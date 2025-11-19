using System;
using System.Collections;
using Cinemachine;
using UnityEngine;

public class IntroManager : MonoBehaviour
{
	public static IntroManager instance;

	[Header("Intro Settings")]
	[SerializeField]
	private AnimationCurve cameraTransitionCurve = AnimationCurve.EaseInOut(0f, 0f, 1f, 1f);

	[Header("Camera References")]
	[SerializeField]
	private Transform playerCameraRef;

	[SerializeField]
	private CinemachineVirtualCamera virtualCameraRef;

	[SerializeField]
	private CinemachineCameraOffset cameraOffsetRef;

	[Header("References")]
	[SerializeField]
	private HoleController holeController;

	[SerializeField]
	private HandCursor handCursorRef;

	private Transform playerCamera;

	private CinemachineVirtualCamera virtualCamera;

	private CinemachineCameraOffset cameraOffset;

	private bool isIntroActive = false;

	private bool introCompleted = false;

	private bool isIntroTextVisible = false;

	private bool isIntroTextHidden = false;

	public Action OnIntroStarted;

	public Action OnIntroCompleted;

	private PlayableSettings PlayableSettings => PlayableSettings.instance;

	public bool IsIntroTextVisible => isIntroTextVisible && !isIntroTextHidden;

	public bool IsIntroTextHidden => isIntroTextHidden;

	public bool IsIntroActive => isIntroActive;

	public bool IsIntroCompleted => introCompleted;

	private void Awake()
	{
		if (instance == null)
		{
			instance = this;
		}
		else
		{
			UnityEngine.Object.Destroy(base.gameObject);
		}
	}

	private void Start()
	{
		playerCamera = ((playerCameraRef != null) ? playerCameraRef : PlayableSettings.instance?.playerCamera);
		virtualCamera = ((virtualCameraRef != null) ? virtualCameraRef : playerCamera?.GetComponent<CinemachineVirtualCamera>());
		cameraOffset = ((cameraOffsetRef != null) ? cameraOffsetRef : playerCamera?.GetComponent<CinemachineCameraOffset>());
		if (PlayableSettings != null && PlayableSettings.enableIntro && !introCompleted)
		{
			StartIntro();
		}
	}

	public void StartIntro()
	{
		if (!isIntroActive && !introCompleted)
		{
			isIntroActive = true;
			OnIntroStarted?.Invoke();
			StartIntroText();
			StartCoroutine(IntroSequence());
			if (PlayableSettings != null && PlayableSettings.blockPlayerInput)
			{
				StartCoroutine(BlockInputSequence());
			}
		}
	}

	private IEnumerator BlockInputSequence()
	{
		SetPlayerInputEnabled(false);
		if (PlayableSettings.blockInputDuration > 0f)
		{
			yield return new WaitForSeconds(PlayableSettings.blockInputDuration);
			SetPlayerInputEnabled(true);
			yield break;
		}
		yield return new WaitUntil(() => introCompleted);
		SetPlayerInputEnabled(true);
	}

	private IEnumerator IntroSequence()
	{
		if (playerCamera != null && PlayableSettings != null)
		{
			playerCamera.eulerAngles = PlayableSettings.startCameraAngle;
			if (cameraOffset != null)
			{
				cameraOffset.m_Offset = PlayableSettings.startCameraPosition;
			}
			if (virtualCamera != null)
			{
				virtualCamera.m_Lens.FieldOfView = PlayableSettings.startFOV;
			}
		}
		if (PlayableSettings != null)
		{
			bool hasCameraTransition = PlayableSettings.cameraTransitionDuration > 0f;
			bool hasFovTransition = PlayableSettings.fovTransitionDuration > 0f;
			if (hasCameraTransition && hasFovTransition)
			{
				yield return StartCoroutine(TransitionCameraAndFOV());
			}
			else if (hasCameraTransition)
			{
				if (PlayableSettings.cameraTransitionDelay > 0f)
				{
					yield return new WaitForSeconds(PlayableSettings.cameraTransitionDelay);
				}
				yield return StartCoroutine(TransitionCameraAngle());
			}
			else if (hasFovTransition)
			{
				yield return StartCoroutine(TransitionFOV());
			}
		}
		float remainingTime = 0.2f;
		if (remainingTime > 0f)
		{
			yield return new WaitForSeconds(remainingTime);
		}
		CompleteIntro();
	}

