using UnityEngine;

public class Utils
{
	public void SwitchChild(Transform parent, int index)
	{
		for (int i = 0; i < parent.childCount; i++)
		{
			parent.GetChild(i).gameObject.SetActive(false);
		}
		parent.GetChild(index).gameObject.SetActive(true);
	}

	public int WrapIndex(int bounds, int index)
	{
		int result = index;
		if (result > bounds - 1)
		{
			result = 0;
		}
		if (result < 0)
		{
			result = bounds - 1;
		}
		return result;
	}
}
