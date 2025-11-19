using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

public class ObjectivesUISystem : MonoBehaviour
{
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

	private struct ObjectiveKey
	{
		public Sprite icon;

		public bool isTopItem;

		public override int GetHashCode()
		{
			return (((icon != null) ? icon.GetHashCode() : 0) * 397) ^ isTopItem.GetHashCode();
		}

		public override bool Equals(object obj)
		{
			if (!(obj is ObjectiveKey other) || 1 == 0)
			{
				return false;
			}
			return icon == other.icon && isTopItem == other.isTopItem;
		}
	}

	public ItemObjective[] itemObjectivePool;

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
		{
			_pickupContainerRect = pickupIconContainer;
		}
		else
		{
			_pickupContainerRect = GetComponent<RectTransform>();
		}
		_canvas = GetComponentInParent<Canvas>();
		if (_canvas != null)
		{
			_uiCamera = ((_canvas.renderMode == RenderMode.ScreenSpaceOverlay) ? null : _canvas.worldCamera);
		}
		_worldCamera = ((worldCamera != null) ? worldCamera : Camera.main);
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
			{
				if (itemObjectivePool[i] != null && itemObjectivePool[i].gameObject.activeSelf)
				{
					itemObjectivePool[i].gameObject.SetActive(false);
				}
			}
		}
		if (PlayableSettings.instance != null && !PlayableSettings.instance.enableObjectivesUI)
		{
			if (_updateRoutine != null)
			{
				StopCoroutine(_updateRoutine);
			}
			_updateRoutine = null;
			return;
		}
		int poolIndex = 0;
		List<SupportActivator> allSupports;
		if (woodTowers != null && woodTowers.Count > 0)
		{
			allSupports = new List<SupportActivator>();
			foreach (WoodTower tower in woodTowers)
			{
				if (tower != null)
				{
					SupportActivator topItemActivator = tower.GetActiveTopItemSupportActivator();
					if (topItemActivator != null)
					{
						allSupports.Add(topItemActivator);
					}
				}
			}
			SupportActivator[] otherSupports = Object.FindObjectsOfType<SupportActivator>();
			SupportActivator[] array = otherSupports;
			foreach (SupportActivator support in array)
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
			if (_updateRoutine != null)
			{
				StopCoroutine(_updateRoutine);
			}
			_updateRoutine = null;
			return;
		}
		List<SupportActivator> topItems = allSupports.Where((SupportActivator s) => s != null && s.isTopItem && s.objectiveIcon != null).ToList();
		if (topItems.Count > 0 && poolIndex < itemObjectivePool.Length)
		{
			SupportActivator firstTopItem = topItems[0];
			ItemObjective card2 = itemObjectivePool[poolIndex++];
			if (card2 != null)
			{
				if (card2.itemImage != null)
				{
					card2.itemImage.sprite = firstTopItem.objectiveIcon;
				}
				int current = topItems.Count((SupportActivator s) => s != null && s.gameObject.activeInHierarchy && s.countInObjectives);
				if (card2.itemCountText != null)
				{
					card2.itemCountText.text = current.ToString();
				}
				card2.gameObject.SetActive(current > 0);
				_runtimeObjectives.Add(new RuntimeObjective
				{
					icon = firstTopItem.objectiveIcon,
					card = card2,
					lastCount = -1,
					supports = topItems,
					isTopItem = true,
					cardRect = card2.GetComponent<RectTransform>(),
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
		List<SupportActivator> counted = allSupports.Where((SupportActivator s) => s != null && s.countInObjectives && !s.isTopItem).ToList();
		IEnumerable<IGrouping<Sprite, SupportActivator>> groups = from s in counted
			group s by s.objectiveIcon;
		foreach (IGrouping<Sprite, SupportActivator> g in groups)
		{
			if (poolIndex >= itemObjectivePool.Length)
			{
				break;
			}
			ItemObjective card = itemObjectivePool[poolIndex++];
			if (card == null)
			{
				continue;
			}
			Sprite icon = g.Key;
			if (card.itemImage != null)
			{
				card.itemImage.sprite = icon;
			}
			List<SupportActivator> list = g.ToList();
			int countNow = 0;
			for (int j = 0; j < list.Count; j++)
			{
				SupportActivator s2 = list[j];
				if (s2 != null && s2.countInObjectives && s2.gameObject.activeInHierarchy)
				{
					countNow++;
				}
			}
			if (card.itemCountText != null)
			{
				card.itemCountText.text = countNow.ToString();
			}
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
		WaitForSeconds wait = new WaitForSeconds(_updateInterval);
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
			RuntimeObjective ro = _runtimeObjectives[i];
			int count = 0;
			if (ro.supports != null)
			{
				int c = 0;
				for (int j = 0; j < ro.supports.Count; j++)
				{
					SupportActivator s = ro.supports[j];
					if (s != null && s.gameObject.activeInHierarchy && s.countInObjectives)
					{
						c++;
					}
				}
				count = c;
			}
			int displayCount = Mathf.Max(0, count + ro.pendingVisualRemovals);
			if (displayCount == ro.lastCount)
			{
				continue;
			}
			ro.lastCount = displayCount;
			if (ro.card != null)
			{
				if (ro.card.itemCountText != null)
				{
					ro.card.itemCountText.text = displayCount.ToString();
				}
				bool active = displayCount > 0;
				if (ro.card.gameObject.activeSelf != active)
				{
					ro.card.gameObject.SetActive(active);
					changed = true;
				}
			}
		}
		if (changed)
		{
			RefreshBackground();
		}
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
		if (!enablePickupFlight || support == null || support.objectiveIcon == null)
		{
			return;
		}
		RuntimeObjective runtime = FindRuntimeObjective(support.objectiveIcon, support.isTopItem);
		if (runtime == null || runtime.cardRect == null)
		{
			return;
		}
		ObjectivePickupIcon iconInstance = GetPickupIconInstance();
		if (iconInstance == null)
		{
			return;
		}
		if (!TryGetWorldToContainerPosition(holeWorldPos, out var startPos) && !TryGetCardPosition(runtime, out startPos))
		{
			ReleasePickupIcon(iconInstance);
			return;
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
		if (Mathf.Approximately(directionX, 0f))
		{
			directionX = 1f;
		}
		float directionY = Mathf.Sign(targetPos.y - corner.y);
		if (Mathf.Approximately(directionY, 0f))
		{
			directionY = 1f;
		}
		Vector2 controlA = new Vector2(corner.x - directionX * 0f, startPos.y);
		Vector2 controlB = new Vector2(corner.x, corner.y + directionY * 0f);
		iconInstance.Play(support.objectiveIcon, startPos, controlA, controlB, targetPos, pickupFlightDuration, 0.6f, 1f, delegate
		{
			runtime.pendingVisualRemovals = Mathf.Max(0, runtime.pendingVisualRemovals - 1);
			TriggerCardBounce(runtime);
			ReleasePickupIcon(iconInstance);
			UpdateCounts();
		});
	}

	private void TriggerCardBounce(RuntimeObjective runtime)
	{
		if (runtime != null && !(runtime.cardRect == null))
		{
			RectTransform rect = runtime.cardRect;
			if (_cardBounceRoutines.TryGetValue(rect, out var routine) && routine != null)
			{
				StopCoroutine(routine);
			}
			rect.localScale = Vector3.one;
			Coroutine newRoutine = StartCoroutine(BounceRoutine(rect));
			_cardBounceRoutines[rect] = newRoutine;
		}
	}

	private IEnumerator BounceRoutine(RectTransform rect)
	{
		if (!(rect == null))
		{
			Vector3 baseScale = Vector3.one;
			Vector3 targetScale = baseScale * Mathf.Max(1f, 1.1f);
			float halfDuration = Mathf.Max(0.01f, 0.18f) * 0.5f;
			float elapsed2 = 0f;
			while (elapsed2 < halfDuration)
			{
				float t = elapsed2 / halfDuration;
				rect.localScale = Vector3.Lerp(baseScale, targetScale, t);
				elapsed2 += Time.deltaTime;
				yield return null;
			}
			rect.localScale = targetScale;
			elapsed2 = 0f;
			while (elapsed2 < halfDuration)
			{
				float t2 = elapsed2 / halfDuration;
				rect.localScale = Vector3.Lerp(targetScale, baseScale, t2);
				elapsed2 += Time.deltaTime;
				yield return null;
			}
			rect.localScale = baseScale;
			_cardBounceRoutines[rect] = null;
		}
	}

	private bool TryGetWorldToContainerPosition(Vector3 worldPos, out Vector2 localPoint)
	{
		localPoint = Vector2.zero;
		if (_pickupContainerRect == null)
		{
			return false;
		}
		if (_worldCamera == null)
		{
			_worldCamera = ((worldCamera != null) ? worldCamera : Camera.main);
		}
		if (_worldCamera == null)
		{
			return false;
		}
		Vector3 screenPoint = _worldCamera.WorldToScreenPoint(worldPos);
		return RectTransformUtility.ScreenPointToLocalPointInRectangle(_pickupContainerRect, screenPoint, _uiCamera, out localPoint);
	}

	private bool TryGetCardPosition(RuntimeObjective runtime, out Vector2 localPoint)
	{
		localPoint = Vector2.zero;
		if (_pickupContainerRect == null || runtime == null || runtime.cardRect == null)
		{
			return false;
		}
		Vector3 centerWorld = runtime.cardRect.TransformPoint(runtime.cardRect.rect.center);
		Vector2 screenPoint = RectTransformUtility.WorldToScreenPoint(_uiCamera, centerWorld);
		return RectTransformUtility.ScreenPointToLocalPointInRectangle(_pickupContainerRect, screenPoint, _uiCamera, out localPoint);
	}

	private void WarmupPickupPool()
	{
		if (!(pickupIconPrefab == null) && !(_pickupContainerRect == null))
		{
			int targetCount = Mathf.Max(0, initialPickupIconPool);
			int total = _pickupPool.Count + _activePickupIcons.Count;
			for (int i = total; i < targetCount; i++)
			{
				ObjectivePickupIcon icon = Object.Instantiate(pickupIconPrefab, _pickupContainerRect);
				icon.gameObject.SetActive(false);
				_pickupPool.Add(icon);
			}
		}
	}

	private ObjectivePickupIcon GetPickupIconInstance()
	{
		if (pickupIconPrefab == null || _pickupContainerRect == null)
		{
			return null;
		}
		ObjectivePickupIcon instance;
		if (_pickupPool.Count > 0)
		{
			int last = _pickupPool.Count - 1;
			instance = _pickupPool[last];
			_pickupPool.RemoveAt(last);
		}
		else
		{
			instance = Object.Instantiate(pickupIconPrefab, _pickupContainerRect);
		}
		if (instance == null)
		{
			return null;
		}
		_activePickupIcons.Add(instance);
		return instance;
	}

	private void ReleasePickupIcon(ObjectivePickupIcon icon)
	{
		if (!(icon == null))
		{
			icon.StopAndHide();
			_activePickupIcons.Remove(icon);
			if (!_pickupPool.Contains(icon))
			{
				_pickupPool.Add(icon);
			}
		}
	}

	private void ClearActivePickupIcons()
	{
		for (int i = 0; i < _activePickupIcons.Count; i++)
		{
			ObjectivePickupIcon icon = _activePickupIcons[i];
			if (!(icon == null))
			{
				icon.StopAndHide();
				if (!_pickupPool.Contains(icon))
				{
					_pickupPool.Add(icon);
				}
			}
		}
		_activePickupIcons.Clear();
		if (_cardBounceRoutines.Count <= 0)
		{
			return;
		}
		foreach (KeyValuePair<RectTransform, Coroutine> kvp in _cardBounceRoutines)
		{
			if (kvp.Value != null)
			{
				StopCoroutine(kvp.Value);
			}
		}
		_cardBounceRoutines.Clear();
	}

	private void BuildObjectiveLookup()
	{
		_objectiveLookup.Clear();
		for (int i = 0; i < _runtimeObjectives.Count; i++)
		{
			RuntimeObjective runtime = _runtimeObjectives[i];
			if (runtime != null && !(runtime.icon == null))
			{
				ObjectiveKey objectiveKey = default(ObjectiveKey);
				objectiveKey.icon = runtime.icon;
				objectiveKey.isTopItem = runtime.isTopItem;
				ObjectiveKey key = objectiveKey;
				if (!_objectiveLookup.ContainsKey(key))
				{
					_objectiveLookup.Add(key, runtime);
				}
			}
		}
	}

	private RuntimeObjective FindRuntimeObjective(Sprite icon, bool isTopItem)
	{
		if (icon == null)
		{
			return null;
		}
		ObjectiveKey objectiveKey = default(ObjectiveKey);
		objectiveKey.icon = icon;
		objectiveKey.isTopItem = isTopItem;
		ObjectiveKey key = objectiveKey;
		if (_objectiveLookup.TryGetValue(key, out var runtime))
		{
			return runtime;
		}
		return null;
	}

	private void StartOrRestartLoop()
	{
		if (_updateRoutine != null)
		{
			StopCoroutine(_updateRoutine);
		}
		_updateRoutine = StartCoroutine(UpdateLoop());
	}
}
