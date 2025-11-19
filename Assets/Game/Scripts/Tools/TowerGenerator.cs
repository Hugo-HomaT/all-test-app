using System;
using System.Collections.Generic;
using UnityEngine;

namespace HG.Playables.Tools
{
    [ExecuteAlways]
    public class TowerGenerator : MonoBehaviour
    {
        public enum TowerShape
        {
            Circular = 0,
            Square = 1,
            CircularFilled = 2
        }


        [Serializable]
        public class FruitPatternItem
        {
            public GameObject fruitPrefab;
            [Min(0.01f)] public float scale = 1.0f;
            [Min(0.01f)] public float radius = 1.0f;
            public float angleOffsetDegrees = 0f;
            [Min(0f)] public float rowHeight = 0f; // 0 = use global rowHeight
        }

        [Serializable]
        public class PatternRowGroup
        {
            [Header("Pattern Settings")]
            public string name = "Pattern Group";
            [Min(0)] public int startRowIndex = 0;
            [Min(0)] public int endRowIndex = 0; // inclusive
            [Min(1)] public int itemsInRow = 24;
            [Min(0f)] public float perRowHeight = 0f; // 0 = use global rowHeight
            [Min(0.01f)] public float fillSpacing = 0.3f; // used for CircularFilled
            
            [Header("Grid Settings (Square Shape Only)")]
            [Min(1)] public int gridWidth = 2; // number of columns for square/rectangle
            [Min(1)] public int gridHeight = 3; // number of rows for square/rectangle
            
            [Header("Fruit Pattern")]
            public FruitPatternItem[] fruitPattern = new FruitPatternItem[3]; // orange, banana, peach, etc.
            [Min(1)] public int patternRepeatCount = 1; // How many times to repeat the pattern per row
        }

        [Header("General Settings")]
        public TowerShape shape = TowerShape.Circular;
        [Min(0.01f)] public float rowHeight = 0.25f;
        public float startY = 0f;
        public Transform parentOverride;
        public bool clearBeforeBuild = true;

        [Header("Pattern Row Groups (repeating fruit patterns)")]
        public List<PatternRowGroup> patternRowGroups = new List<PatternRowGroup>();

        private const string GeneratedRootName = "Tower_Generated";

        [ContextMenu("Build Tower")]
        public void BuildTower()
        {
            if (patternRowGroups == null || patternRowGroups.Count == 0)
                return;

            Transform root = GetOrCreateGeneratedRoot();
            var index = root.GetComponent<TowerRuntimeIndex>();
            if (index == null) index = root.gameObject.AddComponent<TowerRuntimeIndex>();
            index.Clear();

            if (clearBeforeBuild)
                ClearGenerated(root);

            // Build pattern row groups
            for (int g = 0; g < patternRowGroups.Count; g++)
            {
                PatternRowGroup group = patternRowGroups[g];
                if (group == null || group.fruitPattern == null || group.fruitPattern.Length == 0)
                    continue;

                int startRow = Mathf.Max(0, Mathf.Min(group.startRowIndex, group.endRowIndex));
                int endRow = Mathf.Max(group.startRowIndex, group.endRowIndex);

                for (int rowIndex = startRow; rowIndex <= endRow; rowIndex++)
                {
                    Transform rowParent = new GameObject(GetPatternRowName(rowIndex, group)).transform;
                    rowParent.SetParent(root, false);
                    rowParent.localPosition = new Vector3(0f, GetRowYWithPattern(group, rowIndex), 0f);

                    switch (shape)
                    {
                        case TowerShape.Circular:
                            BuildCircularPatternRow(group, rowParent, root, rowIndex);
                            break;
                        case TowerShape.Square:
                            BuildSquarePatternRow(group, rowParent, root, rowIndex);
                            break;
                        case TowerShape.CircularFilled:
                            BuildCircularFilledPatternRow(group, rowParent, root, rowIndex);
                            break;
                    }
                }
            }

#if UNITY_EDITOR
            TriggerThemeDisplayGroupCollection();
#endif
        }

        [ContextMenu("Clear Generated")]
        public void ClearGenerated()
        {
            Transform root = GetOrCreateGeneratedRoot();
            ClearGenerated(root);
        }

        // Helper methods for pattern groups
        private string GetPatternRowName(int rowIndex, PatternRowGroup group)
        {
            return $"Row_{rowIndex:D3}_{group.name}";
        }

        private float GetRowY(int rowIndex)
        {
            return startY + (rowIndex * rowHeight);
        }

        private float GetRowYWithPattern(PatternRowGroup group, int rowIndex)
        {
            float y = startY;
            
            // Calculate height based on fruit pattern
            for (int i = 0; i < rowIndex; i++)
            {
                FruitPatternItem fruitItem = GetFruitFromPattern(group, i);
                float height = fruitItem != null && fruitItem.rowHeight > 0f ? fruitItem.rowHeight : rowHeight;
                y += height;
            }
            
            return y;
        }

