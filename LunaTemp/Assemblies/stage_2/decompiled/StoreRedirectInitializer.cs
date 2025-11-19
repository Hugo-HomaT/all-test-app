using UnityEngine;

public class StoreRedirectInitializer : MonoBehaviour
{
	private void Awake()
	{
		if (StoreRedirectTracker.instance == null)
		{
			GameObject trackerObject = new GameObject("StoreRedirectTracker");
			trackerObject.AddComponent<StoreRedirectTracker>();
		}
	}
}
