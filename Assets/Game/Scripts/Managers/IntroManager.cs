using System.Collections;
using UnityEngine;
using Cinemachine;

public class IntroManager : MonoBehaviour
{
    public static IntroManager instance;
    
    [Header("Intro Settings")]
    [SerializeField] private AnimationCurve cameraTransitionCurve = AnimationCurve.EaseInOut(0f, 0f, 1f, 1f);
    
    [Header("Camera References")]
    [SerializeField] private Transform playerCameraRef;
    [SerializeField] private CinemachineVirtualCamera virtualCameraRef;
    [SerializeField] private CinemachineCameraOffset cameraOffsetRef;
    [Header("References")]
    [SerializeField] private HoleController holeController;
    [SerializeField] private HandCursor handCursorRef;
    
    private PlayableSettings PlayableSettings => PlayableSettings.instance;
    
    private Transform playerCamera;
    private CinemachineVirtualCamera virtualCamera;
    private CinemachineCameraOffset cameraOffset;
    private bool isIntroActive = false;
    private bool introCompleted = false;
    
    // Independent intro text system
    private bool isIntroTextVisible = false;
    private bool isIntroTextHidden = false;
    
    // Events
    public System.Action OnIntroStarted;
    public System.Action OnIntroCompleted;
    
    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    private void Start()
    {
        // Get camera references - use manual references first, fallback to auto-find
        playerCamera = playerCameraRef != null ? playerCameraRef : (PlayableSettings.instance?.playerCamera);
        virtualCamera = virtualCameraRef != null ? virtualCameraRef : (playerCamera?.GetComponent<CinemachineVirtualCamera>());
        cameraOffset = cameraOffsetRef != null ? cameraOffsetRef : (playerCamera?.GetComponent<CinemachineCameraOffset>());
        
        // Start intro if enabled
        if (PlayableSettings != null && PlayableSettings.enableIntro && !introCompleted)
        {
            StartIntro();
        }
    }
    
    public void StartIntro()
    {
        if (isIntroActive || introCompleted) return;
        
        isIntroActive = true;
        OnIntroStarted?.Invoke();
        
        // Start independent intro text system
        StartIntroText();
        
        // Start camera transition
        StartCoroutine(IntroSequence());
        
        // Start independent input blocking with custom duration
        if (PlayableSettings != null && PlayableSettings.blockPlayerInput)
        {
            StartCoroutine(BlockInputSequence());
        }
    }
    
    private IEnumerator BlockInputSequence()
    {
        // Block input immediately from start
        SetPlayerInputEnabled(false);
        
        // Duration determines how many seconds to keep it blocked
        // If duration is 0, block until intro completes
        if (PlayableSettings.blockInputDuration > 0f)
        {
            yield return new WaitForSeconds(PlayableSettings.blockInputDuration);
            SetPlayerInputEnabled(true);
        }
        else
        {
            // Duration is 0, keep blocked until intro completes
            yield return new WaitUntil(() => introCompleted);
            SetPlayerInputEnabled(true);
        }
    }
    
    private IEnumerator IntroSequence()
    {
        // Set initial camera angle and position
        if (playerCamera != null && PlayableSettings != null)
        {
            playerCamera.eulerAngles = PlayableSettings.startCameraAngle;
            
            // Use Cinemachine camera offset extension
            if (cameraOffset != null)
            {
                cameraOffset.m_Offset = PlayableSettings.startCameraPosition;
            }
            
            // Set initial FOV
            if (virtualCamera != null)
            {
                virtualCamera.m_Lens.FieldOfView = PlayableSettings.startFOV;
            }
        }
        
        // Determine which transitions are enabled
        if (PlayableSettings != null)
        {
            bool hasCameraTransition = PlayableSettings.cameraTransitionDuration > 0f;
            bool hasFovTransition = PlayableSettings.fovTransitionDuration > 0f;
            
            if (hasCameraTransition && hasFovTransition)
            {
                // Start both transitions in parallel with independent delays
                yield return StartCoroutine(TransitionCameraAndFOV());
            }
            else if (hasCameraTransition)
            {
                // Wait for camera transition delay
                if (PlayableSettings.cameraTransitionDelay > 0f)
                {
                    yield return new WaitForSeconds(PlayableSettings.cameraTransitionDelay);
                }
                
                yield return StartCoroutine(TransitionCameraAngle());
            }
            else if (hasFovTransition)
            {
                // Wait for FOV transition delay (handled inside TransitionFOV)
                // Don't wait for camera delay since camera transition isn't enabled
                yield return StartCoroutine(TransitionFOV());
            }
        }

        float remainingTime = 0.2f;
        if (remainingTime > 0f)
        {
            yield return new WaitForSeconds(remainingTime);
        }
        
        // Complete intro
        CompleteIntro();
    }
    
