using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class TriggerDetector : MonoBehaviour
{
    public Action OnTrigger;
    public LayerMask detectedLayerMask;
    
    private void OnTriggerEnter(Collider other)
    {
        if (((1 << other.gameObject.layer) & detectedLayerMask) != 0)
        {
            OnTrigger?.Invoke();
        }
    }
}
