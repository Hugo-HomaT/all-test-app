using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ResourceLoader : MonoBehaviour
{
    
    public enum LevelShape { Corridor, Circular, LvlCircular1,LvlCircular2,LvlCircular3,LvlCircular4 }

    public enum LevelTheme { 
        Cherry, 
        Flower, 
        Maki, 
        Sushi, 
        Donut, 
        Strawberry,
        PineappleRing,
        FigBlue,
        Watermelon,
        WatermelonQuarter,
        Starfruit,
        DragonfruitHalf,
        DragonfruitPinkQuarter,
        DragonfruitPink
    }

    public static event Action<Transform> OnObjectLoaded;
    
    private static List<string> resourceList;
    private const string Path = "Collectables/";

    public static void AddToList(string name)
    {
        if (resourceList == null) resourceList = new List<string>();
        if (resourceList.Contains(name)) return;
        resourceList.Add(name);
    }
    
    private void Start()
    {
        if (resourceList == null || resourceList.Count == 0) return;
        foreach (var resourceName in resourceList)
        {
            StartCoroutine(LoadResource(resourceName));
        }
    }

    private IEnumerator LoadResource(string resourceName)
    {
        var request = Resources.LoadAsync(Path + resourceName, typeof(Transform));
        yield return request;
        if (request.asset == null)
        {
            yield break;
        }
            
        OnObjectLoaded?.Invoke(request.asset as Transform);
    }
}