	private IEnumerator TransitionCameraAngle()
	{
		if (PlayableSettings == null)
		{
			yield break;
		}
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
			yield return null;
		}
		if (playerCamera != null)
		{
			playerCamera.eulerAngles = endAngle;
			if (cameraOffset != null)
			{
				cameraOffset.m_Offset = endPosition;
			}
		}
	}

	private IEnumerator TransitionFOV()
	{
		if (!(PlayableSettings == null) && !(virtualCamera == null))
		{
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
				float currentFOV = Mathf.Lerp(startFOV, endFOV, curveValue);
				virtualCamera.m_Lens.FieldOfView = currentFOV;
				yield return null;
			}
			virtualCamera.m_Lens.FieldOfView = endFOV;
		}
	}

	private IEnumerator TransitionCameraAndFOV()
	{
		if (PlayableSettings == null)
		{
			yield break;
		}
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
		float maxDuration = Mathf.Max(cameraTransitionDelay + cameraTransitionDuration, fovTransitionDelay + fovTransitionDuration);
		float elapsedTime = 0f;
		float cameraElapsedTime = 0f;
		float fovElapsedTime = 0f;
		bool cameraTransitionStarted = false;
		bool fovTransitionStarted = false;
		while (elapsedTime < maxDuration)
		{
			elapsedTime += Time.deltaTime;
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
			else if (cameraTransitionStarted && playerCamera != null)
			{
				playerCamera.eulerAngles = endAngle;
				if (cameraOffset != null)
				{
					cameraOffset.m_Offset = endPosition;
				}
			}
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
					virtualCamera.m_Lens.FieldOfView = endFOV;
				}
			}
			yield return null;
		}
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
		OnIntroCompleted?.Invoke();
	}

	private void SetPlayerInputEnabled(bool enabled)
	{
		if (holeController != null)
		{
			holeController.SetInputEnabled(enabled);
		}
		if (handCursorRef != null)
		{
			handCursorRef.enabled = enabled;
			if (!enabled)
			{
				handCursorRef.gameObject.SetActive(false);
			}
			else
			{
				handCursorRef.gameObject.SetActive(true);
			}
		}
	}

	private void StartIntroText()
	{
		if (!isIntroTextVisible && !isIntroTextHidden && !(PlayableSettings == null) && PlayableSettings.showIntroText)
		{
			isIntroTextVisible = true;
			isIntroTextHidden = false;
			if (UIManager.instance != null)
			{
				UIManager.instance.ShowIntroText(PlayableSettings.introText);
			}
			if (PlayableSettings.hideIntroTextOnPlayerTouch && PlayableSettings.introTextHideAfterDuration)
			{
				StartCoroutine(WaitForTouchOrDuration());
			}
			else if (PlayableSettings.hideIntroTextOnPlayerTouch)
			{
				StartCoroutine(WaitForTouch());
			}
			else if (PlayableSettings.introTextHideAfterDuration)
			{
				StartCoroutine(WaitForDuration());
			}
		}
	}

	private IEnumerator WaitForTouchOrDuration()
	{
		float duration = PlayableSettings.introTextDuration;
		float elapsedTime = 0f;
		while (elapsedTime < duration && !isIntroTextHidden)
		{
			if (!isIntroActive && (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)))
			{
				HideIntroText();
				yield break;
			}
			elapsedTime += Time.deltaTime;
			yield return null;
		}
		if (!isIntroTextHidden)
		{
			HideIntroText();
		}
	}

	private IEnumerator WaitForTouch()
	{
		while (!isIntroTextHidden)
		{
			if (!isIntroActive && (Input.GetMouseButtonDown(0) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)))
			{
				HideIntroText();
				break;
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
		if (!isIntroTextHidden)
		{
			isIntroTextHidden = true;
			isIntroTextVisible = false;
			if (UIManager.instance != null)
			{
				UIManager.instance.HideIntroText();
			}
		}
	}

	public void ForceHideIntroText()
	{
		HideIntroText();
	}

	public void SkipIntro()
	{
		if (!isIntroActive)
		{
			return;
		}
		StopAllCoroutines();
		if (playerCamera != null && PlayableSettings != null)
		{
			playerCamera.eulerAngles = PlayableSettings.endCameraAngle;
			if (cameraOffset != null)
			{
				cameraOffset.m_Offset = PlayableSettings.endCameraPosition;
			}
			if (virtualCamera != null)
			{
				virtualCamera.m_Lens.FieldOfView = PlayableSettings.endFOV;
			}
		}
		CompleteIntro();
	}

	public void ConfigureIntro(bool enable, float duration, Vector3 startAngle, Vector3 endAngle, float transitionDuration)
	{
	}
}
