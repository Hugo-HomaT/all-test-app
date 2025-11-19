using System.Collections.Generic;
using UnityEngine;

public class FloatingFeedback : MonoBehaviour
{
	[SerializeField]
	private GameObject prefab;

	[SerializeField]
	private List<FloatingText> pool = new List<FloatingText>();

	[SerializeField]
	private int poolSize = 10;

	public void Show(Vector3 worldPos)
	{
		if (pool.Count != 0)
		{
			FloatingText ft = pool[0];
			pool.RemoveAt(0);
			pool.Add(ft);
			worldPos.x += Random.Range(-0.25f, 0.25f);
			worldPos.z += Random.Range(-0.25f, 0.25f);
			ft.Show(worldPos);
		}
	}
}
