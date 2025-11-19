using System;
using UnityEngine;

public class ResourcePlaceholder : MonoBehaviour
{
    public string resourceName;
    public Transform tower;
    public int rowIndex;

    private void Awake()
    {
        if (string.IsNullOrEmpty(resourceName))
        {
            return;
        }
        ResourceLoader.AddToList(resourceName);
        ResourceLoader.OnObjectLoaded += SpawnInstance;
    }

    public void ApplyResourceName(string newResourceName)
    {
        if (string.IsNullOrEmpty(newResourceName))
        {
            return;
        }

        var previous = resourceName;
        resourceName = newResourceName;
        
        ResourceLoader.AddToList(resourceName);
    }

    private void SpawnInstance(Transform prefab)
    {
        if (resourceName != prefab.name) return;
        if (prefab == null)
        {
            return;
        }
        var tr = transform;
        var instance = Instantiate(prefab, tr.position, tr.rotation, tr.parent);
        instance.localScale = tr.localScale;
        instance.name = resourceName;

     //   EnsureSupportActivator(instance);
        Destroy(gameObject);
    }

    private void EnsureSupportActivator(Transform instance)
    {
        var go = instance.gameObject;

        // Ensure a Rigidbody exists and starts as kinematic
        var rb = go.GetComponent<Rigidbody>();
        if (rb == null) rb = go.GetComponentInChildren<Rigidbody>();
        if (rb == null) rb = go.AddComponent<Rigidbody>();
        rb.isKinematic = true;

        // Add SupportActivator if missing and derive basic checks from bounds
        var activator = go.GetComponent<SupportActivator>();
        if (activator == null) activator = go.AddComponent<SupportActivator>();
        if (activator.supportMask.value == 0)
        {
            var defaultMask = (1 << LayerMask.NameToLayer("Default")) | (1 << LayerMask.NameToLayer("Collectables"));
            if (defaultMask == 0)
                defaultMask = (1 << 0) | (1 << 6);
            activator.supportMask = defaultMask;
        }

        // Keep simple: rely on activator.checkDistance default; only set misses
        activator.requiredMisses = 2;

        // Propagate tower reference to activator
        activator.tower = tower;
        activator.rowIndex = rowIndex;
        var index = tower != null ? tower.GetComponent<TowerRuntimeIndex>() : null;
        if (index != null) index.Register(activator);
    }

#if UNITY_EDITOR
    [ContextMenu("Set resource name")]
    private void SetName()
    {
        resourceName = name;
        UnityEditor.EditorUtility.SetDirty(gameObject);
        UnityEditor.AssetDatabase.SaveAssets();
    }
    #endif
}
