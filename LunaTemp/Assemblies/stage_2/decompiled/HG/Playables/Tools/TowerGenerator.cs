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
			Circular,
			Square,
			CircularFilled
		}

		[Serializable]
		public class FruitPatternItem
		{
			public GameObject fruitPrefab;

			[Min(0.01f)]
			public float scale = 1f;

			[Min(0.01f)]
			public float radius = 1f;

			public float angleOffsetDegrees = 0f;

			[Min(0f)]
			public float rowHeight = 0f;
		}

		[Serializable]
		public class PatternRowGroup
		{
			[Header("Pattern Settings")]
			public string name = "Pattern Group";

			[Min(0f)]
			public int startRowIndex = 0;

			[Min(0f)]
			public int endRowIndex = 0;

			[Min(1f)]
			public int itemsInRow = 24;

			[Min(0f)]
			public float perRowHeight = 0f;

			[Min(0.01f)]
			public float fillSpacing = 0.3f;

			[Header("Grid Settings (Square Shape Only)")]
			[Min(1f)]
			public int gridWidth = 2;

			[Min(1f)]
			public int gridHeight = 3;

			[Header("Fruit Pattern")]
			public FruitPatternItem[] fruitPattern = new FruitPatternItem[3];

			[Min(1f)]
			public int patternRepeatCount = 1;
		}

		[Header("General Settings")]
		public TowerShape shape = TowerShape.Circular;

		[Min(0.01f)]
		public float rowHeight = 0.25f;

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
			{
				return;
			}
			Transform root = GetOrCreateGeneratedRoot();
			TowerRuntimeIndex index = root.GetComponent<TowerRuntimeIndex>();
			if (index == null)
			{
				index = root.gameObject.AddComponent<TowerRuntimeIndex>();
			}
			index.Clear();
			if (clearBeforeBuild)
			{
				ClearGenerated(root);
			}
			for (int g = 0; g < patternRowGroups.Count; g++)
			{
				PatternRowGroup group = patternRowGroups[g];
				if (group == null || group.fruitPattern == null || group.fruitPattern.Length == 0)
				{
					continue;
				}
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
		}

		[ContextMenu("Clear Generated")]
		public void ClearGenerated()
		{
			Transform root = GetOrCreateGeneratedRoot();
			ClearGenerated(root);
		}

		private string GetPatternRowName(int rowIndex, PatternRowGroup group)
		{
			return $"Row_{rowIndex:D3}_{group.name}";
		}

		private float GetRowY(int rowIndex)
		{
			return startY + (float)rowIndex * rowHeight;
		}

		private float GetRowYWithPattern(PatternRowGroup group, int rowIndex)
		{
			float y = startY;
			for (int i = 0; i < rowIndex; i++)
			{
				FruitPatternItem fruitItem = GetFruitFromPattern(group, i);
				float height = ((fruitItem != null && fruitItem.rowHeight > 0f) ? fruitItem.rowHeight : rowHeight);
				y += height;
			}
			return y;
		}

		private void BuildCircularPatternRow(PatternRowGroup row, Transform rowParent, Transform towerRoot, int rowIndex)
		{
			int count = Mathf.Max(1, row.itemsInRow);
			FruitPatternItem fruitItem = GetFruitFromPattern(row, rowIndex);
			if (fruitItem != null && !(fruitItem.fruitPrefab == null))
			{
				float angleOffsetRad = fruitItem.angleOffsetDegrees * (3.14159265f / 180f);
				for (int i = 0; i < count; i++)
				{
					float t = (float)i / (float)count;
					float angle = t * 3.14159265f * 2f + angleOffsetRad;
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
		}

		private void BuildSquarePatternRow(PatternRowGroup row, Transform rowParent, Transform towerRoot, int rowIndex)
		{
			FruitPatternItem fruitItem = GetFruitFromPattern(row, rowIndex);
			if (fruitItem == null || fruitItem.fruitPrefab == null)
			{
				return;
			}
			int gridWidth = row.gridWidth;
			int gridHeight = row.gridHeight;
			int totalItems = gridWidth * gridHeight;
			float spacing = fruitItem.radius * 2f;
			float startX = (float)(-(gridWidth - 1)) * spacing * 0.5f;
			float startZ = (float)(-(gridHeight - 1)) * spacing * 0.5f;
			int placed = 0;
			for (int z = 0; z < gridHeight; z++)
			{
				for (int x = 0; x < gridWidth; x++)
				{
					Vector3 localPos = new Vector3(startX + (float)x * spacing, 0f, startZ + (float)z * spacing);
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
			FruitPatternItem fruitItem = GetFruitFromPattern(row, rowIndex);
			if (fruitItem == null || fruitItem.fruitPrefab == null)
			{
				return;
			}
			float spacing = row.fillSpacing;
			int ringIndex = 0;
			int placed = 0;
			while (placed < count)
			{
				float ringRadius = (float)ringIndex * spacing;
				if (ringRadius > fruitItem.radius)
				{
					break;
				}
				int itemsInRing = Mathf.RoundToInt(3.14159265f * 2f * ringRadius / spacing);
				if (itemsInRing <= 0)
				{
					itemsInRing = 1;
				}
				if (placed + itemsInRing > count)
				{
					itemsInRing = count - placed;
				}
				for (int i = 0; i < itemsInRing; i++)
				{
					float angle = (float)i / (float)itemsInRing * 3.14159265f * 2f;
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
			if (row.fruitPattern == null || row.fruitPattern.Length == 0)
			{
				return null;
			}
			int patternIndex = rowIndex / row.patternRepeatCount % row.fruitPattern.Length;
			return row.fruitPattern[patternIndex];
		}

		private void SetupTowerComponent(GameObject instance, Transform towerRoot, int rowIndex)
		{
			ResourcePlaceholder placeholder = instance.GetComponent<ResourcePlaceholder>();
			if (placeholder != null)
			{
				placeholder.tower = towerRoot;
				placeholder.rowIndex = rowIndex;
				return;
			}
			SupportActivator sa = instance.GetComponentInChildren<SupportActivator>();
			if (sa != null)
			{
				sa.tower = towerRoot;
				sa.rowIndex = rowIndex;
				TowerRuntimeIndex idx = towerRoot.GetComponent<TowerRuntimeIndex>();
				if (idx != null)
				{
					idx.Register(sa);
				}
			}
		}

		private static GameObject InstantiatePreservingPrefab(GameObject prefab, Transform parent)
		{
			return UnityEngine.Object.Instantiate(prefab, parent);
		}

		private Transform GetOrCreateGeneratedRoot()
		{
			Transform host = ((parentOverride != null) ? parentOverride : base.transform);
			Transform existing = host.Find("Tower_Generated");
			if (existing != null)
			{
				return existing;
			}
			GameObject obj = new GameObject("Tower_Generated");
			obj.transform.SetParent(host, false);
			return obj.transform;
		}

		private static void ClearGenerated(Transform root)
		{
			for (int i = root.childCount - 1; i >= 0; i--)
			{
				Transform child = root.GetChild(i);
				UnityEngine.Object.Destroy(child.gameObject);
			}
		}

		private void OnDrawGizmosSelected()
		{
			if (patternRowGroups == null)
			{
				return;
			}
			Gizmos.color = new Color(1f, 0.6f, 0.1f, 0.6f);
			for (int g = 0; g < patternRowGroups.Count; g++)
			{
				PatternRowGroup group = patternRowGroups[g];
				if (group == null)
				{
					continue;
				}
				int startRow = Mathf.Max(0, Mathf.Min(group.startRowIndex, group.endRowIndex));
				int endRow = Mathf.Max(group.startRowIndex, group.endRowIndex);
				for (int rowIndex = startRow; rowIndex <= endRow; rowIndex++)
				{
					Vector3 yOffset = new Vector3(0f, GetRowYWithPattern(group, rowIndex), 0f);
					float radius = GetFruitFromPattern(group, rowIndex)?.radius ?? 1f;
					if (shape == TowerShape.Circular || shape == TowerShape.CircularFilled)
					{
						DrawCircleGizmo(base.transform.position + yOffset, radius);
					}
					else if (shape == TowerShape.Square)
					{
						DrawRectangleGizmo(base.transform.position + yOffset, group.gridWidth, group.gridHeight, radius);
					}
				}
			}
		}

		private static void DrawCircleGizmo(Vector3 center, float radius)
		{
			Vector3 prev = center + new Vector3(radius, 0f, 0f);
			for (int i = 1; i <= 64; i++)
			{
				float t = (float)i / 64f;
				float angle = t * 3.14159265f * 2f;
				Vector3 next = center + new Vector3(Mathf.Cos(angle) * radius, 0f, Mathf.Sin(angle) * radius);
				Gizmos.DrawLine(prev, next);
				prev = next;
			}
		}

		private static void DrawRectangleGizmo(Vector3 center, int gridWidth, int gridHeight, float radius)
		{
			float spacing = radius * 2f;
			float halfWidth = (float)(gridWidth - 1) * spacing * 0.5f;
			float halfHeight = (float)(gridHeight - 1) * spacing * 0.5f;
			Vector3 a = center + new Vector3(0f - halfWidth, 0f, 0f - halfHeight);
			Vector3 b = center + new Vector3(0f - halfWidth, 0f, halfHeight);
			Vector3 c = center + new Vector3(halfWidth, 0f, halfHeight);
			Vector3 d = center + new Vector3(halfWidth, 0f, 0f - halfHeight);
			Gizmos.DrawLine(a, b);
			Gizmos.DrawLine(b, c);
			Gizmos.DrawLine(c, d);
			Gizmos.DrawLine(d, a);
		}
	}
}
