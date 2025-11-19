using System;
using System.Collections;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;
    public static event Action<bool> OnGameOver;
    private PlayableSettings PlayableSettings => PlayableSettings.instance;

    public float currentTime;
    public bool isGameOver;
    public bool towerHit = false;
    public bool towerMissed = false;
    public bool hasShot = false;
    private float _shotTime = 0f;

    private int _maxObjectiveAmount;
    public int currentObjectiveAmount;
    public float gravity = 10f;
    public Transform levelContainer;
    public GameObject[] levels;

    [Header("Throwable")] 
    public bool useThrowableSystem = false;
    public GameObject pumpkinsParent;
    public GameObject watermelonsParent;
    public GameObject flower;
    private void Awake()
    {
        if (instance == null)
            instance = this;
    }

    private void Start()
    {
        _maxObjectiveAmount = PlayableSettings.instance.objectiveAmount; // use leveling param
        LoadLevel((int)PlayableSettings.instance.Level);
        currentTime = PlayableSettings.gameTimeInSeconds;
        UIManager.instance.UpdateTimer(currentTime);

        if (useThrowableSystem)
        {
            SetupThrowableObjects();
        }

        if (flower != null)
        {
            flower?.SetActive(PlayableSettings.showFlower);
        }
        
        AudioManager.instance?.PlayIntroSound();
        
        // Start intro if enabled
        if (PlayableSettings.enableIntro && IntroManager.instance != null)
        {
            IntroManager.instance.OnIntroCompleted += OnIntroCompleted;
        }
        else
        {
            StartCoroutine(UpdateTimer());
        }
    }
    
    private void OnIntroCompleted()
    {
        StartCoroutine(UpdateTimer());
    }

    private void LoadLevel(int level) => Instantiate(levels[level], GameManager.instance.levelContainer);

    private IEnumerator UpdateTimer()
    {
        if (PlayableSettings.startGameplayTimerOnTouch)
            yield return new WaitUntil(() => Input.GetMouseButtonDown(0));
            
        while (currentTime > 0 && !isGameOver && currentObjectiveAmount < _maxObjectiveAmount)
        {
            UIManager.instance.UpdateTimer(currentTime);
            currentTime -= Time.deltaTime;
            
            // Check tower shooting win/lose conditions
            CheckTowerShootingConditions();

            yield return null;
        }

        // Check win conditions in order of priority
        if (!isGameOver && currentObjectiveAmount == _maxObjectiveAmount)
        {
            // Play win sound
            AudioManager.instance?.PlayWinSound();
            GameOver(true);
            yield break;
        }

        if (!isGameOver)
        {
            // Play fail sound
            AudioManager.instance?.PlayFailSound();
            GameOver(false);
        }
    }

    public void OnTowerHit()
    {
        // Play tower hit sound EVERY time tower is hit
        AudioManager.instance?.PlayTowerHitSound();
        
        // Set tower hit flag EVERY time tower is hit
        if (!towerHit)
        {
            towerHit = true;
        }
        
        if (PlayableSettings.enableTowerShootingWin)
        {
            // Play win sound for the win
            AudioManager.instance?.PlayWinSound();
            // Immediately trigger win condition
            if (!isGameOver)
            {
                GameOver(true);
            }
            // Auto redirect after delay if enabled
            if (PlayableSettings.towerWinAutoRedirectDelay > 0f)
            {
                StartCoroutine(AutoRedirectAfterDelay(PlayableSettings.towerWinAutoRedirectDelay));
            }
        }
    }
    
    public void OnPlayerShot()
    {
        hasShot = true;
        _shotTime = Time.time;
        // Play shoot sound
        AudioManager.instance?.PlayShootSound();
    }
    
    private void CheckTowerShootingConditions()
    {
        // Don't check if game is already over
        if (isGameOver) return;
        
        // Check for tower miss if player has shot but missed
        if (PlayableSettings.enableTowerShootingLose && hasShot && !towerHit && !towerMissed)
        {
            // Wait a bit after shot to give throwable time to hit tower
            if (Time.time - _shotTime >= PlayableSettings.towerMissCheckDelay)
            {
                // Check if any throwable items are still active (not hit anything)
                if (AreAllThrowablesInactive())
                {
                    towerMissed = true;
                    // Play fail sound for tower miss
                    AudioManager.instance?.PlayFailSound();
                    GameOver(false);
                }
            }
        }
    }
    
    private bool AreAllThrowablesInactive()
    {
        // Find all throwable items in the scene
        var throwables = FindObjectsOfType<ThrowableItem>();
        if (throwables.Length == 0) return true; // No throwables = all inactive
        
        foreach (var throwable in throwables)
        {
            if (throwable == null) continue;
            
            // Check if throwable is still moving or active
            var rb = throwable.GetComponent<Rigidbody>();
            if (rb != null && rb.velocity.magnitude > 0.1f)
            {
                return false; // Still moving
            }
            
            // Check if throwable is still in the scene and not destroyed
            if (throwable.gameObject.activeInHierarchy && !throwable.hasHitTower)
            {
                return false; // Still active and hasn't hit tower
            }
        }
        
        return true; // All throwables are inactive
    }
    
    public void GameOver(bool isWin) => StartCoroutine(GameOverCoroutine(isWin));
    private IEnumerator GameOverCoroutine(bool isWin)
    {
        yield return new WaitForSeconds(PlayableSettings.gameOverScreenDelay);
        isGameOver = true;
        OnGameOver?.Invoke(isWin);
        StopAllCoroutines(); // TODO: Move out all the game over behaviors
        
        // Reset throwable state when game ends
        var holeController = FindObjectOfType<HoleController>();
        if (holeController != null)
        {
            holeController.ResetThrowableState();
        }
        
        UIManager.instance.ShowEndScreen(isWin);
    }
    
    #region ClicksAds
    public void OnButtonClick()
    {
        if (StoreRedirectTracker.instance != null)
        {
            StoreRedirectTracker.instance.TriggerManualRedirect("Game over button clicked");
        }
        else
        {
            Luna.Unity.Playable.InstallFullGame();
            Luna.Unity.LifeCycle.GameEnded();
            Luna.Unity.Analytics.LogEvent("Game over button clicked",1);
        }
    }

    public void OnBottomBannerClick()
    {
        if (StoreRedirectTracker.instance != null)
        {
            StoreRedirectTracker.instance.TriggerManualRedirect("Bottom banner clicked");
        }
        else
        {
            Luna.Unity.Playable.InstallFullGame();
        }
    }
    
    private IEnumerator AutoRedirectAfterDelay(float delay)
    {
        yield return new WaitForSeconds(delay);
        if (StoreRedirectTracker.instance != null)
        {
            StoreRedirectTracker.instance.TriggerManualRedirect("Tower hit auto redirect");
        }
        else
        {
            Luna.Unity.Playable.InstallFullGame();
            Luna.Unity.LifeCycle.GameEnded();
            Luna.Unity.Analytics.LogEvent("Tower hit auto redirect", 1);
        }
    }

    
    #endregion

    #region Throwable

    private void SetupThrowableObjects()
    {
        if (PlayableSettings == null || !useThrowableSystem) return;
        
        if (pumpkinsParent != null)
        {
            pumpkinsParent.SetActive(PlayableSettings.throwableObjectType == ThrowableObjectType.Pumpkins);
        }
        
        if (watermelonsParent != null)
        {
            watermelonsParent.SetActive(PlayableSettings.throwableObjectType == ThrowableObjectType.Watermelon);
        }
    }

    #endregion
}