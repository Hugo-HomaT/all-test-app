using System.Collections;
using UnityEngine;

public class HoleController : MonoBehaviour
{
    public float moveSpeed = 2f;
    
	[Header("Movement Indicator")]
	public Transform movementIndicatorPivot; // assign the triangle's pivot here
	public Renderer triangleSpriteRenderer; // manually assign the triangle sprite renderer
	public GameObject periscopeRenderer; // manually assign the periscope renderer
	public float indicatorRotationSpeed = 720f; // deg/sec
	private Vector3 _lastPos;

    [Header("Hole Collect")]
    public LayerMask victimLayer;
    public float swallowPower = 2f;
    public SphereCollider detector;
    public AudioSource collectSFX;
    public ParticleSystem evolveVFX;
    [Header("Physics Optimization")] public float physicsCheckInterval = 0.1f; // Reduce frequency from every frame
    private float _lastPhysicsCheck;
    private Collider[] _victimsBuffer;
    private Collider[] _releaseBuffer;
    
    [Header("Support Flagging")]
    public float supportFlagHeight = 6f;
    public float supportFlagInterval = 0.05f;
    [Range(0.1f, 2f)] public float supportFlagRadiusMultiplier = 1.1f;
    private float _lastSupportFlag;
    private Collider[] _supportFlagBuffer;
    public float releaseRadius = 0.5f;
    public float releaseHeight = 1.0f;
    public int maxReleasesPerEvent = 12;

    [Header("Movement Constraints")]
    [SerializeField] private LayerMask blockPlayerLayer;
    [SerializeField] private float boundaryCheckRadiusOverride = 0f;
    [SerializeField] private float boundaryCheckVerticalOffset = 0.5f;

        [Header("Throwable")]
        public AimArrow aimArrow;
        private ThrowableItem _held;
    
    [Header("Hole Grow")]
    public float scaleDuration = 0.2f;
    public float scaleMultiplier = 1.2f;
    public float growThreshold = 10f;
    public float growThresholdMultiplier = 1.2f;
    private int _growCounter;

    public Transform skinsParent;
    
    [SerializeField] private FloatingFeedback floatingFeedback;
    
    private PlayerMovement _playerMovement;
    private Utils _utils;
    private bool _isFakeMoving = false;
    private Vector3 _fakeTargetPosition;
    private Vector3 _fakeStartPosition;
    private bool _inputEnabled = true;
    private Vector3 _lastSupportPosition;
    private PlayableSettings _settings;
    
    public bool IsInputEnabled => _inputEnabled;
    
    
    
    public void SetInputEnabled(bool enabled)
    {
        _inputEnabled = enabled;
        if (!enabled)
        {
            SetIndicatorVisible(false);
        }
    }

    private void Start()
    {
        _settings = PlayableSettings.instance;
        _playerMovement = new PlayerMovement();
        _utils = new Utils();
        
        if (_settings != null)
        {
            moveSpeed = _settings.holeMoveSpeed;
            scaleMultiplier = _settings.levelUpSizeIncreaseMultiplier;
            growThreshold = _settings.swallowCountFirstLevel;
            growThresholdMultiplier = _settings.swallowNeededMultiplier;
            
            
            if (triangleSpriteRenderer != null || periscopeRenderer != null)
            {
                SetIndicatorVisible(false);
                if (_settings.enableMovementIndicator)
                {
                    SetIndicatorColor(_settings.movementIndicatorColor);
                }
            }
            
            if (skinsParent != null)
            {
                _utils.SwitchChild(skinsParent, _settings.holeSkin);
                var intro = GetComponent<IntroHoleAnimation>();
                if (intro != null) intro.Begin();
            }
            
            if (_settings.useHoleStartPosition)
            {
                transform.position = _settings.holeStartPosition;
            }
        }
        
        _lastPos = transform.position;
        _victimsBuffer = PhysicsObjectPool.GetColliders(16);
        _releaseBuffer = PhysicsObjectPool.GetColliders(maxReleasesPerEvent);
        _supportFlagBuffer = PhysicsObjectPool.GetColliders(32);
        _lastSupportPosition = transform.position;
        
        UIManager.instance.UpdateSlider(GameManager.instance.currentObjectiveAmount);
    }
    
