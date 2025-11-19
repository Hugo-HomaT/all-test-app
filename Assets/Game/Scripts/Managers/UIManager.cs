using System;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

public class UIManager : MonoBehaviour
{
    public static UIManager instance;

    public GameObject playScreen;
    public GameObject winScreen;
    public GameObject loseScreen;
    public GameObject shootScreen;
    public Text timerText;

    public Image timeBarImage;
    public Animator anim;
    private bool isTimerAnimPlaying;

    public GameObject topBanner;
    public GameObject midBanner;
    public GameObject bottomBanner;
    public HandCursor handCursor;
    public GameObject joystick;
    public GameObject tutoJoystick;
    [Header("Intro Text")]
    public TextMeshProUGUI introText;
    [Header("References")]
    public HoleController holeController;

    public ObjectivesUISystem myObjectivesUISystem;
    // Tuto joystick tracking
    private bool tutoJoystickHidden = false;
    private float lastTouchReleaseTime = 0f;
    private Coroutine showAfterDelayCoroutine;
    private bool isTouching = false;
    
    private void Awake()
    {
        if (instance == null)
            instance = this;
        playScreen.SetActive(true);
    }
    
    private void Start()
    {
        // Initialize joysticks after PlayableSettings is ready
        InitializeJoysticks();

        // Ensure intro text is empty when intro display is disabled in settings
        if (PlayableSettings.instance != null && !PlayableSettings.instance.showIntroText && introText != null)
        {
            introText.text = "";
        }

        // Do not init objectives here; Level triggers after theme groups activation
    }
    
    public void InitializeJoysticks()
    {
        if (PlayableSettings.instance == null)
            return;
        
        // Initialize regular joystick
        if (joystick != null)
        {
            joystick.SetActive(PlayableSettings.instance.enableJoystick);
        }
        
        // Initialize tuto joystick
        if (tutoJoystick != null)
        {
            if (PlayableSettings.instance.enableTutoJoystick)
            {
                bool shouldShow = PlayableSettings.instance.tutoJoystickShowAtStart || PlayableSettings.instance.enableTutoJoystickAfterTouch;
                
                if (shouldShow && PlayableSettings.instance.tutoJoystickDisplayDelay > 0f)
                {
                    // Delay the display
                    tutoJoystick.SetActive(false);
                    StartCoroutine(DelayedShowTutoJoystick());
                }
                else
                {
                    tutoJoystick.SetActive(shouldShow);
                }
            }
            else
            {
                tutoJoystick.SetActive(false);
            }
        }
    }
    
    public void UpdateTimer(float amount)
    {
        int minutes = Mathf.FloorToInt(amount / 60);
        int seconds = Mathf.FloorToInt(amount % 60);

        if (timerText != null)
            timerText.text = $"{minutes:0}:{seconds:00}";

        // Update time bar fill amount
        UpdateTimeBar(amount);

        if (amount < 5f && !isTimerAnimPlaying)
        {
            anim.Play("Timer Low");
            isTimerAnimPlaying = true;
        }
    }

    private void UpdateTimeBar(float currentTime)
    {
        if (timeBarImage != null)
        {
            // Calculate fill amount: 0 = full time, 1 = no time left (inverted)
            float fillAmount = 1f - (currentTime / PlayableSettings.instance.gameTimeInSeconds);
            timeBarImage.fillAmount = Mathf.Clamp01(fillAmount);
        }
    }

    public void UpdateSlider(float amount)
    {
        // objectiveAmount.text = amount + " / " + PlayableSettings.instance.objectiveAmount;
        //
        // objectiveSlider.value = amount / PlayableSettings.instance.objectiveAmount;
    }

    public void ShowShootScreen()
    {
        shootScreen.SetActive(true);
        Luna.Unity.Analytics.LogEvent("screen_shoot_showed",1);
            if (handCursor != null) handCursor.SetForceHidden(true);
    }
    
    public void HideShootScreenAfterShoot()
    {
        shootScreen.SetActive(false);
            if (handCursor != null) handCursor.SetForceHidden(false);
    }
    public void ShowEndScreen(bool isWin)
    {
        var screen = isWin ? winScreen : loseScreen;
        playScreen.gameObject.SetActive(false);
        screen.SetActive(true);
        Luna.Unity.Analytics.LogEvent(Luna.Unity.Analytics.EventType.EndCardShown);

        if (isWin)
        {
            Luna.Unity.Analytics.LogEvent("screen_win_showed",1);
        }
        else
        {
            Luna.Unity.Analytics.LogEvent("screen_lose_showed",1);
        }
        
    }
    
