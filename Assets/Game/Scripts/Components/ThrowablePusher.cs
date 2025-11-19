using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class ThrowablePusher : MonoBehaviour
{
    [Min(0.1f)] public float pushRadius = 1f;
    [Min(0.1f)] public float pushForce = 14f;
    public LayerMask victimMask; 

    private Rigidbody _rb;
    private RaycastHit[] _castHits;
    private Collider[] _overlapBuffer;

    private void Awake()
    {
        _rb = GetComponent<Rigidbody>();
        _castHits = PhysicsObjectPool.GetRaycastHits(8);
        _overlapBuffer = PhysicsObjectPool.GetColliders(16);
    }
    
    private void OnDestroy()
    {
        if (_castHits != null)
        {
            PhysicsObjectPool.ReturnRaycastHits(_castHits);
            _castHits = null;
        }
        if (_overlapBuffer != null)
        {
            PhysicsObjectPool.ReturnColliders(_overlapBuffer);
            _overlapBuffer = null;
        }
    }

    private void OnCollisionEnter(Collision collision)
    {
        // Check cascade on directly hit object
        var sa = collision.collider != null ? collision.collider.GetComponentInParent<SupportActivator>() : null;
        if (sa != null) TriggerCascadeIfTopRows(sa);
        Pulse();
    }

    private void OnTriggerEnter(Collider other)
    {
        Pulse();
    }

    private void FixedUpdate()
    {
        if (_rb == null) return;
        float speed = _rb.velocity.magnitude;
        if (speed < 0.1f) return;

        Vector3 dir = _rb.velocity.normalized;
        float distance = speed * Time.fixedDeltaTime * 2f + pushRadius * 0.5f;
        int hitCount = Physics.SphereCastNonAlloc(transform.position, pushRadius * 0.5f, dir, _castHits, distance, victimMask, QueryTriggerInteraction.Ignore);
        for (int i = 0; i < hitCount; i++)
        {
            var hit = _castHits[i];
            var rb = hit.rigidbody != null ? hit.rigidbody : hit.collider.attachedRigidbody;
            if (rb == null || rb == _rb) continue;
            if (rb.isKinematic)
            {
                var activator = rb.GetComponent<SupportActivator>() ?? rb.GetComponentInChildren<SupportActivator>();
                if (activator != null) activator.ForceActivate(); else rb.isKinematic = false;
            }
            // Cascade if the hit object belongs to a top row
            var sa = (rb != null ? rb.GetComponent<SupportActivator>() : null) ?? hit.collider.GetComponentInParent<SupportActivator>();
            if (sa != null) TriggerCascadeIfTopRows(sa);
            rb.AddForce((dir + Vector3.up * 0.15f) * pushForce, ForceMode.Impulse);
        }
    }

    private static void TriggerCascadeIfTopRows(SupportActivator sa)
    {
        if (sa.tower == null) return;
        if (sa.rowIndex >= 3) return;
        var idx = sa.tower.GetComponent<TowerRuntimeIndex>();
        if (idx == null) return;
        var list = idx.members;
        for (int i = 0; i < list.Count; i++)
        {
            var other = list[i];
            if (other == null) continue;
            other.ForceActivate();
        }
    }

    private void Pulse()
    {
        int hitCount = Physics.OverlapSphereNonAlloc(transform.position, pushRadius, _overlapBuffer, victimMask, QueryTriggerInteraction.Ignore);
        for (int i = 0; i < hitCount; i++)
        {
            var hit = _overlapBuffer[i];
            if (hit == null) continue;
            
            var rb = hit.attachedRigidbody;
            if (rb != null && rb.isKinematic)
            {
                // Wake sleeping kinematic items
                var activator = rb.GetComponent<SupportActivator>() ?? rb.GetComponentInChildren<SupportActivator>();
                if (activator != null)
                {
                    activator.ForceActivate();
                }
                else
                {
                    rb.isKinematic = false;
                }
            }

            // Nudge away slightly
            if (rb != null)
            {
                Vector3 dir = (hit.transform.position - transform.position).normalized;
                rb.AddForce((dir + Vector3.up * 0.2f) * pushForce, ForceMode.Impulse);
            }
        }
    }
}