    private void OnDestroy()
    {
        if (_victimsBuffer != null)
        {
            PhysicsObjectPool.ReturnColliders(_victimsBuffer);
            _victimsBuffer = null;
        }
        if (_releaseBuffer != null)
        {
            PhysicsObjectPool.ReturnColliders(_releaseBuffer);
            _releaseBuffer = null;
        }
        if (_supportFlagBuffer != null)
        {
            PhysicsObjectPool.ReturnColliders(_supportFlagBuffer);
            _supportFlagBuffer = null;
        }
    }
    
    private void Update()
    {
        if (GameManager.instance.isGameOver) return;
        
        // Read inputs (must be in Update, not FixedUpdate)
        if (!_isFakeMoving && _held == null && _inputEnabled)
        {
            _playerMovement.UpdateInputs(transform);
        }

			// Rotate indicator towards movement direction and toggle visibility
            if (_inputEnabled && movementIndicatorPivot != null && _settings != null)
			{
                if (!_settings.enableMovementIndicator)
                {
                    SetIndicatorVisible(false);
                }
                else
                {
				// Show indicator when mouse is held (player is trying to move)
				bool isMoving = Input.GetMouseButton(0);
				bool shouldShow = isMoving || !_settings.hideMovementIndicatorWhenIdle;
				SetIndicatorVisible(shouldShow);
				
				if (shouldShow)
				{
					// Get movement direction from position delta for rotation
					Vector3 currentPos = transform.position;
					Vector3 delta = currentPos - _lastPos;
					Vector3 planar = new Vector3(delta.x, 0f, delta.z);
					
					if (planar.sqrMagnitude > 0.0001f)
					{
						Quaternion lookRot = Quaternion.LookRotation(planar.normalized, Vector3.up);
						movementIndicatorPivot.rotation = Quaternion.RotateTowards(movementIndicatorPivot.rotation, lookRot, indicatorRotationSpeed * Time.deltaTime);
					}
					_lastPos = currentPos;
				}
                }
			}
        
        bool movedThisFrame = (transform.position - _lastSupportPosition).sqrMagnitude > 0.0001f;
        if (movedThisFrame && Time.time - _lastSupportFlag >= supportFlagInterval)
        {
            _lastSupportFlag = Time.time;
            FlagSupportsAboveHole();
        }
        if (movedThisFrame)
        {
            _lastSupportPosition = transform.position;
        }
        
        // Reduce physics check frequency
        if (Time.time - _lastPhysicsCheck >= physicsCheckInterval)
        {
            _lastPhysicsCheck = Time.time;
            int victimCount = Physics.OverlapSphereNonAlloc(transform.position, detector.radius, _victimsBuffer, victimLayer);
            
            if (victimCount > 0)
            {
                for (int i = 0; i < victimCount; i++)
                {
                    var item = _victimsBuffer[i];
                    if (item == null) continue;
                    
                    // Check for throwable first
                    var throwable = item.GetComponentInParent<ThrowableItem>();
                    if (throwable != null && throwable.enabled && _held == null)
                    {
                        PickUpThrowable(throwable);
                        break;
                    }

                    var victimRb = item.GetComponentInParent<Rigidbody>();
                    if (victimRb != null && _held == null) SwallowVictim(victimRb);
                }
            }
        }

        if (_growCounter > growThreshold)
        {
            Grow();
            _growCounter = 0;
            
            if (_settings != null)
            {
                growThreshold *= _settings.swallowNeededMultiplier;
                if (_settings.holeSpeedIncreaseType == PlayableSettings.HoleSpeedIncreaseType.Additive)
                    moveSpeed += _settings.holeSpeedIncrease;
                else
                    moveSpeed *= Mathf.Max(1f, _settings.holeSpeedIncrease);
                
                _settings.CameraZoomOut(scaleMultiplier);
                
                if (_settings.showHoleGrowVFX)
                {
                    evolveVFX.Play();
                }
            }
            
            AudioManager.instance?.PlayHoleGrowSound();
        }

    }
    
