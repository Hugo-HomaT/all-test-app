using UnityEngine;
using System.Collections.Generic;
#if UNITY_EDITOR
using UnityEditor;
#endif

public class FloatingFeedback : MonoBehaviour
{
    [SerializeField] private GameObject prefab;            // prefab to duplicate
    [SerializeField] private List<FloatingText> pool = new List<FloatingText>();
    [SerializeField] private int poolSize = 10;

    // Called by HoleController
    public void Show(Vector3 worldPos)
    {
        if (pool.Count == 0) return;

        // simple round-robin reuse
        FloatingText ft = pool[0];
        pool.RemoveAt(0);
        pool.Add(ft);

        worldPos.x += Random.Range(-0.25f, 0.25f);
        worldPos.z += Random.Range(-0.25f, 0.25f);

        ft.Show(worldPos);
    }

#if UNITY_EDITOR
    [ContextMenu("Populate Pool In Editor")]
    private void PopulatePoolInEditor()
    {
        if (!prefab)
        { return;
        }
        for (int i = transform.childCount - 1; i >= 0; i--)
            DestroyImmediate(transform.GetChild(i).gameObject);

        pool.Clear();

        for (int i = 0; i < poolSize; i++)
        {
            GameObject go = (GameObject)PrefabUtility.InstantiatePrefab(prefab, transform);
            go.name = prefab.name + "_" + i;
            var ft = go.GetComponent<FloatingText>();
            go.SetActive(false);
            pool.Add(ft);
        }

        EditorUtility.SetDirty(this);
        EditorUtility.SetDirty(gameObject);
    }
#endif
}