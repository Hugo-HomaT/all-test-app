using System.Collections;
using UnityEngine;

public class IntroHoleAnimation : MonoBehaviour
{
    [Header("Holder Animation")]
    public Transform holderTransform;
    public AnimationCurve holderScaleCurve = AnimationCurve.EaseInOut(0f, 1f, 1f, 1f);
    public float animationSpeed = 1f;
    
    [Header("Glow Animation")]
    public AnimationCurve glowAlphaCurve = AnimationCurve.EaseInOut(0f, 1f, 1f, 1f);
    public AnimationCurve glowScaleCurve = AnimationCurve.EaseInOut(0f, 1f, 1f, 1f);
    
    
    private HoleController _holeController;
    private Vector3 _originalHolderScale;
    private HoleSkin _activeHoleSkin;
    private Color _originalGlowColor;
    private Vector3 _originalGlowScale;
    private float _originalGlowAlpha;
    
    private Coroutine _animationCoroutine;
    private bool _isAnimating = false;
    
    private void Start()
    {
        _holeController = GetComponent<HoleController>();
        
        if (holderTransform == null)
        {
            Debug.LogWarning("IntroHoleAnimation: Holder Transform not assigned!");
            return;
        }
        
        // We consider 1,1,1 the canonical reset scale
        _originalHolderScale = Vector3.one;
        
        // Don't auto-start here; HoleController will call Begin() after skins are initialized
    }

    public void Begin()
    {
        // Called by HoleController once skins have been initialized
        FindActiveHoleSkin();
        
        // Disable glow by default and cache values
        if (_activeHoleSkin != null && _activeHoleSkin.glowSprite != null)
        {
            _originalGlowColor = _activeHoleSkin.glowSprite.color;
            _originalGlowAlpha = _originalGlowColor.a;
            var c = _originalGlowColor;
            c.a = 0f;
            _activeHoleSkin.glowSprite.color = c;
            _activeHoleSkin.glowSprite.enabled = false;
        }
        if (_activeHoleSkin != null && _activeHoleSkin.glowTransform != null)
        {
            _originalGlowScale = _activeHoleSkin.glowTransform.localScale;
        }
        
        StartIdleAnimation();
    }
    
    private void FindActiveHoleSkin()
    {
        if (_holeController == null || _holeController.skinsParent == null)
            return;
        
        // Find which child is active (the active skin)
        Transform skinsParent = _holeController.skinsParent;
        for (int i = 0; i < skinsParent.childCount; i++)
        {
            Transform skinChild = skinsParent.GetChild(i);
            if (skinChild.gameObject.activeSelf)
            {
                _activeHoleSkin = skinChild.GetComponent<HoleSkin>();
                
                if (_activeHoleSkin != null)
                {
                    // Store original glow values
                    if (_activeHoleSkin.glowSprite != null)
                    {
                        _originalGlowColor = _activeHoleSkin.glowSprite.color;
                        _originalGlowAlpha = _originalGlowColor.a;
                    }
                    
                    if (_activeHoleSkin.glowTransform != null)
                    {
                        _originalGlowScale = _activeHoleSkin.glowTransform.localScale;
                    }
                }
                break;
            }
        }
    }
    
    public void StartIdleAnimation()
    {
        if (_isAnimating || holderTransform == null)
            return;
        
        _isAnimating = true;
        
        // Stop any existing animation
        if (_animationCoroutine != null)
            StopCoroutine(_animationCoroutine);
        
        _animationCoroutine = StartCoroutine(AnimateCoroutine());
    }
    
    public void StopIdleAnimation()
    {
        if (!_isAnimating)
            return;
        
        // Stop animation coroutine
        if (_animationCoroutine != null)
        {
            StopCoroutine(_animationCoroutine);
            _animationCoroutine = null;
        }
        
        // Reset values directly
        ResetValues();
    }
    
    private IEnumerator AnimateCoroutine()
    {
        float time = 0f;
        
        // Get curve duration (max time key)
        float curveDuration = GetCurveDuration();
        
        while (true)
        {
            // Check for player touch - only stop if input is enabled
            if (_holeController != null && _holeController.IsInputEnabled && 
                (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)))
            {
                // Stop and reset instantly on touch
                if (_animationCoroutine != null)
                {
                    StopCoroutine(_animationCoroutine);
                    _animationCoroutine = null;
                }
                ResetValues();
                yield break;
            }
            
            // Normalize time to 0-1 based on curve duration
            float normalizedTime = (time % curveDuration) / curveDuration;
            
            // Animate holder scale (base is exactly 1,1,1)
            float holderScaleValue = holderScaleCurve.Evaluate(normalizedTime);
            holderTransform.localScale = Vector3.one * holderScaleValue;
            
            // Animate glow if HoleSkin exists
            if (_activeHoleSkin != null)
            {
                // Glow alpha
                if (_activeHoleSkin.glowSprite != null)
                {
                    if (!_activeHoleSkin.glowSprite.enabled) _activeHoleSkin.glowSprite.enabled = true;
                    float alphaValue = glowAlphaCurve.Evaluate(normalizedTime);
                    Color currentColor = _originalGlowColor;
                    currentColor.a = _originalGlowAlpha * alphaValue;
                    _activeHoleSkin.glowSprite.color = currentColor;
                }
                
                // Glow scale
                if (_activeHoleSkin.glowTransform != null)
                {
                    float glowScaleValue = glowScaleCurve.Evaluate(normalizedTime);
                    _activeHoleSkin.glowTransform.localScale = _originalGlowScale * glowScaleValue;
                }
            }
            
            time += Time.deltaTime * animationSpeed;
            yield return null;
        }
        
        // Should never reach here; coroutine is stopped externally or by touch
    }
    
    private void ResetValues()
    {
        // Reset holder scale to exactly 1,1,1
        holderTransform.localScale = Vector3.one;
        
        // Reset glow if HoleSkin exists
        if (_activeHoleSkin != null)
        {
            if (_activeHoleSkin.glowSprite != null)
            {
                _activeHoleSkin.glowSprite.color = _originalGlowColor;
                _activeHoleSkin.glowSprite.enabled = false; // keep glow disabled after reset
            }
            if (_activeHoleSkin.glowTransform != null)
                _activeHoleSkin.glowTransform.localScale = _originalGlowScale;
        }
        
        _isAnimating = false;
    }
    
    private float GetCurveDuration()
    {
        float maxDuration = 0f;
        
        if (holderScaleCurve != null && holderScaleCurve.length > 0)
            maxDuration = Mathf.Max(maxDuration, holderScaleCurve.keys[holderScaleCurve.length - 1].time);
        
        if (glowAlphaCurve != null && glowAlphaCurve.length > 0)
            maxDuration = Mathf.Max(maxDuration, glowAlphaCurve.keys[glowAlphaCurve.length - 1].time);
        
        if (glowScaleCurve != null && glowScaleCurve.length > 0)
            maxDuration = Mathf.Max(maxDuration, glowScaleCurve.keys[glowScaleCurve.length - 1].time);
        
        return maxDuration > 0f ? maxDuration : 1f; // Default to 1 second if no curves
    }
    
    private void OnDestroy()
    {
        if (_animationCoroutine != null)
            StopCoroutine(_animationCoroutine);
    }
}