    private void FixedUpdate()
    {
        if (GameManager.instance.isGameOver) return;
        
        // Handle fake movement if enabled
        if (_isFakeMoving)
        {
            UpdateFakeMovement();
        }
        else if (_held == null && _inputEnabled)
        {
            Vector3 movementDelta = _playerMovement.GetMovementDelta(moveSpeed);
            if (movementDelta.sqrMagnitude > 0.000001f)
            {
                ApplyMovementDelta(movementDelta);
            }
        }
    }

	private void SetIndicatorVisible(bool visible)
	{
		if (_settings == null) return;

        if (!_settings.enableMovementIndicator)
        {
            visible = false;
        }
		
		if (_settings.movementIndicatorType == MovementIndicatorType.Triangle)
		{
			if (triangleSpriteRenderer != null)
				triangleSpriteRenderer.enabled = visible;
            periscopeRenderer.SetActive(false);
		}
		else // Periscope
		{
            periscopeRenderer.SetActive(visible);
			if (triangleSpriteRenderer != null)
				triangleSpriteRenderer.enabled = false;
		}
	}

	private void SetIndicatorColor(Color color)
	{
		if (_settings == null) return;
		
		if (_settings.movementIndicatorType == MovementIndicatorType.Triangle)
		{
			if (triangleSpriteRenderer != null)
				triangleSpriteRenderer.material.color = color;
		}
    }

    public void Throw()
    {
        if (_held != null )
        {
            Vector3 dir = aimArrow != null ? aimArrow.GetForward(transform) : transform.forward;
            ThrowHeld(dir);
            
            // Notify GameManager that player has shot
            if (GameManager.instance != null)
            {
                GameManager.instance.OnPlayerShot();
            }
        }
    }

    private void OnTriggerEnter(Collider other)
    {
        if (!IsCollectible(other.gameObject)) return;
            var rb = other.GetComponentInParent<Rigidbody>();
            if (rb && _held == null) rb.isKinematic = false;
    }

    private void OnTriggerExit(Collider other)
    {
        if (_held != null)
        {
            var held = other.GetComponentInParent<ThrowableItem>();
            if (held != null && held == _held) return;
        }

        if (IsCollectible(other.gameObject) && other.transform.position.y < -0.5f)
        {
            if (_settings != null && _settings.displayHoleCountFeedback)
            {
                floatingFeedback.Show(transform.position);
            }
            
            var collectedAmount = GameManager.instance.currentObjectiveAmount;
            if (_settings != null && collectedAmount < _settings.objectiveAmount)
            {
                
                collectSFX.PlayOneShot(_settings.collectItemSFX);
                GameManager.instance.currentObjectiveAmount++;
                UIManager.instance.UpdateSlider(GameManager.instance.currentObjectiveAmount);
            }
            
            _growCounter++;
            Vector3 removedPos = other.transform.position;
            ReleaseNeighbors(removedPos);
            
            var rb = other.GetComponentInParent<Rigidbody>();
            var sa = rb != null 
                ? (rb.GetComponent<SupportActivator>() ?? rb.GetComponentInChildren<SupportActivator>())
                : (other.GetComponent<SupportActivator>() ?? other.GetComponentInChildren<SupportActivator>());

            if (sa != null)
            {
                sa.countInObjectives = false;

                if (UIManager.instance != null && UIManager.instance.myObjectivesUISystem != null)
                {
                    UIManager.instance.myObjectivesUISystem.HandleSupportSwallowed(sa, transform.position);
                }

                // Win condition: all top items swallowed (no remaining top items)
                if (_settings != null && _settings.enableWinOnSwallowTopItem && sa.isTopItem)
                {
                    int remainingTopItems = CountRemainingTopItems();
                    if (remainingTopItems == 0 && !GameManager.instance.isGameOver)
                    {
                        Luna.Unity.Analytics.LogEvent("win_top_item_swallowed", 1);
                        AudioManager.instance?.PlayWinSound();
                        GameManager.instance.GameOver(true);
                    }
                }
            }

            (rb != null ? rb.gameObject : other.gameObject).SetActive(false);
        }
    }

