using System.Collections.Generic;
using UnityEngine;

#if UNITY_EDITOR
using UnityEditor;
#endif

[ExecuteAlways]
public class WoodTower : MonoBehaviour
{
    [Header("Prefabs")]
    public GameObject woodSupportPrefab;
    public GameObject finalWoodSupportPrefab;

    [Header("Holder & Layout")]
    public Transform holder;
    public Transform topItem; 
    public Vector3 elementScale = Vector3.one;
    public int numberOfLevels = 10;
    public float verticalSpacing = 0.2f;

    [Header("Top Item Settings")]
    public Vector3 topOffset = new Vector3(0, 0.1f, 0);
    
    [Header("Particle System")]
    public ParticleSystem sparkleParticle;

    [System.Serializable]
    public class TopItemEntry
    {
        public TopItemType type;
        public GameObject gameObject;
        public Rigidbody rigidbody;
        public SupportActivator supportActivator;
    }

    public List<TopItemEntry> topItemList = new List<TopItemEntry>();

    [Header("Behaviour")]
    public bool spawnAtStart = true;

    private float _floatingOffset;
    private GameObject _activeTopItemObject;
    private Vector3 _originalTopItemLocalPos;
    private bool _originalPosCaptured = false;
    private Rigidbody _topItemRigidbody;
    private bool _visualEffectsActive = true;
    private float _currentFloatingY = 0f;
    private float _originalCheckDistance = 0f;
    private SupportActivator _activeSupportActivator;

    public SupportActivator GetActiveTopItemSupportActivator()
    {
        return _activeSupportActivator;
    }

    public enum TopItemType
    {
        Banana,
        Watermelon,
        Eggplant,
        Cucumber,
        Strawberry,
        Donut
    }

    private void Start()
    {
        ApplyTopItemSizeMultiplier();
        
        if (Application.isPlaying && spawnAtStart)
        {
            SpawnTower();
        }
        
        _floatingOffset = Random.Range(0f, Mathf.PI * 2f);
    }

    private void Update()
    {
        if (PlayableSettings.instance != null)
        {
            UpdateTopItemAnimations();
        }
        
        UpdateParticlePosition();
    }

    [ContextMenu("Spawn Tower")]
    public void SpawnTower()
    {
        if (holder == null || woodSupportPrefab == null || finalWoodSupportPrefab == null)
            return;

        CleanTower();

        int levelsToUse = GetLevelsToUse();
        for (int i = 0; i < levelsToUse; i++)
        {
            GameObject sourcePrefab = (i == levelsToUse - 1)
                ? finalWoodSupportPrefab
                : woodSupportPrefab;

            GameObject instance = InstantiateChildKeepingPrefabLink(sourcePrefab, holder);
            instance.transform.localPosition = new Vector3(0f, i * verticalSpacing, 0f);
            instance.transform.localRotation = Quaternion.identity;
            
            Vector3 scaleToApply = elementScale;
            if (PlayableSettings.instance != null)
            {
                scaleToApply.x = PlayableSettings.instance.towerWidth;
                scaleToApply.z = PlayableSettings.instance.towerWidth;
            }
            instance.transform.localScale = scaleToApply;
        }

        UpdateTopItemPosition();
        UpdateTopItemVisual();
        
        if (sparkleParticle != null && _activeTopItemObject != null)
        {
            if (PlayableSettings.instance != null && PlayableSettings.instance.enableSparkleParticle)
            {
                sparkleParticle.transform.position = _activeTopItemObject.transform.position + Vector3.up * 1.5f;
                sparkleParticle.Play();
            }
            else
            {
                sparkleParticle.Stop();
            }
        }
        
        if (Application.isPlaying && PlayableSettings.instance != null)
        {
            UpdateTopItemAnimations();
        }
    }

    [ContextMenu("Clean Tower")]
    public void CleanTower()
    {
        if (holder == null)
            return;

        var toDestroy = new List<GameObject>();
        foreach (Transform child in holder)
            toDestroy.Add(child.gameObject);

#if UNITY_EDITOR
        if (!Application.isPlaying)
        {
            foreach (var go in toDestroy)
                DestroyImmediate(go);
        }
        else
#endif
        {
            foreach (var go in toDestroy)
                Destroy(go);
        }
    }

    private int GetLevelsToUse()
    {
        if (PlayableSettings.instance != null)
            return PlayableSettings.instance.towerHeight;
        return numberOfLevels;
    }

    private void UpdateTopItemPosition()
    {
        if (topItem == null) return;
        float lastY = GetLevelsToUse() * verticalSpacing;
        topItem.localPosition = new Vector3(0f, lastY, 0f) + topOffset;
    }

    private void ApplyTopItemSizeMultiplier()
    {
        if (topItemList == null || topItemList.Count == 0)
            return;

        float sizeMultiplier = 1f;
        if (PlayableSettings.instance != null)
        {
            sizeMultiplier = PlayableSettings.instance.topItemSizeMultiplier;
        }

        foreach (var entry in topItemList)
        {
            if (entry.gameObject != null)
            {
                Vector3 currentScale = entry.gameObject.transform.localScale;
                entry.gameObject.transform.localScale = currentScale * sizeMultiplier;
            }
        }
    }

