using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(Rigidbody))]
public class ThrowablePusher : MonoBehaviour
{
	[Min(0.1f)]
	public float pushRadius = 1f;

	[Min(0.1f)]
	public float pushForce = 14f;

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
		SupportActivator sa = ((collision.collider != null) ? collision.collider.GetComponentInParent<SupportActivator>() : null);
		if (sa != null)
		{
			TriggerCascadeIfTopRows(sa);
		}
		Pulse();
	}

	private void OnTriggerEnter(Collider other)
	{
		Pulse();
	}

	private void FixedUpdate()
	{
		if (_rb == null)
		{
			return;
		}
		float speed = _rb.velocity.magnitude;
		if (speed < 0.1f)
		{
			return;
		}
		Vector3 dir = _rb.velocity.normalized;
		float distance = speed * Time.fixedDeltaTime * 2f + pushRadius * 0.5f;
		int hitCount = Physics.SphereCastNonAlloc(base.transform.position, pushRadius * 0.5f, dir, _castHits, distance, victimMask, QueryTriggerInteraction.Ignore);
		for (int i = 0; i < hitCount; i++)
		{
			RaycastHit hit = _castHits[i];
			Rigidbody rb = ((hit.rigidbody != null) ? hit.rigidbody : hit.collider.attachedRigidbody);
			if (rb == null || rb == _rb)
			{
				continue;
			}
			if (rb.isKinematic)
			{
				SupportActivator activator = rb.GetComponent<SupportActivator>() ?? rb.GetComponentInChildren<SupportActivator>();
				if (activator != null)
				{
					activator.ForceActivate();
				}
				else
				{
					rb.isKinematic = false;
				}
			}
			SupportActivator sa = ((rb != null) ? rb.GetComponent<SupportActivator>() : null) ?? hit.collider.GetComponentInParent<SupportActivator>();
			if (sa != null)
			{
				TriggerCascadeIfTopRows(sa);
			}
			rb.AddForce((dir + Vector3.up * 0.15f) * pushForce, ForceMode.Impulse);
		}
	}

	private static void TriggerCascadeIfTopRows(SupportActivator sa)
	{
		if (sa.tower == null || sa.rowIndex >= 3)
		{
			return;
		}
		TowerRuntimeIndex idx = sa.tower.GetComponent<TowerRuntimeIndex>();
		if (idx == null)
		{
			return;
		}
		List<SupportActivator> list = idx.members;
		for (int i = 0; i < list.Count; i++)
		{
			SupportActivator other = list[i];
			if (!(other == null))
			{
				other.ForceActivate();
			}
		}
	}

	private void Pulse()
	{
		int hitCount = Physics.OverlapSphereNonAlloc(base.transform.position, pushRadius, _overlapBuffer, victimMask, QueryTriggerInteraction.Ignore);
		for (int i = 0; i < hitCount; i++)
		{
			Collider hit = _overlapBuffer[i];
			if (hit == null)
			{
				continue;
			}
			Rigidbody rb = hit.attachedRigidbody;
			if (rb != null && rb.isKinematic)
			{
				SupportActivator activator = rb.GetComponent<SupportActivator>() ?? rb.GetComponentInChildren<SupportActivator>();
				if (activator != null)
				{
					activator.ForceActivate();
				}
				else
				{
					rb.isKinematic = false;
				}
			}
			if (rb != null)
			{
				Vector3 dir = (hit.transform.position - base.transform.position).normalized;
				rb.AddForce((dir + Vector3.up * 0.2f) * pushForce, ForceMode.Impulse);
			}
		}
	}
}