    private bool IsCollectible(GameObject other) => (1 << other.layer & victimLayer) != 0; // Same thing as other.layer == 6 but more bullet-proof

    private void SwallowVictim(Rigidbody victimRb)
    {
        victimRb.AddForce(Vector3.down * (swallowPower * GameManager.instance.gravity * Time.deltaTime), ForceMode.Impulse);
        
    }

    private void Grow() => StartCoroutine(ScaleOverTime());

    IEnumerator ScaleOverTime()
    {
        Vector3 originalScale = transform.localScale;
        float currentTime = 0f;

        var targetScale = originalScale * scaleMultiplier;
        while (currentTime < scaleDuration)
        {
            transform.localScale = Vector3.Lerp(originalScale, targetScale, currentTime / scaleDuration);
            
            currentTime += Time.deltaTime;
            yield return null;
        }

        transform.localScale = targetScale;
    }

    private void PickUpThrowable(ThrowableItem ti)
    {
        _held = ti;
        _held.AttachTo(transform);
        if (aimArrow != null) aimArrow.SetVisible(true);
        if (UIManager.instance != null) UIManager.instance.ShowShootScreen();
        
        // Stop fake movement when picking up throwable
        if (_isFakeMoving)
        {
            _isFakeMoving = false;
        }
    }

    private void ThrowHeld(Vector3 dir)
    {
        if (_held == null) return;
        var toThrow = _held;
        _held = null;
        if (aimArrow != null) aimArrow.SetVisible(false);
        if (UIManager.instance != null) UIManager.instance.HideShootScreenAfterShoot();
        toThrow.ThrowForward(dir.normalized);
    }
    
    private void ReleaseNeighbors(Vector3 fromPosition)
    {
        Vector3 p0 = fromPosition + Vector3.up * 0.1f;
        Vector3 p1 = p0 + Vector3.up * Mathf.Max(0.1f, releaseHeight);
        int hitCount = Physics.OverlapCapsuleNonAlloc(p0, p1, Mathf.Max(0.05f, releaseRadius), _releaseBuffer, victimLayer);
        int released = 0;
        for (int i = 0; i < hitCount && released < maxReleasesPerEvent; i++)
        {
            var hit = _releaseBuffer[i];
            if (hit == null) continue;
            
            var rb = hit.attachedRigidbody;
            if (rb == null) continue;
            if (!rb.isKinematic) continue;
            rb.isKinematic = false;
            rb.AddForce(Vector3.down * (swallowPower * 0.5f), ForceMode.Impulse);
            released++;
        }
    }

    private void ApplyMovementDelta(Vector3 delta)
    {
        if (blockPlayerLayer == 0)
        {
            transform.Translate(delta, Space.World);
            return;
        }

        Vector3 position = transform.position;
        const float epsilon = 0.000001f;

        if (Mathf.Abs(delta.x) > epsilon)
        {
            Vector3 candidate = position + new Vector3(delta.x, 0f, 0f);
            if (!IsMovementBlocked(candidate))
            {
                position = candidate;
            }
        }

        if (Mathf.Abs(delta.z) > epsilon)
        {
            Vector3 candidate = position + new Vector3(0f, 0f, delta.z);
            if (!IsMovementBlocked(candidate))
            {
                position = candidate;
            }
        }

        transform.position = position;
    }

