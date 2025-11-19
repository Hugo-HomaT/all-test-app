using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public static AudioManager instance;
    
    [Header("Audio Sources")]
    [SerializeField] private AudioSource musicSource;
    [SerializeField] private AudioSource sfxSource;
    [SerializeField] private AudioSource uiSource;
    
    [Header("Settings")]
    [SerializeField] private float musicVolume = 1f;
    [SerializeField] private float sfxVolume = 1f;
    [SerializeField] private float uiVolume = 1f;
    
    private PlayableSettings PlayableSettings => PlayableSettings.instance;
    
    // Audio source pool for performance
    private Queue<AudioSource> audioSourcePool = new Queue<AudioSource>();
    private List<AudioSource> activeAudioSources = new List<AudioSource>();
    private const int POOL_SIZE = 10;
    
    // Luna integration
    private bool isMuted = false;
    
    private void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
            InitializeAudioSources();
            InitializePool();
        }
        else
        {
            Destroy(gameObject);
        }
    }
    
    private void Start()
    {

        
        // Update volumes from PlayableSettings
        UpdateVolumesFromSettings();
    }
    
    private void UpdateVolumesFromSettings()
    {
        // Use fixed volumes from inspector settings
        SetMusicVolume(musicVolume);
        SetSFXVolume(sfxVolume);
        SetUIVolume(uiVolume);
    }
    
    private void OnDestroy()
    {

    }
    
    private void InitializeAudioSources()
    {
        // Create main audio sources if not assigned
        if (musicSource == null)
        {
            musicSource = gameObject.AddComponent<AudioSource>();
            musicSource.loop = true;
            musicSource.playOnAwake = false;
        }
        
        if (sfxSource == null)
        {
            sfxSource = gameObject.AddComponent<AudioSource>();
            sfxSource.loop = false;
            sfxSource.playOnAwake = false;
        }
        
        if (uiSource == null)
        {
            uiSource = gameObject.AddComponent<AudioSource>();
            uiSource.loop = false;
            uiSource.playOnAwake = false;
        }
    }
    
    private void InitializePool()
    {
        // Create pool of audio sources for concurrent sound effects
        for (int i = 0; i < POOL_SIZE; i++)
        {
            GameObject poolObject = new GameObject($"PooledAudioSource_{i}");
            poolObject.transform.SetParent(transform);
            AudioSource pooledSource = poolObject.AddComponent<AudioSource>();
            pooledSource.loop = false;
            pooledSource.playOnAwake = false;
            poolObject.SetActive(false);
            audioSourcePool.Enqueue(pooledSource);
        }
    }
    
    public void PlaySound(SoundEffect soundEffect, float volume = 1f, float pitch = 1f)
    {
        if (isMuted) return;
        
        AudioClip clipToPlay = GetAudioClip(soundEffect);
        if (clipToPlay == null) return;
        
        AudioSource sourceToUse = GetAvailableAudioSource();
        if (sourceToUse == null) return;
        
        sourceToUse.clip = clipToPlay;
        sourceToUse.volume = volume * GetVolumeForSoundType(soundEffect);
        sourceToUse.pitch = pitch;
        sourceToUse.Play();
        
        // Return to pool when finished
        StartCoroutine(ReturnToPoolWhenFinished(sourceToUse));
    }
    
    public void PlaySoundOneShot(SoundEffect soundEffect, float volume = 1f, float pitch = 1f)
    {
        if (isMuted) return;
        
        AudioClip clipToPlay = GetAudioClip(soundEffect);
        if (clipToPlay == null) return;
        
        AudioSource sourceToUse = GetAvailableAudioSource();
        if (sourceToUse == null) return;
        
        sourceToUse.volume = volume * GetVolumeForSoundType(soundEffect);
        sourceToUse.pitch = pitch;
        sourceToUse.PlayOneShot(clipToPlay);
        
        // Return to pool when finished
        StartCoroutine(ReturnToPoolWhenFinished(sourceToUse));
    }
    
    private AudioClip GetAudioClip(SoundEffect soundEffect)
    {
        if (PlayableSettings == null) return null;
        
        return soundEffect switch
        {
            SoundEffect.Win => PlayableSettings.winSound,
            SoundEffect.TowerHit => PlayableSettings.towerHitSound,
            SoundEffect.Shoot => PlayableSettings.shootSound,
            SoundEffect.Fail => PlayableSettings.failSound,
            SoundEffect.Intro => PlayableSettings.introSound,
            SoundEffect.HoleGrow => PlayableSettings.holeGrowSound,
            _ => null
        };
    }
    
    private AudioSource GetAvailableAudioSource()
    {
        // Try to get from pool first
        if (audioSourcePool.Count > 0)
        {
            AudioSource pooledSource = audioSourcePool.Dequeue();
            pooledSource.gameObject.SetActive(true);
            activeAudioSources.Add(pooledSource);
            return pooledSource;
        }
        
        // If pool is empty, use main sfx source
        return sfxSource;
    }
    
    private float GetVolumeForSoundType(SoundEffect soundEffect)
    {
        return soundEffect switch
        {
            SoundEffect.Intro => musicVolume,
            SoundEffect.Win or SoundEffect.Fail => uiVolume,
            _ => sfxVolume
        };
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
        
        // Stop all pooled sources
        foreach (var source in activeAudioSources)
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
    
    // Public methods for specific sound effects
    public void PlayWinSound() => PlaySound(SoundEffect.Win);
    public void PlayTowerHitSound() => PlaySound(SoundEffect.TowerHit);
    public void PlayShootSound() => PlaySound(SoundEffect.Shoot);
    public void PlayFailSound() => PlaySound(SoundEffect.Fail);
    public void PlayIntroSound() => PlaySound(SoundEffect.Intro);
    public void PlayHoleGrowSound() => PlaySound(SoundEffect.HoleGrow);
}

    public enum SoundEffect
    {
        Win,
        TowerHit,
        Shoot,
        Fail,
        Intro,
        HoleGrow
    }
