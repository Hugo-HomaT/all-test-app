using UnityEngine;

[ExecuteAlways]
public class CopyMainCameraFOV : MonoBehaviour
{
    [SerializeField] private Camera mainCamera;
    private Camera uiCamera;

    void Awake()
    {
        uiCamera = GetComponent<Camera>();
        if (!mainCamera) mainCamera = Camera.main;
    }

    void LateUpdate()
    {
        if (!mainCamera || !uiCamera) return;
        uiCamera.fieldOfView = mainCamera.fieldOfView;
    }
}