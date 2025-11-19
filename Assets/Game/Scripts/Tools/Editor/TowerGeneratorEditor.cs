using UnityEditor;
using UnityEngine;

namespace HG.Playables.Tools.Editor
{
    [CustomEditor(typeof(TowerGenerator))]
    public class TowerGeneratorEditor : UnityEditor.Editor
    {
        private SerializedProperty _shape;
        private SerializedProperty _rowHeight;
        private SerializedProperty _startY;
        private SerializedProperty _parentOverride;
        private SerializedProperty _clearBeforeBuild;
        private SerializedProperty _patternRowGroups;


        private void OnEnable()
        {
            _shape = serializedObject.FindProperty("shape");
            _rowHeight = serializedObject.FindProperty("rowHeight");
            _startY = serializedObject.FindProperty("startY");
            _parentOverride = serializedObject.FindProperty("parentOverride");
            _clearBeforeBuild = serializedObject.FindProperty("clearBeforeBuild");
            _patternRowGroups = serializedObject.FindProperty("patternRowGroups");
        }

        public override void OnInspectorGUI()
        {
            serializedObject.Update();

            EditorGUILayout.PropertyField(_shape);
            EditorGUILayout.PropertyField(_rowHeight);
            EditorGUILayout.PropertyField(_startY);
            EditorGUILayout.PropertyField(_parentOverride);
            EditorGUILayout.PropertyField(_clearBeforeBuild);

            EditorGUILayout.Space();
            EditorGUILayout.LabelField("Pattern Row Groups", EditorStyles.boldLabel);
            EditorGUILayout.HelpBox("Each group defines Start Row and End Row (inclusive) with a repeating fruit pattern.", MessageType.None);

            for (int i = 0; i < _patternRowGroups.arraySize; i++)
            {
                SerializedProperty group = _patternRowGroups.GetArrayElementAtIndex(i);
                EditorGUILayout.BeginVertical("box");
                EditorGUILayout.BeginHorizontal();
                EditorGUILayout.LabelField($"Pattern Group {i}", EditorStyles.boldLabel);
                if (GUILayout.Button("▲", GUILayout.Width(24)))
                {
                    if (i > 0) _patternRowGroups.MoveArrayElement(i, i - 1);
                }
                if (GUILayout.Button("▼", GUILayout.Width(24)))
                {
                    if (i < _patternRowGroups.arraySize - 1) _patternRowGroups.MoveArrayElement(i, i + 1);
                }
                if (GUILayout.Button("X", GUILayout.Width(24)))
                {
                    _patternRowGroups.DeleteArrayElementAtIndex(i);
                    EditorGUILayout.EndHorizontal();
                    EditorGUILayout.EndVertical();
                    break;
                }
                EditorGUILayout.EndHorizontal();

                EditorGUILayout.PropertyField(group.FindPropertyRelative("name"));
                using (new EditorGUILayout.HorizontalScope())
                {
                    EditorGUILayout.PropertyField(group.FindPropertyRelative("startRowIndex"));
                    EditorGUILayout.PropertyField(group.FindPropertyRelative("endRowIndex"));
                }
                EditorGUILayout.PropertyField(group.FindPropertyRelative("itemsInRow"));
                EditorGUILayout.PropertyField(group.FindPropertyRelative("perRowHeight"), new GUIContent("Per-Row Height (override)"));
                EditorGUILayout.PropertyField(group.FindPropertyRelative("fillSpacing"), new GUIContent("Fill Spacing (CircularFilled)"));
                
                EditorGUILayout.Space(4);
                EditorGUILayout.LabelField("Grid Settings (Square Shape Only)", EditorStyles.miniLabel);
                using (new EditorGUILayout.HorizontalScope())
                {
                    EditorGUILayout.PropertyField(group.FindPropertyRelative("gridWidth"), new GUIContent("Grid Width (X)"));
                    EditorGUILayout.PropertyField(group.FindPropertyRelative("gridHeight"), new GUIContent("Grid Height (Z)"));
                }
                
                EditorGUILayout.Space(4);
                EditorGUILayout.LabelField("Fruit Pattern", EditorStyles.boldLabel);
                EditorGUILayout.HelpBox("Configure each fruit in the pattern with its own prefab, scale, radius, and angle offset.", MessageType.Info);
                EditorGUILayout.PropertyField(group.FindPropertyRelative("fruitPattern"), true);
                EditorGUILayout.PropertyField(group.FindPropertyRelative("patternRepeatCount"), new GUIContent("Pattern Repeat Count"));

                EditorGUILayout.EndVertical();
            }

            EditorGUILayout.Space(4);
            if (GUILayout.Button("+ Add Pattern Group"))
            {
                AddPatternGroupWithDefaults(_patternRowGroups);
            }

            serializedObject.ApplyModifiedProperties();

            EditorGUILayout.Space();
            using (new EditorGUILayout.HorizontalScope())
            {
                if (GUILayout.Button("Build Tower"))
                {
                    foreach (var t in targets)
                    {
                        var gen = (TowerGenerator)t;
                        Undo.RegisterFullObjectHierarchyUndo(gen.gameObject, "Build Tower");
                        gen.BuildTower();
                        EditorUtility.SetDirty(gen);
                    }
                }

                if (GUILayout.Button("Clear Generated"))
                {
                    foreach (var t in targets)
                    {
                        var gen = (TowerGenerator)t;
                        Undo.RegisterFullObjectHierarchyUndo(gen.gameObject, "Clear Tower");
                        gen.ClearGenerated();
                        EditorUtility.SetDirty(gen);
                    }
                }
            }
        }

        private static void AddPatternGroupWithDefaults(SerializedProperty groupsProp)
        {
            int index = Mathf.Max(0, groupsProp.arraySize);
            groupsProp.InsertArrayElementAtIndex(index);
            var group = groupsProp.GetArrayElementAtIndex(index);
            group.FindPropertyRelative("name").stringValue = "Pattern Group";
            group.FindPropertyRelative("startRowIndex").intValue = 0;
            group.FindPropertyRelative("endRowIndex").intValue = 0;
            group.FindPropertyRelative("itemsInRow").intValue = 24;
            group.FindPropertyRelative("perRowHeight").floatValue = 0f;
            group.FindPropertyRelative("fillSpacing").floatValue = 0.3f;
            group.FindPropertyRelative("gridWidth").intValue = 2;
            group.FindPropertyRelative("gridHeight").intValue = 3;
            group.FindPropertyRelative("patternRepeatCount").intValue = 1;
            
            // Initialize fruit pattern array with default items
            var fruitPatternProp = group.FindPropertyRelative("fruitPattern");
            fruitPatternProp.arraySize = 3;
            for (int i = 0; i < 3; i++)
            {
                var fruitItem = fruitPatternProp.GetArrayElementAtIndex(i);
                fruitItem.FindPropertyRelative("fruitPrefab").objectReferenceValue = null;
                fruitItem.FindPropertyRelative("scale").floatValue = 1f;
                fruitItem.FindPropertyRelative("radius").floatValue = 1f;
                fruitItem.FindPropertyRelative("angleOffsetDegrees").floatValue = 0f;
                fruitItem.FindPropertyRelative("rowHeight").floatValue = 0f;
            }
        }
    }
}


