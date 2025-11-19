using System;
using System.Collections;
using Luna.Unity;
using UnityEngine;

public class GameManager : MonoBehaviour
{
	public static GameManager instance;

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

	private PlayableSettings PlayableSettings => PlayableSettings.instance;

	public static event Action<bool> OnGameOver;

	private void Awake()
	{
		if (instance == null)
		{
			instance = this;
		}
	}

	private void Start()
	{
		_maxObjectiveAmount = PlayableSettings.instance.objectiveAmount;
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
		if (PlayableSettings.enableIntro && IntroManager.instance != null)
		{
			IntroManager introManager = IntroManager.instance;
			introManager.OnIntroCompleted = (Action)Delegate.Combine(introManager.OnIntroCompleted, new Action(OnIntroCompleted));
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

	private void LoadLevel(int level)
	{
		UnityEngine.Object.Instantiate(levels[level], instance.levelContainer);
	}

	private IEnumerator UpdateTimer()
	{
		if (PlayableSettings.startGameplayTimerOnTouch)
		{
			yield return new WaitUntil(() => Input.GetMouseButtonDown(0));
		}
		while (currentTime > 0f && !isGameOver && currentObjectiveAmount < _maxObjectiveAmount)
		{
			UIManager.instance.UpdateTimer(currentTime);
			currentTime -= Time.deltaTime;
			CheckTowerShootingConditions();
			yield return null;
		}
		if (!isGameOver && currentObjectiveAmount == _maxObjectiveAmount)
		{
			AudioManager.instance?.PlayWinSound();
			GameOver(true);
		}
		else if (!isGameOver)
		{
			AudioManager.instance?.PlayFailSound();
			GameOver(false);
		}
	}

	public void OnTowerHit()
	{
		AudioManager.instance?.PlayTowerHitSound();
		if (!towerHit)
		{
			towerHit = true;
		}
		if (PlayableSettings.enableTowerShootingWin)
		{
			AudioManager.instance?.PlayWinSound();
			if (!isGameOver)
			{
				GameOver(true);
			}
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
		AudioManager.instance?.PlayShootSound();
	}

	private void CheckTowerShootingConditions()
	{
		if (!isGameOver && PlayableSettings.enableTowerShootingLose && hasShot && !towerHit && !towerMissed && Time.time - _shotTime >= PlayableSettings.towerMissCheckDelay && AreAllThrowablesInactive())
		{
			towerMissed = true;
			AudioManager.instance?.PlayFailSound();
			GameOver(false);
		}
	}

	private bool AreAllThrowablesInactive()
	{
		ThrowableItem[] throwables = UnityEngine.Object.FindObjectsOfType<ThrowableItem>();
		if (throwables.Length == 0)
		{
			return true;
		}
		ThrowableItem[] array = throwables;
		foreach (ThrowableItem throwable in array)
		{
			if (!(throwable == null))
			{
				Rigidbody rb = throwable.GetComponent<Rigidbody>();
				if (rb != null && rb.velocity.magnitude > 0.1f)
				{
					return false;
				}
				if (throwable.gameObject.activeInHierarchy && !throwable.hasHitTower)
				{
					return false;
				}
			}
		}
		return true;
	}

	public void GameOver(bool isWin)
	{
		StartCoroutine(GameOverCoroutine(isWin));
	}

	private IEnumerator GameOverCoroutine(bool isWin)
	{
		yield return new WaitForSeconds(PlayableSettings.gameOverScreenDelay);
		isGameOver = true;
		GameManager.OnGameOver?.Invoke(isWin);
		StopAllCoroutines();
		HoleController holeController = UnityEngine.Object.FindObjectOfType<HoleController>();
		if (holeController != null)
		{
			holeController.ResetThrowableState();
		}
		UIManager.instance.ShowEndScreen(isWin);
	}

	public void OnButtonClick()
	{
		if (StoreRedirectTracker.instance != null)
		{
			StoreRedirectTracker.instance.TriggerManualRedirect("Game over button clicked");
			return;
		}
		Playable.InstallFullGame();
		LifeCycle.GameEnded();
		Analytics.LogEvent("Game over button clicked", 1);
	}

	public void OnBottomBannerClick()
	{
		if (StoreRedirectTracker.instance != null)
		{
			StoreRedirectTracker.instance.TriggerManualRedirect("Bottom banner clicked");
		}
		else
		{
			Playable.InstallFullGame();
		}
	}

	private IEnumerator AutoRedirectAfterDelay(float delay)
	{
		yield return new WaitForSeconds(delay);
		if (StoreRedirectTracker.instance != null)
		{
			StoreRedirectTracker.instance.TriggerManualRedirect("Tower hit auto redirect");
			yield break;
		}
		Playable.InstallFullGame();
		LifeCycle.GameEnded();
		Analytics.LogEvent("Tower hit auto redirect", 1);
	}

	private void SetupThrowableObjects()
	{
		if (!(PlayableSettings == null) && useThrowableSystem)
		{
			if (pumpkinsParent != null)
			{
				pumpkinsParent.SetActive(PlayableSettings.throwableObjectType == ThrowableObjectType.Pumpkins);
			}
			if (watermelonsParent != null)
			{
				watermelonsParent.SetActive(PlayableSettings.throwableObjectType == ThrowableObjectType.Watermelon);
			}
		}
	}
}
