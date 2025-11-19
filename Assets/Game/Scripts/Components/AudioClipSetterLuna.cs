using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class AudioClipSetterLuna : MonoBehaviour
{
    public bool playSoundAwake;
    public AudioSource source;

    private void Start()
    {
        // source.clip = PlayableSettings.instance.musicClipLuna;

        if (playSoundAwake)
        {
            source.Play();
        }
    }
}