    private bool IsMovementBlocked(Vector3 candidatePosition)
    {
        if (blockPlayerLayer == 0) return false;

        float baseRadius = boundaryCheckRadiusOverride > 0f
            ? boundaryCheckRadiusOverride
            : detector != null ? detector.radius : 0.5f;

        float scaleFactor = Mathf.Max(0.5f, Mathf.Max(transform.lossyScale.x, transform.lossyScale.z));
        float radius = baseRadius * scaleFactor * 1.2f;

        float baseOffset = boundaryCheckVerticalOffset > 0f
            ? boundaryCheckVerticalOffset
            : Mathf.Max(0.1f, baseRadius);

        float verticalOffset = baseOffset * scaleFactor;

        Vector3 candidateCenter = candidatePosition + Vector3.up * verticalOffset;
        bool candidateBlocked = Physics.CheckSphere(candidateCenter, radius, blockPlayerLayer, QueryTriggerInteraction.Ignore);

        if (!candidateBlocked)
        {
            return false;
        }

        // If we're already overlapping (e.g., after growing larger), allow movement so the player can exit
        Vector3 currentCenter = transform.position + Vector3.up * verticalOffset;
        bool currentBlocked = Physics.CheckSphere(currentCenter, radius, blockPlayerLayer, QueryTriggerInteraction.Ignore);
        return !currentBlocked;
    }

    private void FlagSupportsAboveHole()
    {
        if (detector == null || _supportFlagBuffer == null) return;

        Vector3 worldCenter = detector.bounds.center;
        float radius = Mathf.Max(0.05f, detector.radius * supportFlagRadiusMultiplier);
        float height = Mathf.Max(0.5f, supportFlagHeight);
        Vector3 p0 = worldCenter + Vector3.up * 0.05f;
        Vector3 p1 = p0 + Vector3.up * height;
        int hitCount = Physics.OverlapCapsuleNonAlloc(p0, p1, radius, _supportFlagBuffer, victimLayer, QueryTriggerInteraction.Ignore);

        for (int i = 0; i < hitCount; i++)
        {
            var hit = _supportFlagBuffer[i];
            if (hit == null) continue;
            var activator = hit.GetComponentInParent<SupportActivator>();
            if (activator == null) continue;
            activator.FlaggedByHole();
        }
    }
    
    public void ResetThrowableState()
    {
        if (_held != null)
        {
            _held = null;
        }
        
        if (aimArrow != null) 
        {
            aimArrow.SetVisible(false);
        }
        
        if (UIManager.instance != null) 
        {
            UIManager.instance.HideShootScreenAfterShoot();
        }
    }
    
    public void StartFakeMovement()
    {
        if (_settings != null && _settings.enableFakeControl && !_isFakeMoving)
        {
            _isFakeMoving = true;
            _fakeStartPosition = transform.position;
            _fakeTargetPosition = _fakeStartPosition + Vector3.forward * 2f;
        }
    }
    
    private void UpdateFakeMovement()
    {
        if (!_isFakeMoving) return;
        
        Vector3 direction = (_fakeTargetPosition - transform.position).normalized;
        float distance = Vector3.Distance(transform.position, _fakeTargetPosition);
        
        if (distance > 0.1f)
        {
            transform.Translate(direction * moveSpeed * Time.fixedDeltaTime);
        }
        else
        {
            transform.position = _fakeTargetPosition;
            _isFakeMoving = false;
        }
    }
    
    public bool IsFakeMoving => _isFakeMoving;
    
    private int CountRemainingTopItems()
    {
        int count = 0;
        var allSupports = Object.FindObjectsOfType<SupportActivator>();
        
        foreach (var support in allSupports)
        {
            if (support != null && support.isTopItem && support.countInObjectives && support.gameObject.activeInHierarchy)
            {
                count++;
            }
        }
        
        return count;
    }
}
