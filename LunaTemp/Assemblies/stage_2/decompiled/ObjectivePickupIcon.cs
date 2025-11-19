using System;
using System.Collections;
using UnityEngine;
using UnityEngine.UI;

[RequireComponent(typeof(RectTransform), typeof(Image))]
public class ObjectivePickupIcon : MonoBehaviour
{
	public Image iconImage;

	public RectTransform rectTransform;

	private Coroutine _playRoutine;

	private void Awake()
	{
		if (rectTransform == null)
		{
			rectTransform = GetComponent<RectTransform>();
		}
		if (iconImage == null)
		{
			iconImage = GetComponent<Image>();
		}
	}

	public void Play(Sprite sprite, Vector2 start, Vector2 controlA, Vector2 controlB, Vector2 endPoint, float duration, float startScale, float endScale, Action onComplete)
	{
		if (rectTransform == null || iconImage == null)
		{
			Awake();
		}
		iconImage.sprite = sprite;
		rectTransform.anchoredPosition = start;
		Vector3 startScaleVec = Vector3.one * startScale;
		Vector3 endScaleVec = Vector3.one * endScale;
		rectTransform.localScale = startScaleVec;
		base.gameObject.SetActive(true);
		if (_playRoutine != null)
		{
			StopCoroutine(_playRoutine);
			_playRoutine = null;
		}
		_playRoutine = StartCoroutine(PlayRoutine(start, controlA, controlB, endPoint, Mathf.Max(0.01f, duration), startScaleVec, endScaleVec, onComplete));
	}

	public void StopAndHide()
	{
		if (_playRoutine != null)
		{
			StopCoroutine(_playRoutine);
			_playRoutine = null;
		}
		base.gameObject.SetActive(false);
		rectTransform.localScale = Vector3.one;
	}

	private IEnumerator PlayRoutine(Vector2 start, Vector2 controlA, Vector2 controlB, Vector2 endPoint, float duration, Vector3 startScaleVec, Vector3 endScaleVec, Action onComplete)
	{
		float elapsed = 0f;
		while (elapsed < duration)
		{
			float t = Mathf.Clamp01(elapsed / duration);
			Vector2 pos = EvaluateCubicBezier(start, controlA, controlB, endPoint, t);
			rectTransform.anchoredPosition = pos;
			rectTransform.localScale = Vector3.Lerp(startScaleVec, endScaleVec, t);
			elapsed += Time.deltaTime;
			yield return null;
		}
		rectTransform.localScale = endScaleVec;
		onComplete?.Invoke();
		_playRoutine = null;
	}

	private static Vector2 EvaluateCubicBezier(Vector2 a, Vector2 b, Vector2 c, Vector2 d, float t)
	{
		float oneMinusT = 1f - t;
		float oneMinusTSqr = oneMinusT * oneMinusT;
		float tSqr = t * t;
		return oneMinusTSqr * oneMinusT * a + 3f * oneMinusTSqr * t * b + 3f * oneMinusT * tSqr * c + tSqr * t * d;
	}
}
