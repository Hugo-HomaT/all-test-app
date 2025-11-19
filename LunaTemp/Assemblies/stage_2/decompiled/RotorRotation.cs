using UnityEngine;

public class RotorRotation : MonoBehaviour
{
	public enum RotationAxis
	{
		X,
		Y,
		Z
	}

	public RotationAxis rotationAxis = RotationAxis.Y;

	public float rotationSpeed = 300f;

	private void Update()
	{
		Vector3 axis = Vector3.zero;
		switch (rotationAxis)
		{
		case RotationAxis.X:
			axis = Vector3.right;
			break;
		case RotationAxis.Y:
			axis = Vector3.up;
			break;
		case RotationAxis.Z:
			axis = Vector3.forward;
			break;
		}
		base.transform.Rotate(axis, rotationSpeed * Time.deltaTime);
	}
}
