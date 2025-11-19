using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class ObjectivesUISystem : MonoBehaviour
{
    public ItemObjective[] itemObjectivePool;


    private class RuntimeObjective
    {
        public Sprite icon;
        public ItemObjective card;
        public int lastCount;
        public List<SupportActivator> supports;
        public bool isTopItem;
        public int pendingVisualRemovals;
        public RectTransform cardRect;
    }

    public RectTransform backgroundRect;

    [Header("Pickup Feedback")]
    public bool enablePickupFlight = false;
    public ObjectivePickupIcon pickupIconPrefab;
    public RectTransform pickupIconContainer;
    public int initialPickupIconPool = 4;
    public float pickupFlightDuration = 0.6f;
    public Camera worldCamera;

    private const float PickupIconStartScale = 0.6f;
    private const float PickupIconEndScale = 1f;
    private const float CardBounceScale = 1.1f;
    private const float CardBounceDuration = 0.18f;
    private const float ControlOffsetMax = 60f;
    private const float ControlOffsetMin = 10f;

    private readonly List<RuntimeObjective> _runtimeObjectives = new List<RuntimeObjective>();
    private readonly Dictionary<ObjectiveKey, RuntimeObjective> _objectiveLookup = new Dictionary<ObjectiveKey, RuntimeObjective>();
    private readonly List<ObjectivePickupIcon> _pickupPool = new List<ObjectivePickupIcon>();
    private readonly List<ObjectivePickupIcon> _activePickupIcons = new List<ObjectivePickupIcon>();
    private readonly Dictionary<RectTransform, Coroutine> _cardBounceRoutines = new Dictionary<RectTransform, Coroutine>();
    private float _updateInterval = 0.5f;
    private Coroutine _updateRoutine;
    private RectTransform _pickupContainerRect;
    private Canvas _canvas;
    private Camera _uiCamera;
    private Camera _worldCamera;

    private void Awake()
    {
        if (pickupIconContainer != null)
            _pickupContainerRect = pickupIconContainer;
        else
            _pickupContainerRect = GetComponent<RectTransform>();

        _canvas = GetComponentInParent<Canvas>();
        if (_canvas != null)
        {
            _uiCamera = _canvas.renderMode == RenderMode.ScreenSpaceOverlay ? null : _canvas.worldCamera;
        }

        _worldCamera = worldCamera != null ? worldCamera : Camera.main;
    }

    private void OnEnable()
    {
        InitializeFromScene();
    }

    private void OnDisable()
    {
        if (_updateRoutine != null)
        {
            StopCoroutine(_updateRoutine);
            _updateRoutine = null;
        }
        ClearActivePickupIcons();
    }

    public void InitializeFromScene(List<WoodTower> woodTowers = null)
    {
        if (PlayableSettings.instance != null)
        {
            enablePickupFlight = PlayableSettings.instance.enableObjectivePickupFlight;
            pickupFlightDuration = Mathf.Max(0.1f, PlayableSettings.instance.objectivePickupFlightDuration);
        }
        
        _runtimeObjectives.Clear();
        _objectiveLookup.Clear();
        ClearActivePickupIcons();

        if (itemObjectivePool != null)
        {
            for (int i = 0; i < itemObjectivePool.Length; i++)
                if (itemObjectivePool[i] != null && itemObjectivePool[i].gameObject.activeSelf)
                    itemObjectivePool[i].gameObject.SetActive(false);
        }

        if (PlayableSettings.instance != null && !PlayableSettings.instance.enableObjectivesUI)
        {
            if (_updateRoutine != null) StopCoroutine(_updateRoutine);
            _updateRoutine = null;

            return;
        }

        int poolIndex = 0;
        List<SupportActivator> allSupports;

        if (woodTowers != null && woodTowers.Count > 0)
        {
            allSupports = new List<SupportActivator>();
            foreach (var tower in woodTowers)
            {
                if (tower != null)
                {
                    var topItemActivator = tower.GetActiveTopItemSupportActivator();
                    if (topItemActivator != null)
                    {
                        allSupports.Add(topItemActivator);
                    }
                }
            }
            
            var otherSupports = Object.FindObjectsOfType<SupportActivator>();
            foreach (var support in otherSupports)
            {
                if (support != null && !support.isTopItem && support.countInObjectives)
                {
                    allSupports.Add(support);
                }
            }
        }
        else
        {
            allSupports = Object.FindObjectsOfType<SupportActivator>().ToList();
        }

        if (allSupports == null || allSupports.Count == 0)
        {
            if (_updateRoutine != null) StopCoroutine(_updateRoutine);
            _updateRoutine = null;
         
            return;
        }

        var topItems = allSupports.Where(s => s != null && s.isTopItem && s.objectiveIcon != null).ToList();
        if (topItems.Count > 0 && poolIndex < itemObjectivePool.Length)
        {
            var firstTopItem = topItems[0];
            var card = itemObjectivePool[poolIndex++];
            if (card != null)
            {
                if (card.itemImage != null) card.itemImage.sprite = firstTopItem.objectiveIcon;
                int current = topItems.Count(s => s != null && s.gameObject.activeInHierarchy && s.countInObjectives);
                if (card.itemCountText != null) card.itemCountText.text = current.ToString();
                card.gameObject.SetActive(current > 0);

                _runtimeObjectives.Add(new RuntimeObjective
                {
                    icon = firstTopItem.objectiveIcon,
                    card = card,
                    lastCount = -1,
                    supports = topItems,
                    isTopItem = true,
                    cardRect = card.GetComponent<RectTransform>(),
                    pendingVisualRemovals = 0
                });
            }
        }

        if (PlayableSettings.instance != null && PlayableSettings.instance.objectivesOnlyTopItem)
        {
            BuildObjectiveLookup();
            WarmupPickupPool();
            StartOrRestartLoop();
            RefreshBackground();
            return;
        }

        var counted = allSupports.Where(s => s != null && s.countInObjectives && !s.isTopItem).ToList();
        var groups = counted.GroupBy(s => s.objectiveIcon);

        foreach (var g in groups)
        {
            if (poolIndex >= itemObjectivePool.Length) break;
            var card = itemObjectivePool[poolIndex++];
            if (card == null) continue;

            var icon = g.Key;
            if (card.itemImage != null) card.itemImage.sprite = icon;

            var list = g.ToList();
            int countNow = 0;

            for (int i = 0; i < list.Count; i++)
            {
                var s = list[i];
                if (s != null && s.countInObjectives && s.gameObject.activeInHierarchy)
                    countNow++;
            }

            if (card.itemCountText != null) card.itemCountText.text = countNow.ToString();
            card.gameObject.SetActive(countNow > 0);

            _runtimeObjectives.Add(new RuntimeObjective
            {
                icon = icon,
                card = card,
                lastCount = -1,
                supports = list,
                isTopItem = false,
                cardRect = card.GetComponent<RectTransform>(),
                pendingVisualRemovals = 0
            });
        }

        BuildObjectiveLookup();
        WarmupPickupPool();
        StartOrRestartLoop();
        RefreshBackground();
    }

    private IEnumerator UpdateLoop()
    {
        var wait = new WaitForSeconds(_updateInterval);
        while (true)
        {
            UpdateCounts();
            yield return wait;
        }
    }

    private void UpdateCounts()
    {
        bool changed = false;

        for (int i = 0; i < _runtimeObjectives.Count; i++)
        {
            var ro = _runtimeObjectives[i];

            int count = 0;
            if (ro.supports != null)
            {
                int c = 0;
                for (int j = 0; j < ro.supports.Count; j++)
                {
                    var s = ro.supports[j];
                    if (s != null && s.gameObject.activeInHierarchy && s.countInObjectives)
                        c += 1;
                }
                count = c;
            }

            int displayCount = Mathf.Max(0, count + ro.pendingVisualRemovals);

            if (displayCount != ro.lastCount)
            {
                ro.lastCount = displayCount;
                if (ro.card != null)
                {
                    if (ro.card.itemCountText != null)
                        ro.card.itemCountText.text = displayCount.ToString();

                    bool active = displayCount > 0;
                    if (ro.card.gameObject.activeSelf != active)
                    {
                        ro.card.gameObject.SetActive(active);
                        changed = true;
                    }
                }
            }
        }

        if (changed) RefreshBackground();
    }

    private void RefreshBackground()
    {
        bool anyVisible = false;

        for (int i = 0; i < itemObjectivePool.Length; i++)
        {
            if (itemObjectivePool[i] != null && itemObjectivePool[i].gameObject.activeSelf)
            {
                anyVisible = true;
                break;
            }
        }
        
        LayoutRebuilder.ForceRebuildLayoutImmediate(backgroundRect);
    }


    public void HandleSupportSwallowed(SupportActivator support, Vector3 holeWorldPos)
    {
        if (!enablePickupFlight)
            return;

        if (support == null || support.objectiveIcon == null)
            return;

        var runtime = FindRuntimeObjective(support.objectiveIcon, support.isTopItem);
        if (runtime == null || runtime.cardRect == null)
            return;

        var iconInstance = GetPickupIconInstance();
        if (iconInstance == null)
            return;

        if (!TryGetWorldToContainerPosition(holeWorldPos, out var startPos))
        {
            if (!TryGetCardPosition(runtime, out startPos))
            {
                ReleasePickupIcon(iconInstance);
                return;
            }
        }

        if (!TryGetCardPosition(runtime, out var targetPos))
        {
            ReleasePickupIcon(iconInstance);
            return;
        }

        runtime.pendingVisualRemovals++;
        UpdateCounts();

        Vector2 corner = new Vector2(targetPos.x, startPos.y);
        
        float directionX = Mathf.Sign(corner.x - startPos.x);
        if (Mathf.Approximately(directionX, 0f)) directionX = 1f;
        float directionY = Mathf.Sign(targetPos.y - corner.y);
        if (Mathf.Approximately(directionY, 0f)) directionY = 1f;

        Vector2 controlA = new Vector2(corner.x - directionX * 0, startPos.y);
        Vector2 controlB = new Vector2(corner.x, corner.y + directionY * 0);

        iconInstance.Play(
            support.objectiveIcon,
            startPos,
            controlA,
            controlB,
            targetPos,
            pickupFlightDuration,
            PickupIconStartScale,
            PickupIconEndScale,
            () =>
            {
                runtime.pendingVisualRemovals = Mathf.Max(0, runtime.pendingVisualRemovals - 1);
                TriggerCardBounce(runtime);
                ReleasePickupIcon(iconInstance);
                UpdateCounts();
            });
    }

    private void TriggerCardBounce(RuntimeObjective runtime)
    {
        if (runtime == null || runtime.cardRect == null)
            return;

        var rect = runtime.cardRect;
        if (_cardBounceRoutines.TryGetValue(rect, out var routine) && routine != null)
        {
            StopCoroutine(routine);
        }

        rect.localScale = Vector3.one;

        var newRoutine = StartCoroutine(BounceRoutine(rect));
        _cardBounceRoutines[rect] = newRoutine;
    }

    private IEnumerator BounceRoutine(RectTransform rect)
    {
        if (rect == null)
            yield break;

        Vector3 baseScale = Vector3.one;
        Vector3 targetScale = baseScale * Mathf.Max(1f, CardBounceScale);
        float halfDuration = Mathf.Max(0.01f, CardBounceDuration) * 0.5f;
        float elapsed = 0f;

        while (elapsed < halfDuration)
        {
            float t = elapsed / halfDuration;
            rect.localScale = Vector3.Lerp(baseScale, targetScale, t);
            elapsed += Time.deltaTime;
            yield return null;
        }

        rect.localScale = targetScale;
        elapsed = 0f;
        while (elapsed < halfDuration)
        {
            float t = elapsed / halfDuration;
            rect.localScale = Vector3.Lerp(targetScale, baseScale, t);
            elapsed += Time.deltaTime;
            yield return null;
        }

        rect.localScale = baseScale;
        _cardBounceRoutines[rect] = null;
    }

    private bool TryGetWorldToContainerPosition(Vector3 worldPos, out Vector2 localPoint)
    {
        localPoint = Vector2.zero;
        if (_pickupContainerRect == null)
            return false;

        if (_worldCamera == null)
            _worldCamera = worldCamera != null ? worldCamera : Camera.main;

        if (_worldCamera == null)
            return false;

        Vector3 screenPoint = _worldCamera.WorldToScreenPoint(worldPos);
        return RectTransformUtility.ScreenPointToLocalPointInRectangle(
            _pickupContainerRect,
            (Vector2)screenPoint,
            _uiCamera,
            out localPoint);
    }

    private bool TryGetCardPosition(RuntimeObjective runtime, out Vector2 localPoint)
    {
        localPoint = Vector2.zero;
        if (_pickupContainerRect == null || runtime == null || runtime.cardRect == null)
            return false;

        Vector3 centerWorld = runtime.cardRect.TransformPoint(runtime.cardRect.rect.center);
        Vector2 screenPoint = RectTransformUtility.WorldToScreenPoint(_uiCamera, centerWorld);
        return RectTransformUtility.ScreenPointToLocalPointInRectangle(
            _pickupContainerRect,
            screenPoint,
            _uiCamera,
            out localPoint);
    }

    private void WarmupPickupPool()
    {
        if (pickupIconPrefab == null || _pickupContainerRect == null)
            return;

        int targetCount = Mathf.Max(0, initialPickupIconPool);
        int total = _pickupPool.Count + _activePickupIcons.Count;
        for (int i = total; i < targetCount; i++)
        {
            var icon = Instantiate(pickupIconPrefab, _pickupContainerRect);
            icon.gameObject.SetActive(false);
            _pickupPool.Add(icon);
        }
    }

    private ObjectivePickupIcon GetPickupIconInstance()
    {
        if (pickupIconPrefab == null || _pickupContainerRect == null)
            return null;

        ObjectivePickupIcon instance;
        if (_pickupPool.Count > 0)
        {
            int last = _pickupPool.Count - 1;
            instance = _pickupPool[last];
            _pickupPool.RemoveAt(last);
        }
        else
        {
            instance = Instantiate(pickupIconPrefab, _pickupContainerRect);
        }

        if (instance == null)
            return null;

        _activePickupIcons.Add(instance);
        return instance;
    }

    private void ReleasePickupIcon(ObjectivePickupIcon icon)
    {
        if (icon == null)
            return;

        icon.StopAndHide();
        _activePickupIcons.Remove(icon);
        if (!_pickupPool.Contains(icon))
        {
            _pickupPool.Add(icon);
        }
    }

    private void ClearActivePickupIcons()
    {
        for (int i = 0; i < _activePickupIcons.Count; i++)
        {
            var icon = _activePickupIcons[i];
            if (icon == null) continue;
            icon.StopAndHide();
            if (!_pickupPool.Contains(icon))
            {
                _pickupPool.Add(icon);
            }
        }

        _activePickupIcons.Clear();

        if (_cardBounceRoutines.Count > 0)
        {
            foreach (var kvp in _cardBounceRoutines)
            {
                if (kvp.Value != null)
                {
                    StopCoroutine(kvp.Value);
                }
            }
            _cardBounceRoutines.Clear();
        }
    }

    private void BuildObjectiveLookup()
    {
        _objectiveLookup.Clear();
        for (int i = 0; i < _runtimeObjectives.Count; i++)
        {
            var runtime = _runtimeObjectives[i];
            if (runtime == null || runtime.icon == null)
                continue;

            var key = new ObjectiveKey { icon = runtime.icon, isTopItem = runtime.isTopItem };
            if (!_objectiveLookup.ContainsKey(key))
            {
                _objectiveLookup.Add(key, runtime);
            }
        }
    }

    private RuntimeObjective FindRuntimeObjective(Sprite icon, bool isTopItem)
    {
        if (icon == null)
            return null;

        var key = new ObjectiveKey { icon = icon, isTopItem = isTopItem };
        if (_objectiveLookup.TryGetValue(key, out var runtime))
        {
            return runtime;
        }

        return null;
    }

    private void StartOrRestartLoop()
    {
        if (_updateRoutine != null) StopCoroutine(_updateRoutine);
        _updateRoutine = StartCoroutine(UpdateLoop());
    }

    private struct ObjectiveKey
    {
        public Sprite icon;
        public bool isTopItem;

        public override int GetHashCode()
        {
            unchecked
            {
                return ((icon != null ? icon.GetHashCode() : 0) * 397) ^ isTopItem.GetHashCode();
            }
        }

        public override bool Equals(object obj)
        {
            if (!(obj is ObjectiveKey other)) return false;
            return icon == other.icon && isTopItem == other.isTopItem;
        }
    }
}