    private void UpdateTopItemVisual()
    {
        if (topItemList == null || topItemList.Count == 0)
            return;

        TopItemType currentSelectedItem = TopItemType.Banana;
        if (PlayableSettings.instance != null)
        {
            currentSelectedItem = PlayableSettings.instance.selectedTopItem;
        }

        GameObject previousActiveItem = _activeTopItemObject;
        _activeTopItemObject = null;
        
        foreach (var entry in topItemList)
        {
            if (entry.gameObject == null) continue;
            bool isActive = entry.type == currentSelectedItem;
            
            if (isActive)
            {
                _activeTopItemObject = entry.gameObject;

                if (entry.gameObject != previousActiveItem)
                {
                    _topItemRigidbody = entry.rigidbody;
                    _activeSupportActivator = entry.supportActivator;
                    
                    Vector3 currentPos = entry.gameObject.transform.localPosition;
                    entry.gameObject.transform.localPosition = new Vector3(currentPos.x, 0, currentPos.z);
                    _originalTopItemLocalPos = entry.gameObject.transform.localPosition;
                    
                    if (_activeSupportActivator != null)
                    {
                        _originalCheckDistance = _activeSupportActivator.checkDistance;
                    }
                    
                    _originalPosCaptured = true;
                    _visualEffectsActive = true;
                    _currentFloatingY = 0f;
                    entry.gameObject.SetActive(true);
                }
                else
                {
                    entry.gameObject.SetActive(true);
                }
            }
            else
            {
                entry.gameObject.SetActive(false);
            }
        }
        
        if (_activeTopItemObject == null)
        {
            _originalPosCaptured = false;
        }
    }

    private void UpdateTopItemAnimations()
    {
        if (PlayableSettings.instance == null || topItem == null)
            return;

        if (_activeTopItemObject == null || !_activeTopItemObject.activeSelf)
        {
            _originalPosCaptured = false;
            UpdateTopItemVisual();
        }
        
        if (_activeTopItemObject == null || !_originalPosCaptured || !_visualEffectsActive)
            return;

        if (_topItemRigidbody != null && !_topItemRigidbody.isKinematic)
        {
            StopVisualEffects();
            return;
        }

        var settings = PlayableSettings.instance;

        float lastY = GetLevelsToUse() * verticalSpacing;
        topItem.localPosition = new Vector3(0f, lastY, 0f) + topOffset;
        
        if (settings.enableTopItemFloating && _activeTopItemObject != null)
        {
            float sinValue = Mathf.Sin((Time.time + _floatingOffset) * settings.topItemFloatingSpeed);
            _currentFloatingY = (sinValue + 1f) * 0.5f * settings.topItemFloatingHeight;
            
            float finalY = _originalTopItemLocalPos.y + _currentFloatingY;
            _activeTopItemObject.transform.localPosition = new Vector3(_originalTopItemLocalPos.x, finalY, _originalTopItemLocalPos.z);
        }
        else if (_activeTopItemObject != null)
        {
            _currentFloatingY = 0f;
            _activeTopItemObject.transform.localPosition = _originalTopItemLocalPos;
        }

        UpdateSupportActivatorCheckDistances();

        if (settings.enableTopItemRotation && _activeTopItemObject != null)
        {
            _activeTopItemObject.transform.Rotate(Vector3.up, settings.topItemRotationSpeed * Time.deltaTime);
        }
    }

    private void StopVisualEffects()
    {
        _visualEffectsActive = false;
        _currentFloatingY = 0f;
        
        if (_activeTopItemObject != null && _originalPosCaptured)
        {
            _activeTopItemObject.transform.localPosition = _originalTopItemLocalPos;
        }
    }
    private void UpdateSupportActivatorCheckDistances()
    {
        if (_activeSupportActivator != null)
        {
            _activeSupportActivator.checkDistance = _originalCheckDistance + _currentFloatingY;
        }
    }

    private void UpdateParticlePosition()
    {
        if (_activeTopItemObject == null || sparkleParticle == null) return;
        
        // Check if sparkle particle should be enabled based on settings
        if (PlayableSettings.instance != null && !PlayableSettings.instance.enableSparkleParticle)
        {
            if (sparkleParticle.isPlaying)
            {
                sparkleParticle.Stop();
            }
            return;
        }
        
        Vector3 itemWorldPos = _activeTopItemObject.transform.position;
        sparkleParticle.transform.position = itemWorldPos + Vector3.up * 1.5f;
        
        if (itemWorldPos.y < 2f && sparkleParticle.isPlaying)
        {
            sparkleParticle.Stop();
        }
    }

    private GameObject InstantiateChildKeepingPrefabLink(GameObject prefab, Transform parent)
    {
#if UNITY_EDITOR
        if (!Application.isPlaying)
        {
            GameObject inst = (GameObject)PrefabUtility.InstantiatePrefab(prefab, parent);
            if (inst == null)
                inst = Instantiate(prefab, parent);
            return inst;
        }
#endif
        return Instantiate(prefab, parent);
    }
}
