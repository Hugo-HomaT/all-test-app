using System.Collections;
using System.Collections.Generic;
using Luna.Unity;
using UnityEngine;

public class AudioManager : MonoBehaviour
{
	public static AudioManager instance;

	[Header("Audio Sources")]
	[SerializeField]
	private AudioSource musicSource;

	[SerializeField]
	private AudioSource sfxSource;

	[SerializeField]
	private AudioSource uiSource;

	[Header("Settings")]
	[SerializeField]
	private float musicVolume = 1f;

	[SerializeField]
	private float sfxVolume = 1f;

	[SerializeField]
	private float uiVolume = 1f;

	private Queue<AudioSource> audioSourcePool = new Queue<AudioSource>();

	private List<AudioSource> activeAudioSources = new List<AudioSource>();

	private const int POOL_SIZE = 10;

	private bool isMuted = false;

	private PlayableSettings PlayableSettings => PlayableSettings.instance;

	private void Awake()
	{
		if (instance == null)
		{
			instance = this;
			Object.DontDestroyOnLoad(base.gameObject);
			InitializeAudioSources();
			InitializePool();
		}
		else
		{
			Object.Destroy(base.gameObject);
		}
	}

	private void Start()
	{
		LifeCycle.OnMute += OnMute;
		LifeCycle.OnUnmute += OnUnmute;
		UpdateVolumesFromSettings();
	}

	private void UpdateVolumesFromSettings()
	{
		SetMusicVolume(musicVolume);
		SetSFXVolume(sfxVolume);
		SetUIVolume(uiVolume);
	}

	private void OnDestroy()
	{
		LifeCycle.OnMute -= OnMute;
		LifeCycle.OnUnmute -= OnUnmute;
	}

	private void InitializeAudioSources()
	{
		if (musicSource == null)
		{
			musicSource = base.gameObject.AddComponent<AudioSource>();
			musicSource.loop = true;
			musicSource.playOnAwake = false;
		}
		if (sfxSource == null)
		{
			sfxSource = base.gameObject.AddComponent<AudioSource>();
			sfxSource.loop = false;
			sfxSource.playOnAwake = false;
		}
		if (uiSource == null)
		{
			uiSource = base.gameObject.AddComponent<AudioSource>();
			uiSource.loop = false;
			uiSource.playOnAwake = false;
		}
	}

	private void InitializePool()
	{
		for (int i = 0; i < 10; i++)
		{
			GameObject poolObject = new GameObject($"PooledAudioSource_{i}");
			poolObject.transform.SetParent(base.transform);
			AudioSource pooledSource = poolObject.AddComponent<AudioSource>();
			pooledSource.loop = false;
			pooledSource.playOnAwake = false;
			poolObject.SetActive(false);
			audioSourcePool.Enqueue(pooledSource);
		}
	}

	public void PlaySound(SoundEffect soundEffect, float volume = 1f, float pitch = 1f)
	{
		if (isMuted)
		{
			return;
		}
		AudioClip clipToPlay = GetAudioClip(soundEffect);
		if (!(clipToPlay == null))
		{
			AudioSource sourceToUse = GetAvailableAudioSource();
			if (!(sourceToUse == null))
			{
				sourceToUse.clip = clipToPlay;
				sourceToUse.volume = volume * GetVolumeForSoundType(soundEffect);
				sourceToUse.pitch = pitch;
				sourceToUse.Play();
				StartCoroutine(ReturnToPoolWhenFinished(sourceToUse));
			}
		}
	}

	public void PlaySoundOneShot(SoundEffect soundEffect, float volume = 1f, float pitch = 1f)
	{
		if (isMuted)
		{
			return;
		}
		AudioClip clipToPlay = GetAudioClip(soundEffect);
		if (!(clipToPlay == null))
		{
			AudioSource sourceToUse = GetAvailableAudioSource();
			if (!(sourceToUse == null))
			{
				sourceToUse.volume = volume * GetVolumeForSoundType(soundEffect);
				sourceToUse.pitch = pitch;
				sourceToUse.PlayOneShot(clipToPlay);
				StartCoroutine(ReturnToPoolWhenFinished(sourceToUse));
			}
		}
	}

	private AudioClip GetAudioClip(SoundEffect soundEffect)
	{
		if (PlayableSettings == null)
		{
			return null;
		}
		if (1 == 0)
		{
		}
		AudioClip result;
		switch (soundEffect)
		{
		case SoundEffect.Win:
			result = PlayableSettings.winSound;
			break;
		case SoundEffect.TowerHit:
			result = PlayableSettings.towerHitSound;
			break;
		case SoundEffect.Shoot:
			result = PlayableSettings.shootSound;
			break;
		case SoundEffect.Fail:
			result = PlayableSettings.failSound;
			break;
		case SoundEffect.Intro:
			result = PlayableSettings.introSound;
			break;
		case SoundEffect.HoleGrow:
			result = PlayableSettings.holeGrowSound;
			break;
		default:
			result = null;
			break;
		}
		if (1 == 0)
		{
		}
		return result;
	}

	private AudioSource GetAvailableAudioSource()
	{
		if (audioSourcePool.Count > 0)
		{
			AudioSource pooledSource = audioSourcePool.Dequeue();
			pooledSource.gameObject.SetActive(true);
			activeAudioSources.Add(pooledSource);
			return pooledSource;
		}
		return sfxSource;
	}

	private float GetVolumeForSoundType(SoundEffect soundEffect)
	{
		if (1 == 0)
		{
		}
		float result;
		switch (soundEffect)
		{
		case SoundEffect.Intro:
			result = musicVolume;
			break;
		case SoundEffect.Win:
		case SoundEffect.Fail:
			result = uiVolume;
			break;
		default:
			result = sfxVolume;
			break;
		}
		if (1 == 0)
		{
		}
		return result;
	}

	private IEnumerator ReturnToPoolWhenFinished(AudioSource source)
	{
		yield return new WaitUntil(() => !source.isPlaying);
		if (activeAudioSources.Contains(source))
		{
			activeAudioSources.Remove(source);
			source.gameObject.SetActive(false);
			audioSourcePool.Enqueue(source);
		}
	}

	public void SetMusicVolume(float volume)
	{
		musicVolume = Mathf.Clamp01(volume);
		musicSource.volume = musicVolume;
	}

	public void SetSFXVolume(float volume)
	{
		sfxVolume = Mathf.Clamp01(volume);
		sfxSource.volume = sfxVolume;
	}

	public void SetUIVolume(float volume)
	{
		uiVolume = Mathf.Clamp01(volume);
		uiSource.volume = uiVolume;
	}

	public void StopAllSounds()
	{
		musicSource.Stop();
		sfxSource.Stop();
		uiSource.Stop();
		foreach (AudioSource source in activeAudioSources)
		{
			if (source != null && source.isPlaying)
			{
				source.Stop();
			}
		}
	}

	private void OnMute()
	{
		isMuted = true;
		AudioListener.volume = 0f;
	}

	private void OnUnmute()
	{
		isMuted = false;
		AudioListener.volume = 1f;
	}

	public void PlayWinSound()
	{
		PlaySound(SoundEffect.Win);
	}

	public void PlayTowerHitSound()
	{
		PlaySound(SoundEffect.TowerHit);
	}

	public void PlayShootSound()
	{
		PlaySound(SoundEffect.Shoot);
	}

	public void PlayFailSound()
	{
		PlaySound(SoundEffect.Fail);
	}

	public void PlayIntroSound()
	{
		PlaySound(SoundEffect.Intro);
	}

	public void PlayHoleGrowSound()
	{
		PlaySound(SoundEffect.HoleGrow);
	}
}
