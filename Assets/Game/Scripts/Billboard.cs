using UnityEngine;

namespace MyBox
{
	[ExecuteAlways]
	public class Billboard : MonoBehaviour
	{
		public Transform facedObject;

		private Camera mainCam;
		private Transform mainCamTransform;

		private void Awake()
		{
			mainCam = Camera.main;

			if (mainCam != null)
			{
				mainCamTransform = mainCam.transform;
			}
		}

		private void Update()
		{
			if (facedObject != null)
			{
				transform.LookAt(facedObject);
			}
			else if (mainCam != null)
			{
				//transform.LookAt(mainCamTransform);
				transform.forward = mainCamTransform.forward;
			}
		}
	}
}

