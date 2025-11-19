using System.Collections.Generic;
using UnityEngine;

[DisallowMultipleComponent]
public class TowerRuntimeIndex : MonoBehaviour
{
    public readonly List<SupportActivator> members = new List<SupportActivator>(128);

    public void Clear()
    {
        members.Clear();
    }

    public void Register(SupportActivator activator)
    {
        if (activator == null) return;
        if (!members.Contains(activator)) members.Add(activator);
    }

    public void Unregister(SupportActivator activator)
    {
        if (activator == null) return;
        members.Remove(activator);
    }
}


