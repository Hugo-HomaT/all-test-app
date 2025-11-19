using System.Linq.Expressions;
using UnityEngine;

[DisallowMultipleComponent]
public class SupportActivator : MonoBehaviour
{
    [Header("Support Detection (Raycast)")]
    public LayerMask supportMask;
    public float checkDistance = 0.25f;
    private float checkInterval = 0.01f;
    [Min(1)] public int requiredMisses = 2;
    
    [Header("Physics Optimization")]
    public float sleepDelay = 3f; 

    [Header("Objectives")]
    public bool countInObjectives = false;
    public Sprite objectiveIcon;
    public bool isTopItem = false;

    private Rigidbody _rb;
    private Collider _col;
    private int _missCounter;
    private readonly RaycastHit[] _rayHits = new RaycastHit[4];
    private float _checkTimer;
    [HideInInspector] public Transform tower;
    [HideInInspector] public int rowIndex;
    
    // Simple physics optimization
    private float _activationTime;
    private bool _forceHoleDrop;

    private void Awake()
    {
        _rb = GetComponent<Rigidbody>();
        if (_rb == null)
            _rb = GetComponentInParent<Rigidbody>();
        _col = GetComponent<Collider>();
        if (_col == null)
            _col = GetComponentInParent<Collider>();
        _rb.isKinematic = true;
        _rb.drag = 0;
        int defaultIdx = LayerMask.NameToLayer("Default");
        if (defaultIdx < 0) defaultIdx = 0;
        int collectIdx = LayerMask.NameToLayer("Collectables");
        if (collectIdx < 0) collectIdx = 6; // common collectibles layer index

        int required = (1 << defaultIdx) | (1 << collectIdx);
        if (supportMask.value == 0)
        {
            supportMask = required;
        }
        else
        {
            supportMask |= required;
        }
    }
    private void OnEnable()
    {
        _checkTimer = 0f;
        var index = tower != null ? tower.GetComponent<TowerRuntimeIndex>() : null;
        if (index != null) index.Register(this);
    }

    private void OnDisable()
    {
        var index = tower != null ? tower.GetComponent<TowerRuntimeIndex>() : null;
        if (index != null) index.Unregister(this);
    }

    private void EvaluateSupport()
    {
        if (_forceHoleDrop || _rb == null || !_rb.isKinematic) return;

        if (!HasSupportBelow())
        {
            _missCounter++;
            if (_missCounter >= requiredMisses)
            {
                ActivatePhysics();
                _missCounter = 0;
            }
        }
        else
        {
            _missCounter = 0;
        }
    }

    private void ActivatePhysics()
    {
        if (_rb == null) return;
        _rb.isKinematic = false;
        _rb.WakeUp();
        _activationTime = Time.time;
    }

    public void ForceActivate()
    {
        if (_rb == null) return;
        _forceHoleDrop = true;
        ActivatePhysics();
    }

    public void FlaggedByHole()
    {
        _forceHoleDrop = true;
        ActivatePhysics();
    }

    private bool HasSupportBelow()
    {
        const float skin = 0.01f;
        Bounds b = _col != null ? _col.bounds : new Bounds(transform.position, Vector3.zero);
        Vector3 origin = new Vector3(b.center.x, b.min.y + skin, b.center.z);
        Vector3 direction = Vector3.down;

        float distance = Mathf.Max(checkDistance, 0.1f);

        Debug.DrawRay(origin, direction * distance, Color.red, checkInterval);

        int hitCount = Physics.RaycastNonAlloc(
            origin, direction, _rayHits, distance, supportMask, QueryTriggerInteraction.Ignore
        );

        if (hitCount == 0) return false;
        

        for (int i = 0; i < hitCount; i++)
        {
            var hit = _rayHits[i];
            var col = hit.collider;
            if (col == null) continue;

            var hitRb = hit.rigidbody != null ? hit.rigidbody : col.GetComponentInParent<Rigidbody>();
            if (hitRb == _rb) continue;
            Debug.DrawRay(origin, direction * hit.distance, Color.green, checkInterval);
            return true;
        }

        return false;
    }
    
    private void Update()
    {
        if (_rb == null) return;

        if (_forceHoleDrop)
        {
            if (_rb.isKinematic)
            {
                ActivatePhysics();
            }
            return;
        }

        if (_rb.isKinematic)
        {
            _checkTimer += Time.deltaTime;
            float interval = Mathf.Max(0.02f, checkInterval);
            if (_checkTimer >= interval)
            {
                _checkTimer = 0f;
                EvaluateSupport();
            }
        }
        else if (Time.time - _activationTime > sleepDelay)
        {
            _rb.isKinematic = true;
        }
    }
    
    private void OnCollisionEnter(Collision collision)
    {
        if (_forceHoleDrop) return;

        if (_rb != null && _rb.isKinematic)
        {
            _rb.isKinematic = false;
            _activationTime = Time.time; 
        }
    }

}