    private IEnumerator TransitionCameraAngle()
    {
        if (PlayableSettings == null) yield break;
        
        Vector3 startAngle = PlayableSettings.startCameraAngle;
        Vector3 endAngle = PlayableSettings.endCameraAngle;
        Vector3 startPosition = PlayableSettings.startCameraPosition;
        Vector3 endPosition = PlayableSettings.endCameraPosition;
        float transitionDuration = PlayableSettings.cameraTransitionDuration;
        float elapsedTime = 0f;
        
        while (elapsedTime < transitionDuration)
        {
            elapsedTime += Time.deltaTime;
            float progress = elapsedTime / transitionDuration;
            float curveValue = cameraTransitionCurve.Evaluate(progress);
            
            // Interpolate camera angle and position
            Vector3 currentAngle = Vector3.Lerp(startAngle, endAngle, curveValue);
            Vector3 currentPosition = Vector3.Lerp(startPosition, endPosition, curveValue);
            
            if (playerCamera != null)
            {
                playerCamera.eulerAngles = currentAngle;
                
                // Update Cinemachine camera offset
                if (cameraOffset != null)
                {
                    cameraOffset.m_Offset = currentPosition;
                }
            }
            
            yield return null;
        }
        
        // Ensure final angle and position are set
        if (playerCamera != null)
        {
            playerCamera.eulerAngles = endAngle;
            
            // Set final Cinemachine camera offset
            if (cameraOffset != null)
            {
                cameraOffset.m_Offset = endPosition;
            }
        }
    }
    
    private IEnumerator TransitionFOV()
    {
        if (PlayableSettings == null || virtualCamera == null) yield break;
        
        // Wait for FOV transition delay
        if (PlayableSettings.fovTransitionDelay > 0f)
        {
            yield return new WaitForSeconds(PlayableSettings.fovTransitionDelay);
        }
        
        float startFOV = PlayableSettings.startFOV;
        float endFOV = PlayableSettings.endFOV;
        float transitionDuration = PlayableSettings.fovTransitionDuration;
        float elapsedTime = 0f;
        
        while (elapsedTime < transitionDuration)
        {
            elapsedTime += Time.deltaTime;
            float progress = elapsedTime / transitionDuration;
            float curveValue = cameraTransitionCurve.Evaluate(progress);
            
            // Interpolate FOV
            float currentFOV = Mathf.Lerp(startFOV, endFOV, curveValue);
            virtualCamera.m_Lens.FieldOfView = currentFOV;
            
            yield return null;
        }
        
        // Ensure final FOV is set
        virtualCamera.m_Lens.FieldOfView = endFOV;
    }
    
