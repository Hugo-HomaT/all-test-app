using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[DisallowMultipleComponent]
public class ThrowableItem : MonoBehaviour
{
    public float snapOffsetY = 0.2f;
    public float throwForce = 14f;
    public float throwUpward = 2.5f;
    public float spinTorque = 8f;
    public float detachDelay = 0.05f;
    public bool pickedUp;
    public bool smoothSnap = true;
    public float snapDuration = 0.12f;
    public float throwProtectDuration = 0.6f;
    public bool hasHitTower = false;
    private float _throwTime = 0f;

    private Rigidbody _rb;
    private Transform _originalParent;
    private Collider[] _colliders;
    private readonly List<GameObject> _savedLayerObjects = new List<GameObject>(8);
    private readonly List<int> _savedLayers = new List<int>(8);
    
    // Visual effects
    private Vector3 _originalPosition;
    private float _floatingOffset;
    private Vector3 _savedPosition;
    private Quaternion _savedRotation;
    private bool _visualEffectsActive = true;
    private Vector3 _floatingBasePosition;
    
    [Header("Visual Effects")]
    public Transform visualChild; // Reference to the visual child object (set in inspector)

    private void Awake()
    {
        _rb = GetComponent<Rigidbody>();
        if (_rb == null) _rb = GetComponentInChildren<Rigidbody>();
        _colliders = GetComponentsInChildren<Collider>(true);
        if (GetComponent<ThrowablePusher>() == null)
            gameObject.AddComponent<ThrowablePusher>();
    }
    
    private void Start()
    {
        // Initialize visual effects
        _originalPosition = transform.position;
        _floatingOffset = Random.Range(0f, Mathf.PI * 2f); // Random offset for variety
        
        // Calculate floating base position (bottom of the object)
        CalculateFloatingBasePosition();
        
        // Visual child should be assigned in inspector
        if (visualChild == null)
        {
            Debug.LogWarning($"Visual child not assigned on {gameObject.name}. Please assign a child object for visual effects.");
        }
        else
        {
            // Hide main renderer when visual child is available
            HideMainRenderer();
        }
    }
    
    private void CalculateFloatingBasePosition()
    {
        // Get the bounds of the object to find the bottom
        Bounds bounds = GetComponent<Renderer>()?.bounds ?? GetComponentInChildren<Renderer>()?.bounds ?? new Bounds();
        
        if (bounds.size != Vector3.zero)
        {
            // Set floating base to the bottom of the object
            _floatingBasePosition = new Vector3(_originalPosition.x, bounds.min.y, _originalPosition.z);
        }
        else
        {
            // Fallback to original position if no renderer found
            _floatingBasePosition = _originalPosition;
        }
    }
    
    private void Update()
    {
        if (!pickedUp && _visualEffectsActive && PlayableSettings.instance != null)
        {
            UpdateVisualEffects();
        }
    }
    
    private void UpdateVisualEffects()
    {
        var settings = PlayableSettings.instance;
        
        // Floating animation
        if (settings.enableFloatingAnimation)
        {
            // Simple floating: divide height by parent scale for consistent look
            float parentScale = transform.lossyScale.y;
            float adjustedHeight = settings.floatingHeight / parentScale;
            float sinValue = Mathf.Sin((Time.time + _floatingOffset) * settings.floatingSpeed);
            float floatingY = (sinValue + 1f) * 0.5f * adjustedHeight; // Maps -1,1 to 0,adjustedHeight
            
            // Move visual child instead of main object
            if (visualChild != null)
            {
                visualChild.localPosition = Vector3.up * floatingY;
            }
            else
            {
                // Fallback to moving main object if visual child not assigned
                transform.position = _floatingBasePosition + Vector3.up * floatingY;
            }
        }
        
        // Self rotation
        if (settings.enableSelfRotation)
        {
            // Rotate visual child instead of main object
            if (visualChild != null)
            {
                visualChild.Rotate(Vector3.up, settings.rotationSpeed * Time.deltaTime);
            }
            else
            {
                // Fallback to rotating main object if visual child not assigned
                transform.Rotate(Vector3.up, settings.rotationSpeed * Time.deltaTime);
            }
        }
    }
    
    private void StopVisualEffects()
    {
        // Save current position and rotation before stopping effects
        _savedPosition = transform.position;
        _savedRotation = transform.rotation;
        
        // Disable visual effects
        _visualEffectsActive = false;
        
        // Hide visual child when collected
        if (visualChild != null)
        {
            visualChild.gameObject.SetActive(false);
        }
        
        // Show original renderer when collected
        ShowMainRenderer();
        
        // Restore to saved state (exact position and rotation when collected)
        transform.position = _savedPosition;
        transform.rotation = _savedRotation;
    }

