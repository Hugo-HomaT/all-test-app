using UnityEngine;

[ExecuteAlways]
public class CopyMainCameraFOV : MonoBehaviour
{
	[SerializeField]
	private Camera mainCamera;

	private Camera uiCamera;

	private void Awake()
	{
		uiCamera = GetComponent<Camera>();
		if (!mainCamera)
		{
			mainCamera = Camera.main;
		}
	}

	private void LateUpdate()
	{
		if ((bool)mainCamera && (bool)uiCamera)
		{
			uiCamera.fieldOfView = mainCamera.fieldOfView;
		}
	}
}