        // Pattern building methods
        private void BuildCircularPatternRow(PatternRowGroup row, Transform rowParent, Transform towerRoot, int rowIndex)
        {
            int count = Mathf.Max(1, row.itemsInRow);
            
            // Get fruit item for this row to use its properties
            FruitPatternItem fruitItem = GetFruitFromPattern(row, rowIndex);
            if (fruitItem == null || fruitItem.fruitPrefab == null) return;
            
            float angleOffsetRad = fruitItem.angleOffsetDegrees * Mathf.Deg2Rad;
            
            for (int i = 0; i < count; i++)
            {
                float t = (float)i / count;
                float angle = t * Mathf.PI * 2f + angleOffsetRad;
                Vector3 dir = new Vector3(Mathf.Cos(angle), 0f, Mathf.Sin(angle));
                Vector3 localPos = dir * fruitItem.radius;

                GameObject instance = InstantiatePreservingPrefab(fruitItem.fruitPrefab, rowParent);
                instance.name = fruitItem.fruitPrefab.name + "_" + i;
                Transform tr = instance.transform;
                tr.localPosition = localPos;
                tr.localRotation = Quaternion.LookRotation(dir, Vector3.up);
                tr.localScale = Vector3.one * fruitItem.scale;

                SetupTowerComponent(instance, towerRoot, rowIndex);
            }
        }

        private void BuildSquarePatternRow(PatternRowGroup row, Transform rowParent, Transform towerRoot, int rowIndex)
        {
            // Get fruit item for this row to use its properties
            FruitPatternItem fruitItem = GetFruitFromPattern(row, rowIndex);
            if (fruitItem == null || fruitItem.fruitPrefab == null) return;
            
            // Use grid dimensions for square/rectangle shape
            int gridWidth = row.gridWidth;
            int gridHeight = row.gridHeight;
            int totalItems = gridWidth * gridHeight;
            
            // Calculate spacing based on radius
            float spacing = fruitItem.radius * 2f;
            
            // Calculate starting position to center the grid
            float startX = -(gridWidth - 1) * spacing * 0.5f;
            float startZ = -(gridHeight - 1) * spacing * 0.5f;
            
            int placed = 0;
            
            // Create grid layout: width is X axis, height is Z axis
            for (int z = 0; z < gridHeight; z++)
            {
                for (int x = 0; x < gridWidth; x++)
                {
                    Vector3 localPos = new Vector3(startX + x * spacing, 0f, startZ + z * spacing);
                    
                    GameObject instance = InstantiatePreservingPrefab(fruitItem.fruitPrefab, rowParent);
                    instance.name = fruitItem.fruitPrefab.name + "_" + placed;
                    Transform tr = instance.transform;
                    tr.localPosition = localPos;
                    tr.localRotation = Quaternion.identity;
                    tr.localScale = Vector3.one * fruitItem.scale;
                    placed++;

                    SetupTowerComponent(instance, towerRoot, rowIndex);
                }
            }
        }

        private void BuildCircularFilledPatternRow(PatternRowGroup row, Transform rowParent, Transform towerRoot, int rowIndex)
        {
            int count = Mathf.Max(1, row.itemsInRow);
            
            // Get fruit item for this row to use its properties
            FruitPatternItem fruitItem = GetFruitFromPattern(row, rowIndex);
            if (fruitItem == null || fruitItem.fruitPrefab == null) return;
            
            float spacing = row.fillSpacing;
            int ringIndex = 0;
            int placed = 0;

            while (placed < count)
            {
                float ringRadius = ringIndex * spacing;
                if (ringRadius > fruitItem.radius) break;

                int itemsInRing = Mathf.RoundToInt(2f * Mathf.PI * ringRadius / spacing);
                if (itemsInRing <= 0) itemsInRing = 1;
                if (placed + itemsInRing > count) itemsInRing = count - placed;

                for (int i = 0; i < itemsInRing; i++)
                {
                    float angle = (float)i / itemsInRing * Mathf.PI * 2f;
                    Vector3 localPos = new Vector3(Mathf.Cos(angle) * ringRadius, 0f, Mathf.Sin(angle) * ringRadius);

                    GameObject instance = InstantiatePreservingPrefab(fruitItem.fruitPrefab, rowParent);
                    instance.name = fruitItem.fruitPrefab.name + "_" + placed;
                    Transform tr = instance.transform;
                    tr.localPosition = localPos;
                    tr.localRotation = Quaternion.LookRotation(localPos.normalized, Vector3.up);
                    tr.localScale = Vector3.one * fruitItem.scale;
                    placed++;

                    SetupTowerComponent(instance, towerRoot, rowIndex);
                }
                ringIndex++;
            }
        }

        private FruitPatternItem GetFruitFromPattern(PatternRowGroup row, int rowIndex)
        {
            if (row.fruitPattern == null || row.fruitPattern.Length == 0) return null;
            
            // Calculate which fruit to use based on row index and pattern repeat count
            int patternIndex = (rowIndex / row.patternRepeatCount) % row.fruitPattern.Length;
            return row.fruitPattern[patternIndex];
        }

