using System;
using System.Collections;
using HomaPlayables;
using UnityEngine;

public class StoreRedirectTracker : MonoBehaviour
{
    public static StoreRedirectTracker instance;
    
    private int totalClicks = 0;
    private float timeElapsed = 0f;
    
    // Tracking flags
    private bool isTrackingClicks = false;
    private bool isTrackingTime = false;
    private bool hasRedirected = false;
    private bool isTracking = true;
    
    // Store redirection settings reference
    private PlayableSettings playableSettings;
    
    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    private void Start()
    {
        // Get settings from PlayableSettings
        if (PlayableSettings.instance != null)
        {
            playableSettings = PlayableSettings.instance;
            InitializeTracking();
        }
    }
    
    private void Update()
    {
        // Retry initialization if PlayableSettings wasn't available at Start
        if (playableSettings == null && PlayableSettings.instance != null)
        {
            playableSettings = PlayableSettings.instance;
            InitializeTracking();
        }
        
        if (!isTracking) return;
        
        // Track time only if time tracking is enabled
        if (isTrackingTime && playableSettings != null && playableSettings.enableTimeRedirection)
        {
            timeElapsed += Time.deltaTime;
            
            CheckTimeRedirection();
        }
        
        // Track mouse/touch input
        TrackInput();
    }
    
    private void TrackInput()
    {
        // Track mouse clicks and touches
        if (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began))
        {
            OnClick();
        }
    }
    
    private void InitializeTracking()
    {
        if (playableSettings == null) return;
        
        // Enable tracking based on settings
        isTrackingClicks = playableSettings.enableClickRedirection;
        isTrackingTime = playableSettings.enableTimeRedirection;
        
        // Reset counters
        ResetCounters();
    }
    
    public void ResetCounters()
    {
        totalClicks = 0;
        timeElapsed = 0f;
        hasRedirected = false;
    }
    
    public void OnClick()
    {
        // If player has been redirected once before, ALWAYS redirect on any click
        if (hasRedirected)
        {
            TriggerStoreRedirection("Redirect after first redirection");
            return;
        }
        
        // Only track clicks if click redirection is enabled
        if (!isTrackingClicks || playableSettings == null || !playableSettings.enableClickRedirection) return;
        
        totalClicks++;
        
        // Check click redirection inline to avoid binding issues
        if (totalClicks >= playableSettings.clicksToRedirect)
        {
            TriggerStoreRedirection("Click count reached");
        }
    }
    
    public void OnThrow()
    {
        // If player has been redirected once before, ALWAYS redirect on any throw
        if (hasRedirected)
        {
            TriggerStoreRedirection("Redirect after first redirection");
            return;
        }
        
        // Only track throws if throw redirection is enabled
        if (!isTracking || playableSettings == null || !playableSettings.redirectAfterThrow) return;
        
        // Trigger redirect after throw with delay
        StartCoroutine(RedirectAfterThrowCoroutine());
    }
    
    private IEnumerator RedirectAfterThrowCoroutine()
    {
        yield return new WaitForSeconds(playableSettings.redirectDelayAfterThrow);
        TriggerStoreRedirection("After throw");
    }
    
    public void CheckClickRedirection()
    {
        if (playableSettings == null || !playableSettings.enableClickRedirection) return;
        
        if (totalClicks >= playableSettings.clicksToRedirect)
        {
            TriggerStoreRedirection("Click count reached");
        }
    }
    
    public void CheckTimeRedirection()
    {
        // Double-check that time redirection is enabled (defensive programming)
        if (playableSettings == null || !playableSettings.enableTimeRedirection || !isTrackingTime) return;
        
        // Don't check time redirection if already redirected (only redirect on actual clicks)
        if (hasRedirected) return;
        
        if (timeElapsed >= playableSettings.timeToRedirect)
        {
            TriggerStoreRedirection("Time limit reached");
        }
    }
    
    private void TriggerStoreRedirection(string reason)
    {
        // Set flag for first redirect only
        if (!hasRedirected)
        {
            hasRedirected = true;
        }
        
        HomaEventTracker.TrackEvent($"Store Redirect - {reason}", new { value = 1 });
        // Trigger store redirection
        HomaEventTracker.InstallFullGame();
        HomaEventTracker.GameEnded();
    }
    
    // Public getters for current values
    public int GetTotalClicks() => totalClicks;
    public float GetTimeElapsed() => timeElapsed;
    public bool HasRedirected() => hasRedirected;
    
    // Method to manually trigger redirect (for UI buttons)
    public void TriggerManualRedirect(string reason = "Manual redirect")
    {
        TriggerStoreRedirection(reason);
    }
    
    // Method to enable/disable tracking
    public void SetTrackingEnabled(bool enabled)
    {
        isTracking = enabled;
    }
    
    // Method to reset all counters
    public void ResetAllCounters()
    {
        ResetCounters();
    }
    
    // Method to clear redirect state (for testing purposes)
    public void ClearRedirectState()
    {
        hasRedirected = false;
    }
}