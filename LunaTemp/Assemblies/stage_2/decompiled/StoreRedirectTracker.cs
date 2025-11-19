using System.Collections;
using Luna.Unity;
using UnityEngine;

public class StoreRedirectTracker : MonoBehaviour
{
	public static StoreRedirectTracker instance;

	private int totalClicks = 0;

	private float timeElapsed = 0f;

	private bool isTrackingClicks = false;

	private bool isTrackingTime = false;

	private bool hasRedirected = false;

	private bool isTracking = true;

	private PlayableSettings playableSettings;

	private void Awake()
	{
		if (instance == null)
		{
			instance = this;
			Object.DontDestroyOnLoad(base.gameObject);
		}
		else
		{
			Object.Destroy(base.gameObject);
		}
	}

	private void Start()
	{
		if (PlayableSettings.instance != null)
		{
			playableSettings = PlayableSettings.instance;
			InitializeTracking();
		}
	}

	private void Update()
	{
		if (playableSettings == null && PlayableSettings.instance != null)
		{
			playableSettings = PlayableSettings.instance;
			InitializeTracking();
		}
		if (isTracking)
		{
			if (isTrackingTime && playableSettings != null && playableSettings.enableTimeRedirection)
			{
				timeElapsed += Time.deltaTime;
				CheckTimeRedirection();
			}
			TrackInput();
		}
	}

	private void TrackInput()
	{
		if (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began))
		{
			OnClick();
		}
	}

	private void InitializeTracking()
	{
		if (!(playableSettings == null))
		{
			isTrackingClicks = playableSettings.enableClickRedirection;
			isTrackingTime = playableSettings.enableTimeRedirection;
			ResetCounters();
		}
	}

	public void ResetCounters()
	{
		totalClicks = 0;
		timeElapsed = 0f;
		hasRedirected = false;
	}

	public void OnClick()
	{
		if (hasRedirected)
		{
			TriggerStoreRedirection("Redirect after first redirection");
		}
		else if (isTrackingClicks && !(playableSettings == null) && playableSettings.enableClickRedirection)
		{
			totalClicks++;
			if (totalClicks >= playableSettings.clicksToRedirect)
			{
				TriggerStoreRedirection("Click count reached");
			}
		}
	}

	public void OnThrow()
	{
		if (hasRedirected)
		{
			TriggerStoreRedirection("Redirect after first redirection");
		}
		else if (isTracking && !(playableSettings == null) && playableSettings.redirectAfterThrow)
		{
			StartCoroutine(RedirectAfterThrowCoroutine());
		}
	}

	private IEnumerator RedirectAfterThrowCoroutine()
	{
		yield return new WaitForSeconds(playableSettings.redirectDelayAfterThrow);
		TriggerStoreRedirection("After throw");
	}

	public void CheckClickRedirection()
	{
		if (!(playableSettings == null) && playableSettings.enableClickRedirection && totalClicks >= playableSettings.clicksToRedirect)
		{
			TriggerStoreRedirection("Click count reached");
		}
	}

	public void CheckTimeRedirection()
	{
		if (!(playableSettings == null) && playableSettings.enableTimeRedirection && isTrackingTime && !hasRedirected && timeElapsed >= playableSettings.timeToRedirect)
		{
			TriggerStoreRedirection("Time limit reached");
		}
	}

	private void TriggerStoreRedirection(string reason)
	{
		if (!hasRedirected)
		{
			hasRedirected = true;
		}
		Analytics.LogEvent("Store Redirect - " + reason, 1);
		Playable.InstallFullGame();
		LifeCycle.GameEnded();
	}

	public int GetTotalClicks()
	{
		return totalClicks;
	}

	public float GetTimeElapsed()
	{
		return timeElapsed;
	}

	public bool HasRedirected()
	{
		return hasRedirected;
	}

	public void TriggerManualRedirect(string reason = "Manual redirect")
	{
		TriggerStoreRedirection(reason);
	}

	public void SetTrackingEnabled(bool enabled)
	{
		isTracking = enabled;
	}

	public void ResetAllCounters()
	{
		ResetCounters();
	}

	public void ClearRedirectState()
	{
		hasRedirected = false;
	}
}
