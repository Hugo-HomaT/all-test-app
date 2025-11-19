using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Level : MonoBehaviour
{
    [Tooltip("Registered Theme Display Groups. Use context menu to auto-populate.")]
    public List<GameObject> themeGroups = new List<GameObject>();
    
    [Tooltip("Wood Towers in this level. Use context menu to auto-populate.")]
    public List<WoodTower> woodTowers = new List<WoodTower>();

    [ContextMenu("Auto-Find Theme Groups")]
    void FindThemeGroups()
    {
        themeGroups.Clear();
        foreach (var tdg in GetComponentsInChildren<ThemeDisplayGroup>(true))
        {
            themeGroups.Add(tdg.gameObject);
        }
#if UNITY_EDITOR
    UnityEditor.EditorUtility.SetDirty(this);
#endif
    }
    
    [ContextMenu("Auto-Find Wood Towers")]
    void FindWoodTowers()
    {
        woodTowers.Clear();
        foreach (var tower in GetComponentsInChildren<WoodTower>(true))
        {
            woodTowers.Add(tower);
        }
#if UNITY_EDITOR
    UnityEditor.EditorUtility.SetDirty(this);
#endif
    }

    private void Awake()
    {
        ShowOnlyMatchingGroups();
    }

    private void Start()
    {
        // Delay objectives initialization to ensure WoodTower has fully set its top item
        StartCoroutine(DelayedObjectivesInit());
    }

    private IEnumerator DelayedObjectivesInit()
    {
        // Wait a frame to let all Start() methods complete, then a tiny extra delay
        yield return null;
        yield return new WaitForSeconds(0.1f);

        if (PlayableSettings.instance != null && PlayableSettings.instance.enableObjectivesUI)
        {
            if (UIManager.instance != null && UIManager.instance.myObjectivesUISystem != null)
            {
                UIManager.instance.myObjectivesUISystem.InitializeFromScene(woodTowers);
            }
        }
    }

    [ContextMenu("Refresh Theme Groups")]
    void ShowOnlyMatchingGroups()
    {
        foreach (var go in themeGroups)
        {
            if (go == null) continue;

            go.SetActive(true);

            var display = go.GetComponent<ThemeDisplayGroup>();
            if (display != null)
            {
                display.SyncThemeFromSettings();
            }
        }
    }
}