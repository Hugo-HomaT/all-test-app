using UnityEngine;

namespace ToonyColorsPro.Runtime
{
	[ExecuteInEditMode]
	[RequireComponent(typeof(Camera))]
	public class TCP2_CameraDepth : MonoBehaviour
	{
		public bool RenderDepth = true;

		private void OnEnable()
		{
			SetCameraDepth();
		}

		private void OnValidate()
		{
			SetCameraDepth();
		}

		private void SetCameraDepth()
		{
			Camera cam = GetComponent<Camera>();
			if (RenderDepth)
			{
				cam.depthTextureMode |= DepthTextureMode.Depth;
			}
			else
			{
				cam.depthTextureMode &= ~DepthTextureMode.Depth;
			}
		}
	}
}
