using UnityEngine;

public class ResourceSetter : MonoBehaviour
{
	private void Awake()
	{
		EnsureSupportActivator(base.transform);
	}

	private void EnsureSupportActivator(Transform instance)
	{
		GameObject go = instance.gameObject;
		Rigidbody rb = go.GetComponent<Rigidbody>();
		if (rb == null)
		{
			rb = go.GetComponentInChildren<Rigidbody>();
		}
		if (rb == null)
		{
			rb = go.AddComponent<Rigidbody>();
		}
		rb.isKinematic = true;
		SupportActivator activator = go.GetComponent<SupportActivator>();
		if (activator == null)
		{
			activator = go.AddComponent<SupportActivator>();
		}
		if (activator.supportMask.value == 0)
		{
			int defaultMask = (1 << LayerMask.NameToLayer("Default")) | (1 << LayerMask.NameToLayer("Collectables"));
			if (defaultMask == 0)
			{
				defaultMask = 65;
			}
			activator.supportMask = defaultMask;
		}
		activator.requiredMisses = 2;
	}
}
