using UnityEngine;
using UnityEngine.UI;

public class MovingMovement : MonoBehaviour
{
	public Image movingImage;

	private void Start()
	{
		movingImage.enabled = PlayableSettings.instance.enableMovingVisual;
	}
}
