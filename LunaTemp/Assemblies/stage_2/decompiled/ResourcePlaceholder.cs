using UnityEngine;

public class ResourcePlaceholder : MonoBehaviour
{
	public string resourceName;

	public Transform tower;

	public int rowIndex;

	private void Awake()
	{
		if (!string.IsNullOrEmpty(resourceName))
		{
			ResourceLoader.AddToList(resourceName);
			ResourceLoader.OnObjectLoaded += SpawnInstance;
		}
	}

	public void ApplyResourceName(string newResourceName)
	{
		if (!string.IsNullOrEmpty(newResourceName))
		{
			string previous = resourceName;
			resourceName = newResourceName;
			ResourceLoader.AddToList(resourceName);
		}
	}

	private void SpawnInstance(Transform prefab)
	{
		if (!(resourceName != prefab.name) && !(prefab == null))
		{
			Transform tr = base.transform;
			Transform instance = Object.Instantiate(prefab, tr.position, tr.rotation, tr.parent);
			instance.localScale = tr.localScale;
			instance.name = resourceName;
			Object.Destroy(base.gameObject);
		}
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
		activator.tower = tower;
		activator.rowIndex = rowIndex;
		TowerRuntimeIndex index = ((tower != null) ? tower.GetComponent<TowerRuntimeIndex>() : null);
		if (index != null)
		{
			index.Register(activator);
		}
	}
}
