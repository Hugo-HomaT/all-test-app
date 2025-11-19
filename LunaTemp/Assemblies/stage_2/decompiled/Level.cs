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
	private void FindThemeGroups()
	{
		themeGroups.Clear();
		ThemeDisplayGroup[] componentsInChildren = GetComponentsInChildren<ThemeDisplayGroup>(true);
		foreach (ThemeDisplayGroup tdg in componentsInChildren)
		{
			themeGroups.Add(tdg.gameObject);
		}
	}

	[ContextMenu("Auto-Find Wood Towers")]
	private void FindWoodTowers()
	{
		woodTowers.Clear();
		WoodTower[] componentsInChildren = GetComponentsInChildren<WoodTower>(true);
		foreach (WoodTower tower in componentsInChildren)
		{
			woodTowers.Add(tower);
		}
	}

	private void Awake()
	{
		ShowOnlyMatchingGroups();
	}

	private void Start()
	{
		StartCoroutine(DelayedObjectivesInit());
	}

	private IEnumerator DelayedObjectivesInit()
	{
		yield return null;
		yield return new WaitForSeconds(0.1f);
		if (PlayableSettings.instance != null && PlayableSettings.instance.enableObjectivesUI && UIManager.instance != null && UIManager.instance.myObjectivesUISystem != null)
		{
			UIManager.instance.myObjectivesUISystem.InitializeFromScene(woodTowers);
		}
	}

	[ContextMenu("Refresh Theme Groups")]
	private void ShowOnlyMatchingGroups()
	{
		foreach (GameObject go in themeGroups)
		{
			if (!(go == null))
			{
				go.SetActive(true);
				ThemeDisplayGroup display = go.GetComponent<ThemeDisplayGroup>();
				if (display != null)
				{
					display.SyncThemeFromSettings();
				}
			}
		}
	}
}
