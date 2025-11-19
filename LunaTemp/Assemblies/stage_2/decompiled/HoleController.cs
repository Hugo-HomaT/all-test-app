using System.Collections;
using Luna.Unity;
using UnityEngine;

public class HoleController : MonoBehaviour
{
	public float moveSpeed = 2f;

	[Header("Movement Indicator")]
	public Transform movementIndicatorPivot;

	public Renderer triangleSpriteRenderer;

	public GameObject periscopeRenderer;

	public float indicatorRotationSpeed = 720f;

	private Vector3 _lastPos;

	[Header("Hole Collect")]
	public LayerMask victimLayer;

	public float swallowPower = 2f;

	public SphereCollider detector;

	public AudioSource collectSFX;

	public ParticleSystem evolveVFX;

	[Header("Physics Optimization")]
	public float physicsCheckInterval = 0.1f;

	private float _lastPhysicsCheck;

	private Collider[] _victimsBuffer;

	private Collider[] _releaseBuffer;

	[Header("Support Flagging")]
	public float supportFlagHeight = 6f;

	public float supportFlagInterval = 0.05f;

	[Range(0.1f, 2f)]
	public float supportFlagRadiusMultiplier = 1.1f;

	private float _lastSupportFlag;

	private Collider[] _supportFlagBuffer;

	public float releaseRadius = 0.5f;

	public float releaseHeight = 1f;

	public int maxReleasesPerEvent = 12;

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

	[SerializeField]
	private FloatingFeedback floatingFeedback;

	private PlayerMovement _playerMovement;

	private Utils _utils;

	private bool _isFakeMoving = false;

	private Vector3 _fakeTargetPosition;

	private Vector3 _fakeStartPosition;

	private bool _inputEnabled = true;

	private Vector3 _lastSupportPosition;

	private PlayableSettings _settings;

	public bool IsInputEnabled => _inputEnabled;

