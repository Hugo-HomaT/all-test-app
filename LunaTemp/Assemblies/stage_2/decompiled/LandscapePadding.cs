using UnityEngine;

public class LandscapePadding : MonoBehaviour
{
	public RectTransform target;

	public bool moveLeft = true;

	public float percent = 0.04f;

	private bool lastLandscape;

	private int lastW;

	private int lastH;

	private void Start()
	{
		lastW = Screen.width;
		lastH = Screen.height;
		Apply();
	}

	private void Update()
	{
		if (Screen.width != lastW || Screen.height != lastH)
		{
			lastW = Screen.width;
			lastH = Screen.height;
			Apply();
		}
	}

	private void Apply()
	{
		if (!(lastLandscape = Screen.width > Screen.height))
		{
			target.anchorMin = new Vector2(0f, target.anchorMin.y);
			target.anchorMax = new Vector2(1f, target.anchorMax.y);
		}
		else
		{
			float x = (moveLeft ? percent : (1f - percent));
			target.anchorMin = new Vector2(x, target.anchorMin.y);
			target.anchorMax = new Vector2(x, target.anchorMax.y);
		}
	}
}
