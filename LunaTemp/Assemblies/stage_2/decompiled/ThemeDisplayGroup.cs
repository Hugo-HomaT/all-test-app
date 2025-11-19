using System;
using System.Collections.Generic;
using UnityEngine;

[DefaultExecutionOrder(-100)]
public class ThemeDisplayGroup : MonoBehaviour
{
	[Serializable]
	public class ThemeResourceOverride
	{
		public ResourceLoader.LevelTheme theme;

		public string resourceName;
	}

	[Serializable]
	public class ThemePlaceholderEntry
	{
		public ResourcePlaceholder placeholder;

		public string defaultResourceName;

		public List<ThemeResourceOverride> overrides = new List<ThemeResourceOverride>();

		public string GetResourceName(ResourceLoader.LevelTheme currentTheme)
		{
			if (overrides != null)
			{
				foreach (ThemeResourceOverride item in overrides)
				{
					if (item != null && item.theme == currentTheme && !string.IsNullOrEmpty(item.resourceName))
					{
						return item.resourceName;
					}
				}
			}
			return null;
		}
	}

	public ResourceLoader.LevelShape shape;

	public ResourceLoader.LevelTheme theme;

	[Tooltip("Optional root used to collect placeholders when running the context menu.")]
	public Transform searchRoot;

	public List<ThemePlaceholderEntry> placeholders = new List<ThemePlaceholderEntry>();

	private void Awake()
	{
		SyncThemeFromSettings();
	}

	private void Start()
	{
		SyncThemeFromSettings();
	}

	public void SyncThemeFromSettings()
	{
		ResolveThemeFromSettings();
		ApplyTheme();
	}

	public void ResolveThemeFromSettings()
	{
		PlayableSettings settings = PlayableSettings.instance;
		if (!(settings == null))
		{
			ResourceLoader.LevelTheme previousTheme = theme;
			switch (shape)
			{
			case ResourceLoader.LevelShape.Corridor:
				theme = settings.corridorTheme;
				break;
			case ResourceLoader.LevelShape.Circular:
				theme = settings.circularTheme;
				break;
			case ResourceLoader.LevelShape.LvlCircular1:
				theme = settings.lvlCircular1Theme;
				break;
			case ResourceLoader.LevelShape.LvlCircular2:
				theme = settings.lvlCircular2Theme;
				break;
			case ResourceLoader.LevelShape.LvlCircular3:
				theme = settings.lvlCircular3Theme;
				break;
			case ResourceLoader.LevelShape.LvlCircular4:
				theme = settings.lvlCircular4Theme;
				break;
			}
		}
	}

	private void ApplyTheme()
	{
		if (placeholders == null || placeholders.Count == 0)
		{
			return;
		}
		foreach (ThemePlaceholderEntry entry in placeholders)
		{
			if (entry == null || entry.placeholder == null)
			{
				continue;
			}
			string targetName = entry.GetResourceName(theme);
			if (string.IsNullOrEmpty(targetName))
			{
				targetName = GetCollectableName(theme);
				if (string.IsNullOrEmpty(targetName))
				{
					continue;
				}
			}
			entry.placeholder.ApplyResourceName(targetName);
		}
	}

	public static string GetCollectableName(ResourceLoader.LevelTheme levelTheme)
	{
		switch (levelTheme)
		{
		case ResourceLoader.LevelTheme.Cherry:
			return "4 - CherryLeaf";
		case ResourceLoader.LevelTheme.Flower:
			return "None";
		case ResourceLoader.LevelTheme.Maki:
			return "44 - Maki1";
		case ResourceLoader.LevelTheme.Sushi:
			return "43 - Sushi1";
		case ResourceLoader.LevelTheme.Donut:
			return "45 - Donut";
		case ResourceLoader.LevelTheme.Strawberry:
			return "46 - Strawb";
		case ResourceLoader.LevelTheme.PineappleRing:
			return "47 - pineappl_slice";
		case ResourceLoader.LevelTheme.FigBlue:
			return "48 - Fig";
		case ResourceLoader.LevelTheme.Watermelon:
			return "53 - Watermellon";
		case ResourceLoader.LevelTheme.WatermelonQuarter:
			return "54 - Watermelon_Quarter";
		case ResourceLoader.LevelTheme.Starfruit:
			return "52 - Starfruit";
		case ResourceLoader.LevelTheme.DragonfruitHalf:
			return "50 - Dragonfruit_Half";
		case ResourceLoader.LevelTheme.DragonfruitPinkQuarter:
			return "51 - Dragonfruit_Quarter";
		case ResourceLoader.LevelTheme.DragonfruitPink:
			return "49 - Dragonfruit";
		default:
			return null;
		}
	}
}
