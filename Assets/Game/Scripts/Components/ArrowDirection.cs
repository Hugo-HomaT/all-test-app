using UnityEngine;

public class ArrowDirection : MonoBehaviour
{
    public enum TargetType
    {
        ClosestTopItem,
        ClosestItem
    }
    
    public enum ArrowModelType
    {
        Model1,
        Model2
    }
    
    [Header("Arrow Direction Settings")]
    [Tooltip("Will be overridden by PlayableSettings if enabled")]
    public TargetType targetType = TargetType.ClosestTopItem;
    
    [Tooltip("Will be overridden by PlayableSettings if enabled")]
    public ArrowModelType arrowModel = ArrowModelType.Model1;
    
    [Header("Arrow Models")]
    [Tooltip("First arrow model GameObject")]
    public GameObject arrowModel1;
    [Tooltip("Second arrow model GameObject")]
    public GameObject arrowModel2;
    
    [Header("Arrow Settings")]
    [Tooltip("Transform that rotates to point at target")]
    public Transform arrowPivot;
    public float rotationSpeed = 360f;
    public float updateInterval = 0.1f;
    
    [Header("Yoyo Movement")]
    public float yoyoSpeed = 2f;
    public float yoyoDistance = 0.2f;

    private float _lastUpdateTime;
    private SupportActivator _currentTarget;
    private GameObject _activeArrowModel;
    private bool _isEnabled;
    private MeshRenderer _meshRenderer;
    private Vector3 _basePosition;
    private float _yoyoTime;
    
    private float minDistance = 2f;
    
    private void Start()
    {
        if (arrowPivot == null)
        {
            arrowPivot = transform;
        }
        
        _isEnabled = PlayableSettings.instance != null && PlayableSettings.instance.enableArrowDirection;
        if (PlayableSettings.instance != null)
        {
            if (_isEnabled)
            {
                targetType = PlayableSettings.instance.arrowDirectionTargetType;
            }
            arrowModel = PlayableSettings.instance.arrowDirectionModel;
            SetArrowColor(PlayableSettings.instance.arrowDirectionColor);
            SetArrowScale(PlayableSettings.instance.arrowDirectionScale);
            SetArrowPosition(PlayableSettings.instance.arrowDirectionPosition);
            SetYoyoSettings(PlayableSettings.instance.arrowDirectionYoyoSpeed, PlayableSettings.instance.arrowDirectionYoyoDistance);
        }
        
        SetArrowModel(arrowModel);
        SetArrowVisible(false);
    }
    
    private void Update()
    {
        if (arrowPivot == null || _activeArrowModel == null) return;
        
        if (!_isEnabled)
        {
            SetArrowVisible(false);
            return;
        }
        
        if (Time.time - _lastUpdateTime >= updateInterval)
        {
            UpdateTarget();
            _lastUpdateTime = Time.time;
        }
        
        if (_currentTarget != null && _currentTarget.gameObject.activeInHierarchy)
        {
            
            Vector3 myPos = transform.position;
            Vector3 targetPos = _currentTarget.transform.position;
            Vector3 horizontalDirection = new Vector3(targetPos.x - myPos.x, 0f, targetPos.z - myPos.z);
            float horizontalDistance = horizontalDirection.magnitude;
            
            if (horizontalDistance >= minDistance)
            {
                SetArrowVisible(true);
                RotateTowardTarget();
                UpdateYoyoMovement();
            }
            else
            {
                SetArrowVisible(false);
            }
        }
        else
        {
            SetArrowVisible(false);
        }
    }
    
    private void UpdateTarget()
    {
        switch (targetType)
        {
            case TargetType.ClosestTopItem:
                _currentTarget = FindClosestTopItem();
                break;
                
            case TargetType.ClosestItem:
                _currentTarget = FindClosestItem();
                break;
        }
    }
    
    private SupportActivator FindClosestTopItem()
    {
        SupportActivator closest = null;
        float closestDistance = float.MaxValue;
        Vector3 myPosition = transform.position;
        
        // Find all SupportActivators in the scene
        SupportActivator[] allActivators = Object.FindObjectsOfType<SupportActivator>();
        
        foreach (SupportActivator activator in allActivators)
        {
            if (activator == null || !activator.gameObject.activeInHierarchy) continue;
            if (!activator.isTopItem) continue;
            
            // Calculate distance ignoring Y
            Vector3 targetPos = activator.transform.position;
            Vector3 horizontalDirection = new Vector3(targetPos.x - myPosition.x, 0f, targetPos.z - myPosition.z);
            float horizontalDistance = horizontalDirection.magnitude;
            
            // Skip if too close
            if (horizontalDistance < minDistance) continue;
            
            if (horizontalDistance < closestDistance)
            {
                closestDistance = horizontalDistance;
                closest = activator;
            }
        }
        
        return closest;
    }
    
