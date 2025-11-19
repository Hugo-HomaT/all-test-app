using System;
using UnityEngine;

[Serializable]
public class IntroManagerSetup : MonoBehaviour
{
	[Header("Intro Manager Setup")]
	[SerializeField]
	private bool createIntroManagerOnStart = true;

	private void Start()
	{
		if (createIntroManagerOnStart && IntroManager.instance == null)
		{
			CreateIntroManager();
		}
	}

	private void CreateIntroManager()
	{
		GameObject introManagerObject = new GameObject("IntroManager");
		introManagerObject.AddComponent<IntroManager>();
		introManagerObject.transform.SetParent(base.transform);
	}

	[ContextMenu("Create Intro Manager")]
	public void CreateIntroManagerManually()
	{
		if (IntroManager.instance == null)
		{
			CreateIntroManager();
		}
	}
}