    public void AttachTo(Transform hole)
    {
        if (pickedUp) return;
        pickedUp = true;
        
        // Stop all visual effects immediately
        StopVisualEffects();
        
        _originalParent = transform.parent;
        if (_rb != null)
        {
            _rb.isKinematic = true;
            _rb.velocity = Vector3.zero;
            _rb.angularVelocity = Vector3.zero;
            _rb.useGravity = false;
            _rb.detectCollisions = false;
        }
        if (_colliders != null)
        {
            for (int i = 0; i < _colliders.Length; i++)
                if (_colliders[i] != null) _colliders[i].enabled = false;
        }
        transform.SetParent(hole);
        Vector3 targetPos = new Vector3(0f, snapOffsetY, 0f);
        Quaternion targetRot = Quaternion.identity;
        if (smoothSnap)
            transform.SmoothLerpLocal(this, targetPos, targetRot, snapDuration);
        else
        {
            transform.localPosition = targetPos;
            transform.localRotation = targetRot;
        }
    }

    public void ThrowForward(Vector3 forward)
    {
        if (!pickedUp) return;
        pickedUp = false;
        transform.SetParent(_originalParent);
        if (_rb != null)
        {
            // Temporarily move out of victim layer to avoid being swallowed during the throw
            SaveAndSetLayerRecursively(transform, LayerMask.NameToLayer("Default"));

            if (_colliders != null)
            {
                for (int i = 0; i < _colliders.Length; i++)
                    if (_colliders[i] != null) _colliders[i].enabled = true;
            }
            _rb.detectCollisions = true;
            _rb.useGravity = true;
            _rb.isKinematic = false;
            _rb.velocity = Vector3.zero;
            _rb.angularVelocity = Vector3.zero;
            Vector3 impulse = forward.normalized * throwForce + Vector3.up * throwUpward;
            _rb.AddForce(impulse, ForceMode.VelocityChange);
            _rb.AddTorque(Random.onUnitSphere * spinTorque, ForceMode.VelocityChange);
            
            // Record the throw time for safe checking
            _throwTime = Time.time;
        }
        
        // Trigger store redirect after throw if enabled
        if (StoreRedirectTracker.instance != null)
        {
            StoreRedirectTracker.instance.OnThrow();
        }
        
        // Restore layers after a short protection window, then remove this component
        StartCoroutine(RestoreLayersAndCleanupAfterDelay(throwProtectDuration));
    }

    private void SaveAndSetLayerRecursively(Transform root, int newLayer)
    {
        _savedLayerObjects.Clear();
        _savedLayers.Clear();
        foreach (var t in root.GetComponentsInChildren<Transform>(true))
        {
            var go = t.gameObject;
            _savedLayerObjects.Add(go);
            _savedLayers.Add(go.layer);
            go.layer = newLayer;
        }
    }

    private void RestoreSavedLayers()
    {
        int count = Mathf.Min(_savedLayerObjects.Count, _savedLayers.Count);
        for (int i = 0; i < count; i++)
        {
            var go = _savedLayerObjects[i];
            if (go != null) go.layer = _savedLayers[i];
        }
        _savedLayerObjects.Clear();
        _savedLayers.Clear();
    }

    private IEnumerator RestoreLayersAndCleanupAfterDelay(float delay)
    {
        if (delay > 0f) yield return new WaitForSeconds(delay);
        RestoreSavedLayers();
        Destroy(this);
    }
    
    private void OnCollisionEnter(Collision collision)
    {
        // Early exit if already hit tower
        if (hasHitTower) return;
        
        // Early exit if no rigidbody (can't be player thrown)
        if (_rb == null) return;
        
        // Check if we hit a tower (SupportActivator with tower reference)
        var supportActivator = collision.collider.GetComponent<SupportActivator>();
        if (supportActivator?.tower == null) return;
        
        // Safe check: Only allow tower hit if this throwable was actually thrown by player
        if (IsPlayerThrown())
        {
            hasHitTower = true;
            GameManager.instance?.OnTowerHit();
        }
    }
    
    private void OnTriggerEnter(Collider other)
    {
        // Early exit if already hit tower
        if (hasHitTower) return;
        
        // Early exit if no rigidbody (can't be player thrown)
        if (_rb == null) return;
        
        // Check if we hit a tower (SupportActivator with tower reference)
        var supportActivator = other.GetComponent<SupportActivator>();
        if (supportActivator?.tower == null) return;
        
        // Safe check: Only allow tower hit if this throwable was actually thrown by player
        if (IsPlayerThrown())
        {
            hasHitTower = true;
            GameManager.instance?.OnTowerHit();
        }
    }
    
    private bool IsPlayerThrown()
    {
        // Early exit if no rigidbody
        if (_rb == null) return false;
        
        // Check if recently thrown first (cheaper calculation)
        float timeSinceThrow = Time.time - _throwTime;
        if (timeSinceThrow > throwProtectDuration) return false;
        
        // Only check velocity if recently thrown (avoid expensive magnitude calculation)
        return _rb.velocity.sqrMagnitude > 0.01f; // Using sqrMagnitude is faster than magnitude
    }
    
    private void HideMainRenderer()
    {
        var originalMeshRenderer = GetComponent<MeshRenderer>();
        if (originalMeshRenderer != null)
        {
            originalMeshRenderer.enabled = false;
        }
    }
    
    private void ShowMainRenderer()
    {
        var originalMeshRenderer = GetComponent<MeshRenderer>();
        if (originalMeshRenderer != null)
        {
            originalMeshRenderer.enabled = true;
        }
    }
    
}