    private IEnumerator TransitionCameraAndFOV()
    {
        if (PlayableSettings == null) yield break;
        
        Vector3 startAngle = PlayableSettings.startCameraAngle;
        Vector3 endAngle = PlayableSettings.endCameraAngle;
        Vector3 startPosition = PlayableSettings.startCameraPosition;
        Vector3 endPosition = PlayableSettings.endCameraPosition;
        float cameraTransitionDelay = PlayableSettings.cameraTransitionDelay;
        float cameraTransitionDuration = PlayableSettings.cameraTransitionDuration;
        
        float startFOV = PlayableSettings.startFOV;
        float endFOV = PlayableSettings.endFOV;
        float fovTransitionDelay = PlayableSettings.fovTransitionDelay;
        float fovTransitionDuration = PlayableSettings.fovTransitionDuration;
        
        // Calculate maximum duration needed
        float maxDuration = Mathf.Max(
            cameraTransitionDelay + cameraTransitionDuration,
            fovTransitionDelay + fovTransitionDuration
        );
        
        float elapsedTime = 0f;
        float cameraElapsedTime = 0f;
        float fovElapsedTime = 0f;
        bool cameraTransitionStarted = false;
        bool fovTransitionStarted = false;
        
        while (elapsedTime < maxDuration)
        {
            elapsedTime += Time.deltaTime;
            
            // Handle camera angle and position transition with delay
            if (!cameraTransitionStarted && elapsedTime >= cameraTransitionDelay)
            {
                cameraTransitionStarted = true;
                cameraElapsedTime = 0f;
            }
            
            if (cameraTransitionStarted && cameraElapsedTime < cameraTransitionDuration)
            {
                cameraElapsedTime += Time.deltaTime;
                float progress = cameraElapsedTime / cameraTransitionDuration;
                float curveValue = cameraTransitionCurve.Evaluate(progress);
                
                Vector3 currentAngle = Vector3.Lerp(startAngle, endAngle, curveValue);
                Vector3 currentPosition = Vector3.Lerp(startPosition, endPosition, curveValue);
                
                if (playerCamera != null)
                {
                    playerCamera.eulerAngles = currentAngle;
                    
                    if (cameraOffset != null)
                    {
                        cameraOffset.m_Offset = currentPosition;
                    }
                }
            }
            else if (cameraTransitionStarted)
            {
                // Camera transition complete - ensure final values are set
                if (playerCamera != null)
                {
                    playerCamera.eulerAngles = endAngle;
                    
                    if (cameraOffset != null)
                    {
                        cameraOffset.m_Offset = endPosition;
                    }
                }
            }
            
            // Handle FOV transition with delay
            if (!fovTransitionStarted && elapsedTime >= fovTransitionDelay)
            {
                fovTransitionStarted = true;
                fovElapsedTime = 0f;
            }
            
            if (fovTransitionStarted && virtualCamera != null)
            {
                fovElapsedTime += Time.deltaTime;
                
                if (fovElapsedTime < fovTransitionDuration)
                {
                    float fovProgress = fovElapsedTime / fovTransitionDuration;
                    float fovCurveValue = cameraTransitionCurve.Evaluate(fovProgress);
                    
                    float currentFOV = Mathf.Lerp(startFOV, endFOV, fovCurveValue);
                    virtualCamera.m_Lens.FieldOfView = currentFOV;
                }
                else
                {
                    // FOV transition complete
                    virtualCamera.m_Lens.FieldOfView = endFOV;
                }
            }
            
            yield return null;
        }
        
        // Ensure final values are set
        if (playerCamera != null)
        {
            playerCamera.eulerAngles = endAngle;
            
            if (cameraOffset != null)
            {
                cameraOffset.m_Offset = endPosition;
            }
        }
        
        if (virtualCamera != null)
        {
            virtualCamera.m_Lens.FieldOfView = endFOV;
        }
    }
    
    private void CompleteIntro()
    {
        isIntroActive = false;
        introCompleted = true;
        
        // Input blocking is independent - don't auto-unblock here
        // It's controlled by blockInputDuration setting only
        
        OnIntroCompleted?.Invoke();
    }
    
    private void SetPlayerInputEnabled(bool enabled)
    {
        // Toggle hole input during intro without disabling the component
        if (holeController != null)
        {
            holeController.SetInputEnabled(enabled);
        }
        
        // Disable hand cursor during intro
        if (handCursorRef != null)
        {
            handCursorRef.enabled = enabled;
            // Hide cursor visually when disabled
            if (!enabled)
            {
                handCursorRef.gameObject.SetActive(false);
            }
            else
            {
                handCursorRef.gameObject.SetActive(true);
            }
        }
        
        // Movement indicator visibility is handled inside HoleController when input is toggled
    }
    
