using UnityEngine;

public class LandscapePaddingAnchor : MonoBehaviour
{
	public RectTransform target;

	public bool moveLeft = true;

	public float percent = 0.04f;

	private bool lastLandscape;

	private float originalMinX;

	private float originalMaxX;

	private bool originalStored;

	private int lastW;

	private int lastH;

	private void Start()
	{
		StoreOriginalAnchors();
		lastW = Screen.width;
		lastH = Screen.height;
		Apply(true);
	}

	private void Update()
	{
		if (Screen.width != lastW || Screen.height != lastH)
		{
			lastW = Screen.width;
			lastH = Screen.height;
			Apply(false);
		}
	}

	private void StoreOriginalAnchors()
	{
		if (!originalStored)
		{
			originalStored = true;
			originalMinX = target.anchorMin.x;
			originalMaxX = target.anchorMax.x;
		}
	}

	private void Apply(bool force)
	{
		bool landscape = Screen.width > Screen.height;
		if (force || landscape != lastLandscape)
		{
			lastLandscape = landscape;
			if (!landscape)
			{
				target.anchorMin = new Vector2(originalMinX, target.anchorMin.y);
				target.anchorMax = new Vector2(originalMaxX, target.anchorMax.y);
			}
			else
			{
				float delta = (moveLeft ? percent : (0f - percent));
				target.anchorMin = new Vector2(originalMinX + delta, target.anchorMin.y);
				target.anchorMax = new Vector2(originalMaxX + delta, target.anchorMax.y);
			}
		}
	}
}