    private SupportActivator FindClosestItem()
    {
        SupportActivator closest = null;
        float closestDistance = float.MaxValue;
        Vector3 myPosition = transform.position;
        
        // Find all SupportActivators in the scene
        SupportActivator[] allActivators = Object.FindObjectsOfType<SupportActivator>();
        
        foreach (SupportActivator activator in allActivators)
        {
            if (activator == null || !activator.gameObject.activeInHierarchy) continue;
            
            // Calculate distance ignoring Y
            Vector3 targetPos = activator.transform.position;
            Vector3 horizontalDirection = new Vector3(targetPos.x - myPosition.x, 0f, targetPos.z - myPosition.z);
            float horizontalDistance = horizontalDirection.magnitude;
            
            // Skip if too close
            if (horizontalDistance < minDistance) continue;
            
            if (horizontalDistance < closestDistance)
            {
                closestDistance = horizontalDistance;
                closest = activator;
            }
        }
        
        return closest;
    }
    
    private void SetArrowVisible(bool visible)
    {
        if (_activeArrowModel != null)
        {
            _activeArrowModel.SetActive(visible);
        }
    }
    
    private void RotateTowardTarget()
    {
        if (_currentTarget == null) return;
        
        Vector3 directionToTarget = _currentTarget.transform.position - transform.position;
        directionToTarget.y = 0f;
        
        if (directionToTarget.sqrMagnitude < 0.001f) return; 
        
        Quaternion targetRotation = Quaternion.LookRotation(directionToTarget.normalized, Vector3.up);
        arrowPivot.rotation = Quaternion.RotateTowards(
            arrowPivot.rotation, 
            targetRotation, 
            rotationSpeed * Time.deltaTime
        );
    }
    
    public SupportActivator GetCurrentTarget()
    {
        return _currentTarget;
    }
    
    public void SetArrowColor(Color color)
    {
        if (_meshRenderer != null && _meshRenderer.materials != null && _meshRenderer.materials.Length > 0)
        {
            if (_meshRenderer.materials[0] != null)
            {
                _meshRenderer.materials[0].color = color;
            }
            
            if (_meshRenderer.materials.Length > 1 && _meshRenderer.materials[1] != null && PlayableSettings.instance != null)
            {
                _meshRenderer.materials[1].color = PlayableSettings.instance.arrowDirectionOutlineColor;
            }
        }
    }
    
    public void SetArrowScale(float scale)
    {
        if (_activeArrowModel != null)
        {
            _activeArrowModel.transform.localScale = Vector3.one * scale;
        }
    }
    
    public void SetArrowPosition(Vector3 position)
    {
        if (_activeArrowModel != null)
        {
            _basePosition = position;
            _activeArrowModel.transform.localPosition = _basePosition;
        }
    }
    
    public void SetArrowModel(ArrowModelType modelType)
    {
        // Deactivate both models first
        if (arrowModel1 != null)
        {
            arrowModel1.SetActive(false);
        }
        
        if (arrowModel2 != null)
        {
            arrowModel2.SetActive(false);
        }
        
        // Activate selected model
        GameObject selectedModel = modelType == ArrowModelType.Model1 ? arrowModel1 : arrowModel2;
        if (selectedModel != null)
        {
            selectedModel.SetActive(true);
            _activeArrowModel = selectedModel;
            
            // Auto-detect MeshRenderer from active model
            _meshRenderer = selectedModel.GetComponent<MeshRenderer>();
            if (_meshRenderer == null)
            {
                _meshRenderer = selectedModel.GetComponentInChildren<MeshRenderer>(true);
            }
            
            // Re-apply color and position if settings are available
            if (PlayableSettings.instance != null)
            {
                SetArrowColor(PlayableSettings.instance.arrowDirectionColor);
                SetArrowPosition(PlayableSettings.instance.arrowDirectionPosition);
            }
        }
    }
    
    private void UpdateYoyoMovement()
    {
        if (_activeArrowModel == null) return;
        
        _yoyoTime += Time.deltaTime * yoyoSpeed;
        float yoyoOffset = Mathf.Sin(_yoyoTime) * yoyoDistance;
        
        Vector3 currentPos = _basePosition;
        currentPos.z += yoyoOffset;
        
        _activeArrowModel.transform.localPosition = currentPos;
    }
    
    public void SetYoyoSettings(float speed, float distance)
    {
        yoyoSpeed = speed;
        yoyoDistance = distance;
    }
}




