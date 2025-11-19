using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ResourceSetter : MonoBehaviour
{
    private void Awake()
    {
        EnsureSupportActivator(transform);
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
        
    }
}
