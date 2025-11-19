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
                foreach (var item in overrides)
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
        var settings = PlayableSettings.instance;
        if (settings == null)
        {
            return;
        }

        var previousTheme = theme;

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

    private void ApplyTheme()
    {
        if (placeholders == null || placeholders.Count == 0)
        {
            return;
        }

        foreach (var entry in placeholders)
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

#if UNITY_EDITOR
    [ContextMenu("Collect Resource Placeholders")]
    public void CollectResourcePlaceholders()
    {
        if (placeholders == null)
        {
            placeholders = new List<ThemePlaceholderEntry>();
        }

        var existing = new HashSet<ResourcePlaceholder>();

        var localPlaceholders = GetComponentsInChildren<ResourcePlaceholder>(true);
        AddPlaceholders(localPlaceholders, existing);

        if (searchRoot != null)
        {
            var extraPlaceholders = searchRoot.GetComponentsInChildren<ResourcePlaceholder>(true);
            AddPlaceholders(extraPlaceholders, existing);
        }

        placeholders.RemoveAll(entry => entry == null || entry.placeholder == null || !existing.Contains(entry.placeholder));

        UnityEditor.EditorUtility.SetDirty(this);
    }

    private void AddPlaceholders(ResourcePlaceholder[] candidates, HashSet<ResourcePlaceholder> existing)
    {
        if (candidates == null)
        {
            return;
        }

        foreach (var candidate in candidates)
        {
            if (candidate == null)
            {
                continue;
            }

            if (!existing.Add(candidate))
            {
                continue;
            }

            var entry = placeholders.Find(e => e != null && e.placeholder == candidate);
            if (entry == null)
            {
                entry = new ThemePlaceholderEntry
                {
                    placeholder = candidate,
                    defaultResourceName = string.IsNullOrEmpty(candidate.resourceName) ? candidate.name : candidate.resourceName
                };
                placeholders.Add(entry);
            }
            else if (string.IsNullOrEmpty(entry.defaultResourceName))
            {
                entry.defaultResourceName = string.IsNullOrEmpty(candidate.resourceName) ? candidate.name : candidate.resourceName;
            }
        }
    }
#endif
}