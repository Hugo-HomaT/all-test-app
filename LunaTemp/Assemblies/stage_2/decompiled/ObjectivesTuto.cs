using UnityEngine;
using UnityEngine.UI;

public class ObjectivesTuto : MonoBehaviour
{
	[Header("References")]
	public ObjectivesUISystem objectivesSystem;

	public RectTransform mover;

	public Image glowImage;

	public CanvasGroup canvasGroup;

	[Header("Motion Settings")]
	public float boundsPadding = 20f;

	public float legDuration = 1f;

	public float endPause = 0.2f;

	public AnimationCurve motionCurve = AnimationCurve.EaseInOut(0f, 0f, 1f, 1f);

	[Header("Bob & Scale (optional)")]
	public float bobAmplitude = 6f;

	public float bobFrequency = 1.2f;

	public float scalePulse = 0.05f;

	public float scaleFrequency = 2f;

	[Header("Glow Settings")]
	public AnimationCurve glowCurve = AnimationCurve.EaseInOut(0f, 0.2f, 1f, 1f);

	public float glowPeriod = 1.2f;

	public float glowBaseAlpha = 0.2f;

	public float glowMaxAlpha = 1f;

	[Header("Fade Settings")]
	public float fadeOutDuration = 0.35f;

	private float _minX;

	private float _maxX;

	private bool _hasBounds;

	private float _lastBoundsUpdate;

	private const float BoundsRefreshInterval = 0.5f;

	private float _cycleStartTime;

	private Vector2 _moverBaseAnchoredPos;

	private Vector3 _moverBaseScale = Vector3.one;

	private bool _hasFaded = false;

	private bool _fading = false;

	private float _fadeStartTime = 0f;

	private void Awake()
	{
		if (objectivesSystem == null && UIManager.instance != null)
		{
			objectivesSystem = UIManager.instance.myObjectivesUISystem;
		}
		if (PlayableSettings.instance != null)
		{
			ApplySettingsFromPlayable();
		}
	}

	private void Start()
	{
		if (PlayableSettings.instance != null)
		{
			ApplySettingsFromPlayable();
		}
	}

	private void OnEnable()
	{
		if (mover != null)
		{
			_moverBaseAnchoredPos = mover.anchoredPosition;
			_moverBaseScale = mover.localScale;
		}
		_cycleStartTime = Time.time;
		_hasFaded = false;
		_fading = false;
		_fadeStartTime = 0f;
		if (canvasGroup != null)
		{
			canvasGroup.alpha = 1f;
		}
		RefreshBounds();
	}

	private void Update()
	{
		PlayableSettings ps = PlayableSettings.instance;
		if (ps != null && (!ps.enableObjectivesUI || !ps.enableObjectivesTuto))
		{
			if (base.gameObject.activeSelf)
			{
				base.gameObject.SetActive(false);
			}
			return;
		}
		if (!_hasFaded && !_fading && ShouldStartFadeOnTouch())
		{
			_fading = true;
			_fadeStartTime = Time.time;
		}
		if (_fading)
		{
			float t = ((fadeOutDuration <= 0.001f) ? 1f : Mathf.Clamp01((Time.time - _fadeStartTime) / fadeOutDuration));
			if (canvasGroup != null)
			{
				canvasGroup.alpha = 1f - t;
			}
			if (t >= 1f)
			{
				_fading = false;
				_hasFaded = true;
				if (base.gameObject.activeSelf)
				{
					base.gameObject.SetActive(false);
				}
				return;
			}
		}
		if (mover == null)
		{
			return;
		}
		if (Time.time - _lastBoundsUpdate > 0.5f)
		{
			RefreshBounds();
		}
		if (_hasBounds)
		{
			float pathStart = _minX;
			float pathEnd = _maxX;
			float leg = Mathf.Max(0.05f, legDuration);
			float pause = Mathf.Max(0f, endPause);
			float cycle = (leg + pause) * 2f;
			float tt = Mathf.Repeat(Time.time - _cycleStartTime, cycle);
			float u;
			if (tt < leg)
			{
				u = tt / leg;
			}
			else if (tt < leg + pause)
			{
				u = 1f;
			}
			else if (tt < leg + pause + leg)
			{
				float tb = (tt - leg - pause) / leg;
				u = 1f - tb;
			}
			else
			{
				u = 0f;
			}
			float eased = ((motionCurve != null) ? motionCurve.Evaluate(u) : u);
			float x = Mathf.Lerp(pathStart, pathEnd, eased);
			Vector2 pos = _moverBaseAnchoredPos;
			pos.x = x;
			mover.anchoredPosition = pos;
			if (glowImage != null)
			{
				float phase = ((glowPeriod <= 0.01f) ? 0f : Mathf.Repeat(Time.time / glowPeriod, 1f));
				float i = ((glowCurve != null) ? glowCurve.Evaluate(phase) : phase);
				float a = Mathf.Lerp(glowBaseAlpha, glowMaxAlpha, i);
				Color c = glowImage.color;
				c.a = a;
				glowImage.color = c;
			}
			if (!mover.gameObject.activeSelf)
			{
				mover.gameObject.SetActive(true);
			}
		}
		else if (mover.gameObject.activeSelf)
		{
			mover.gameObject.SetActive(false);
		}
	}

	private bool ShouldStartFadeOnTouch()
	{
		if (UIManager.instance != null && UIManager.instance.holeController != null && !UIManager.instance.holeController.IsInputEnabled)
		{
			return false;
		}
		if (Input.GetMouseButtonDown(0))
		{
			return true;
		}
		if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)
		{
			return true;
		}
		return false;
	}

	private void ApplySettingsFromPlayable()
	{
		bool enabledFlag = PlayableSettings.instance.enableObjectivesTuto && PlayableSettings.instance.enableObjectivesUI;
		base.gameObject.SetActive(enabledFlag);
		float speed = Mathf.Max(0f, PlayableSettings.instance.objectivesTutoGlowSpeed);
		glowPeriod = ((speed > 0.01f) ? (1f / speed) : 0f);
		legDuration = Mathf.Max(0.05f, PlayableSettings.instance.objectivesTutoTravelTime);
		endPause = Mathf.Max(0f, PlayableSettings.instance.objectivesTutoEndPause);
	}

	private void RefreshBounds()
	{
		_lastBoundsUpdate = Time.time;
		_hasBounds = false;
		if (objectivesSystem == null || objectivesSystem.itemObjectivePool == null || objectivesSystem.itemObjectivePool.Length == 0)
		{
			return;
		}
		float minX = float.PositiveInfinity;
		float maxX = float.NegativeInfinity;
		int activeCount = 0;
		for (int i = 0; i < objectivesSystem.itemObjectivePool.Length; i++)
		{
			ItemObjective card = objectivesSystem.itemObjectivePool[i];
			if (card == null || !card.gameObject.activeInHierarchy)
			{
				continue;
			}
			RectTransform rt = card.transform as RectTransform;
			if (!(rt == null))
			{
				float x = rt.anchoredPosition.x;
				if (x < minX)
				{
					minX = x;
				}
				if (x > maxX)
				{
					maxX = x;
				}
				activeCount++;
			}
		}
		if (activeCount >= 1 && minX <= maxX && float.IsFinite(minX) && float.IsFinite(maxX))
		{
			_minX = minX - Mathf.Abs(boundsPadding);
			_maxX = maxX + Mathf.Abs(boundsPadding);
			_hasBounds = true;
		}
		else
		{
			_hasBounds = false;
		}
	}
}
