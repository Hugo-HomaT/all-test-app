using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ObjectivesTuto : MonoBehaviour
{
    [Header("References")]
    public ObjectivesUISystem objectivesSystem;   // If null, will try UIManager.instance.myObjectivesUISystem
    public RectTransform mover;                   // The rect to move horizontally under the cards
    public Image glowImage;                       // Optional glow image to pulse alpha
    public CanvasGroup canvasGroup;               // Fade container (assigned in prefab)

    [Header("Motion Settings")]
    public float boundsPadding = 20f;             // Extra padding from first/last card edges (in local X units)
    public float legDuration = 1.0f;              // Seconds to travel from left to right (or right to left)
    public float endPause = 0.2f;                 // Pause at each end for a juicier feel
    public AnimationCurve motionCurve = AnimationCurve.EaseInOut(0, 0, 1, 1); // Non-linear easing along the path

    [Header("Bob & Scale (optional)")]
    public float bobAmplitude = 6f;               // Vertical bob in anchored Y (units). 0 disables
    public float bobFrequency = 1.2f;             // Bob cycles per second
    public float scalePulse = 0.05f;              // Local scale +/- amount. 0 disables
    public float scaleFrequency = 2.0f;           // Scale pulse cycles per second

    [Header("Glow Settings")]
    public AnimationCurve glowCurve = AnimationCurve.EaseInOut(0, 0.2f, 1, 1f);
    public float glowPeriod = 1.2f;               // Seconds for one glow cycle
    public float glowBaseAlpha = 0.2f;            // Minimum alpha
    public float glowMaxAlpha = 1.0f;             // Maximum alpha

    [Header("Fade Settings")]
    public float fadeOutDuration = 0.35f;         // Fade time on first touch

    private float _minX;
    private float _maxX;
    private bool _hasBounds;
    private float _lastBoundsUpdate;
    private const float BoundsRefreshInterval = 0.5f; // Re-scan active cards twice a second
    private float _cycleStartTime;
    private Vector2 _moverBaseAnchoredPos;
    private Vector3 _moverBaseScale = Vector3.one;

    // Fade state
    private bool _hasFaded = false;
    private bool _fading = false;
    private float _fadeStartTime = 0f;

    private void Awake()
    {
        if (objectivesSystem == null && UIManager.instance != null)
        {
            objectivesSystem = UIManager.instance.myObjectivesUISystem;
        }

        // Apply settings from PlayableSettings (may be null this early)
        if (PlayableSettings.instance != null)
        {
            ApplySettingsFromPlayable();
        }
    }

    private void Start()
    {
        // Ensure settings are applied even if PlayableSettings initialized after our Awake
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
        if (canvasGroup != null) canvasGroup.alpha = 1f;
        RefreshBounds();
    }

    private void Update()
    {
        // Hard guard every frame in case settings flipped at runtime
        var ps = PlayableSettings.instance;
        if (ps != null && (!ps.enableObjectivesUI || !ps.enableObjectivesTuto))
        {
            if (gameObject.activeSelf)
                gameObject.SetActive(false);
            return;
        }

        // Handle fade on first valid player touch (only if not blocked by intro/controls)
        if (!_hasFaded && !_fading && ShouldStartFadeOnTouch())
        {
            _fading = true;
            _fadeStartTime = Time.time;
        }
        if (_fading)
        {
            float t = fadeOutDuration <= 0.001f ? 1f : Mathf.Clamp01((Time.time - _fadeStartTime) / fadeOutDuration);
            if (canvasGroup != null)
            {
                canvasGroup.alpha = 1f - t;
            }
            if (t >= 1f)
            {
                _fading = false;
                _hasFaded = true;
                if (gameObject.activeSelf)
                    gameObject.SetActive(false);
                return;
            }
        }

        if (mover == null)
            return;

        // Periodically refresh bounds since cards can appear/disappear
        if (Time.time - _lastBoundsUpdate > BoundsRefreshInterval)
        {
            RefreshBounds();
        }

        if (_hasBounds)
        {
            float pathStart = _minX;
            float pathEnd = _maxX;

            // Total cycle: forward leg + pause + backward leg + pause
            float leg = Mathf.Max(0.05f, legDuration);
            float pause = Mathf.Max(0f, endPause);
            float cycle = (leg + pause) * 2f;
            float tt = Mathf.Repeat(Time.time - _cycleStartTime, cycle);

            // Map t to a normalized position u in [0,1] with end pauses
            float u;
            if (tt < leg) // forward travel
            {
                u = tt / leg;
            }
            else if (tt < leg + pause) // pause at end (right)
            {
                u = 1f;
            }
            else if (tt < leg + pause + leg) // backward travel
            {
                float tb = (tt - leg - pause) / leg;
                u = 1f - tb;
            }
            else // pause at start (left)
            {
                u = 0f;
            }

            // Apply easing
            float eased = motionCurve != null ? motionCurve.Evaluate(u) : u;
            float x = Mathf.Lerp(pathStart, pathEnd, eased);

            // Base pos
            Vector2 pos = _moverBaseAnchoredPos;
            pos.x = x;

            // Bob on Y (optional)
            // if (bobAmplitude > 0f && bobFrequency > 0f)
            // {
            //     pos.y = _moverBaseAnchoredPos.y + bobAmplitude * Mathf.Sin(Time.time * Mathf.PI * 2f * bobFrequency);
            // }

            mover.anchoredPosition = pos;

            // Scale pulse (optional)
            // if (scalePulse > 0f && scaleFrequency > 0f)
            // {
            //     float s = 1f + scalePulse * Mathf.Sin(Time.time * Mathf.PI * 2f * scaleFrequency);
            //     mover.localScale = _moverBaseScale * s;
            // }

            // Glow alpha pulse
            if (glowImage != null)
            {
                float phase = (glowPeriod <= 0.01f) ? 0f : Mathf.Repeat(Time.time / glowPeriod, 1f);
                float k = glowCurve != null ? glowCurve.Evaluate(phase) : phase;
                float a = Mathf.Lerp(glowBaseAlpha, glowMaxAlpha, k);
                var c = glowImage.color;
                c.a = a;
                glowImage.color = c;
            }

            if (!mover.gameObject.activeSelf)
                mover.gameObject.SetActive(true);
        }
        else
        {
            if (mover.gameObject.activeSelf)
                mover.gameObject.SetActive(false);
        }
    }

    private bool ShouldStartFadeOnTouch()
    {
        // Respect input blocking (same as joystick tuto)
        if (UIManager.instance != null && UIManager.instance.holeController != null && !UIManager.instance.holeController.IsInputEnabled)
        {
            return false;
        }
        // Mouse or first touch began
        if (Input.GetMouseButtonDown(0)) return true;
        if (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began) return true;
        return false;
    }

    private void ApplySettingsFromPlayable()
    {
        bool enabledFlag = PlayableSettings.instance.enableObjectivesTuto && PlayableSettings.instance.enableObjectivesUI;
        gameObject.SetActive(enabledFlag);

        float speed = Mathf.Max(0f, PlayableSettings.instance.objectivesTutoGlowSpeed);
        glowPeriod = speed > 0.01f ? (1f / speed) : 0f;

        legDuration = Mathf.Max(0.05f, PlayableSettings.instance.objectivesTutoTravelTime);
        endPause = Mathf.Max(0f, PlayableSettings.instance.objectivesTutoEndPause);
    }

    private void RefreshBounds()
    {
        _lastBoundsUpdate = Time.time;
        _hasBounds = false;

        if (objectivesSystem == null || objectivesSystem.itemObjectivePool == null || objectivesSystem.itemObjectivePool.Length == 0)
            return;

        float minX = float.PositiveInfinity;
        float maxX = float.NegativeInfinity;
        int activeCount = 0;

        // We assume tuto and cards share the same canvas space/parent so anchoredPosition.x is comparable
        for (int i = 0; i < objectivesSystem.itemObjectivePool.Length; i++)
        {
            var card = objectivesSystem.itemObjectivePool[i];
            if (card == null || !card.gameObject.activeInHierarchy) continue;
            var rt = card.transform as RectTransform;
            if (rt == null) continue;
            float x = rt.anchoredPosition.x;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            activeCount++;
        }

        if (activeCount >= 1 && minX <= maxX && float.IsFinite(minX) && float.IsFinite(maxX))
        {
            // Add padding so the mover travels a bit beyond first/last card
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
