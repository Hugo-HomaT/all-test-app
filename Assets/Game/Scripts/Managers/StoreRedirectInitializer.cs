using UnityEngine;

public class StoreRedirectInitializer : MonoBehaviour
{
    private void Awake()
    {
        // Ensure StoreRedirectTracker exists
        if (StoreRedirectTracker.instance == null)
        {
            GameObject trackerObject = new GameObject("StoreRedirectTracker");
            trackerObject.AddComponent<StoreRedirectTracker>();
        }
    }
}