	public bool IsFakeMoving => _isFakeMoving;

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
				IntroHoleAnimation intro = GetComponent<IntroHoleAnimation>();
				if (intro != null)
				{
					intro.Begin();
				}
			}
			if (_settings.useHoleStartPosition)
			{
				base.transform.position = _settings.holeStartPosition;
			}
		}
		_lastPos = base.transform.position;
		_victimsBuffer = PhysicsObjectPool.GetColliders(16);
		_releaseBuffer = PhysicsObjectPool.GetColliders(maxReleasesPerEvent);
		_supportFlagBuffer = PhysicsObjectPool.GetColliders(32);
		_lastSupportPosition = base.transform.position;
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
		if (GameManager.instance.isGameOver)
		{
			return;
		}
		if (!_isFakeMoving && _held == null && _inputEnabled)
		{
			_playerMovement.UpdateInputs(base.transform);
		}
		if (_inputEnabled && movementIndicatorPivot != null && _settings != null)
		{
			if (!_settings.enableMovementIndicator)
			{
				SetIndicatorVisible(false);
			}
			else
			{
				bool shouldShow = Input.GetMouseButton(0) || !_settings.hideMovementIndicatorWhenIdle;
				SetIndicatorVisible(shouldShow);
				if (shouldShow)
				{
					Vector3 currentPos = base.transform.position;
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
		bool movedThisFrame = (base.transform.position - _lastSupportPosition).sqrMagnitude > 0.0001f;
		if (movedThisFrame && Time.time - _lastSupportFlag >= supportFlagInterval)
		{
			_lastSupportFlag = Time.time;
			FlagSupportsAboveHole();
		}
		if (movedThisFrame)
		{
			_lastSupportPosition = base.transform.position;
		}
		if (Time.time - _lastPhysicsCheck >= physicsCheckInterval)
		{
			_lastPhysicsCheck = Time.time;
			int victimCount = Physics.OverlapSphereNonAlloc(base.transform.position, detector.radius, _victimsBuffer, victimLayer);
			if (victimCount > 0)
			{
				for (int i = 0; i < victimCount; i++)
				{
					Collider item = _victimsBuffer[i];
					if (!(item == null))
					{
						ThrowableItem throwable = item.GetComponentInParent<ThrowableItem>();
						if (throwable != null && throwable.enabled && _held == null)
						{
							PickUpThrowable(throwable);
							break;
						}
						Rigidbody victimRb = item.GetComponentInParent<Rigidbody>();
						if (victimRb != null && _held == null)
						{
							SwallowVictim(victimRb);
						}
					}
				}
			}
		}
		if (!((float)_growCounter > growThreshold))
		{
			return;
		}
		Grow();
		_growCounter = 0;
		if (_settings != null)
		{
			growThreshold *= _settings.swallowNeededMultiplier;
			if (_settings.holeSpeedIncreaseType == PlayableSettings.HoleSpeedIncreaseType.Additive)
			{
				moveSpeed += _settings.holeSpeedIncrease;
			}
			else
			{
				moveSpeed *= Mathf.Max(1f, _settings.holeSpeedIncrease);
			}
			_settings.CameraZoomOut(scaleMultiplier);
			if (_settings.showHoleGrowVFX)
			{
				evolveVFX.Play();
			}
		}
		AudioManager.instance?.PlayHoleGrowSound();
	}

	private void FixedUpdate()
	{
		if (!GameManager.instance.isGameOver)
		{
			if (_isFakeMoving)
			{
				UpdateFakeMovement();
			}
			else if (_held == null && _inputEnabled)
			{
				_playerMovement.ApplyMovement(base.transform, moveSpeed);
			}
		}
	}

	private void SetIndicatorVisible(bool visible)
	{
		if (_settings == null)
		{
			return;
		}
		if (!_settings.enableMovementIndicator)
		{
			visible = false;
		}
		if (_settings.movementIndicatorType == MovementIndicatorType.Triangle)
		{
			if (triangleSpriteRenderer != null)
			{
				triangleSpriteRenderer.enabled = visible;
			}
			periscopeRenderer.SetActive(false);
		}
		else
		{
			periscopeRenderer.SetActive(visible);
			if (triangleSpriteRenderer != null)
			{
				triangleSpriteRenderer.enabled = false;
			}
		}
	}

	private void SetIndicatorColor(Color color)
	{
		if (!(_settings == null) && _settings.movementIndicatorType == MovementIndicatorType.Triangle && triangleSpriteRenderer != null)
		{
			triangleSpriteRenderer.material.color = color;
		}
	}

	public void Throw()
	{
		if (_held != null)
		{
			Vector3 dir = ((aimArrow != null) ? aimArrow.GetForward(base.transform) : base.transform.forward);
			ThrowHeld(dir);
			if (GameManager.instance != null)
			{
				GameManager.instance.OnPlayerShot();
			}
		}
	}

	private void OnTriggerEnter(Collider other)
	{
		if (IsCollectible(other.gameObject))
		{
			Rigidbody rb = other.GetComponentInParent<Rigidbody>();
			if ((bool)rb && _held == null)
			{
				rb.isKinematic = false;
			}
		}
	}

	private void OnTriggerExit(Collider other)
	{
		if (_held != null)
		{
			ThrowableItem held = other.GetComponentInParent<ThrowableItem>();
			if (held != null && held == _held)
			{
				return;
			}
		}
		if (!IsCollectible(other.gameObject) || !(other.transform.position.y < -0.5f))
		{
			return;
		}
		if (_settings != null && _settings.displayHoleCountFeedback)
		{
			floatingFeedback.Show(base.transform.position);
		}
		int collectedAmount = GameManager.instance.currentObjectiveAmount;
		if (_settings != null && collectedAmount < _settings.objectiveAmount)
		{
			collectSFX.PlayOneShot(_settings.collectItemSFX);
			GameManager.instance.currentObjectiveAmount++;
			UIManager.instance.UpdateSlider(GameManager.instance.currentObjectiveAmount);
		}
		_growCounter++;
		Vector3 removedPos = other.transform.position;
		ReleaseNeighbors(removedPos);
		Rigidbody rb = other.GetComponentInParent<Rigidbody>();
		SupportActivator sa = ((rb != null) ? (rb.GetComponent<SupportActivator>() ?? rb.GetComponentInChildren<SupportActivator>()) : (other.GetComponent<SupportActivator>() ?? other.GetComponentInChildren<SupportActivator>()));
		if (sa != null)
		{
			sa.countInObjectives = false;
			if (UIManager.instance != null && UIManager.instance.myObjectivesUISystem != null)
			{
				UIManager.instance.myObjectivesUISystem.HandleSupportSwallowed(sa, base.transform.position);
			}
			if (_settings != null && _settings.enableWinOnSwallowTopItem && sa.isTopItem && CountRemainingTopItems() == 0 && !GameManager.instance.isGameOver)
			{
				Analytics.LogEvent("win_top_item_swallowed", 1);
				AudioManager.instance?.PlayWinSound();
				GameManager.instance.GameOver(true);
			}
		}
		((rb != null) ? rb.gameObject : other.gameObject).SetActive(false);
	}

	private bool IsCollectible(GameObject other)
	{
		return ((1 << other.layer) & (int)victimLayer) != 0;
	}

	private void SwallowVictim(Rigidbody victimRb)
	{
		victimRb.AddForce(Vector3.down * (swallowPower * GameManager.instance.gravity * Time.deltaTime), ForceMode.Impulse);
	}

	private void Grow()
	{
		StartCoroutine(ScaleOverTime());
	}

	private IEnumerator ScaleOverTime()
	{
		Vector3 originalScale = base.transform.localScale;
		float currentTime = 0f;
		Vector3 targetScale = originalScale * scaleMultiplier;
		while (currentTime < scaleDuration)
		{
			base.transform.localScale = Vector3.Lerp(originalScale, targetScale, currentTime / scaleDuration);
			currentTime += Time.deltaTime;
			yield return null;
		}
		base.transform.localScale = targetScale;
	}

	private void PickUpThrowable(ThrowableItem ti)
	{
		_held = ti;
		_held.AttachTo(base.transform);
		if (aimArrow != null)
		{
			aimArrow.SetVisible(true);
		}
		if (UIManager.instance != null)
		{
			UIManager.instance.ShowShootScreen();
		}
		if (_isFakeMoving)
		{
			_isFakeMoving = false;
		}
	}

	private void ThrowHeld(Vector3 dir)
	{
		if (!(_held == null))
		{
			ThrowableItem toThrow = _held;
			_held = null;
			if (aimArrow != null)
			{
				aimArrow.SetVisible(false);
			}
			if (UIManager.instance != null)
			{
				UIManager.instance.HideShootScreenAfterShoot();
			}
			toThrow.ThrowForward(dir.normalized);
		}
	}

	private void ReleaseNeighbors(Vector3 fromPosition)
	{
		Vector3 p0 = fromPosition + Vector3.up * 0.1f;
		Vector3 p1 = p0 + Vector3.up * Mathf.Max(0.1f, releaseHeight);
		int hitCount = Physics.OverlapCapsuleNonAlloc(p0, p1, Mathf.Max(0.05f, releaseRadius), _releaseBuffer, victimLayer);
		int released = 0;
		for (int i = 0; i < hitCount; i++)
		{
			if (released >= maxReleasesPerEvent)
			{
				break;
			}
			Collider hit = _releaseBuffer[i];
			if (!(hit == null))
			{
				Rigidbody rb = hit.attachedRigidbody;
				if (!(rb == null) && rb.isKinematic)
				{
					rb.isKinematic = false;
					rb.AddForce(Vector3.down * (swallowPower * 0.5f), ForceMode.Impulse);
					released++;
				}
			}
		}
	}

	private void FlagSupportsAboveHole()
	{
		if (detector == null || _supportFlagBuffer == null)
		{
			return;
		}
		Vector3 worldCenter = detector.bounds.center;
		float radius = Mathf.Max(0.05f, detector.radius * supportFlagRadiusMultiplier);
		float height = Mathf.Max(0.5f, supportFlagHeight);
		Vector3 p0 = worldCenter + Vector3.up * 0.05f;
		Vector3 p1 = p0 + Vector3.up * height;
		int hitCount = Physics.OverlapCapsuleNonAlloc(p0, p1, radius, _supportFlagBuffer, victimLayer, QueryTriggerInteraction.Ignore);
		for (int i = 0; i < hitCount; i++)
		{
			Collider hit = _supportFlagBuffer[i];
			if (!(hit == null))
			{
				SupportActivator activator = hit.GetComponentInParent<SupportActivator>();
				if (!(activator == null))
				{
					activator.FlaggedByHole();
				}
			}
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
			_fakeStartPosition = base.transform.position;
			_fakeTargetPosition = _fakeStartPosition + Vector3.forward * 2f;
		}
	}

	private void UpdateFakeMovement()
	{
		if (_isFakeMoving)
		{
			Vector3 direction = (_fakeTargetPosition - base.transform.position).normalized;
			float distance = Vector3.Distance(base.transform.position, _fakeTargetPosition);
			if (distance > 0.1f)
			{
				base.transform.Translate(direction * moveSpeed * Time.fixedDeltaTime);
				return;
			}
			base.transform.position = _fakeTargetPosition;
			_isFakeMoving = false;
		}
	}

	private int CountRemainingTopItems()
	{
		int count = 0;
		SupportActivator[] allSupports = Object.FindObjectsOfType<SupportActivator>();
		SupportActivator[] array = allSupports;
		foreach (SupportActivator support in array)
		{
			if (support != null && support.isTopItem && support.countInObjectives && support.gameObject.activeInHierarchy)
			{
				count++;
			}
		}
		return count;
	}
}