        private void SetupTowerComponent(GameObject instance, Transform towerRoot, int rowIndex)
        {
            // If the prefab is a ResourcePlaceholder, stamp tower info
            var placeholder = instance.GetComponent<ResourcePlaceholder>();
            if (placeholder != null)
            {
                placeholder.tower = towerRoot;
                placeholder.rowIndex = rowIndex;
            }
            else
            {
                // If it already has SupportActivator, register it now
                var sa = instance.GetComponentInChildren<SupportActivator>();
                if (sa != null)
                {
                    sa.tower = towerRoot;
                    sa.rowIndex = rowIndex;
                    var idx = towerRoot.GetComponent<TowerRuntimeIndex>();
                    if (idx != null) idx.Register(sa);
                }
            }
        }

		private static GameObject InstantiatePreservingPrefab(GameObject prefab, Transform parent)
		{
#if UNITY_EDITOR
			if (!Application.isPlaying)
			{
				var obj = UnityEditor.PrefabUtility.InstantiatePrefab(prefab, parent) as GameObject;
				if (obj != null) return obj;
			}
#endif
			return Instantiate(prefab, parent);
		}

        private Transform GetOrCreateGeneratedRoot()
        {
            Transform host = parentOverride != null ? parentOverride : transform;
            Transform existing = host.Find(GeneratedRootName);
            if (existing != null)
                return existing;

            GameObject obj = new GameObject(GeneratedRootName);
            obj.transform.SetParent(host, false);
            return obj.transform;
        }

        private static void ClearGenerated(Transform root)
        {
            for (int i = root.childCount - 1; i >= 0; i--)
            {
                Transform child = root.GetChild(i);
#if UNITY_EDITOR
                if (!Application.isPlaying)
                    UnityEditor.Undo.DestroyObjectImmediate(child.gameObject);
                else
                    Destroy(child.gameObject);
#else
                Destroy(child.gameObject);
#endif
            }
        }


        private void OnDrawGizmosSelected()
        {
            if (patternRowGroups == null)
                return;

            Gizmos.color = new Color(1f, 0.6f, 0.1f, 0.6f);
            for (int g = 0; g < patternRowGroups.Count; g++)
            {
                PatternRowGroup group = patternRowGroups[g];
                if (group == null) continue;
                int startRow = Mathf.Max(0, Mathf.Min(group.startRowIndex, group.endRowIndex));
                int endRow = Mathf.Max(group.startRowIndex, group.endRowIndex);
                for (int rowIndex = startRow; rowIndex <= endRow; rowIndex++)
                {
                    Vector3 yOffset = new Vector3(0f, GetRowYWithPattern(group, rowIndex), 0f);
                    
                    // Get the fruit item for this row to use its radius
                    FruitPatternItem fruitItem = GetFruitFromPattern(group, rowIndex);
                    float radius = fruitItem != null ? fruitItem.radius : 1f;
                    
                    if (shape == TowerShape.Circular || shape == TowerShape.CircularFilled)
                        DrawCircleGizmo(transform.position + yOffset, radius);
                    else if (shape == TowerShape.Square)
                        DrawRectangleGizmo(transform.position + yOffset, group.gridWidth, group.gridHeight, radius);
                }
            }
        }


        private static void DrawCircleGizmo(Vector3 center, float radius)
        {
            const int segments = 64;
            Vector3 prev = center + new Vector3(radius, 0f, 0f);
            for (int i = 1; i <= segments; i++)
            {
                float t = (float)i / segments;
                float angle = t * Mathf.PI * 2f;
                Vector3 next = center + new Vector3(Mathf.Cos(angle) * radius, 0f, Mathf.Sin(angle) * radius);
                Gizmos.DrawLine(prev, next);
                prev = next;
            }
        }

        private static void DrawRectangleGizmo(Vector3 center, int gridWidth, int gridHeight, float radius)
        {
            float spacing = radius * 2f;
            float halfWidth = (gridWidth - 1) * spacing * 0.5f;
            float halfHeight = (gridHeight - 1) * spacing * 0.5f;
            
            Vector3 a = center + new Vector3(-halfWidth, 0f, -halfHeight);
            Vector3 b = center + new Vector3(-halfWidth, 0f, halfHeight);
            Vector3 c = center + new Vector3(halfWidth, 0f, halfHeight);
            Vector3 d = center + new Vector3(halfWidth, 0f, -halfHeight);
            Gizmos.DrawLine(a, b);
            Gizmos.DrawLine(b, c);
            Gizmos.DrawLine(c, d);
            Gizmos.DrawLine(d, a);
        }

#if UNITY_EDITOR
        private void TriggerThemeDisplayGroupCollection()
        {
            var displayGroup = GetComponent<ThemeDisplayGroup>();
            if (displayGroup == null)
            {
                displayGroup = GetComponentInChildren<ThemeDisplayGroup>();
            }

            displayGroup?.CollectResourcePlaceholders();
        }
#endif
    }
}



