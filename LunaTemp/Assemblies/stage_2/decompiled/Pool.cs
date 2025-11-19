using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class Pool<T> where T : MonoBehaviour
{
	private T prefab;

	private Transform parent;

	private readonly List<T> objects;

	public Pool(T prefab, Transform parent, int initialSize)
	{
		objects = new List<T>();
		this.parent = parent;
		this.prefab = prefab;
		for (int i = 0; i < initialSize; i++)
		{
			Grow();
		}
	}

	private T Grow()
	{
		T newObject = Object.Instantiate(prefab, parent);
		newObject.gameObject.SetActive(false);
		objects.Add(newObject);
		return newObject;
	}

	public void Dispose(T obj)
	{
		obj.gameObject.SetActive(false);
		obj.transform.position = Vector3.zero;
	}

	public T Get(bool growIfFull)
	{
		T result = null;
		foreach (T obj2 in objects.Where((T obj) => !obj.gameObject.activeInHierarchy))
		{
			result = obj2;
		}
		if (!(Object)result)
		{
			if (!growIfFull)
			{
				return null;
			}
			result = Grow();
		}
		result.gameObject.SetActive(true);
		return result;
	}
}