    public void OnButtonClick()
    {
        if (StoreRedirectTracker.instance != null)
        {
            StoreRedirectTracker.instance.TriggerManualRedirect("UI Button clicked");
        }
        else
        {
            // Fallback to direct redirect if tracker not available
            Luna.Unity.Playable.InstallFullGame();
            Luna.Unity.Analytics.LogEvent("Button clicked",1);
            Luna.Unity.LifeCycle.GameEnded();
        }
    }
    
    public void OnBannerClick()
    {
        if (StoreRedirectTracker.instance != null)
        {
            StoreRedirectTracker.instance.TriggerManualRedirect("Banner clicked");
        }
        else
        {
            // Fallback to direct redirect if tracker not available
            Luna.Unity.Playable.InstallFullGame();
            Luna.Unity.Analytics.LogEvent("Banner clicked",1);
            Luna.Unity.LifeCycle.GameEnded();
        }
    }
    
    public void ShowIntroText(string text)
    {
        if (introText != null)
        {
            introText.text = text;
            introText.gameObject.SetActive(true);
        }
    }
    
    public void HideIntroText()
    {
        if (introText != null)
        {
            introText.text = "";
        }
    }
    
    public void OnPlayerTouch()
    {
        if (tutoJoystick == null || !PlayableSettings.instance.enableTutoJoystick)
            return;
        
        // Don't process joystick tutorial touches if input is blocked
        if (holeController != null && !holeController.IsInputEnabled)
            return;
        
        isTouching = true;
        
        // If tuto joystick is showing and we're in "show at start" mode, hide on first touch
        if (PlayableSettings.instance.tutoJoystickShowAtStart && !tutoJoystickHidden)
        {
            tutoJoystick.SetActive(false);
            tutoJoystickHidden = true;
        }
        
        // If "show after touch" mode is enabled, hide it immediately
        if (PlayableSettings.instance.enableTutoJoystickAfterTouch)
        {
            // Hide on touch
            tutoJoystick.SetActive(false);
            
            // Stop any existing coroutine since user is touching again
            if (showAfterDelayCoroutine != null)
            {
                StopCoroutine(showAfterDelayCoroutine);
            }
        }
    }
    
    public void OnPlayerTouchRelease()
    {
        if (tutoJoystick == null || !PlayableSettings.instance.enableTutoJoystick)
            return;
        
        isTouching = false;
        
        // If "show after touch" mode is enabled, start the redisplay logic
        if (PlayableSettings.instance.enableTutoJoystickAfterTouch)
        {
            // Record when user released touch
            lastTouchReleaseTime = Time.time;
            
            // Start coroutine that will check after X seconds
            showAfterDelayCoroutine = StartCoroutine(ShowTutoJoystickAfterDelay());
        }
    }
    
    private System.Collections.IEnumerator ShowTutoJoystickAfterDelay()
    {

        yield return new WaitForSeconds(PlayableSettings.instance.tutoJoystickShowTimesAfterTouch);
        
        while (Time.time - lastTouchReleaseTime < PlayableSettings.instance.tutoJoystickShowTimesAfterTouch || 
               Input.GetMouseButton(0) || (Input.touchCount > 0))
        {
            yield return null;
        }
        
        if (tutoJoystick != null && PlayableSettings.instance.enableTutoJoystick && !isTouching)
        {
            tutoJoystick.SetActive(true);
        }
    }
    
    private System.Collections.IEnumerator DelayedShowTutoJoystick()
    {
        yield return new WaitForSeconds(PlayableSettings.instance.tutoJoystickDisplayDelay);
        
        // Only show if user is not currently touching
        if (tutoJoystick != null && PlayableSettings.instance.enableTutoJoystick && !isTouching)
        {
            tutoJoystick.SetActive(true);
        }
    }
    
    private void Update()
    {
        // Update isTouching state to prevent showing joystick while dragging
        if (Input.GetMouseButton(0) || Input.touchCount > 0)
        {
            isTouching = true;
        }
    }
}