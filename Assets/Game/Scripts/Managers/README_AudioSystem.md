# Audio System for Playable

## Overview
This is an efficient sound system designed specifically for Unity playables with Luna integration. It provides optimized performance through audio source pooling and proper mute/unmute handling.

## Features
- **Audio Source Pooling**: Uses a pool of AudioSources to handle multiple concurrent sounds efficiently
- **Luna Integration**: Automatically handles mute/unmute events from Luna
- **Volume Control**: Separate volume controls for Music, SFX, and UI sounds
- **PlayableSettings Integration**: Audio clips and volumes are configurable through Luna Playground
- **Performance Optimized**: Minimal memory allocation and efficient sound management

## Setup Instructions

### 1. Create AudioManager
- Add the `AudioManagerSetup` component to any GameObject in your scene
- The AudioManager will be created automatically on Start
- Or manually create an AudioManager GameObject and add the `AudioManager` component

### 2. Configure Audio Clips
In the PlayableSettings (Luna Playground), assign your audio clips:
- **Win Sound**: Played when player wins
- **Tower Hit Sound**: Played when tower is hit
- **Shoot Sound**: Played when player shoots
- **Fail Sound**: Played when player fails
- **Intro Sound**: Played at the start of the playable

### 3. Volume Settings
Configure volumes in PlayableSettings:
- **Music Volume**: For intro/background music
- **SFX Volume**: For game sound effects (shoot, tower hit)
- **UI Volume**: For UI sounds (win, fail)

## Usage

### Playing Sounds
```csharp
// Play specific sound effects
AudioManager.instance.PlayWinSound();
AudioManager.instance.PlayTowerHitSound();
AudioManager.instance.PlayShootSound();
AudioManager.instance.PlayFailSound();
AudioManager.instance.PlayIntroSound();

// Or use the generic method
AudioManager.instance.PlaySound(SoundEffect.Win);
AudioManager.instance.PlaySound(SoundEffect.Shoot, volume: 0.8f, pitch: 1.2f);
```

### Volume Control
```csharp
// Set volumes programmatically
AudioManager.instance.SetMusicVolume(0.7f);
AudioManager.instance.SetSFXVolume(0.9f);
AudioManager.instance.SetUIVolume(0.8f);

// Stop all sounds
AudioManager.instance.StopAllSounds();
```

## Sound Events Integration
The system is already integrated with the GameManager:
- **Intro Sound**: Plays when the game starts
- **Shoot Sound**: Plays when player shoots (`OnPlayerShot()`)
- **Tower Hit Sound**: Plays when tower is hit (`OnTowerHit()`)
- **Win Sound**: Plays when player wins (objective completed)
- **Fail Sound**: Plays when player fails (timeout or tower miss)

## Performance Features
- **Audio Source Pool**: Reuses AudioSources to avoid garbage collection
- **Automatic Cleanup**: Returns AudioSources to pool when finished
- **Efficient Memory Usage**: Minimal allocations during runtime
- **Luna Mute Integration**: Properly handles platform mute/unmute events

## File Structure
- `AudioManager.cs`: Main audio management system
- `AudioManagerSetup.cs`: Helper script for easy setup
- `SoundEffect.cs`: Enum for different sound types
- `PlayableSettings.cs`: Configuration for audio clips and volumes

## Notes
- The system automatically handles Luna's mute/unmute events
- Audio clips are loaded from PlayableSettings for easy configuration
- The AudioManager is a singleton and persists across scenes
- All sound calls are null-safe (using `?.` operator)
