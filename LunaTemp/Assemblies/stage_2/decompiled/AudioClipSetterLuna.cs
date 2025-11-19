using UnityEngine;

public class AudioClipSetterLuna : MonoBehaviour
{
	public bool playSoundAwake;

	public AudioSource source;

	private void Start()
	{
		if (playSoundAwake)
		{
			source.Play();
		}
	}
}
