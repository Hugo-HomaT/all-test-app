using UnityEngine;

public class PlayerMovement
{
	private Vector3 movementDirection;

	private Vector3 initialMousePosition;

	private Vector3 currentMousePosition;

	private bool isTouching = false;

	private const float minSpeed = 0.1f;

	private const float speedMultiplier = 0.1f;

	public void UpdateInputs(Transform target)
	{
		if (Input.GetMouseButtonDown(0))
		{
			initialMousePosition = Input.mousePosition;
			currentMousePosition = Input.mousePosition;
			isTouching = true;
			if (UIManager.instance != null)
			{
				UIManager.instance.OnPlayerTouch();
			}
			if (PlayableSettings.instance.enableFakeControl)
			{
				HoleController holeController = target.GetComponent<HoleController>();
				if (holeController != null && !holeController.IsFakeMoving)
				{
					holeController.StartFakeMovement();
					isTouching = false;
					return;
				}
			}
		}
		if (Input.GetMouseButtonUp(0))
		{
			movementDirection = Vector3.zero;
			isTouching = false;
			if (UIManager.instance != null)
			{
				UIManager.instance.OnPlayerTouchRelease();
			}
		}
		if (Input.GetMouseButton(0) && isTouching)
		{
			currentMousePosition = Input.mousePosition;
		}
	}

	public void ApplyMovement(Transform transform, float moveSpeed)
	{
		if (isTouching)
		{
			Vector3 mouseDelta = currentMousePosition - initialMousePosition;
			movementDirection = new Vector3(mouseDelta.x, 0f, mouseDelta.y).normalized;
			float dragDistance = new Vector3(mouseDelta.x, 0f, mouseDelta.y).magnitude;
			float speedFactor = Mathf.Clamp(dragDistance * 0.1f, 0.1f, 1f);
			transform.Translate(movementDirection * moveSpeed * speedFactor * Time.fixedDeltaTime);
		}
	}
}
