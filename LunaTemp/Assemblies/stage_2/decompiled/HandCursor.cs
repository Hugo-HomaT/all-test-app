using UnityEngine;
using UnityEngine.UI;

public class HandCursor : MonoBehaviour
{
	public Image cursorImage;

	private bool _forceHidden;

	private void Start()
	{
		cursorImage.enabled = false;
		cursorImage.sprite = PlayableSettings.instance.cursors[(int)PlayableSettings.instance.handCursor];
		cursorImage.transform.localScale = Vector3.one * PlayableSettings.instance.cursorScale;
	}

	private void Update()
	{
		if (PlayableSettings.instance.enableHandCursor && !_forceHidden)
		{
			base.transform.position = Input.mousePosition;
			if (Input.GetMouseButtonDown(0))
			{
				cursorImage.enabled = true;
			}
			if (Input.GetMouseButtonUp(0))
			{
				cursorImage.enabled = false;
			}
		}
	}

	public void SetForceHidden(bool hidden)
	{
		_forceHidden = hidden;
		if (cursorImage != null)
		{
			cursorImage.enabled = !hidden && PlayableSettings.instance.enableHandCursor;
		}
	}
}
