using UnityEngine;
using UnityEditor;
using System.Collections;

public class BulkReplaceObjects : ScriptableWizard
{
    [SerializeField] private GameObject[] _objectsToReplace;
    [SerializeField] private GameObject _replaceWithPrefab;
    [SerializeField] private bool _deleteOld;

    [MenuItem("CustomTools/Bulk Replace GameObjects")]
    private static void CreateWizard()
    {
        DisplayWizard("Bulk Replace GameObjects", typeof(BulkReplaceObjects), "Replace");
    }

    private void OnWizardCreate()
    {
        foreach (GameObject go in _objectsToReplace)
        {
            GameObject newObject;
            newObject = (GameObject)PrefabUtility.InstantiatePrefab(_replaceWithPrefab);
            newObject.transform.position = go.transform.position;
            newObject.transform.rotation = go.transform.rotation;
            newObject.transform.parent = go.transform.parent;

            newObject.SetActive(go.activeInHierarchy);

            if (_deleteOld)
                DestroyImmediate(go);
        }
    }
}