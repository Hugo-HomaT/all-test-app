using System.Collections;
using Luna.Unity;
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
	public Text introText;

	[Header("References")]
	public HoleController holeController;

	public ObjectivesUISystem myObjectivesUISystem;

	private bool tutoJoystickHidden = false;

	private float lastTouchReleaseTime = 0f;

	private Coroutine showAfterDelayCoroutine;

	private bool isTouching = false;

	private void Awake()
	{
		if (instance == null)
		{
			instance = this;
		}
		playScreen.SetActive(true);
	}

	private void Start()
	{
		InitializeJoysticks();
		if (PlayableSettings.instance != null && !PlayableSettings.instance.showIntroText && introText != null)
		{
			introText.text = "";
		}
	}

	public void InitializeJoysticks()
	{
		if (PlayableSettings.instance == null)
		{
			return;
		}
		if (joystick != null)
		{
			joystick.SetActive(PlayableSettings.instance.enableJoystick);
		}
		if (!(tutoJoystick != null))
		{
			return;
		}
		if (PlayableSettings.instance.enableTutoJoystick)
		{
			bool shouldShow = PlayableSettings.instance.tutoJoystickShowAtStart || PlayableSettings.instance.enableTutoJoystickAfterTouch;
			if (shouldShow && PlayableSettings.instance.tutoJoystickDisplayDelay > 0f)
			{
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

	public void UpdateTimer(float amount)
	{
		int minutes = Mathf.FloorToInt(amount / 60f);
		int seconds = Mathf.FloorToInt(amount % 60f);
		if (timerText != null)
		{
			timerText.text = $"{minutes:0}:{seconds:00}";
		}
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
			float fillAmount = 1f - currentTime / PlayableSettings.instance.gameTimeInSeconds;
			timeBarImage.fillAmount = Mathf.Clamp01(fillAmount);
		}
	}

	public void UpdateSlider(float amount)
	{
	}

	public void ShowShootScreen()
	{
		shootScreen.SetActive(true);
		Analytics.LogEvent("screen_shoot_showed", 1);
		if (handCursor != null)
		{
			handCursor.SetForceHidden(true);
		}
	}

	public void HideShootScreenAfterShoot()
	{
		shootScreen.SetActive(false);
		if (handCursor != null)
		{
			handCursor.SetForceHidden(false);
		}
	}

	public void ShowEndScreen(bool isWin)
	{
		GameObject screen = (isWin ? winScreen : loseScreen);
		playScreen.gameObject.SetActive(false);
		screen.SetActive(true);
		Analytics.LogEvent(Analytics.EventType.EndCardShown);
		if (isWin)
		{
			Analytics.LogEvent("screen_win_showed", 1);
		}
		else
		{
			Analytics.LogEvent("screen_lose_showed", 1);
		}
	}

	public void OnButtonClick()
	{
		if (StoreRedirectTracker.instance != null)
		{
			StoreRedirectTracker.instance.TriggerManualRedirect("UI Button clicked");
			return;
		}
		Playable.InstallFullGame();
		Analytics.LogEvent("Button clicked", 1);
		LifeCycle.GameEnded();
	}

	public void OnBannerClick()
	{
		if (StoreRedirectTracker.instance != null)
		{
			StoreRedirectTracker.instance.TriggerManualRedirect("Banner clicked");
			return;
		}
		Playable.InstallFullGame();
		Analytics.LogEvent("Banner clicked", 1);
		LifeCycle.GameEnded();
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
		if (tutoJoystick == null || !PlayableSettings.instance.enableTutoJoystick || (holeController != null && !holeController.IsInputEnabled))
		{
			return;
		}
		isTouching = true;
		if (PlayableSettings.instance.tutoJoystickShowAtStart && !tutoJoystickHidden)
		{
			tutoJoystick.SetActive(false);
			tutoJoystickHidden = true;
		}
		if (PlayableSettings.instance.enableTutoJoystickAfterTouch)
		{
			tutoJoystick.SetActive(false);
			if (showAfterDelayCoroutine != null)
			{
				StopCoroutine(showAfterDelayCoroutine);
			}
		}
	}

	public void OnPlayerTouchRelease()
	{
		if (!(tutoJoystick == null) && PlayableSettings.instance.enableTutoJoystick)
		{
			isTouching = false;
			if (PlayableSettings.instance.enableTutoJoystickAfterTouch)
			{
				lastTouchReleaseTime = Time.time;
				showAfterDelayCoroutine = StartCoroutine(ShowTutoJoystickAfterDelay());
			}
		}
	}

	private IEnumerator ShowTutoJoystickAfterDelay()
	{
		yield return new WaitForSeconds(PlayableSettings.instance.tutoJoystickShowTimesAfterTouch);
		while (Time.time - lastTouchReleaseTime < PlayableSettings.instance.tutoJoystickShowTimesAfterTouch || Input.GetMouseButton(0) || Input.touchCount > 0)
		{
			yield return null;
		}
		if (tutoJoystick != null && PlayableSettings.instance.enableTutoJoystick && !isTouching)
		{
			tutoJoystick.SetActive(true);
		}
	}

	private IEnumerator DelayedShowTutoJoystick()
	{
		yield return new WaitForSeconds(PlayableSettings.instance.tutoJoystickDisplayDelay);
		if (tutoJoystick != null && PlayableSettings.instance.enableTutoJoystick && !isTouching)
		{
			tutoJoystick.SetActive(true);
		}
	}

	private void Update()
	{
		if (Input.GetMouseButton(0) || Input.touchCount > 0)
		{
			isTouching = true;
		}
	}
}