    // Independent intro text system
    private void StartIntroText()
    {
        if (isIntroTextVisible || isIntroTextHidden || PlayableSettings == null || !PlayableSettings.showIntroText) return;
        
        isIntroTextVisible = true;
        isIntroTextHidden = false;
        
        // Show intro text
        if (UIManager.instance != null)
        {
            UIManager.instance.ShowIntroText(PlayableSettings.introText);
        }
        
        // Handle different hiding methods
        if (PlayableSettings.hideIntroTextOnPlayerTouch && PlayableSettings.introTextHideAfterDuration)
        {
            // Both enabled - hide on whichever happens first
            StartCoroutine(WaitForTouchOrDuration());
        }
        else if (PlayableSettings.hideIntroTextOnPlayerTouch)
        {
            // Only touch - start touch detection
            StartCoroutine(WaitForTouch());
        }
        else if (PlayableSettings.introTextHideAfterDuration)
        {
            // Only duration - start duration timer
            StartCoroutine(WaitForDuration());
        }
        // If neither is enabled, text stays visible
    }
    
    private IEnumerator WaitForTouchOrDuration()
    {
        float duration = PlayableSettings.introTextDuration;
        float elapsedTime = 0f;
        
        while (elapsedTime < duration && !isIntroTextHidden)
        {
            // Check for touch only if intro is not currently active (input not blocked)
            if (!isIntroActive && 
                (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)))
            {
                HideIntroText();
                yield break;
            }
            
            elapsedTime += Time.deltaTime;
            yield return null;
        }
        
        // Duration reached
        if (!isIntroTextHidden)
        {
            HideIntroText();
        }
    }
    
    private IEnumerator WaitForTouch()
    {
        while (!isIntroTextHidden)
        {
            // Check for touch only if intro is not currently active (input not blocked)
            if (!isIntroActive && 
                (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)))
            {
                HideIntroText();
                yield break;
            }
            yield return null;
        }
    }
    
    private IEnumerator WaitForDuration()
    {
        yield return new WaitForSeconds(PlayableSettings.introTextDuration);
        
        if (!isIntroTextHidden)
        {
            HideIntroText();
        }
    }
    
    private void HideIntroText()
    {
        if (isIntroTextHidden) return;
        
        isIntroTextHidden = true;
        isIntroTextVisible = false;
        
        if (UIManager.instance != null)
        {
            UIManager.instance.HideIntroText();
        }
    }
    
    public void ForceHideIntroText()
    {
        HideIntroText();
    }
    
    public bool IsIntroTextVisible => isIntroTextVisible && !isIntroTextHidden;
    public bool IsIntroTextHidden => isIntroTextHidden;
    
    // Public methods for external control
    public void SkipIntro()
    {
        if (!isIntroActive) return;
        
        StopAllCoroutines();
        
        // Set final camera angle and position
        if (playerCamera != null && PlayableSettings != null)
        {
            playerCamera.eulerAngles = PlayableSettings.endCameraAngle;
            
            // Set final Cinemachine camera offset
            if (cameraOffset != null)
            {
                cameraOffset.m_Offset = PlayableSettings.endCameraPosition;
            }
            
            // Set final FOV
            if (virtualCamera != null)
            {
                virtualCamera.m_Lens.FieldOfView = PlayableSettings.endFOV;
            }
        }
        
        CompleteIntro();
    }
    
    public bool IsIntroActive => isIntroActive;
    public bool IsIntroCompleted => introCompleted;
    
    // Method to configure intro from PlayableSettings
    public void ConfigureIntro(bool enable, float duration, Vector3 startAngle, Vector3 endAngle, float transitionDuration)
    {
        // This method is no longer needed since we use PlayableSettings directly
        // Keeping for backward compatibility but it does nothing
    }
}
