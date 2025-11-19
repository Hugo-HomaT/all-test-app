/**
 * @compiler Bridge.NET 17.9.40-luna
 */
Bridge.assembly("UnityScriptsCompiler", function ($asm, globals) {
    "use strict";

    /*AimArrow start.*/
    Bridge.define("AimArrow", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            arrowSprites: null,
            minAngle: 0,
            maxAngle: 0,
            speed: 0,
            visible: false,
            _angle: 0,
            _dir: 0
        },
        ctors: {
            init: function () {
                this.minAngle = -30.0;
                this.maxAngle = 30.0;
                this.speed = 120.0;
                this._dir = 1;
            }
        },
        methods: {
            /*AimArrow.OnEnable start.*/
            OnEnable: function () {
                this._angle = 0.0;
                this._dir = 1;
                this.SetVisible(false);
            },
            /*AimArrow.OnEnable end.*/

            /*AimArrow.Update start.*/
            Update: function () {
                if (this.visible) {
                    this._angle += this._dir * this.speed * UnityEngine.Time.deltaTime;
                    if (this._angle >= this.maxAngle) {
                        this._angle = this.maxAngle;
                        this._dir = -1;
                    } else if (this._angle <= this.minAngle) {
                        this._angle = this.minAngle;
                        this._dir = 1;
                    }
                    this.transform.localRotation = new pc.Quat().setFromEulerAngles_Unity( 0.0, this._angle, 0.0 );
                }
            },
            /*AimArrow.Update end.*/

            /*AimArrow.GetForward start.*/
            GetForward: function (reference) {
                return new pc.Quat().setFromEulerAngles_Unity( 0.0, this._angle, 0.0 ).transformVector( reference.forward );
            },
            /*AimArrow.GetForward end.*/

            /*AimArrow.SetVisible start.*/
            SetVisible: function (isVisible) {
                var $t;
                this.visible = isVisible;
                var r = { };
                if (this.TryGetComponent$1(UnityEngine.Renderer, r)) {
                    r.v.enabled = isVisible;
                }
                var componentsInChildren = this.GetComponentsInChildren(UnityEngine.Renderer);
                $t = Bridge.getEnumerator(componentsInChildren);
                try {
                    while ($t.moveNext()) {
                        var rr = $t.Current;
                        rr.enabled = isVisible;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*AimArrow.SetVisible end.*/

            /*AimArrow.SetArrowColor start.*/
            SetArrowColor: function (color) {
                var $t;
                if (this.arrowSprites == null) {
                    return;
                }
                var array = this.arrowSprites;
                $t = Bridge.getEnumerator(array);
                try {
                    while ($t.moveNext()) {
                        var spriteRenderer = $t.Current;
                        if (UnityEngine.Component.op_Inequality(spriteRenderer, null)) {
                            spriteRenderer.color = color.$clone();
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*AimArrow.SetArrowColor end.*/


        }
    });
    /*AimArrow end.*/

    /*AudioClipSetterLuna start.*/
    Bridge.define("AudioClipSetterLuna", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            playSoundAwake: false,
            source: null
        },
        methods: {
            /*AudioClipSetterLuna.Start start.*/
            Start: function () {
                if (this.playSoundAwake) {
                    this.source.Play();
                }
            },
            /*AudioClipSetterLuna.Start end.*/


        }
    });
    /*AudioClipSetterLuna end.*/

    /*AudioManager start.*/
    Bridge.define("AudioManager", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                POOL_SIZE: 0,
                instance: null
            },
            ctors: {
                init: function () {
                    this.POOL_SIZE = 10;
                }
            }
        },
        fields: {
            musicSource: null,
            sfxSource: null,
            uiSource: null,
            musicVolume: 0,
            sfxVolume: 0,
            uiVolume: 0,
            audioSourcePool: null,
            activeAudioSources: null,
            isMuted: false
        },
        props: {
            PlayableSettings: {
                get: function () {
                    return PlayableSettings.instance;
                }
            }
        },
        ctors: {
            init: function () {
                this.musicVolume = 1.0;
                this.sfxVolume = 1.0;
                this.uiVolume = 1.0;
                this.audioSourcePool = new (System.Collections.Generic.Queue$1(UnityEngine.AudioSource)).ctor();
                this.activeAudioSources = new (System.Collections.Generic.List$1(UnityEngine.AudioSource)).ctor();
                this.isMuted = false;
            }
        },
        methods: {
            /*AudioManager.Awake start.*/
            Awake: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(AudioManager.instance, null)) {
                    AudioManager.instance = this;
                    UnityEngine.Object.DontDestroyOnLoad(Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject);
                    this.InitializeAudioSources();
                    this.InitializePool();
                } else {
                    UnityEngine.Object.Destroy(Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject);
                }
            },
            /*AudioManager.Awake end.*/

            /*AudioManager.Start start.*/
            Start: function () {
                Luna.Unity.LifeCycle.addOnMute(Bridge.fn.cacheBind(this, this.OnMute));
                Luna.Unity.LifeCycle.addOnUnmute(Bridge.fn.cacheBind(this, this.OnUnmute));
                this.UpdateVolumesFromSettings();
            },
            /*AudioManager.Start end.*/

            /*AudioManager.UpdateVolumesFromSettings start.*/
            UpdateVolumesFromSettings: function () {
                this.SetMusicVolume(this.musicVolume);
                this.SetSFXVolume(this.sfxVolume);
                this.SetUIVolume(this.uiVolume);
            },
            /*AudioManager.UpdateVolumesFromSettings end.*/

            /*AudioManager.OnDestroy start.*/
            OnDestroy: function () {
                Luna.Unity.LifeCycle.removeOnMute(Bridge.fn.cacheBind(this, this.OnMute));
                Luna.Unity.LifeCycle.removeOnUnmute(Bridge.fn.cacheBind(this, this.OnUnmute));
            },
            /*AudioManager.OnDestroy end.*/

            /*AudioManager.InitializeAudioSources start.*/
            InitializeAudioSources: function () {
                if (UnityEngine.Component.op_Equality(this.musicSource, null)) {
                    this.musicSource = Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.AddComponent(UnityEngine.AudioSource);
                    this.musicSource.loop = true;
                    this.musicSource.playOnAwake = false;
                }
                if (UnityEngine.Component.op_Equality(this.sfxSource, null)) {
                    this.sfxSource = Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.AddComponent(UnityEngine.AudioSource);
                    this.sfxSource.loop = false;
                    this.sfxSource.playOnAwake = false;
                }
                if (UnityEngine.Component.op_Equality(this.uiSource, null)) {
                    this.uiSource = Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.AddComponent(UnityEngine.AudioSource);
                    this.uiSource.loop = false;
                    this.uiSource.playOnAwake = false;
                }
            },
            /*AudioManager.InitializeAudioSources end.*/

            /*AudioManager.InitializePool start.*/
            InitializePool: function () {
                for (var i = 0; i < 10; i = (i + 1) | 0) {
                    var poolObject = new UnityEngine.GameObject.$ctor2(System.String.format("PooledAudioSource_{0}", [Bridge.box(i, System.Int32)]));
                    poolObject.transform.SetParent(this.transform);
                    var pooledSource = poolObject.AddComponent(UnityEngine.AudioSource);
                    pooledSource.loop = false;
                    pooledSource.playOnAwake = false;
                    poolObject.SetActive(false);
                    this.audioSourcePool.Enqueue(pooledSource);
                }
            },
            /*AudioManager.InitializePool end.*/

            /*AudioManager.PlaySound start.*/
            PlaySound: function (soundEffect, volume, pitch) {
                if (volume === void 0) { volume = 1.0; }
                if (pitch === void 0) { pitch = 1.0; }
                if (this.isMuted) {
                    return;
                }
                var clipToPlay = this.GetAudioClip(soundEffect);
                if (!(clipToPlay == null)) {
                    var sourceToUse = this.GetAvailableAudioSource();
                    if (!(UnityEngine.Component.op_Equality(sourceToUse, null))) {
                        sourceToUse.clip = clipToPlay;
                        sourceToUse.volume = volume * this.GetVolumeForSoundType(soundEffect);
                        sourceToUse.pitch = pitch;
                        sourceToUse.Play();
                        this.StartCoroutine$1(this.ReturnToPoolWhenFinished(sourceToUse));
                    }
                }
            },
            /*AudioManager.PlaySound end.*/

            /*AudioManager.PlaySoundOneShot start.*/
            PlaySoundOneShot: function (soundEffect, volume, pitch) {
                if (volume === void 0) { volume = 1.0; }
                if (pitch === void 0) { pitch = 1.0; }
                if (this.isMuted) {
                    return;
                }
                var clipToPlay = this.GetAudioClip(soundEffect);
                if (!(clipToPlay == null)) {
                    var sourceToUse = this.GetAvailableAudioSource();
                    if (!(UnityEngine.Component.op_Equality(sourceToUse, null))) {
                        sourceToUse.volume = volume * this.GetVolumeForSoundType(soundEffect);
                        sourceToUse.pitch = pitch;
                        sourceToUse.PlayOneShot(clipToPlay);
                        this.StartCoroutine$1(this.ReturnToPoolWhenFinished(sourceToUse));
                    }
                }
            },
            /*AudioManager.PlaySoundOneShot end.*/

            /*AudioManager.GetAudioClip start.*/
            GetAudioClip: function (soundEffect) {
                if (UnityEngine.MonoBehaviour.op_Equality(this.PlayableSettings, null)) {
                    return null;
                }
                if (false) {
                }
                var result;
                switch (soundEffect) {
                    case SoundEffect.Win: 
                        result = this.PlayableSettings.winSound;
                        break;
                    case SoundEffect.TowerHit: 
                        result = this.PlayableSettings.towerHitSound;
                        break;
                    case SoundEffect.Shoot: 
                        result = this.PlayableSettings.shootSound;
                        break;
                    case SoundEffect.Fail: 
                        result = this.PlayableSettings.failSound;
                        break;
                    case SoundEffect.Intro: 
                        result = this.PlayableSettings.introSound;
                        break;
                    case SoundEffect.HoleGrow: 
                        result = this.PlayableSettings.holeGrowSound;
                        break;
                    default: 
                        result = null;
                        break;
                }
                if (false) {
                }
                return result;
            },
            /*AudioManager.GetAudioClip end.*/

            /*AudioManager.GetAvailableAudioSource start.*/
            GetAvailableAudioSource: function () {
                if (this.audioSourcePool.Count > 0) {
                    var pooledSource = this.audioSourcePool.Dequeue();
                    pooledSource.gameObject.SetActive(true);
                    this.activeAudioSources.add(pooledSource);
                    return pooledSource;
                }
                return this.sfxSource;
            },
            /*AudioManager.GetAvailableAudioSource end.*/

            /*AudioManager.GetVolumeForSoundType start.*/
            GetVolumeForSoundType: function (soundEffect) {
                if (false) {
                }
                var result;
                switch (soundEffect) {
                    case SoundEffect.Intro: 
                        result = this.musicVolume;
                        break;
                    case SoundEffect.Win: 
                    case SoundEffect.Fail: 
                        result = this.uiVolume;
                        break;
                    default: 
                        result = this.sfxVolume;
                        break;
                }
                if (false) {
                }
                return result;
            },
            /*AudioManager.GetVolumeForSoundType end.*/

            /*AudioManager.ReturnToPoolWhenFinished start.*/
            ReturnToPoolWhenFinished: function (source) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = new UnityEngine.WaitUntil(function () {
                                            return !source.isPlaying;
                                        });
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    if (this.activeAudioSources.contains(source)) {
                                            this.activeAudioSources.remove(source);
                                            source.gameObject.SetActive(false);
                                            this.audioSourcePool.Enqueue(source);
                                        }

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*AudioManager.ReturnToPoolWhenFinished end.*/

            /*AudioManager.SetMusicVolume start.*/
            SetMusicVolume: function (volume) {
                this.musicVolume = Math.max(0, Math.min(1, volume));
                this.musicSource.volume = this.musicVolume;
            },
            /*AudioManager.SetMusicVolume end.*/

            /*AudioManager.SetSFXVolume start.*/
            SetSFXVolume: function (volume) {
                this.sfxVolume = Math.max(0, Math.min(1, volume));
                this.sfxSource.volume = this.sfxVolume;
            },
            /*AudioManager.SetSFXVolume end.*/

            /*AudioManager.SetUIVolume start.*/
            SetUIVolume: function (volume) {
                this.uiVolume = Math.max(0, Math.min(1, volume));
                this.uiSource.volume = this.uiVolume;
            },
            /*AudioManager.SetUIVolume end.*/

            /*AudioManager.StopAllSounds start.*/
            StopAllSounds: function () {
                var $t;
                this.musicSource.Stop();
                this.sfxSource.Stop();
                this.uiSource.Stop();
                $t = Bridge.getEnumerator(this.activeAudioSources);
                try {
                    while ($t.moveNext()) {
                        var source = $t.Current;
                        if (UnityEngine.Component.op_Inequality(source, null) && source.isPlaying) {
                            source.Stop();
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*AudioManager.StopAllSounds end.*/

            /*AudioManager.OnMute start.*/
            OnMute: function () {
                this.isMuted = true;
                UnityEngine.AudioListener.volume = 0.0;
            },
            /*AudioManager.OnMute end.*/

            /*AudioManager.OnUnmute start.*/
            OnUnmute: function () {
                this.isMuted = false;
                UnityEngine.AudioListener.volume = 1.0;
            },
            /*AudioManager.OnUnmute end.*/

            /*AudioManager.PlayWinSound start.*/
            PlayWinSound: function () {
                this.PlaySound(SoundEffect.Win);
            },
            /*AudioManager.PlayWinSound end.*/

            /*AudioManager.PlayTowerHitSound start.*/
            PlayTowerHitSound: function () {
                this.PlaySound(SoundEffect.TowerHit);
            },
            /*AudioManager.PlayTowerHitSound end.*/

            /*AudioManager.PlayShootSound start.*/
            PlayShootSound: function () {
                this.PlaySound(SoundEffect.Shoot);
            },
            /*AudioManager.PlayShootSound end.*/

            /*AudioManager.PlayFailSound start.*/
            PlayFailSound: function () {
                this.PlaySound(SoundEffect.Fail);
            },
            /*AudioManager.PlayFailSound end.*/

            /*AudioManager.PlayIntroSound start.*/
            PlayIntroSound: function () {
                this.PlaySound(SoundEffect.Intro);
            },
            /*AudioManager.PlayIntroSound end.*/

            /*AudioManager.PlayHoleGrowSound start.*/
            PlayHoleGrowSound: function () {
                this.PlaySound(SoundEffect.HoleGrow);
            },
            /*AudioManager.PlayHoleGrowSound end.*/


        }
    });
    /*AudioManager end.*/

    /*AudioManagerSetup start.*/
    Bridge.define("AudioManagerSetup", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            createAudioManagerOnStart: false
        },
        ctors: {
            init: function () {
                this.createAudioManagerOnStart = true;
            }
        },
        methods: {
            /*AudioManagerSetup.Start start.*/
            Start: function () {
                if (this.createAudioManagerOnStart && UnityEngine.MonoBehaviour.op_Equality(AudioManager.instance, null)) {
                    this.CreateAudioManager();
                }
            },
            /*AudioManagerSetup.Start end.*/

            /*AudioManagerSetup.CreateAudioManager start.*/
            CreateAudioManager: function () {
                var audioManagerObject = new UnityEngine.GameObject.$ctor2("AudioManager");
                audioManagerObject.AddComponent(AudioManager);
                audioManagerObject.transform.SetParent(this.transform);
            },
            /*AudioManagerSetup.CreateAudioManager end.*/

            /*AudioManagerSetup.CreateAudioManagerManually start.*/
            CreateAudioManagerManually: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(AudioManager.instance, null)) {
                    this.CreateAudioManager();
                }
            },
            /*AudioManagerSetup.CreateAudioManagerManually end.*/


        }
    });
    /*AudioManagerSetup end.*/

    /*ColoredMaterial start.*/
    Bridge.define("ColoredMaterial", {
        fields: {
            MaterialHolder: 0,
            Material: null,
            Textures: null,
            ColorField: null,
            TextureField: null,
            DefaultColor: null
        },
        ctors: {
            init: function () {
                this.DefaultColor = new UnityEngine.Color();
            }
        }
    });
    /*ColoredMaterial end.*/

    /*FontSetterLuna start.*/
    Bridge.define("FontSetterLuna", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            textReference: null
        },
        methods: {
            /*FontSetterLuna.Start start.*/
            Start: function () { },
            /*FontSetterLuna.Start end.*/


        }
    });
    /*FontSetterLuna end.*/

    /*GameManager start.*/
    Bridge.define("GameManager", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                instance: null
            },
            events: {
                OnGameOver: null
            }
        },
        fields: {
            currentTime: 0,
            isGameOver: false,
            towerHit: false,
            towerMissed: false,
            hasShot: false,
            _shotTime: 0,
            _maxObjectiveAmount: 0,
            currentObjectiveAmount: 0,
            gravity: 0,
            levelContainer: null,
            levels: null,
            pumpkinsParent: null,
            watermelonsParent: null,
            flower: null
        },
        props: {
            PlayableSettings: {
                get: function () {
                    return PlayableSettings.instance;
                }
            }
        },
        ctors: {
            init: function () {
                this.towerHit = false;
                this.towerMissed = false;
                this.hasShot = false;
                this._shotTime = 0.0;
                this.gravity = 10.0;
            }
        },
        methods: {
            /*GameManager.Awake start.*/
            Awake: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(GameManager.instance, null)) {
                    GameManager.instance = this;
                }
            },
            /*GameManager.Awake end.*/

            /*GameManager.Start start.*/
            Start: function () {
                this._maxObjectiveAmount = PlayableSettings.instance.maxObjectiveAmount;
                this.LoadLevel(PlayableSettings.instance.Level);
                this.currentTime = this.PlayableSettings.gameTimeInSeconds;
                UIManager.instance.UpdateTimer(this.currentTime);
                this.SetupThrowableObjects();
                UnityEngine.GameObject.op_Inequality(this.flower, null) ? this.flower.SetActive(this.PlayableSettings.showFlower) : null;
                UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayIntroSound() : null;
                if (this.PlayableSettings.enableIntro && UnityEngine.MonoBehaviour.op_Inequality(IntroManager.instance, null)) {
                    var introManager = IntroManager.instance;
                    introManager.OnIntroCompleted = Bridge.fn.combine(introManager.OnIntroCompleted, Bridge.fn.cacheBind(this, this.OnIntroCompleted));
                } else {
                    this.StartCoroutine$1(this.UpdateTimer());
                }
            },
            /*GameManager.Start end.*/

            /*GameManager.OnIntroCompleted start.*/
            OnIntroCompleted: function () {
                this.StartCoroutine$1(this.UpdateTimer());
            },
            /*GameManager.OnIntroCompleted end.*/

            /*GameManager.LoadLevel start.*/
            LoadLevel: function (level) {
                UnityEngine.Object.Instantiate(UnityEngine.GameObject, this.levels[level], GameManager.instance.levelContainer);
            },
            /*GameManager.LoadLevel end.*/

            /*GameManager.UpdateTimer start.*/
            UpdateTimer: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if (this.PlayableSettings.startGameplayTimerOnTouch) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 3;
                                        continue;
                                }
                                case 1: {
                                    $enumerator.current = new UnityEngine.WaitUntil(function () {
                                            return UnityEngine.Input.GetMouseButtonDown(0);
                                        });
                                        $step = 2;
                                        return true;
                                }
                                case 2: {
                                    $step = 3;
                                    continue;
                                }
                                case 3: {
                                    if ( this.currentTime > 0.0 && !this.isGameOver && this.currentObjectiveAmount < this._maxObjectiveAmount ) {
                                            $step = 4;
                                            continue;
                                        } 
                                        $step = 6;
                                        continue;
                                }
                                case 4: {
                                    UIManager.instance.UpdateTimer(this.currentTime);
                                        this.currentTime -= UnityEngine.Time.deltaTime;
                                        this.CheckTowerShootingConditions();
                                        $enumerator.current = null;
                                        $step = 5;
                                        return true;
                                }
                                case 5: {
                                    
                                        $step = 3;
                                        continue;
                                }
                                case 6: {
                                    if (!this.isGameOver && this.currentObjectiveAmount === this._maxObjectiveAmount) {
                                            UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayWinSound() : null;
                                            this.GameOver(true);
                                        } else if (!this.isGameOver) {
                                            UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayFailSound() : null;
                                            this.GameOver(false);
                                        }

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*GameManager.UpdateTimer end.*/

            /*GameManager.OnTowerHit start.*/
            OnTowerHit: function () {
                UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayTowerHitSound() : null;
                if (!this.towerHit) {
                    this.towerHit = true;
                }
                if (this.PlayableSettings.enableTowerShootingWin) {
                    UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayWinSound() : null;
                    if (!this.isGameOver) {
                        this.GameOver(true);
                    }
                    if (this.PlayableSettings.towerWinAutoRedirectDelay > 0.0) {
                        this.StartCoroutine$1(this.AutoRedirectAfterDelay(this.PlayableSettings.towerWinAutoRedirectDelay));
                    }
                }
            },
            /*GameManager.OnTowerHit end.*/

            /*GameManager.OnPlayerShot start.*/
            OnPlayerShot: function () {
                this.hasShot = true;
                this._shotTime = UnityEngine.Time.time;
                UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayShootSound() : null;
            },
            /*GameManager.OnPlayerShot end.*/

            /*GameManager.CheckTowerShootingConditions start.*/
            CheckTowerShootingConditions: function () {
                if (!this.isGameOver && this.PlayableSettings.enableTowerShootingLose && this.hasShot && !this.towerHit && !this.towerMissed && UnityEngine.Time.time - this._shotTime >= this.PlayableSettings.towerMissCheckDelay && this.AreAllThrowablesInactive()) {
                    this.towerMissed = true;
                    UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayFailSound() : null;
                    this.GameOver(false);
                }
            },
            /*GameManager.CheckTowerShootingConditions end.*/

            /*GameManager.AreAllThrowablesInactive start.*/
            AreAllThrowablesInactive: function () {
                var $t;
                var throwables = UnityEngine.Object.FindObjectsOfType(ThrowableItem);
                if (throwables.length === 0) {
                    return true;
                }
                var array = throwables;
                $t = Bridge.getEnumerator(array);
                try {
                    while ($t.moveNext()) {
                        var throwable = $t.Current;
                        if (!(UnityEngine.MonoBehaviour.op_Equality(throwable, null))) {
                            var rb = throwable.GetComponent(UnityEngine.Rigidbody);
                            if (UnityEngine.Component.op_Inequality(rb, null) && rb.velocity.length() > 0.1) {
                                return false;
                            }
                            if (throwable.gameObject.activeInHierarchy && !throwable.hasHitTower) {
                                return false;
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return true;
            },
            /*GameManager.AreAllThrowablesInactive end.*/

            /*GameManager.AutoRedirectAfterDelay start.*/
            AutoRedirectAfterDelay: function (delay) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(delay);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    Luna.Unity.Playable.InstallFullGame();
                                        Luna.Unity.LifeCycle.GameEnded();
                                        Luna.Unity.Analytics.LogEvent$1("Tower hit auto redirect", 1);

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*GameManager.AutoRedirectAfterDelay end.*/

            /*GameManager.GameOver start.*/
            GameOver: function (isWin) {
                this.StartCoroutine$1(this.GameOverCoroutine(isWin));
            },
            /*GameManager.GameOver end.*/

            /*GameManager.OnButtonClick start.*/
            OnButtonClick: function () {
                Luna.Unity.Playable.InstallFullGame();
                Luna.Unity.LifeCycle.GameEnded();
                Luna.Unity.Analytics.LogEvent$1("Game over button clicked", 1);
            },
            /*GameManager.OnButtonClick end.*/

            /*GameManager.OnBottomBannerClick start.*/
            OnBottomBannerClick: function () {
                Luna.Unity.Playable.InstallFullGame();
            },
            /*GameManager.OnBottomBannerClick end.*/

            /*GameManager.SetupThrowableObjects start.*/
            SetupThrowableObjects: function () {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this.PlayableSettings, null))) {
                    if (UnityEngine.GameObject.op_Inequality(this.pumpkinsParent, null)) {
                        this.pumpkinsParent.SetActive(this.PlayableSettings.throwableObjectType === ThrowableObjectType.Pumpkins);
                    }
                    if (UnityEngine.GameObject.op_Inequality(this.watermelonsParent, null)) {
                        this.watermelonsParent.SetActive(this.PlayableSettings.throwableObjectType === ThrowableObjectType.Watermelon);
                    }
                }
            },
            /*GameManager.SetupThrowableObjects end.*/

            /*GameManager.GameOverCoroutine start.*/
            GameOverCoroutine: function (isWin) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    holeController,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(this.PlayableSettings.gameOverScreenDelay);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    this.isGameOver = true;
                                        !Bridge.staticEquals(GameManager.OnGameOver, null) ? GameManager.OnGameOver(isWin) : null;
                                        this.StopAllCoroutines();
                                        holeController = UnityEngine.Object.FindObjectOfType(HoleController);
                                        if (UnityEngine.MonoBehaviour.op_Inequality(holeController, null)) {
                                            holeController.ResetThrowableState();
                                        }
                                        UIManager.instance.ShowEndScreen(isWin);

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*GameManager.GameOverCoroutine end.*/


        }
    });
    /*GameManager end.*/

    /*HandCursor start.*/
    Bridge.define("HandCursor", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            cursorImage: null,
            _forceHidden: false
        },
        methods: {
            /*HandCursor.Start start.*/
            Start: function () {
                var $t;
                this.cursorImage.enabled = PlayableSettings.instance.enableHandCursor;
                this.cursorImage.sprite = ($t = PlayableSettings.instance.cursors)[PlayableSettings.instance.handCursor];
                this.cursorImage.transform.localScale = new pc.Vec3( 1, 1, 1 ).clone().scale( PlayableSettings.instance.cursorScale );
            },
            /*HandCursor.Start end.*/

            /*HandCursor.Update start.*/
            Update: function () {
                if (PlayableSettings.instance.enableHandCursor && !this._forceHidden) {
                    this.transform.position = UnityEngine.Input.mousePosition.$clone();
                    if (UnityEngine.Input.GetMouseButtonDown(0)) {
                        this.cursorImage.enabled = true;
                    }
                    if (UnityEngine.Input.GetMouseButtonUp(0)) {
                        this.cursorImage.enabled = false;
                    }
                }
            },
            /*HandCursor.Update end.*/

            /*HandCursor.SetForceHidden start.*/
            SetForceHidden: function (hidden) {
                this._forceHidden = hidden;
                if (UnityEngine.MonoBehaviour.op_Inequality(this.cursorImage, null)) {
                    this.cursorImage.enabled = !hidden && PlayableSettings.instance.enableHandCursor;
                }
            },
            /*HandCursor.SetForceHidden end.*/


        }
    });
    /*HandCursor end.*/

    /*HandCursorSkin start.*/
    Bridge.define("HandCursorSkin", {
        $kind: 6,
        statics: {
            fields: {
                Default: 0,
                CartoonHand: 1,
                Realistic_Female_White_1: 2,
                Realistic_Tan_1: 3,
                Realistic_White_1: 4,
                Realistic_White_2: 5
            }
        }
    });
    /*HandCursorSkin end.*/

    /*HG.Playables.Tools.TowerGenerator start.*/
    Bridge.define("HG.Playables.Tools.TowerGenerator", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                GeneratedRootName: null
            },
            ctors: {
                init: function () {
                    this.GeneratedRootName = "Tower_Generated";
                }
            },
            methods: {
                /*HG.Playables.Tools.TowerGenerator.InstantiatePreservingPrefab:static start.*/
                InstantiatePreservingPrefab: function (prefab, parent) {
                    return UnityEngine.Object.Instantiate(UnityEngine.GameObject, prefab, parent);
                },
                /*HG.Playables.Tools.TowerGenerator.InstantiatePreservingPrefab:static end.*/

                /*HG.Playables.Tools.TowerGenerator.ClearGenerated:static start.*/
                ClearGenerated: function (root) {
                    for (var i = (root.childCount - 1) | 0; i >= 0; i = (i - 1) | 0) {
                        var child = root.GetChild(i);
                        UnityEngine.Object.Destroy(child.gameObject);
                    }
                },
                /*HG.Playables.Tools.TowerGenerator.ClearGenerated:static end.*/

                /*HG.Playables.Tools.TowerGenerator.DrawCircleGizmo:static start.*/
                DrawCircleGizmo: function (center, radius) {
                    var prev = center.$clone().add( new pc.Vec3( radius, 0.0, 0.0 ) );
                    for (var i = 1; i <= 64; i = (i + 1) | 0) {
                        var t = i / 64.0;
                        var angle = t * 3.14159274 * 2.0;
                        var next = center.$clone().add( new pc.Vec3( Math.cos(angle) * radius, 0.0, Math.sin(angle) * radius ) );
                        pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                        prev = next.$clone();
                    }
                },
                /*HG.Playables.Tools.TowerGenerator.DrawCircleGizmo:static end.*/

                /*HG.Playables.Tools.TowerGenerator.DrawSquareGizmo:static start.*/
                DrawSquareGizmo: function (center, halfSide) {
                    var a = center.$clone().add( new pc.Vec3( 0.0 - halfSide, 0.0, 0.0 - halfSide ) );
                    var b = center.$clone().add( new pc.Vec3( 0.0 - halfSide, 0.0, halfSide ) );
                    var c = center.$clone().add( new pc.Vec3( halfSide, 0.0, halfSide ) );
                    var d = center.$clone().add( new pc.Vec3( halfSide, 0.0, 0.0 - halfSide ) );
                    pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                    pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                    pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                    pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                },
                /*HG.Playables.Tools.TowerGenerator.DrawSquareGizmo:static end.*/


            }
        },
        fields: {
            shape: 0,
            rowHeight: 0,
            startY: 0,
            parentOverride: null,
            clearBeforeBuild: false,
            patternRowGroups: null
        },
        ctors: {
            init: function () {
                this.shape = HG.Playables.Tools.TowerGenerator.TowerShape.Circular;
                this.rowHeight = 0.25;
                this.startY = 0.0;
                this.clearBeforeBuild = true;
                this.patternRowGroups = new (System.Collections.Generic.List$1(HG.Playables.Tools.TowerGenerator.PatternRowGroup)).ctor();
            }
        },
        methods: {
            /*HG.Playables.Tools.TowerGenerator.BuildTower start.*/
            BuildTower: function () {
                if (this.patternRowGroups == null || this.patternRowGroups.Count === 0) {
                    return;
                }
                var root = this.GetOrCreateGeneratedRoot();
                var index = root.GetComponent(TowerRuntimeIndex);
                if (UnityEngine.MonoBehaviour.op_Equality(index, null)) {
                    index = root.gameObject.AddComponent(TowerRuntimeIndex);
                }
                index.Clear();
                if (this.clearBeforeBuild) {
                    HG.Playables.Tools.TowerGenerator.ClearGenerated(root);
                }
                for (var g = 0; g < this.patternRowGroups.Count; g = (g + 1) | 0) {
                    var group = this.patternRowGroups.getItem(g);
                    if (group == null || group.fruitPattern == null || group.fruitPattern.length === 0) {
                        continue;
                    }
                    var startRow = UnityEngine.Mathf.Max(0, UnityEngine.Mathf.Min(group.startRowIndex, group.endRowIndex));
                    var endRow = UnityEngine.Mathf.Max(group.startRowIndex, group.endRowIndex);
                    for (var rowIndex = startRow; rowIndex <= endRow; rowIndex = (rowIndex + 1) | 0) {
                        var rowParent = new UnityEngine.GameObject.$ctor2(this.GetPatternRowName(rowIndex, group)).transform;
                        rowParent.SetParent(root, false);
                        rowParent.localPosition = new pc.Vec3( 0.0, this.GetRowYWithPattern(group, rowIndex), 0.0 );
                        switch (this.shape) {
                            case HG.Playables.Tools.TowerGenerator.TowerShape.Circular: 
                                this.BuildCircularPatternRow(group, rowParent, root, rowIndex);
                                break;
                            case HG.Playables.Tools.TowerGenerator.TowerShape.Square: 
                                this.BuildSquarePatternRow(group, rowParent, root, rowIndex);
                                break;
                            case HG.Playables.Tools.TowerGenerator.TowerShape.CircularFilled: 
                                this.BuildCircularFilledPatternRow(group, rowParent, root, rowIndex);
                                break;
                        }
                    }
                }
            },
            /*HG.Playables.Tools.TowerGenerator.BuildTower end.*/

            /*HG.Playables.Tools.TowerGenerator.ClearGenerated start.*/
            ClearGenerated: function () {
                var root = this.GetOrCreateGeneratedRoot();
                HG.Playables.Tools.TowerGenerator.ClearGenerated(root);
            },
            /*HG.Playables.Tools.TowerGenerator.ClearGenerated end.*/

            /*HG.Playables.Tools.TowerGenerator.GetPatternRowName start.*/
            GetPatternRowName: function (rowIndex, group) {
                return System.String.format("Row_{0:D3}_{1}", Bridge.box(rowIndex, System.Int32), group.name);
            },
            /*HG.Playables.Tools.TowerGenerator.GetPatternRowName end.*/

            /*HG.Playables.Tools.TowerGenerator.GetRowY start.*/
            GetRowY: function (rowIndex) {
                return this.startY + rowIndex * this.rowHeight;
            },
            /*HG.Playables.Tools.TowerGenerator.GetRowY end.*/

            /*HG.Playables.Tools.TowerGenerator.GetRowYWithPattern start.*/
            GetRowYWithPattern: function (group, rowIndex) {
                var y = this.startY;
                for (var i = 0; i < rowIndex; i = (i + 1) | 0) {
                    var fruitItem = this.GetFruitFromPattern(group, i);
                    var height = ((fruitItem != null && fruitItem.rowHeight > 0.0) ? fruitItem.rowHeight : this.rowHeight);
                    y += height;
                }
                return y;
            },
            /*HG.Playables.Tools.TowerGenerator.GetRowYWithPattern end.*/

            /*HG.Playables.Tools.TowerGenerator.BuildCircularPatternRow start.*/
            BuildCircularPatternRow: function (row, rowParent, towerRoot, rowIndex) {
                var count = UnityEngine.Mathf.Max(1, row.itemsInRow);
                var fruitItem = this.GetFruitFromPattern(row, rowIndex);
                if (fruitItem != null && !(UnityEngine.GameObject.op_Equality(fruitItem.fruitPrefab, null))) {
                    var angleOffsetRad = fruitItem.angleOffsetDegrees * (0.0174532924);
                    for (var i = 0; i < count; i = (i + 1) | 0) {
                        var t = i / count;
                        var angle = t * 3.14159274 * 2.0 + angleOffsetRad;
                        var dir = new pc.Vec3( Math.cos(angle), 0.0, Math.sin(angle) );
                        var localPos = dir.$clone().clone().scale( fruitItem.radius );
                        var instance = HG.Playables.Tools.TowerGenerator.InstantiatePreservingPrefab(fruitItem.fruitPrefab, rowParent);
                        instance.name = (fruitItem.fruitPrefab.name || "") + "_" + i;
                        var tr = instance.transform;
                        tr.localPosition = localPos.$clone();
                        tr.localRotation = new pc.Quat().setLookAt( dir, pc.Vec3.UP.clone() );
                        tr.localScale = new pc.Vec3( 1, 1, 1 ).clone().scale( fruitItem.scale );
                        this.SetupTowerComponent(instance, towerRoot, rowIndex);
                    }
                }
            },
            /*HG.Playables.Tools.TowerGenerator.BuildCircularPatternRow end.*/

            /*HG.Playables.Tools.TowerGenerator.BuildSquarePatternRow start.*/
            BuildSquarePatternRow: function (row, rowParent, towerRoot, rowIndex) {
                var count = UnityEngine.Mathf.Max(1, row.itemsInRow);
                var fruitItem = this.GetFruitFromPattern(row, rowIndex);
                if (fruitItem == null || UnityEngine.GameObject.op_Equality(fruitItem.fruitPrefab, null)) {
                    return;
                }
                var half = fruitItem.radius;
                var itemsPerSide = UnityEngine.Mathf.Max(1, ((Bridge.Int.div(count, 4)) | 0));
                var placed = 0;
                for (var side = 0; side < 4; side = (side + 1) | 0) {
                    if (placed >= count) {
                        break;
                    }
                    var itemsThisSide = UnityEngine.Mathf.Min(itemsPerSide, ((count - placed) | 0));
                    var tangentStart = new UnityEngine.Vector3();
                    var tangentStep = new UnityEngine.Vector3();
                    var normal = new UnityEngine.Vector3();
                    switch (side) {
                        case 0: 
                            tangentStart = new pc.Vec3( 0.0 - half, 0.0, 0.0 - half );
                            tangentStep = new pc.Vec3( 2.0 * half / UnityEngine.Mathf.Max(1, ((itemsThisSide - 1) | 0)), 0.0, 0.0 );
                            normal = new pc.Vec3( 0, 0, -1 );
                            break;
                        case 1: 
                            tangentStart = new pc.Vec3( half, 0.0, 0.0 - half );
                            tangentStep = new pc.Vec3( 0.0, 0.0, 2.0 * half / UnityEngine.Mathf.Max(1, ((itemsThisSide - 1) | 0)) );
                            normal = pc.Vec3.RIGHT.clone();
                            break;
                        case 2: 
                            tangentStart = new pc.Vec3( half, 0.0, half );
                            tangentStep = new pc.Vec3( (0.0 - 2.0 * half) / UnityEngine.Mathf.Max(1, ((itemsThisSide - 1) | 0)), 0.0, 0.0 );
                            normal = new pc.Vec3( 0, 0, 1 );
                            break;
                        default: 
                            tangentStart = new pc.Vec3( 0.0 - half, 0.0, half );
                            tangentStep = new pc.Vec3( 0.0, 0.0, (0.0 - 2.0 * half) / UnityEngine.Mathf.Max(1, ((itemsThisSide - 1) | 0)) );
                            normal = pc.Vec3.LEFT.clone();
                            break;
                    }
                    for (var i = 0; i < itemsThisSide; i = (i + 1) | 0) {
                        if (placed >= count) {
                            break;
                        }
                        var localPos = tangentStart.$clone().add( tangentStep.$clone().clone().scale( i ) );
                        var outward = ((pc.Vec3.equals( localPos, pc.Vec3.ZERO.clone() )) ? normal.$clone() : localPos.clone().normalize().$clone());
                        var instance = HG.Playables.Tools.TowerGenerator.InstantiatePreservingPrefab(fruitItem.fruitPrefab, rowParent);
                        instance.name = (fruitItem.fruitPrefab.name || "") + "_" + placed;
                        var tr = instance.transform;
                        tr.localPosition = localPos.$clone();
                        tr.localRotation = new pc.Quat().setLookAt( outward, pc.Vec3.UP.clone() );
                        tr.localScale = new pc.Vec3( 1, 1, 1 ).clone().scale( fruitItem.scale );
                        placed = (placed + 1) | 0;
                        this.SetupTowerComponent(instance, towerRoot, rowIndex);
                    }
                }
            },
            /*HG.Playables.Tools.TowerGenerator.BuildSquarePatternRow end.*/

            /*HG.Playables.Tools.TowerGenerator.BuildCircularFilledPatternRow start.*/
            BuildCircularFilledPatternRow: function (row, rowParent, towerRoot, rowIndex) {
                var count = UnityEngine.Mathf.Max(1, row.itemsInRow);
                var fruitItem = this.GetFruitFromPattern(row, rowIndex);
                if (fruitItem == null || UnityEngine.GameObject.op_Equality(fruitItem.fruitPrefab, null)) {
                    return;
                }
                var spacing = row.fillSpacing;
                var ringIndex = 0;
                var placed = 0;
                while (placed < count) {
                    var ringRadius = ringIndex * spacing;
                    if (ringRadius > fruitItem.radius) {
                        break;
                    }
                    var itemsInRing = Math.round(6.28318548 * ringRadius / spacing);
                    if (itemsInRing <= 0) {
                        itemsInRing = 1;
                    }
                    if (((placed + itemsInRing) | 0) > count) {
                        itemsInRing = (count - placed) | 0;
                    }
                    for (var i = 0; i < itemsInRing; i = (i + 1) | 0) {
                        var angle = i / itemsInRing * 3.14159274 * 2.0;
                        var localPos = new pc.Vec3( Math.cos(angle) * ringRadius, 0.0, Math.sin(angle) * ringRadius );
                        var instance = HG.Playables.Tools.TowerGenerator.InstantiatePreservingPrefab(fruitItem.fruitPrefab, rowParent);
                        instance.name = (fruitItem.fruitPrefab.name || "") + "_" + placed;
                        var tr = instance.transform;
                        tr.localPosition = localPos.$clone();
                        tr.localRotation = new pc.Quat().setLookAt( localPos.clone().normalize(), pc.Vec3.UP.clone() );
                        tr.localScale = new pc.Vec3( 1, 1, 1 ).clone().scale( fruitItem.scale );
                        placed = (placed + 1) | 0;
                        this.SetupTowerComponent(instance, towerRoot, rowIndex);
                    }
                    ringIndex = (ringIndex + 1) | 0;
                }
            },
            /*HG.Playables.Tools.TowerGenerator.BuildCircularFilledPatternRow end.*/

            /*HG.Playables.Tools.TowerGenerator.GetFruitFromPattern start.*/
            GetFruitFromPattern: function (row, rowIndex) {
                if (row.fruitPattern == null || row.fruitPattern.length === 0) {
                    return null;
                }
                var patternIndex = ((Bridge.Int.div(rowIndex, row.patternRepeatCount)) | 0) % row.fruitPattern.length;
                return row.fruitPattern[patternIndex];
            },
            /*HG.Playables.Tools.TowerGenerator.GetFruitFromPattern end.*/

            /*HG.Playables.Tools.TowerGenerator.SetupTowerComponent start.*/
            SetupTowerComponent: function (instance, towerRoot, rowIndex) {
                var placeholder = instance.GetComponent(ResourcePlaceholder);
                if (UnityEngine.MonoBehaviour.op_Inequality(placeholder, null)) {
                    placeholder.tower = towerRoot;
                    placeholder.rowIndex = rowIndex;
                    return;
                }
                var sa = instance.GetComponentInChildren(SupportActivator);
                if (UnityEngine.MonoBehaviour.op_Inequality(sa, null)) {
                    sa.tower = towerRoot;
                    sa.rowIndex = rowIndex;
                    var idx = towerRoot.GetComponent(TowerRuntimeIndex);
                    if (UnityEngine.MonoBehaviour.op_Inequality(idx, null)) {
                        idx.Register(sa);
                    }
                }
            },
            /*HG.Playables.Tools.TowerGenerator.SetupTowerComponent end.*/

            /*HG.Playables.Tools.TowerGenerator.GetOrCreateGeneratedRoot start.*/
            GetOrCreateGeneratedRoot: function () {
                var host = ((UnityEngine.Component.op_Inequality(this.parentOverride, null)) ? this.parentOverride : this.transform);
                var existing = host.Find("Tower_Generated");
                if (UnityEngine.Component.op_Inequality(existing, null)) {
                    return existing;
                }
                var obj = new UnityEngine.GameObject.$ctor2("Tower_Generated");
                obj.transform.SetParent(host, false);
                return obj.transform;
            },
            /*HG.Playables.Tools.TowerGenerator.GetOrCreateGeneratedRoot end.*/

            /*HG.Playables.Tools.TowerGenerator.OnDrawGizmosSelected start.*/
            OnDrawGizmosSelected: function () {
                var $t, $t1;
                if (this.patternRowGroups == null) {
                    return;
                }
                pc.generateStubProxy( 'UnityEngine.Gizmos', true ).color = new pc.Color( 1.0, 0.6, 0.1, 0.6 );
                for (var g = 0; g < this.patternRowGroups.Count; g = (g + 1) | 0) {
                    var group = this.patternRowGroups.getItem(g);
                    if (group == null) {
                        continue;
                    }
                    var startRow = UnityEngine.Mathf.Max(0, UnityEngine.Mathf.Min(group.startRowIndex, group.endRowIndex));
                    var endRow = UnityEngine.Mathf.Max(group.startRowIndex, group.endRowIndex);
                    for (var rowIndex = startRow; rowIndex <= endRow; rowIndex = (rowIndex + 1) | 0) {
                        var yOffset = new pc.Vec3( 0.0, this.GetRowYWithPattern(group, rowIndex), 0.0 );
                        var radius = ($t = (($t1 = this.GetFruitFromPattern(group, rowIndex)) != null ? $t1.radius : null), $t != null ? $t : 1.0);
                        if (this.shape === HG.Playables.Tools.TowerGenerator.TowerShape.Circular) {
                            HG.Playables.Tools.TowerGenerator.DrawCircleGizmo(this.transform.position.$clone().add( yOffset ), radius);
                        } else {
                            HG.Playables.Tools.TowerGenerator.DrawSquareGizmo(this.transform.position.$clone().add( yOffset ), radius);
                        }
                    }
                }
            },
            /*HG.Playables.Tools.TowerGenerator.OnDrawGizmosSelected end.*/


        }
    });
    /*HG.Playables.Tools.TowerGenerator end.*/

    /*HG.Playables.Tools.TowerGenerator+FruitPatternItem start.*/
    Bridge.define("HG.Playables.Tools.TowerGenerator.FruitPatternItem", {
        $kind: 1002,
        fields: {
            fruitPrefab: null,
            scale: 0,
            radius: 0,
            angleOffsetDegrees: 0,
            rowHeight: 0
        },
        ctors: {
            init: function () {
                this.scale = 1.0;
                this.radius = 1.0;
                this.angleOffsetDegrees = 0.0;
                this.rowHeight = 0.0;
            }
        }
    });
    /*HG.Playables.Tools.TowerGenerator+FruitPatternItem end.*/

    /*HG.Playables.Tools.TowerGenerator+PatternRowGroup start.*/
    Bridge.define("HG.Playables.Tools.TowerGenerator.PatternRowGroup", {
        $kind: 1002,
        fields: {
            name: null,
            startRowIndex: 0,
            endRowIndex: 0,
            itemsInRow: 0,
            perRowHeight: 0,
            fillSpacing: 0,
            fruitPattern: null,
            patternRepeatCount: 0
        },
        ctors: {
            init: function () {
                this.name = "Pattern Group";
                this.startRowIndex = 0;
                this.endRowIndex = 0;
                this.itemsInRow = 24;
                this.perRowHeight = 0.0;
                this.fillSpacing = 0.3;
                this.fruitPattern = System.Array.init(3, null, HG.Playables.Tools.TowerGenerator.FruitPatternItem);
                this.patternRepeatCount = 1;
            }
        }
    });
    /*HG.Playables.Tools.TowerGenerator+PatternRowGroup end.*/

    /*HG.Playables.Tools.TowerGenerator+TowerShape start.*/
    Bridge.define("HG.Playables.Tools.TowerGenerator.TowerShape", {
        $kind: 1006,
        statics: {
            fields: {
                Circular: 0,
                Square: 1,
                CircularFilled: 2
            }
        }
    });
    /*HG.Playables.Tools.TowerGenerator+TowerShape end.*/

    /*HoleController start.*/
    Bridge.define("HoleController", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            moveSpeed: 0,
            speedMultiplier: 0,
            movementIndicatorPivot: null,
            triangleSpriteRenderer: null,
            indicatorHideWhenIdle: false,
            indicatorIdleSpeedThreshold: 0,
            indicatorRotationSpeed: 0,
            _lastPos: null,
            victimLayer: null,
            swallowPower: 0,
            detector: null,
            collectSFX: null,
            physicsCheckInterval: 0,
            _lastPhysicsCheck: 0,
            _victimsBuffer: null,
            _releaseBuffer: null,
            releaseRadius: 0,
            releaseHeight: 0,
            maxReleasesPerEvent: 0,
            aimArrow: null,
            _held: null,
            scaleDuration: 0,
            scaleMultiplier: 0,
            growThreshold: 0,
            growThresholdMultiplier: 0,
            _growCounter: 0,
            skinsParent: null,
            _playerMovement: null,
            _utils: null,
            _isFakeMoving: false,
            _fakeTargetPosition: null,
            _fakeStartPosition: null,
            _fakeControlUsed: false
        },
        props: {
            IsFakeMoving: {
                get: function () {
                    return this._isFakeMoving;
                }
            }
        },
        ctors: {
            init: function () {
                this._lastPos = new UnityEngine.Vector3();
                this.victimLayer = new UnityEngine.LayerMask();
                this._fakeTargetPosition = new UnityEngine.Vector3();
                this._fakeStartPosition = new UnityEngine.Vector3();
                this.moveSpeed = 2.0;
                this.speedMultiplier = 1.1;
                this.indicatorHideWhenIdle = true;
                this.indicatorIdleSpeedThreshold = 0.02;
                this.indicatorRotationSpeed = 720.0;
                this.swallowPower = 2.0;
                this.physicsCheckInterval = 0.1;
                this.releaseRadius = 0.5;
                this.releaseHeight = 1.0;
                this.maxReleasesPerEvent = 12;
                this.scaleDuration = 0.2;
                this.scaleMultiplier = 1.2;
                this.growThreshold = 10.0;
                this.growThresholdMultiplier = 1.2;
                this._isFakeMoving = false;
                this._fakeControlUsed = false;
            }
        },
        methods: {
            /*HoleController.Start start.*/
            Start: function () {
                this._playerMovement = new PlayerMovement();
                this._utils = new Utils();
                this.moveSpeed = PlayableSettings.instance.holeMoveSpeed;
                this._playerMovement.minSpeed = PlayableSettings.instance.minSpeed;
                this._playerMovement.speedMultiplier = PlayableSettings.instance.speedMultiplier;
                this._lastPos = this.transform.position.$clone();
                if (UnityEngine.Component.op_Inequality(this.triangleSpriteRenderer, null)) {
                    this.SetIndicatorVisible(false);
                    this.SetIndicatorColor(PlayableSettings.instance.movementIndicatorColor.$clone());
                }
                this._victimsBuffer = PhysicsObjectPool.GetColliders(16);
                this._releaseBuffer = PhysicsObjectPool.GetColliders(this.maxReleasesPerEvent);
                this._utils.SwitchChild(this.skinsParent, PlayableSettings.instance.holeSkin);
                UIManager.instance.UpdateSlider(GameManager.instance.currentObjectiveAmount);
            },
            /*HoleController.Start end.*/

            /*HoleController.OnDestroy start.*/
            OnDestroy: function () {
                if (this._victimsBuffer != null) {
                    PhysicsObjectPool.ReturnColliders(this._victimsBuffer);
                    this._victimsBuffer = null;
                }
                if (this._releaseBuffer != null) {
                    PhysicsObjectPool.ReturnColliders(this._releaseBuffer);
                    this._releaseBuffer = null;
                }
            },
            /*HoleController.OnDestroy end.*/

            /*HoleController.Update start.*/
            Update: function () {
                if (GameManager.instance.isGameOver) {
                    return;
                }
                if (this._isFakeMoving) {
                    this.UpdateFakeMovement();
                } else if (UnityEngine.MonoBehaviour.op_Equality(this._held, null)) {
                    this._playerMovement.UpdateMovement(this.transform, this.moveSpeed);
                }
                if (UnityEngine.Component.op_Inequality(this.movementIndicatorPivot, null) && UnityEngine.Component.op_Inequality(this.triangleSpriteRenderer, null)) {
                    var currentPos = this.transform.position.$clone();
                    var delta = currentPos.$clone().sub( this._lastPos );
                    var planar = new pc.Vec3( delta.x, 0.0, delta.z );
                    var speed = ((UnityEngine.Time.deltaTime > 0.0) ? (planar.length() / UnityEngine.Time.deltaTime) : 0.0);
                    var isMoving = speed > this.indicatorIdleSpeedThreshold && planar.lengthSq() > 1E-08;
                    if (this.indicatorHideWhenIdle) {
                        this.SetIndicatorVisible(isMoving);
                    }
                    if (isMoving) {
                        var lookRot = new pc.Quat().setLookAt( planar.clone().normalize(), pc.Vec3.UP.clone() );
                        this.movementIndicatorPivot.rotation = pc.Quat.rotateTowards( this.movementIndicatorPivot.rotation.$clone(), lookRot.$clone(), this.indicatorRotationSpeed * UnityEngine.Time.deltaTime );
                    }
                    this._lastPos = currentPos.$clone();
                }
                if (UnityEngine.Time.time - this._lastPhysicsCheck >= this.physicsCheckInterval) {
                    this._lastPhysicsCheck = UnityEngine.Time.time;
                    var victimCount = UnityEngine.Physics.OverlapSphereNonAlloc(this.transform.position, this.detector.radius, this._victimsBuffer, UnityEngine.LayerMask.op_Implicit(this.victimLayer.$clone()));
                    if (victimCount > 0) {
                        for (var i = 0; i < victimCount; i = (i + 1) | 0) {
                            var item = this._victimsBuffer[i];
                            if (!(UnityEngine.Component.op_Equality(item, null))) {
                                var throwable = item.GetComponentInParent(ThrowableItem);
                                if (UnityEngine.MonoBehaviour.op_Inequality(throwable, null) && throwable.enabled && UnityEngine.MonoBehaviour.op_Equality(this._held, null)) {
                                    this.PickUpThrowable(throwable);
                                    break;
                                }
                                var victimRb = item.GetComponentInParent(UnityEngine.Rigidbody);
                                if (UnityEngine.Component.op_Inequality(victimRb, null) && UnityEngine.MonoBehaviour.op_Equality(this._held, null)) {
                                    this.SwallowVictim(victimRb);
                                }
                            }
                        }
                    }
                }
                if (this._growCounter > this.growThreshold) {
                    this.Grow();
                    this._growCounter = 0;
                    this.growThreshold *= this.growThresholdMultiplier;
                    this.moveSpeed *= this.speedMultiplier;
                    PlayableSettings.instance.CameraZoomOut(this.scaleMultiplier);
                    UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayHoleGrowSound() : null;
                }
            },
            /*HoleController.Update end.*/

            /*HoleController.SetIndicatorVisible start.*/
            SetIndicatorVisible: function (visible) {
                if (UnityEngine.Component.op_Inequality(this.triangleSpriteRenderer, null)) {
                    this.triangleSpriteRenderer.enabled = visible;
                }
            },
            /*HoleController.SetIndicatorVisible end.*/

            /*HoleController.SetIndicatorColor start.*/
            SetIndicatorColor: function (color) {
                if (UnityEngine.Component.op_Inequality(this.triangleSpriteRenderer, null)) {
                    this.triangleSpriteRenderer.material.color = color.$clone();
                }
            },
            /*HoleController.SetIndicatorColor end.*/

            /*HoleController.Throw start.*/
            Throw: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(this._held, null)) {
                    var dir = ((UnityEngine.MonoBehaviour.op_Inequality(this.aimArrow, null)) ? this.aimArrow.GetForward(this.transform) : this.transform.forward.$clone());
                    this.ThrowHeld(dir.$clone());
                    if (UnityEngine.MonoBehaviour.op_Inequality(GameManager.instance, null)) {
                        GameManager.instance.OnPlayerShot();
                    }
                }
            },
            /*HoleController.Throw end.*/

            /*HoleController.OnTriggerEnter start.*/
            OnTriggerEnter: function (other) {
                if (this.IsCollectible(other.gameObject)) {
                    var rb = other.GetComponentInParent(UnityEngine.Rigidbody);
                    if (UnityEngine.Object.op_Implicit(rb) && UnityEngine.MonoBehaviour.op_Equality(this._held, null)) {
                        rb.isKinematic = false;
                    }
                }
            },
            /*HoleController.OnTriggerEnter end.*/

            /*HoleController.OnTriggerExit start.*/
            OnTriggerExit: function (other) {
                var $t;
                if (UnityEngine.MonoBehaviour.op_Inequality(this._held, null)) {
                    var held = other.GetComponentInParent(ThrowableItem);
                    if (UnityEngine.MonoBehaviour.op_Inequality(held, null) && UnityEngine.MonoBehaviour.op_Equality(held, this._held)) {
                        return;
                    }
                }
                if (this.IsCollectible(other.gameObject) && other.transform.position.y < -0.5) {
                    var collectedAmount = GameManager.instance.currentObjectiveAmount;
                    if (collectedAmount < PlayableSettings.instance.maxObjectiveAmount) {
                        this.collectSFX.Play();
                        ($t = GameManager.instance).currentObjectiveAmount = ($t.currentObjectiveAmount + 1) | 0;
                        UIManager.instance.UpdateSlider(GameManager.instance.currentObjectiveAmount);
                    }
                    this._growCounter = (this._growCounter + 1) | 0;
                    var removedPos = other.transform.position.$clone();
                    this.ReleaseNeighbors(removedPos.$clone());
                    var rb = other.GetComponentInParent(UnityEngine.Rigidbody);
                    if (UnityEngine.Component.op_Inequality(rb, null)) {
                        UnityEngine.Object.Destroy$1(rb.gameObject, 0.8);
                    } else {
                        UnityEngine.Object.Destroy$1(other.gameObject, 0.8);
                    }
                }
            },
            /*HoleController.OnTriggerExit end.*/

            /*HoleController.IsCollectible start.*/
            IsCollectible: function (other) {
                return ((1 << other.layer) & UnityEngine.LayerMask.op_Implicit(this.victimLayer)) !== 0;
            },
            /*HoleController.IsCollectible end.*/

            /*HoleController.SwallowVictim start.*/
            SwallowVictim: function (victimRb) {
                victimRb.AddForce$1(pc.Vec3.DOWN.clone().clone().scale( (this.swallowPower * GameManager.instance.gravity * UnityEngine.Time.deltaTime) ), UnityEngine.ForceMode.Impulse);
            },
            /*HoleController.SwallowVictim end.*/

            /*HoleController.Grow start.*/
            Grow: function () {
                this.StartCoroutine$1(this.ScaleOverTime());
            },
            /*HoleController.Grow end.*/

            /*HoleController.ScaleOverTime start.*/
            ScaleOverTime: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    originalScale,
                    currentTime,
                    targetScale,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    originalScale = this.transform.localScale.$clone();
                                        currentTime = 0.0;
                                        targetScale = originalScale.$clone().clone().scale( this.scaleMultiplier );
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( currentTime < this.scaleDuration ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    this.transform.localScale = new pc.Vec3().lerp( originalScale, targetScale, currentTime / this.scaleDuration );
                                        currentTime += UnityEngine.Time.deltaTime;
                                        $enumerator.current = null;
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 4: {
                                    this.transform.localScale = targetScale.$clone();

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*HoleController.ScaleOverTime end.*/

            /*HoleController.PickUpThrowable start.*/
            PickUpThrowable: function (ti) {
                this._held = ti;
                this._held.AttachTo(this.transform);
                if (UnityEngine.MonoBehaviour.op_Inequality(this.aimArrow, null)) {
                    this.aimArrow.SetVisible(true);
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null)) {
                    UIManager.instance.ShowShootScreen();
                }
                if (this._isFakeMoving) {
                    this._isFakeMoving = false;
                }
            },
            /*HoleController.PickUpThrowable end.*/

            /*HoleController.ThrowHeld start.*/
            ThrowHeld: function (dir) {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this._held, null))) {
                    var toThrow = this._held;
                    this._held = null;
                    if (UnityEngine.MonoBehaviour.op_Inequality(this.aimArrow, null)) {
                        this.aimArrow.SetVisible(false);
                    }
                    if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null)) {
                        UIManager.instance.HideShootScreenAfterShoot();
                    }
                    toThrow.ThrowForward(dir.clone().normalize().$clone());
                }
            },
            /*HoleController.ThrowHeld end.*/

            /*HoleController.ReleaseNeighbors start.*/
            ReleaseNeighbors: function (fromPosition) {
                var p0 = fromPosition.$clone().add( pc.Vec3.UP.clone().clone().scale( 0.1 ) );
                var p1 = p0.$clone().add( pc.Vec3.UP.clone().clone().scale( UnityEngine.Mathf.Max(0.1, this.releaseHeight) ) );
                var hitCount = UnityEngine.Physics.OverlapCapsuleNonAlloc(p0, p1, UnityEngine.Mathf.Max(0.05, this.releaseRadius), this._releaseBuffer, UnityEngine.LayerMask.op_Implicit(this.victimLayer.$clone()));
                var released = 0;
                for (var i = 0; i < hitCount; i = (i + 1) | 0) {
                    if (released >= this.maxReleasesPerEvent) {
                        break;
                    }
                    var hit = this._releaseBuffer[i];
                    if (!(UnityEngine.Component.op_Equality(hit, null))) {
                        var rb = hit.attachedRigidbody;
                        if (!(UnityEngine.Component.op_Equality(rb, null)) && rb.isKinematic) {
                            rb.isKinematic = false;
                            rb.AddForce$1(pc.Vec3.DOWN.clone().clone().scale( (this.swallowPower * 0.5) ), UnityEngine.ForceMode.Impulse);
                            released = (released + 1) | 0;
                        }
                    }
                }
            },
            /*HoleController.ReleaseNeighbors end.*/

            /*HoleController.ResetThrowableState start.*/
            ResetThrowableState: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(this._held, null)) {
                    this._held = null;
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(this.aimArrow, null)) {
                    this.aimArrow.SetVisible(false);
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null)) {
                    UIManager.instance.HideShootScreenAfterShoot();
                }
            },
            /*HoleController.ResetThrowableState end.*/

            /*HoleController.StartFakeMovement start.*/
            StartFakeMovement: function () {
                if (PlayableSettings.instance.enableFakeControl && !this._isFakeMoving && !this._fakeControlUsed) {
                    this._isFakeMoving = true;
                    this._fakeControlUsed = true;
                    this._fakeStartPosition = this.transform.position.$clone();
                    this._fakeTargetPosition = this._fakeStartPosition.$clone().add( new pc.Vec3( 0, 0, 1 ).clone().scale( 2.0 ) );
                }
            },
            /*HoleController.StartFakeMovement end.*/

            /*HoleController.UpdateFakeMovement start.*/
            UpdateFakeMovement: function () {
                if (this._isFakeMoving) {
                    var direction = (this._fakeTargetPosition.$clone().sub( this.transform.position )).clone().normalize().$clone();
                    var distance = pc.Vec3.distance( this.transform.position, this._fakeTargetPosition );
                    if (distance > 0.1) {
                        this.transform.Translate$1(direction.$clone().clone().scale( this.moveSpeed ).clone().scale( UnityEngine.Time.deltaTime ));
                        return;
                    }
                    this.transform.position = this._fakeTargetPosition.$clone();
                    this._isFakeMoving = false;
                }
            },
            /*HoleController.UpdateFakeMovement end.*/


        }
    });
    /*HoleController end.*/

    /*IntroManager start.*/
    Bridge.define("IntroManager", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                instance: null
            }
        },
        fields: {
            cameraTransitionCurve: null,
            playerCameraRef: null,
            virtualCameraRef: null,
            cameraOffsetRef: null,
            playerCamera: null,
            virtualCamera: null,
            cameraOffset: null,
            isIntroActive: false,
            introCompleted: false,
            isIntroTextVisible: false,
            isIntroTextHidden: false,
            OnIntroStarted: null,
            OnIntroCompleted: null
        },
        props: {
            PlayableSettings: {
                get: function () {
                    return PlayableSettings.instance;
                }
            },
            IsIntroTextVisible: {
                get: function () {
                    return this.isIntroTextVisible && !this.isIntroTextHidden;
                }
            },
            IsIntroTextHidden: {
                get: function () {
                    return this.isIntroTextHidden;
                }
            },
            IsIntroActive: {
                get: function () {
                    return this.isIntroActive;
                }
            },
            IsIntroCompleted: {
                get: function () {
                    return this.introCompleted;
                }
            }
        },
        ctors: {
            init: function () {
                this.cameraTransitionCurve = pc.AnimationCurve.createEaseInOut(0.0, 0.0, 1.0, 1.0);
                this.isIntroActive = false;
                this.introCompleted = false;
                this.isIntroTextVisible = false;
                this.isIntroTextHidden = false;
            }
        },
        methods: {
            /*IntroManager.Awake start.*/
            Awake: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(IntroManager.instance, null)) {
                    IntroManager.instance = this;
                } else {
                    UnityEngine.Object.Destroy(Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject);
                }
            },
            /*IntroManager.Awake end.*/

            /*IntroManager.Start start.*/
            Start: function () {
                this.playerCamera = ((UnityEngine.Component.op_Inequality(this.playerCameraRef, null)) ? this.playerCameraRef : UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null) ? PlayableSettings.instance.playerCamera : null);
                this.virtualCamera = ((UnityEngine.MonoBehaviour.op_Inequality(this.virtualCameraRef, null)) ? this.virtualCameraRef : UnityEngine.Component.op_Inequality(this.playerCamera, null) ? this.playerCamera.GetComponent(Cinemachine.CinemachineVirtualCamera) : null);
                this.cameraOffset = ((UnityEngine.MonoBehaviour.op_Inequality(this.cameraOffsetRef, null)) ? this.cameraOffsetRef : UnityEngine.Component.op_Inequality(this.playerCamera, null) ? this.playerCamera.GetComponent(CinemachineCameraOffset) : null);
                if (UnityEngine.MonoBehaviour.op_Inequality(this.PlayableSettings, null) && this.PlayableSettings.enableIntro && !this.introCompleted) {
                    this.StartIntro();
                }
            },
            /*IntroManager.Start end.*/

            /*IntroManager.StartIntro start.*/
            StartIntro: function () {
                if (!this.isIntroActive && !this.introCompleted) {
                    this.isIntroActive = true;
                    !Bridge.staticEquals(this.OnIntroStarted, null) ? this.OnIntroStarted() : null;
                    if (UnityEngine.MonoBehaviour.op_Inequality(this.PlayableSettings, null) && this.PlayableSettings.blockPlayerInput) {
                        this.SetPlayerInputEnabled(false);
                    }
                    this.StartIntroText();
                    this.StartCoroutine$1(this.IntroSequence());
                }
            },
            /*IntroManager.StartIntro end.*/

            /*IntroManager.IntroSequence start.*/
            IntroSequence: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    remainingTime,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if (UnityEngine.Component.op_Inequality(this.playerCamera, null) && UnityEngine.MonoBehaviour.op_Inequality(this.PlayableSettings, null)) {
                                            this.playerCamera.eulerAngles = this.PlayableSettings.startCameraAngle.$clone();
                                            if (UnityEngine.MonoBehaviour.op_Inequality(this.cameraOffset, null)) {
                                                this.cameraOffset.m_Offset = this.PlayableSettings.startCameraPosition.$clone();
                                            }
                                        }
                                        $enumerator.current = new UnityEngine.WaitForSeconds(0.5);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    if (UnityEngine.MonoBehaviour.op_Inequality(this.PlayableSettings, null) && this.PlayableSettings.cameraTransitionDuration > 0.0) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    $enumerator.current = this.StartCoroutine$1(this.TransitionCameraAngle());
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    $step = 4;
                                    continue;
                                }
                                case 4: {
                                    remainingTime = 0.2;
                                        if (remainingTime > 0.0) {
                                            $step = 5;
                                            continue;
                                        } 
                                        $step = 7;
                                        continue;
                                }
                                case 5: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(remainingTime);
                                        $step = 6;
                                        return true;
                                }
                                case 6: {
                                    $step = 7;
                                    continue;
                                }
                                case 7: {
                                    this.CompleteIntro();

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*IntroManager.IntroSequence end.*/

            /*IntroManager.TransitionCameraAngle start.*/
            TransitionCameraAngle: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    startAngle,
                    endAngle,
                    startPosition,
                    endPosition,
                    transitionDuration,
                    elapsedTime,
                    progress,
                    curveValue,
                    currentAngle,
                    currentPosition,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if (UnityEngine.MonoBehaviour.op_Equality(this.PlayableSettings, null)) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 2;
                                        continue;
                                }
                                case 1: {
                                    return false;
                                }
                                case 2: {
                                    startAngle = this.PlayableSettings.startCameraAngle.$clone();
                                        endAngle = this.PlayableSettings.endCameraAngle.$clone();
                                        startPosition = this.PlayableSettings.startCameraPosition.$clone();
                                        endPosition = this.PlayableSettings.endCameraPosition.$clone();
                                        transitionDuration = this.PlayableSettings.cameraTransitionDuration;
                                        elapsedTime = 0.0;
                                    $step = 3;
                                    continue;
                                }
                                case 3: {
                                    if ( elapsedTime < transitionDuration ) {
                                            $step = 4;
                                            continue;
                                        } 
                                        $step = 6;
                                        continue;
                                }
                                case 4: {
                                    elapsedTime += UnityEngine.Time.deltaTime;
                                        progress = elapsedTime / transitionDuration;
                                        curveValue = this.cameraTransitionCurve.value(progress);
                                        currentAngle = new pc.Vec3().lerp( startAngle, endAngle, curveValue );
                                        currentPosition = new pc.Vec3().lerp( startPosition, endPosition, curveValue );
                                        if (UnityEngine.Component.op_Inequality(this.playerCamera, null)) {
                                            this.playerCamera.eulerAngles = currentAngle.$clone();
                                            if (UnityEngine.MonoBehaviour.op_Inequality(this.cameraOffset, null)) {
                                                this.cameraOffset.m_Offset = currentPosition.$clone();
                                            }
                                        }
                                        $enumerator.current = null;
                                        $step = 5;
                                        return true;
                                }
                                case 5: {
                                    
                                        $step = 3;
                                        continue;
                                }
                                case 6: {
                                    if (UnityEngine.Component.op_Inequality(this.playerCamera, null)) {
                                            this.playerCamera.eulerAngles = endAngle.$clone();
                                            if (UnityEngine.MonoBehaviour.op_Inequality(this.cameraOffset, null)) {
                                                this.cameraOffset.m_Offset = endPosition.$clone();
                                            }
                                        }

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*IntroManager.TransitionCameraAngle end.*/

            /*IntroManager.CompleteIntro start.*/
            CompleteIntro: function () {
                this.isIntroActive = false;
                this.introCompleted = true;
                if (UnityEngine.MonoBehaviour.op_Inequality(this.PlayableSettings, null) && this.PlayableSettings.blockPlayerInput) {
                    this.SetPlayerInputEnabled(true);
                }
                !Bridge.staticEquals(this.OnIntroCompleted, null) ? this.OnIntroCompleted() : null;
            },
            /*IntroManager.CompleteIntro end.*/

            /*IntroManager.SetPlayerInputEnabled start.*/
            SetPlayerInputEnabled: function (enabled) {
                var $t;
                var holeController = UnityEngine.Object.FindObjectOfType(HoleController);
                if (UnityEngine.MonoBehaviour.op_Inequality(holeController, null)) {
                    holeController.enabled = enabled;
                }
                var handCursor = UnityEngine.Object.FindObjectOfType(HandCursor);
                if (UnityEngine.MonoBehaviour.op_Inequality(handCursor, null)) {
                    handCursor.enabled = enabled;
                    if (!enabled) {
                        handCursor.gameObject.SetActive(false);
                    } else {
                        handCursor.gameObject.SetActive(true);
                    }
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(holeController, null)) {
                    var triangleRenderer = UnityEngine.MonoBehaviour.op_Inequality(($t = holeController.GetComponent(HoleController)), null) ? $t.triangleSpriteRenderer : null;
                    if (UnityEngine.Component.op_Inequality(triangleRenderer, null)) {
                        triangleRenderer.enabled = enabled;
                    }
                }
            },
            /*IntroManager.SetPlayerInputEnabled end.*/

            /*IntroManager.StartIntroText start.*/
            StartIntroText: function () {
                if (!this.isIntroTextVisible && !this.isIntroTextHidden && !(UnityEngine.MonoBehaviour.op_Equality(this.PlayableSettings, null)) && this.PlayableSettings.showIntroText) {
                    this.isIntroTextVisible = true;
                    this.isIntroTextHidden = false;
                    if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null)) {
                        UIManager.instance.ShowIntroText(this.PlayableSettings.introText);
                    }
                    if (this.PlayableSettings.hideIntroTextOnPlayerTouch && this.PlayableSettings.introTextHideAfterDuration) {
                        this.StartCoroutine$1(this.WaitForTouchOrDuration());
                    } else if (this.PlayableSettings.hideIntroTextOnPlayerTouch) {
                        this.StartCoroutine$1(this.WaitForTouch());
                    } else if (this.PlayableSettings.introTextHideAfterDuration) {
                        this.StartCoroutine$1(this.WaitForDuration());
                    }
                }
            },
            /*IntroManager.StartIntroText end.*/

            /*IntroManager.WaitForTouchOrDuration start.*/
            WaitForTouchOrDuration: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    duration,
                    elapsedTime,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    duration = this.PlayableSettings.introTextDuration;
                                        elapsedTime = 0.0;
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( elapsedTime < duration && !this.isIntroTextHidden ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 6;
                                        continue;
                                }
                                case 2: {
                                    if (!this.isIntroActive && (UnityEngine.Input.GetMouseButtonDown(0) || (UnityEngine.Input.touchCount > 0 && UnityEngine.Input.GetTouch(0).phase === UnityEngine.TouchPhase.Began))) {
                                            $step = 3;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 3: {
                                    this.HideIntroText();
                                        return false;
                                    $step = 4;
                                    continue;
                                }
                                case 4: {
                                    elapsedTime += UnityEngine.Time.deltaTime;
                                        $enumerator.current = null;
                                        $step = 5;
                                        return true;
                                }
                                case 5: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 6: {
                                    if (!this.isIntroTextHidden) {
                                            this.HideIntroText();
                                        }

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*IntroManager.WaitForTouchOrDuration end.*/

            /*IntroManager.WaitForTouch start.*/
            WaitForTouch: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if ( !this.isIntroTextHidden ) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 3;
                                        continue;
                                }
                                case 1: {
                                    if (!this.isIntroActive && (UnityEngine.Input.GetMouseButtonDown(0) || (UnityEngine.Input.touchCount > 0 && UnityEngine.Input.GetTouch(0).phase === UnityEngine.TouchPhase.Began))) {
                                            this.HideIntroText();
                                            $step = 3;
                                            continue;
                                        }
                                        $enumerator.current = null;
                                        $step = 2;
                                        return true;
                                }
                                case 2: {
                                    
                                        $step = 0;
                                        continue;
                                }
                                case 3: {

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*IntroManager.WaitForTouch end.*/

            /*IntroManager.WaitForDuration start.*/
            WaitForDuration: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(this.PlayableSettings.introTextDuration);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    if (!this.isIntroTextHidden) {
                                            this.HideIntroText();
                                        }

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*IntroManager.WaitForDuration end.*/

            /*IntroManager.HideIntroText start.*/
            HideIntroText: function () {
                if (!this.isIntroTextHidden) {
                    this.isIntroTextHidden = true;
                    this.isIntroTextVisible = false;
                    if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null)) {
                        UIManager.instance.HideIntroText();
                    }
                }
            },
            /*IntroManager.HideIntroText end.*/

            /*IntroManager.ForceHideIntroText start.*/
            ForceHideIntroText: function () {
                this.HideIntroText();
            },
            /*IntroManager.ForceHideIntroText end.*/

            /*IntroManager.SkipIntro start.*/
            SkipIntro: function () {
                if (!this.isIntroActive) {
                    return;
                }
                this.StopAllCoroutines();
                if (UnityEngine.Component.op_Inequality(this.playerCamera, null) && UnityEngine.MonoBehaviour.op_Inequality(this.PlayableSettings, null)) {
                    this.playerCamera.eulerAngles = this.PlayableSettings.endCameraAngle.$clone();
                    if (UnityEngine.MonoBehaviour.op_Inequality(this.cameraOffset, null)) {
                        this.cameraOffset.m_Offset = this.PlayableSettings.endCameraPosition.$clone();
                    }
                }
                this.CompleteIntro();
            },
            /*IntroManager.SkipIntro end.*/

            /*IntroManager.ConfigureIntro start.*/
            ConfigureIntro: function (enable, duration, startAngle, endAngle, transitionDuration) { },
            /*IntroManager.ConfigureIntro end.*/


        }
    });
    /*IntroManager end.*/

    /*IntroManagerSetup start.*/
    Bridge.define("IntroManagerSetup", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            createIntroManagerOnStart: false
        },
        ctors: {
            init: function () {
                this.createIntroManagerOnStart = true;
            }
        },
        methods: {
            /*IntroManagerSetup.Start start.*/
            Start: function () {
                if (this.createIntroManagerOnStart && UnityEngine.MonoBehaviour.op_Equality(IntroManager.instance, null)) {
                    this.CreateIntroManager();
                }
            },
            /*IntroManagerSetup.Start end.*/

            /*IntroManagerSetup.CreateIntroManager start.*/
            CreateIntroManager: function () {
                var introManagerObject = new UnityEngine.GameObject.$ctor2("IntroManager");
                introManagerObject.AddComponent(IntroManager);
                introManagerObject.transform.SetParent(this.transform);
            },
            /*IntroManagerSetup.CreateIntroManager end.*/

            /*IntroManagerSetup.CreateIntroManagerManually start.*/
            CreateIntroManagerManually: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(IntroManager.instance, null)) {
                    this.CreateIntroManager();
                }
            },
            /*IntroManagerSetup.CreateIntroManagerManually end.*/


        }
    });
    /*IntroManagerSetup end.*/

    /*MaterialHolder start.*/
    Bridge.define("MaterialHolder", {
        $kind: 6,
        statics: {
            fields: {
                Hole: 0,
                Ground: 1
            }
        }
    });
    /*MaterialHolder end.*/

    /*MovingMovement start.*/
    Bridge.define("MovingMovement", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            movingImage: null
        },
        methods: {
            /*MovingMovement.Start start.*/
            Start: function () {
                this.movingImage.enabled = PlayableSettings.instance.enableMovingVisual;
            },
            /*MovingMovement.Start end.*/


        }
    });
    /*MovingMovement end.*/

    /*PhysicsObjectPool start.*/
    Bridge.define("PhysicsObjectPool", {
        statics: {
            fields: {
                MAX_POOL_SIZE: 0,
                _raycastHitPools: null,
                _colliderPools: null
            },
            ctors: {
                init: function () {
                    this.MAX_POOL_SIZE = 10;
                    this._raycastHitPools = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.RaycastHit)))).ctor();
                    this._colliderPools = new (System.Collections.Generic.Dictionary$2(System.Int32,System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.Collider)))).ctor();
                }
            },
            methods: {
                /*PhysicsObjectPool.GetRaycastHits:static start.*/
                GetRaycastHits: function (size) {
                    if (!PhysicsObjectPool._raycastHitPools.containsKey(size)) {
                        PhysicsObjectPool._raycastHitPools.setItem(size, new (System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.RaycastHit))).ctor());
                    }
                    var pool = PhysicsObjectPool._raycastHitPools.getItem(size);
                    if (pool.Count > 0) {
                        return pool.Dequeue();
                    }
                    return System.Array.init(size, function (){
                        return new UnityEngine.RaycastHit();
                    }, UnityEngine.RaycastHit);
                },
                /*PhysicsObjectPool.GetRaycastHits:static end.*/

                /*PhysicsObjectPool.ReturnRaycastHits:static start.*/
                ReturnRaycastHits: function (array) {
                    if (array == null) {
                        return;
                    }
                    var size = array.length;
                    if (!PhysicsObjectPool._raycastHitPools.containsKey(size)) {
                        PhysicsObjectPool._raycastHitPools.setItem(size, new (System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.RaycastHit))).ctor());
                    }
                    var pool = PhysicsObjectPool._raycastHitPools.getItem(size);
                    if (pool.Count < 10) {
                        for (var i = 0; i < array.length; i = (i + 1) | 0) {
                            array[i] = Bridge.getDefaultValue(UnityEngine.RaycastHit);
                        }
                        pool.Enqueue(array);
                    }
                },
                /*PhysicsObjectPool.ReturnRaycastHits:static end.*/

                /*PhysicsObjectPool.GetColliders:static start.*/
                GetColliders: function (size) {
                    if (!PhysicsObjectPool._colliderPools.containsKey(size)) {
                        PhysicsObjectPool._colliderPools.setItem(size, new (System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.Collider))).ctor());
                    }
                    var pool = PhysicsObjectPool._colliderPools.getItem(size);
                    if (pool.Count > 0) {
                        return pool.Dequeue();
                    }
                    return System.Array.init(size, null, UnityEngine.Collider);
                },
                /*PhysicsObjectPool.GetColliders:static end.*/

                /*PhysicsObjectPool.ReturnColliders:static start.*/
                ReturnColliders: function (array) {
                    if (array == null) {
                        return;
                    }
                    var size = array.length;
                    if (!PhysicsObjectPool._colliderPools.containsKey(size)) {
                        PhysicsObjectPool._colliderPools.setItem(size, new (System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.Collider))).ctor());
                    }
                    var pool = PhysicsObjectPool._colliderPools.getItem(size);
                    if (pool.Count < 10) {
                        for (var i = 0; i < array.length; i = (i + 1) | 0) {
                            array[i] = null;
                        }
                        pool.Enqueue(array);
                    }
                },
                /*PhysicsObjectPool.ReturnColliders:static end.*/

                /*PhysicsObjectPool.ClearPools:static start.*/
                ClearPools: function () {
                    PhysicsObjectPool._raycastHitPools.clear();
                    PhysicsObjectPool._colliderPools.clear();
                },
                /*PhysicsObjectPool.ClearPools:static end.*/


            }
        }
    });
    /*PhysicsObjectPool end.*/

    /*PlayableSettings start.*/
    Bridge.define("PlayableSettings", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                instance: null
            }
        },
        fields: {
            playerCamera: null,
            coloredMaterials: null,
            cursors: null,
            gameTimeInSeconds: 0,
            startGameplayTimerOnTouch: false,
            gameOverScreenDelay: 0,
            maxObjectiveAmount: 0,
            Level: 0,
            cameraAngle: null,
            enableHandCursor: false,
            cursorScale: 0,
            handCursor: 0,
            throwableObjectType: 0,
            showFlower: false,
            minSpeed: 0,
            speedMultiplier: 0,
            enableIntro: false,
            startCameraAngle: null,
            endCameraAngle: null,
            startCameraPosition: null,
            endCameraPosition: null,
            cameraTransitionDuration: 0,
            blockPlayerInput: false,
            showIntroText: false,
            introText: null,
            introTextDuration: 0,
            hideIntroTextOnPlayerTouch: false,
            introTextHideAfterDuration: false,
            enableFakeControl: false,
            enableMovingVisual: false,
            enableMovingHand: false,
            enableFloatingAnimation: false,
            floatingHeight: 0,
            floatingSpeed: 0,
            enableSelfRotation: false,
            rotationSpeed: 0,
            enableTowerShootingWin: false,
            enableTowerShootingLose: false,
            towerWinAutoRedirectDelay: 0,
            towerMissCheckDelay: 0,
            groundColor: null,
            groundTexture: 0,
            holeMoveSpeed: 0,
            holeColor: null,
            holeSkin: 0,
            movementIndicatorColor: null,
            aimArrowColor: null,
            displayTopBanner: false,
            displayMidBanner: false,
            displayBotBanner: false,
            winSound: null,
            towerHitSound: null,
            shootSound: null,
            failSound: null,
            introSound: null,
            holeGrowSound: null
        },
        ctors: {
            init: function () {
                this.cameraAngle = new UnityEngine.Vector3();
                this.startCameraAngle = new UnityEngine.Vector3();
                this.endCameraAngle = new UnityEngine.Vector3();
                this.startCameraPosition = new UnityEngine.Vector3();
                this.endCameraPosition = new UnityEngine.Vector3();
                this.groundColor = new UnityEngine.Color();
                this.holeColor = new UnityEngine.Color();
                this.movementIndicatorColor = new UnityEngine.Color();
                this.aimArrowColor = new UnityEngine.Color();
                this.gameTimeInSeconds = 100.0;
                this.startGameplayTimerOnTouch = true;
                this.gameOverScreenDelay = 2.0;
                this.maxObjectiveAmount = 100;
                this.Level = PlayableSettings.LevelIndex.HalloweenTower_SideHalloween;
                this.cameraAngle = new pc.Vec3( 60.0, 0.0, 0.0 );
                this.enableHandCursor = true;
                this.cursorScale = 1.0;
                this.handCursor = HandCursorSkin.Default;
                this.throwableObjectType = ThrowableObjectType.Pumpkins;
                this.showFlower = true;
                this.minSpeed = 0.1;
                this.speedMultiplier = 0.01;
                this.enableIntro = true;
                this.startCameraAngle = new pc.Vec3( 20.0, 0.0, 0.0 );
                this.endCameraAngle = new pc.Vec3( 60.0, 0.0, 0.0 );
                this.startCameraPosition = new pc.Vec3( 0.0, 5.0, -10.0 );
                this.endCameraPosition = new pc.Vec3( 0.0, 8.0, -6.0 );
                this.cameraTransitionDuration = 2.0;
                this.blockPlayerInput = true;
                this.showIntroText = true;
                this.introText = "Welcome to the Game!";
                this.introTextDuration = 2.0;
                this.hideIntroTextOnPlayerTouch = false;
                this.introTextHideAfterDuration = true;
                this.enableFakeControl = false;
                this.enableMovingVisual = false;
                this.enableMovingHand = false;
                this.enableFloatingAnimation = true;
                this.floatingHeight = 0.3;
                this.floatingSpeed = 2.0;
                this.enableSelfRotation = true;
                this.rotationSpeed = 45.0;
                this.enableTowerShootingWin = false;
                this.enableTowerShootingLose = false;
                this.towerWinAutoRedirectDelay = 1.0;
                this.towerMissCheckDelay = 2.0;
                this.groundColor = new pc.Color( 1, 1, 1, 1 );
                this.groundTexture = 0;
                this.holeMoveSpeed = 2.0;
                this.holeColor = new pc.Color( 0, 0, 0, 1 );
                this.holeSkin = 0;
                this.movementIndicatorColor = new pc.Color( 1, 1, 1, 1 );
                this.aimArrowColor = new pc.Color( 1, 1, 1, 1 );
                this.displayTopBanner = false;
                this.displayMidBanner = false;
                this.displayBotBanner = false;
            }
        },
        methods: {
            /*PlayableSettings.Awake start.*/
            Awake: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(PlayableSettings.instance, null)) {
                    PlayableSettings.instance = this;
                }
                if (!this.enableIntro) {
                    this.playerCamera.eulerAngles = this.cameraAngle.$clone();
                }
                this.SetMaterials();
                UIManager.instance.topBanner.SetActive(PlayableSettings.instance.displayTopBanner);
                UIManager.instance.midBanner.SetActive(PlayableSettings.instance.displayMidBanner);
                UIManager.instance.bottomBanner.SetActive(PlayableSettings.instance.displayBotBanner);
            },
            /*PlayableSettings.Awake end.*/

            /*PlayableSettings.CameraZoomOut start.*/
            CameraZoomOut: function (value) {
                this.StartCoroutine$1(this.SmoothCameraZoomOut(value));
            },
            /*PlayableSettings.CameraZoomOut end.*/

            /*PlayableSettings.SmoothCameraZoomOut start.*/
            SmoothCameraZoomOut: function (value) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    holeVcCam,
                    framingTransposer,
                    startDistance,
                    targetDistance,
                    duration,
                    elapsedTime,
                    progress,
                    smoothProgress,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    holeVcCam = this.playerCamera.GetComponent(Cinemachine.CinemachineVirtualCamera);
                                        framingTransposer = holeVcCam.GetCinemachineComponent(Cinemachine.CinemachineFramingTransposer);
                                        if (!(UnityEngine.MonoBehaviour.op_Equality(framingTransposer, null))) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 6;
                                        continue;
                                }
                                case 1: {
                                    startDistance = framingTransposer.m_CameraDistance;
                                        targetDistance = startDistance + value * 1.5;
                                        duration = 0.5;
                                        elapsedTime = 0.0;
                                    $step = 2;
                                    continue;
                                }
                                case 2: {
                                    if ( elapsedTime < duration ) {
                                            $step = 3;
                                            continue;
                                        } 
                                        $step = 5;
                                        continue;
                                }
                                case 3: {
                                    elapsedTime += UnityEngine.Time.deltaTime;
                                        progress = elapsedTime / duration;
                                        smoothProgress = pc.math.smoothstep(0.0, 1.0, progress);
                                        framingTransposer.m_CameraDistance = pc.math.lerp(startDistance, targetDistance, smoothProgress);
                                        $enumerator.current = null;
                                        $step = 4;
                                        return true;
                                }
                                case 4: {
                                    
                                        $step = 2;
                                        continue;
                                }
                                case 5: {
                                    framingTransposer.m_CameraDistance = targetDistance;
                                    $step = 6;
                                    continue;
                                }
                                case 6: {

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*PlayableSettings.SmoothCameraZoomOut end.*/

            /*PlayableSettings.SetMaterials start.*/
            SetMaterials: function () {
                var $t;
                var array = this.coloredMaterials;
                $t = Bridge.getEnumerator(array);
                try {
                    while ($t.moveNext()) {
                        var coloredMaterial = $t.Current;
                        switch (coloredMaterial.MaterialHolder) {
                            case MaterialHolder.Hole: 
                                coloredMaterial.Material.color = this.holeColor.$clone();
                                break;
                            case MaterialHolder.Ground: 
                                coloredMaterial.Material.color = this.groundColor.$clone();
                                coloredMaterial.Material.SetTexture$1(coloredMaterial.TextureField, coloredMaterial.Textures[this.groundTexture]);
                                break;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                this.ApplyAimArrowColor();
            },
            /*PlayableSettings.SetMaterials end.*/

            /*PlayableSettings.ApplyAimArrowColor start.*/
            ApplyAimArrowColor: function () {
                var aimArrow = UnityEngine.Object.FindObjectOfType(AimArrow);
                if (UnityEngine.MonoBehaviour.op_Inequality(aimArrow, null)) {
                    aimArrow.SetArrowColor(this.aimArrowColor.$clone());
                }
            },
            /*PlayableSettings.ApplyAimArrowColor end.*/


        }
    });
    /*PlayableSettings end.*/

    /*PlayableSettings+LevelIndex start.*/
    Bridge.define("PlayableSettings.LevelIndex", {
        $kind: 1006,
        statics: {
            fields: {
                HalloweenTower_SideHalloween: 0,
                HalloweenTower_SideFruit: 1,
                FruitTower_SideFruit: 2
            }
        }
    });
    /*PlayableSettings+LevelIndex end.*/

    /*PlayableSettings+PlayerSkinIndex start.*/
    Bridge.define("PlayableSettings.PlayerSkinIndex", {
        $kind: 1006,
        statics: {
            fields: {
                Default: 0
            }
        }
    });
    /*PlayableSettings+PlayerSkinIndex end.*/

    /*PlayerMovement start.*/
    Bridge.define("PlayerMovement", {
        fields: {
            movementDirection: null,
            initialMousePosition: null,
            lastMousePosition: null,
            minSpeed: 0,
            speedMultiplier: 0
        },
        ctors: {
            init: function () {
                this.movementDirection = new UnityEngine.Vector3();
                this.initialMousePosition = new UnityEngine.Vector3();
                this.lastMousePosition = new UnityEngine.Vector3();
                this.minSpeed = 0.1;
                this.speedMultiplier = 0.01;
            }
        },
        methods: {
            /*PlayerMovement.UpdateMovement start.*/
            UpdateMovement: function (target, moveSpeed) {
                if (UnityEngine.Input.GetMouseButtonDown(0)) {
                    this.initialMousePosition = UnityEngine.Input.mousePosition.$clone();
                    this.lastMousePosition = UnityEngine.Input.mousePosition.$clone();
                    if (PlayableSettings.instance.enableFakeControl) {
                        var holeController = target.GetComponent(HoleController);
                        if (UnityEngine.MonoBehaviour.op_Inequality(holeController, null) && !holeController.IsFakeMoving) {
                            holeController.StartFakeMovement();
                            return;
                        }
                    }
                }
                if (UnityEngine.Input.GetMouseButtonUp(0)) {
                    this.movementDirection = pc.Vec3.ZERO.clone();
                }
                if (UnityEngine.Input.GetMouseButton(0)) {
                    this.UpdateMovementDirection(target, moveSpeed);
                }
            },
            /*PlayerMovement.UpdateMovement end.*/

            /*PlayerMovement.UpdateMovementDirection start.*/
            UpdateMovementDirection: function (transform, moveSpeed) {
                var currentMousePosition = UnityEngine.Input.mousePosition.$clone();
                var mouseDelta = currentMousePosition.$clone().sub( this.initialMousePosition );
                var mouseVelocity = (currentMousePosition.$clone().sub( this.lastMousePosition )).scale( 1.0 / ( UnityEngine.Time.deltaTime ) );
                this.movementDirection = new pc.Vec3( mouseDelta.x, 0.0, mouseDelta.y ).clone().normalize().$clone();
                var dragDistance = new pc.Vec3( mouseDelta.x, 0.0, mouseDelta.y ).length();
                var speedFactor = Math.max(this.minSpeed, Math.min(dragDistance * this.speedMultiplier, 1.0));
                transform.Translate$1(this.movementDirection.$clone().clone().scale( moveSpeed ).clone().scale( speedFactor ).clone().scale( UnityEngine.Time.deltaTime ));
                this.lastMousePosition = currentMousePosition.$clone();
            },
            /*PlayerMovement.UpdateMovementDirection end.*/


        }
    });
    /*PlayerMovement end.*/

    /*PlayerSkin start.*/
    Bridge.define("PlayerSkin", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            animator: null
        }
    });
    /*PlayerSkin end.*/

    /*Pool$1 start.*/
    Bridge.define("Pool$1", function (T) { return {
        fields: {
            prefab: Bridge.getDefaultValue(T),
            parent: null,
            objects: null
        },
        ctors: {
            init: function () {
                this.prefab = Bridge.getDefaultValue(T);
            },
            ctor: function (prefab, parent, initialSize) {
                this.$initialize();
                this.objects = new (System.Collections.Generic.List$1(T)).ctor();
                this.parent = parent;
                this.prefab = Bridge.rValue(prefab);
                for (var i = 0; i < initialSize; i = (i + 1) | 0) {
                    this.Grow();
                }
            }
        },
        methods: {
            /*Pool$1.Grow start.*/
            Grow: function () {
                var newObject = Bridge.rValue(UnityEngine.Object.Instantiate(T, Bridge.rValue(this.prefab), this.parent));
Bridge.rValue(                newObject).gameObject.SetActive(false);
                this.objects.add(Bridge.rValue(newObject));
                return Bridge.rValue(newObject);
            },
            /*Pool$1.Grow end.*/

            /*Pool$1.Dispose start.*/
            Dispose: function (obj) {
Bridge.rValue(                obj).gameObject.SetActive(false);
Bridge.rValue(                obj).transform.position = pc.Vec3.ZERO.clone();
            },
            /*Pool$1.Dispose end.*/

            /*Pool$1.Get start.*/
            Get: function (growIfFull) {
                var $t;
                var result = null;
                $t = Bridge.getEnumerator(System.Linq.Enumerable.from(this.objects, T).where(function (obj) {
                        return !Bridge.rValue(obj).gameObject.activeInHierarchy;
                    }));
                try {
                    while ($t.moveNext()) {
                        var obj2 = Bridge.rValue($t.Current);
                        result = Bridge.rValue(obj2);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                if (!UnityEngine.Object.op_Implicit(Bridge.rValue(result))) {
                    if (!growIfFull) {
                        return null;
                    }
                    result = Bridge.rValue(this.Grow());
                }
Bridge.rValue(                result).gameObject.SetActive(true);
                return Bridge.rValue(result);
            },
            /*Pool$1.Get end.*/


        }
    }; });
    /*Pool$1 end.*/

    /*ResourceLoader start.*/
    Bridge.define("ResourceLoader", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                Path: null,
                resourceList: null
            },
            events: {
                OnObjectLoaded: null
            },
            ctors: {
                init: function () {
                    this.Path = "Collectables/";
                }
            },
            methods: {
                /*ResourceLoader.AddToList:static start.*/
                AddToList: function (name) {
                    if (ResourceLoader.resourceList == null) {
                        ResourceLoader.resourceList = new (System.Collections.Generic.List$1(System.String)).ctor();
                    }
                    if (!ResourceLoader.resourceList.contains(name)) {
                        ResourceLoader.resourceList.add(name);
                    }
                },
                /*ResourceLoader.AddToList:static end.*/


            }
        },
        methods: {
            /*ResourceLoader.Start start.*/
            Start: function () {
                var $t;
                if (ResourceLoader.resourceList == null || ResourceLoader.resourceList.Count === 0) {
                    return;
                }
                $t = Bridge.getEnumerator(ResourceLoader.resourceList);
                try {
                    while ($t.moveNext()) {
                        var resourceName = $t.Current;
                        this.StartCoroutine$1(this.LoadResource(resourceName));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*ResourceLoader.Start end.*/

            /*ResourceLoader.LoadResource start.*/
            LoadResource: function (resourceName) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    request,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    request = UnityEngine.Resources.LoadAsync$1("Collectables/" + (resourceName || ""), UnityEngine.Transform);
                                        $enumerator.current = request;
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    if (!(request.asset == null)) {
                                            !Bridge.staticEquals(ResourceLoader.OnObjectLoaded, null) ? ResourceLoader.OnObjectLoaded(Bridge.as(request.asset, UnityEngine.Transform)) : null;
                                        }

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*ResourceLoader.LoadResource end.*/


        }
    });
    /*ResourceLoader end.*/

    /*ResourcePlaceholder start.*/
    Bridge.define("ResourcePlaceholder", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            resourceName: null,
            tower: null,
            rowIndex: 0
        },
        methods: {
            /*ResourcePlaceholder.Awake start.*/
            Awake: function () {
                if (!System.String.isNullOrEmpty(this.resourceName)) {
                    ResourceLoader.AddToList(this.resourceName);
                    ResourceLoader.addOnObjectLoaded(Bridge.fn.cacheBind(this, this.SpawnInstance));
                }
            },
            /*ResourcePlaceholder.Awake end.*/

            /*ResourcePlaceholder.SpawnInstance start.*/
            SpawnInstance: function (prefab) {
                if (!(!Bridge.referenceEquals(this.resourceName, prefab.name)) && !(UnityEngine.Component.op_Equality(prefab, null))) {
                    var tr = this.transform;
                    var instance = UnityEngine.Object.Instantiate$3(UnityEngine.Transform, prefab, tr.position.$clone(), tr.rotation.$clone(), tr.parent);
                    instance.localScale = tr.localScale.$clone();
                    instance.name = this.resourceName;
                    this.EnsureSupportActivator(instance);
                    UnityEngine.Object.Destroy(Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject);
                }
            },
            /*ResourcePlaceholder.SpawnInstance end.*/

            /*ResourcePlaceholder.EnsureSupportActivator start.*/
            EnsureSupportActivator: function (instance) {
                var go = instance.gameObject;
                var rb = go.GetComponent(UnityEngine.Rigidbody);
                if (UnityEngine.Component.op_Equality(rb, null)) {
                    rb = go.GetComponentInChildren(UnityEngine.Rigidbody);
                }
                if (UnityEngine.Component.op_Equality(rb, null)) {
                    rb = go.AddComponent(UnityEngine.Rigidbody);
                }
                rb.isKinematic = true;
                var activator = go.GetComponent(SupportActivator);
                if (UnityEngine.MonoBehaviour.op_Equality(activator, null)) {
                    activator = go.AddComponent(SupportActivator);
                }
                if (activator.supportMask.value === 0) {
                    var defaultMask = (1 << UnityEngine.LayerMask.NameToLayer("Default")) | (1 << UnityEngine.LayerMask.NameToLayer("Collectables"));
                    if (defaultMask === 0) {
                        defaultMask = 65;
                    }
                    activator.supportMask = UnityEngine.LayerMask.op_Implicit$1(defaultMask);
                }
                activator.requiredMisses = 2;
                activator.tower = this.tower;
                activator.rowIndex = this.rowIndex;
                var index = ((UnityEngine.Component.op_Inequality(this.tower, null)) ? this.tower.GetComponent(TowerRuntimeIndex) : null);
                if (UnityEngine.MonoBehaviour.op_Inequality(index, null)) {
                    index.Register(activator);
                }
            },
            /*ResourcePlaceholder.EnsureSupportActivator end.*/


        }
    });
    /*ResourcePlaceholder end.*/

    /*RotorRotation start.*/
    Bridge.define("RotorRotation", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            rotationAxis: 0,
            rotationSpeed: 0
        },
        ctors: {
            init: function () {
                this.rotationAxis = RotorRotation.RotationAxis.Y;
                this.rotationSpeed = 300.0;
            }
        },
        methods: {
            /*RotorRotation.Update start.*/
            Update: function () {
                var axis = pc.Vec3.ZERO.clone();
                switch (this.rotationAxis) {
                    case RotorRotation.RotationAxis.X: 
                        axis = pc.Vec3.RIGHT.clone();
                        break;
                    case RotorRotation.RotationAxis.Y: 
                        axis = pc.Vec3.UP.clone();
                        break;
                    case RotorRotation.RotationAxis.Z: 
                        axis = new pc.Vec3( 0, 0, 1 );
                        break;
                }
                this.transform.Rotate$1(axis.$clone(), this.rotationSpeed * UnityEngine.Time.deltaTime);
            },
            /*RotorRotation.Update end.*/


        }
    });
    /*RotorRotation end.*/

    /*RotorRotation+RotationAxis start.*/
    Bridge.define("RotorRotation.RotationAxis", {
        $kind: 1006,
        statics: {
            fields: {
                X: 0,
                Y: 1,
                Z: 2
            }
        }
    });
    /*RotorRotation+RotationAxis end.*/

    /*SoundEffect start.*/
    Bridge.define("SoundEffect", {
        $kind: 6,
        statics: {
            fields: {
                Win: 0,
                TowerHit: 1,
                Shoot: 2,
                Fail: 3,
                Intro: 4,
                HoleGrow: 5
            }
        }
    });
    /*SoundEffect end.*/

    /*SupportActivator start.*/
    Bridge.define("SupportActivator", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            supportMask: null,
            checkDistance: 0,
            checkInterval: 0,
            requiredMisses: 0,
            activateDrag: 0,
            activateAngularDrag: 0,
            sleepDelay: 0,
            _rb: null,
            _missCounter: 0,
            _rayHits: null,
            tower: null,
            rowIndex: 0,
            _activationTime: 0
        },
        ctors: {
            init: function () {
                this.supportMask = new UnityEngine.LayerMask();
                this.checkDistance = 0.55;
                this.checkInterval = 0.03;
                this.requiredMisses = 2;
                this.activateDrag = 1.0;
                this.activateAngularDrag = 0.5;
                this.sleepDelay = 3.0;
            }
        },
        methods: {
            /*SupportActivator.Awake start.*/
            Awake: function () {
                this._rb = this.GetComponent(UnityEngine.Rigidbody);
                if (UnityEngine.Component.op_Equality(this._rb, null)) {
                    this._rb = this.GetComponentInParent(UnityEngine.Rigidbody);
                }
                this._rayHits = PhysicsObjectPool.GetRaycastHits(2);
                var defaultIdx = UnityEngine.LayerMask.NameToLayer("Default");
                if (defaultIdx < 0) {
                    defaultIdx = 0;
                }
                var collectIdx = UnityEngine.LayerMask.NameToLayer("Collectables");
                if (collectIdx < 0) {
                    collectIdx = 6;
                }
                var required = (1 << defaultIdx) | (1 << collectIdx);
                if (this.supportMask.value === 0) {
                    this.supportMask = UnityEngine.LayerMask.op_Implicit$1(required);
                } else {
                    this.supportMask = UnityEngine.LayerMask.op_Implicit$1(UnityEngine.LayerMask.op_Implicit(this.supportMask) | required);
                }
            },
            /*SupportActivator.Awake end.*/

            /*SupportActivator.OnDestroy start.*/
            OnDestroy: function () {
                if (this._rayHits != null) {
                    PhysicsObjectPool.ReturnRaycastHits(this._rayHits);
                    this._rayHits = null;
                }
            },
            /*SupportActivator.OnDestroy end.*/

            /*SupportActivator.OnEnable start.*/
            OnEnable: function () {
                this.InvokeRepeating("CheckSupport", 1.0, this.checkInterval);
                var index = ((UnityEngine.Component.op_Inequality(this.tower, null)) ? this.tower.GetComponent(TowerRuntimeIndex) : null);
                if (UnityEngine.MonoBehaviour.op_Inequality(index, null)) {
                    index.Register(this);
                }
            },
            /*SupportActivator.OnEnable end.*/

            /*SupportActivator.OnDisable start.*/
            OnDisable: function () {
                this.CancelInvoke$1("CheckSupport");
                var index = ((UnityEngine.Component.op_Inequality(this.tower, null)) ? this.tower.GetComponent(TowerRuntimeIndex) : null);
                if (UnityEngine.MonoBehaviour.op_Inequality(index, null)) {
                    index.Unregister(this);
                }
            },
            /*SupportActivator.OnDisable end.*/

            /*SupportActivator.CheckSupport start.*/
            CheckSupport: function () {
                if (UnityEngine.Component.op_Equality(this._rb, null) || !this._rb.isKinematic) {
                    return;
                }
                if (!this.HasSupportBelow()) {
                    this._missCounter = (this._missCounter + 1) | 0;
                    if (this._missCounter >= this.requiredMisses) {
                        this.ActivatePhysics();
                        this._missCounter = 0;
                    }
                } else {
                    this._missCounter = 0;
                }
            },
            /*SupportActivator.CheckSupport end.*/

            /*SupportActivator.ActivatePhysics start.*/
            ActivatePhysics: function () {
                this._rb.isKinematic = false;
                this._rb.drag = this.activateDrag;
                this._rb.angularDrag = this.activateAngularDrag;
                this._activationTime = UnityEngine.Time.time;
            },
            /*SupportActivator.ActivatePhysics end.*/

            /*SupportActivator.ForceActivate start.*/
            ForceActivate: function () {
                if (!(UnityEngine.Component.op_Equality(this._rb, null))) {
                    this._rb.isKinematic = false;
                    this._rb.drag = this.activateDrag;
                    this._rb.angularDrag = this.activateAngularDrag;
                    this._activationTime = UnityEngine.Time.time;
                }
            },
            /*SupportActivator.ForceActivate end.*/

            /*SupportActivator.HasSupportBelow start.*/
            HasSupportBelow: function () {
                var origin = this.transform.position.$clone().add( pc.Vec3.UP.clone().clone().scale( 0.26 ) );
                var direction = pc.Vec3.DOWN.clone();
                UnityEngine.Debug.DrawRay$2(origin.$clone(), direction.$clone().clone().scale( this.checkDistance ), new pc.Color( 1, 0, 0, 1 ), this.checkInterval);
                var hitCount = UnityEngine.Physics.RaycastNonAlloc$2(origin, direction, this._rayHits, this.checkDistance, UnityEngine.LayerMask.op_Implicit(this.supportMask.$clone()), UnityEngine.QueryTriggerInteraction.Ignore);
                if (hitCount === 0) {
                    return false;
                }
                for (var i = 0; i < hitCount; i = (i + 1) | 0) {
                    var hit = this._rayHits[i].$clone();
                    var col = hit.collider;
                    if (!(UnityEngine.Component.op_Equality(col, null))) {
                        var hitRb = ((UnityEngine.Component.op_Inequality(hit.rigidbody, null)) ? hit.rigidbody : col.GetComponentInParent(UnityEngine.Rigidbody));
                        if (!(UnityEngine.Component.op_Equality(hitRb, this._rb))) {
                            UnityEngine.Debug.DrawRay$2(origin.$clone(), direction.$clone().clone().scale( hit.distance ), new pc.Color( 0, 1, 0, 1 ), this.checkInterval);
                            return true;
                        }
                    }
                }
                return false;
            },
            /*SupportActivator.HasSupportBelow end.*/

            /*SupportActivator.Update start.*/
            Update: function () {
                if (!(UnityEngine.Component.op_Equality(this._rb, null)) && !this._rb.isKinematic && UnityEngine.Time.time - this._activationTime > this.sleepDelay) {
                    this._rb.isKinematic = true;
                }
            },
            /*SupportActivator.Update end.*/

            /*SupportActivator.OnCollisionEnter start.*/
            OnCollisionEnter: function (collision) {
                if (UnityEngine.Component.op_Inequality(this._rb, null) && this._rb.isKinematic) {
                    this._rb.isKinematic = false;
                    this._rb.drag = this.activateDrag;
                    this._rb.angularDrag = this.activateAngularDrag;
                    this._activationTime = UnityEngine.Time.time;
                }
            },
            /*SupportActivator.OnCollisionEnter end.*/


        }
    });
    /*SupportActivator end.*/

    /*TextureSetterLuna start.*/
    Bridge.define("TextureSetterLuna", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            preserveAspectImage: false,
            imageRef: null,
            textureField: 0
        },
        ctors: {
            init: function () {
                this.preserveAspectImage = true;
            }
        },
        methods: {
            /*TextureSetterLuna.Start start.*/
            Start: function () {
                this.imageRef.preserveAspect = this.preserveAspectImage;
            },
            /*TextureSetterLuna.Start end.*/

            /*TextureSetterLuna.ConvertTextureToSprite start.*/
            ConvertTextureToSprite: function (texture) {
                return UnityEngine.Sprite.Create$1(texture, new UnityEngine.Rect.$ctor1(0.0, 0.0, texture.width, texture.height), new pc.Vec2( 0.5, 0.5 ), 100.0);
            },
            /*TextureSetterLuna.ConvertTextureToSprite end.*/


        }
    });
    /*TextureSetterLuna end.*/

    /*TextureSetterLuna+TextureLunaFieldType start.*/
    Bridge.define("TextureSetterLuna.TextureLunaFieldType", {
        $kind: 1006,
        statics: {
            fields: {
                TopBanner: 0,
                MidBanner: 1,
                BottomBanner: 2,
                WinImage: 3,
                FailImage: 4
            }
        }
    });
    /*TextureSetterLuna+TextureLunaFieldType end.*/

    /*ThrowableItem start.*/
    Bridge.define("ThrowableItem", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            snapOffsetY: 0,
            throwForce: 0,
            throwUpward: 0,
            spinTorque: 0,
            detachDelay: 0,
            pickedUp: false,
            smoothSnap: false,
            snapDuration: 0,
            throwProtectDuration: 0,
            hasHitTower: false,
            _throwTime: 0,
            _rb: null,
            _originalParent: null,
            _colliders: null,
            _savedLayerObjects: null,
            _savedLayers: null,
            _originalPosition: null,
            _floatingOffset: 0,
            _savedPosition: null,
            _savedRotation: null,
            _visualEffectsActive: false,
            _floatingBasePosition: null,
            visualChild: null
        },
        ctors: {
            init: function () {
                this._originalPosition = new UnityEngine.Vector3();
                this._savedPosition = new UnityEngine.Vector3();
                this._savedRotation = new UnityEngine.Quaternion();
                this._floatingBasePosition = new UnityEngine.Vector3();
                this.snapOffsetY = 0.2;
                this.throwForce = 14.0;
                this.throwUpward = 2.5;
                this.spinTorque = 8.0;
                this.detachDelay = 0.05;
                this.smoothSnap = true;
                this.snapDuration = 0.12;
                this.throwProtectDuration = 0.6;
                this.hasHitTower = false;
                this._throwTime = 0.0;
                this._savedLayerObjects = new (System.Collections.Generic.List$1(UnityEngine.GameObject)).$ctor2(8);
                this._savedLayers = new (System.Collections.Generic.List$1(System.Int32)).$ctor2(8);
                this._visualEffectsActive = true;
            }
        },
        methods: {
            /*ThrowableItem.Awake start.*/
            Awake: function () {
                this._rb = this.GetComponent(UnityEngine.Rigidbody);
                if (UnityEngine.Component.op_Equality(this._rb, null)) {
                    this._rb = this.GetComponentInChildren(UnityEngine.Rigidbody);
                }
                this._colliders = this.GetComponentsInChildren$1(UnityEngine.Collider, true);
                if (UnityEngine.MonoBehaviour.op_Equality(this.GetComponent(ThrowablePusher), null)) {
                    Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.AddComponent(ThrowablePusher);
                }
            },
            /*ThrowableItem.Awake end.*/

            /*ThrowableItem.Start start.*/
            Start: function () {
                this._originalPosition = this.transform.position.$clone();
                this._floatingOffset = UnityEngine.Random.Range$1(0.0, 6.28318548);
                this.CalculateFloatingBasePosition();
                if (UnityEngine.Component.op_Equality(this.visualChild, null)) {
                    UnityEngine.Debug.LogWarning$1("Visual child not assigned on " + (Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.name || "") + ". Please assign a child object for visual effects.");
                } else {
                    this.HideMainRenderer();
                }
            },
            /*ThrowableItem.Start end.*/

            /*ThrowableItem.CalculateFloatingBasePosition start.*/
            CalculateFloatingBasePosition: function () {
                var $t, $t1, $t2, $t3;
                var bounds = ($t = (UnityEngine.Component.op_Inequality(($t1 = this.GetComponent(UnityEngine.Renderer)), null) ? $t1.bounds : null), $t != null ? $t : ($t2 = (UnityEngine.Component.op_Inequality(($t3 = this.GetComponentInChildren(UnityEngine.Renderer)), null) ? $t3.bounds : null), $t2 != null ? $t2 : Bridge.getDefaultValue(UnityEngine.Bounds)));
                if (!pc.Vec3.equals( bounds.halfExtents.$clone().scale( 2 ), pc.Vec3.ZERO.clone() )) {
                    this._floatingBasePosition = new pc.Vec3( this._originalPosition.x, bounds.min.y, this._originalPosition.z );
                } else {
                    this._floatingBasePosition = this._originalPosition.$clone();
                }
            },
            /*ThrowableItem.CalculateFloatingBasePosition end.*/

            /*ThrowableItem.Update start.*/
            Update: function () {
                if (!this.pickedUp && this._visualEffectsActive && UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    this.UpdateVisualEffects();
                }
            },
            /*ThrowableItem.Update end.*/

            /*ThrowableItem.UpdateVisualEffects start.*/
            UpdateVisualEffects: function () {
                var settings = PlayableSettings.instance;
                if (settings.enableFloatingAnimation) {
                    var parentScale = this.transform.lossyScale.y;
                    var adjustedHeight = settings.floatingHeight / parentScale;
                    var sinValue = Math.sin((UnityEngine.Time.time + this._floatingOffset) * settings.floatingSpeed);
                    var floatingY = (sinValue + 1.0) * 0.5 * adjustedHeight;
                    if (UnityEngine.Component.op_Inequality(this.visualChild, null)) {
                        this.visualChild.localPosition = pc.Vec3.UP.clone().clone().scale( floatingY );
                    } else {
                        this.transform.position = this._floatingBasePosition.$clone().add( pc.Vec3.UP.clone().clone().scale( floatingY ) );
                    }
                }
                if (settings.enableSelfRotation) {
                    if (UnityEngine.Component.op_Inequality(this.visualChild, null)) {
                        this.visualChild.Rotate$1(pc.Vec3.UP.clone(), settings.rotationSpeed * UnityEngine.Time.deltaTime);
                    } else {
                        this.transform.Rotate$1(pc.Vec3.UP.clone(), settings.rotationSpeed * UnityEngine.Time.deltaTime);
                    }
                }
            },
            /*ThrowableItem.UpdateVisualEffects end.*/

            /*ThrowableItem.StopVisualEffects start.*/
            StopVisualEffects: function () {
                this._savedPosition = this.transform.position.$clone();
                this._savedRotation = this.transform.rotation.$clone();
                this._visualEffectsActive = false;
                if (UnityEngine.Component.op_Inequality(this.visualChild, null)) {
                    this.visualChild.gameObject.SetActive(false);
                }
                this.ShowMainRenderer();
                this.transform.position = this._savedPosition.$clone();
                this.transform.rotation = this._savedRotation.$clone();
            },
            /*ThrowableItem.StopVisualEffects end.*/

            /*ThrowableItem.AttachTo start.*/
            AttachTo: function (hole) {
                if (this.pickedUp) {
                    return;
                }
                this.pickedUp = true;
                this.StopVisualEffects();
                this._originalParent = this.transform.parent;
                if (UnityEngine.Component.op_Inequality(this._rb, null)) {
                    this._rb.isKinematic = true;
                    this._rb.velocity = pc.Vec3.ZERO.clone();
                    this._rb.angularVelocity = pc.Vec3.ZERO.clone();
                    this._rb.useGravity = false;
                    this._rb.detectCollisions = false;
                }
                if (this._colliders != null) {
                    for (var i = 0; i < this._colliders.length; i = (i + 1) | 0) {
                        if (UnityEngine.Component.op_Inequality(this._colliders[i], null)) {
                            this._colliders[i].enabled = false;
                        }
                    }
                }
                this.transform.SetParent(hole);
                var targetPos = new pc.Vec3( 0.0, this.snapOffsetY, 0.0 );
                var targetRot = pc.Quat.IDENTITY.clone();
                if (this.smoothSnap) {
                    TransformExtensions.SmoothLerpLocal(this.transform, this, targetPos.$clone(), targetRot.$clone(), this.snapDuration);
                    return;
                }
                this.transform.localPosition = targetPos.$clone();
                this.transform.localRotation = targetRot.$clone();
            },
            /*ThrowableItem.AttachTo end.*/

            /*ThrowableItem.ThrowForward start.*/
            ThrowForward: function (forward) {
                if (!this.pickedUp) {
                    return;
                }
                this.pickedUp = false;
                this.transform.SetParent(this._originalParent);
                if (UnityEngine.Component.op_Inequality(this._rb, null)) {
                    this.SaveAndSetLayerRecursively(this.transform, UnityEngine.LayerMask.NameToLayer("Default"));
                    if (this._colliders != null) {
                        for (var i = 0; i < this._colliders.length; i = (i + 1) | 0) {
                            if (UnityEngine.Component.op_Inequality(this._colliders[i], null)) {
                                this._colliders[i].enabled = true;
                            }
                        }
                    }
                    this._rb.detectCollisions = true;
                    this._rb.useGravity = true;
                    this._rb.isKinematic = false;
                    this._rb.velocity = pc.Vec3.ZERO.clone();
                    this._rb.angularVelocity = pc.Vec3.ZERO.clone();
                    var impulse = forward.clone().normalize().$clone().clone().scale( this.throwForce ).add( pc.Vec3.UP.clone().clone().scale( this.throwUpward ) );
                    this._rb.AddForce$1(impulse, UnityEngine.ForceMode.VelocityChange);
                    this._rb.AddTorque$1(UnityEngine.Random.onUnitSphere.$clone().clone().scale( this.spinTorque ), UnityEngine.ForceMode.VelocityChange);
                    this._throwTime = UnityEngine.Time.time;
                }
                this.StartCoroutine$1(this.RestoreLayersAndCleanupAfterDelay(this.throwProtectDuration));
            },
            /*ThrowableItem.ThrowForward end.*/

            /*ThrowableItem.SaveAndSetLayerRecursively start.*/
            SaveAndSetLayerRecursively: function (root, newLayer) {
                var $t;
                this._savedLayerObjects.clear();
                this._savedLayers.clear();
                var componentsInChildren = root.GetComponentsInChildren$1(UnityEngine.Transform, true);
                $t = Bridge.getEnumerator(componentsInChildren);
                try {
                    while ($t.moveNext()) {
                        var t = $t.Current;
                        var go = t.gameObject;
                        this._savedLayerObjects.add(go);
                        this._savedLayers.add(go.layer);
                        go.layer = newLayer;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*ThrowableItem.SaveAndSetLayerRecursively end.*/

            /*ThrowableItem.RestoreSavedLayers start.*/
            RestoreSavedLayers: function () {
                var count = UnityEngine.Mathf.Min(this._savedLayerObjects.Count, this._savedLayers.Count);
                for (var i = 0; i < count; i = (i + 1) | 0) {
                    var go = this._savedLayerObjects.getItem(i);
                    if (UnityEngine.GameObject.op_Inequality(go, null)) {
                        go.layer = this._savedLayers.getItem(i);
                    }
                }
                this._savedLayerObjects.clear();
                this._savedLayers.clear();
            },
            /*ThrowableItem.RestoreSavedLayers end.*/

            /*ThrowableItem.RestoreLayersAndCleanupAfterDelay start.*/
            RestoreLayersAndCleanupAfterDelay: function (delay) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if (delay > 0.0) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 3;
                                        continue;
                                }
                                case 1: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(delay);
                                        $step = 2;
                                        return true;
                                }
                                case 2: {
                                    $step = 3;
                                    continue;
                                }
                                case 3: {
                                    this.RestoreSavedLayers();
                                        UnityEngine.Object.Destroy(this);

                                }
                                default: {
                                    return false;
                                }
                            }
                        }
                    } catch($async_e1) {
                        $async_e = System.Exception.create($async_e1);
                        throw $async_e;
                    }
                }));
                return $enumerator;
            },
            /*ThrowableItem.RestoreLayersAndCleanupAfterDelay end.*/

            /*ThrowableItem.OnCollisionEnter start.*/
            OnCollisionEnter: function (collision) {
                var $t;
                if (!this.hasHitTower && !(UnityEngine.Component.op_Equality(this._rb, null)) && !(UnityEngine.Component.op_Equality((UnityEngine.MonoBehaviour.op_Inequality(($t = collision.collider.GetComponent(SupportActivator)), null) ? $t.tower : null), null)) && this.IsPlayerThrown()) {
                    this.hasHitTower = true;
                    UnityEngine.MonoBehaviour.op_Inequality(GameManager.instance, null) ? GameManager.instance.OnTowerHit() : null;
                }
            },
            /*ThrowableItem.OnCollisionEnter end.*/

            /*ThrowableItem.OnTriggerEnter start.*/
            OnTriggerEnter: function (other) {
                var $t;
                if (!this.hasHitTower && !(UnityEngine.Component.op_Equality(this._rb, null)) && !(UnityEngine.Component.op_Equality((UnityEngine.MonoBehaviour.op_Inequality(($t = other.GetComponent(SupportActivator)), null) ? $t.tower : null), null)) && this.IsPlayerThrown()) {
                    this.hasHitTower = true;
                    UnityEngine.MonoBehaviour.op_Inequality(GameManager.instance, null) ? GameManager.instance.OnTowerHit() : null;
                }
            },
            /*ThrowableItem.OnTriggerEnter end.*/

            /*ThrowableItem.IsPlayerThrown start.*/
            IsPlayerThrown: function () {
                if (UnityEngine.Component.op_Equality(this._rb, null)) {
                    return false;
                }
                var timeSinceThrow = UnityEngine.Time.time - this._throwTime;
                if (timeSinceThrow > this.throwProtectDuration) {
                    return false;
                }
                return this._rb.velocity.lengthSq() > 0.01;
            },
            /*ThrowableItem.IsPlayerThrown end.*/

            /*ThrowableItem.HideMainRenderer start.*/
            HideMainRenderer: function () {
                var originalMeshRenderer = this.GetComponent(UnityEngine.MeshRenderer);
                if (UnityEngine.Component.op_Inequality(originalMeshRenderer, null)) {
                    originalMeshRenderer.enabled = false;
                }
            },
            /*ThrowableItem.HideMainRenderer end.*/

            /*ThrowableItem.ShowMainRenderer start.*/
            ShowMainRenderer: function () {
                var originalMeshRenderer = this.GetComponent(UnityEngine.MeshRenderer);
                if (UnityEngine.Component.op_Inequality(originalMeshRenderer, null)) {
                    originalMeshRenderer.enabled = true;
                }
            },
            /*ThrowableItem.ShowMainRenderer end.*/


        }
    });
    /*ThrowableItem end.*/

    /*ThrowableObjectType start.*/
    Bridge.define("ThrowableObjectType", {
        $kind: 6,
        statics: {
            fields: {
                Pumpkins: 0,
                Watermelon: 1
            }
        }
    });
    /*ThrowableObjectType end.*/

    /*ThrowablePusher start.*/
    Bridge.define("ThrowablePusher", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            methods: {
                /*ThrowablePusher.TriggerCascadeIfTopRows:static start.*/
                TriggerCascadeIfTopRows: function (sa) {
                    if (UnityEngine.Component.op_Equality(sa.tower, null) || sa.rowIndex >= 3) {
                        return;
                    }
                    var idx = sa.tower.GetComponent(TowerRuntimeIndex);
                    if (UnityEngine.MonoBehaviour.op_Equality(idx, null)) {
                        return;
                    }
                    var list = idx.members;
                    for (var i = 0; i < list.Count; i = (i + 1) | 0) {
                        var other = list.getItem(i);
                        if (!(UnityEngine.MonoBehaviour.op_Equality(other, null))) {
                            other.ForceActivate();
                        }
                    }
                },
                /*ThrowablePusher.TriggerCascadeIfTopRows:static end.*/


            }
        },
        fields: {
            pushRadius: 0,
            pushForce: 0,
            victimMask: null,
            _rb: null,
            _castHits: null,
            _overlapBuffer: null
        },
        ctors: {
            init: function () {
                this.victimMask = new UnityEngine.LayerMask();
                this.pushRadius = 1.0;
                this.pushForce = 14.0;
            }
        },
        methods: {
            /*ThrowablePusher.Awake start.*/
            Awake: function () {
                this._rb = this.GetComponent(UnityEngine.Rigidbody);
                this._castHits = PhysicsObjectPool.GetRaycastHits(8);
                this._overlapBuffer = PhysicsObjectPool.GetColliders(16);
            },
            /*ThrowablePusher.Awake end.*/

            /*ThrowablePusher.OnDestroy start.*/
            OnDestroy: function () {
                if (this._castHits != null) {
                    PhysicsObjectPool.ReturnRaycastHits(this._castHits);
                    this._castHits = null;
                }
                if (this._overlapBuffer != null) {
                    PhysicsObjectPool.ReturnColliders(this._overlapBuffer);
                    this._overlapBuffer = null;
                }
            },
            /*ThrowablePusher.OnDestroy end.*/

            /*ThrowablePusher.OnCollisionEnter start.*/
            OnCollisionEnter: function (collision) {
                var sa = ((UnityEngine.Component.op_Inequality(collision.collider, null)) ? collision.collider.GetComponentInParent(SupportActivator) : null);
                if (UnityEngine.MonoBehaviour.op_Inequality(sa, null)) {
                    ThrowablePusher.TriggerCascadeIfTopRows(sa);
                }
                this.Pulse();
            },
            /*ThrowablePusher.OnCollisionEnter end.*/

            /*ThrowablePusher.OnTriggerEnter start.*/
            OnTriggerEnter: function (other) {
                this.Pulse();
            },
            /*ThrowablePusher.OnTriggerEnter end.*/

            /*ThrowablePusher.FixedUpdate start.*/
            FixedUpdate: function () {
                if (UnityEngine.Component.op_Equality(this._rb, null)) {
                    return;
                }
                var speed = this._rb.velocity.length();
                if (speed < 0.1) {
                    return;
                }
                var dir = this._rb.velocity.clone().normalize().$clone();
                var distance = speed * UnityEngine.Time.fixedDeltaTime * 2.0 + this.pushRadius * 0.5;
                var hitCount = UnityEngine.Physics.SphereCastNonAlloc$1(this.transform.position, this.pushRadius * 0.5, dir, this._castHits, distance, UnityEngine.LayerMask.op_Implicit(this.victimMask.$clone()), UnityEngine.QueryTriggerInteraction.Ignore);
                for (var i = 0; i < hitCount; i = (i + 1) | 0) {
                    var hit = this._castHits[i].$clone();
                    var rb = ((UnityEngine.Component.op_Inequality(hit.rigidbody, null)) ? hit.rigidbody : hit.collider.attachedRigidbody);
                    if (UnityEngine.Component.op_Equality(rb, null) || UnityEngine.Component.op_Equality(rb, this._rb)) {
                        continue;
                    }
                    if (rb.isKinematic) {
                        var activator = rb.GetComponent(SupportActivator) || rb.GetComponentInChildren(SupportActivator);
                        if (UnityEngine.MonoBehaviour.op_Inequality(activator, null)) {
                            activator.ForceActivate();
                        } else {
                            rb.isKinematic = false;
                        }
                    }
                    var sa = ((UnityEngine.Component.op_Inequality(rb, null)) ? rb.GetComponent(SupportActivator) : null) || hit.collider.GetComponentInParent(SupportActivator);
                    if (UnityEngine.MonoBehaviour.op_Inequality(sa, null)) {
                        ThrowablePusher.TriggerCascadeIfTopRows(sa);
                    }
                    rb.AddForce$1((dir.$clone().add( pc.Vec3.UP.clone().clone().scale( 0.15 ) )).clone().scale( this.pushForce ), UnityEngine.ForceMode.Impulse);
                }
            },
            /*ThrowablePusher.FixedUpdate end.*/

            /*ThrowablePusher.Pulse start.*/
            Pulse: function () {
                var hitCount = UnityEngine.Physics.OverlapSphereNonAlloc(this.transform.position, this.pushRadius, this._overlapBuffer, UnityEngine.LayerMask.op_Implicit(this.victimMask.$clone()), UnityEngine.QueryTriggerInteraction.Ignore);
                for (var i = 0; i < hitCount; i = (i + 1) | 0) {
                    var hit = this._overlapBuffer[i];
                    if (UnityEngine.Component.op_Equality(hit, null)) {
                        continue;
                    }
                    var rb = hit.attachedRigidbody;
                    if (UnityEngine.Component.op_Inequality(rb, null) && rb.isKinematic) {
                        var activator = rb.GetComponent(SupportActivator) || rb.GetComponentInChildren(SupportActivator);
                        if (UnityEngine.MonoBehaviour.op_Inequality(activator, null)) {
                            activator.ForceActivate();
                        } else {
                            rb.isKinematic = false;
                        }
                    }
                    if (UnityEngine.Component.op_Inequality(rb, null)) {
                        var dir = (hit.transform.position.$clone().sub( this.transform.position )).clone().normalize().$clone();
                        rb.AddForce$1((dir.$clone().add( pc.Vec3.UP.clone().clone().scale( 0.2 ) )).clone().scale( this.pushForce ), UnityEngine.ForceMode.Impulse);
                    }
                }
            },
            /*ThrowablePusher.Pulse end.*/


        }
    });
    /*ThrowablePusher end.*/

    /*TowerRegistry start.*/
    Bridge.define("TowerRegistry", {
        statics: {
            fields: {
                _map: null,
                _empty: null
            },
            ctors: {
                init: function () {
                    this._map = new (System.Collections.Generic.Dictionary$2(UnityEngine.Transform,System.Collections.Generic.List$1(SupportActivator))).ctor();
                    this._empty = new (System.Collections.Generic.List$1(SupportActivator)).$ctor2(0);
                }
            },
            methods: {
                /*TowerRegistry.Register:static start.*/
                Register: function (tower, activator) {
                    if (!(UnityEngine.Component.op_Equality(tower, null)) && !(UnityEngine.MonoBehaviour.op_Equality(activator, null))) {
                        var list = { };
                        if (!TowerRegistry._map.tryGetValue(tower, list)) {
                            list.v = new (System.Collections.Generic.List$1(SupportActivator)).$ctor2(64);
                            TowerRegistry._map.setItem(tower, list.v);
                        }
                        if (!list.v.contains(activator)) {
                            list.v.add(activator);
                        }
                    }
                },
                /*TowerRegistry.Register:static end.*/

                /*TowerRegistry.Unregister:static start.*/
                Unregister: function (tower, activator) {
                    var list = { };
                    if (!(UnityEngine.Component.op_Equality(tower, null)) && !(UnityEngine.MonoBehaviour.op_Equality(activator, null)) && TowerRegistry._map.tryGetValue(tower, list)) {
                        list.v.remove(activator);
                        if (list.v.Count === 0) {
                            TowerRegistry._map.remove(tower);
                        }
                    }
                },
                /*TowerRegistry.Unregister:static end.*/

                /*TowerRegistry.GetAll:static start.*/
                GetAll: function (tower) {
                    if (UnityEngine.Component.op_Equality(tower, null)) {
                        return TowerRegistry._empty;
                    }
                    var list = { };
                    return TowerRegistry._map.tryGetValue(tower, list) ? list.v : TowerRegistry._empty;
                },
                /*TowerRegistry.GetAll:static end.*/


            }
        }
    });
    /*TowerRegistry end.*/

    /*TowerRuntimeIndex start.*/
    Bridge.define("TowerRuntimeIndex", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            members: null
        },
        ctors: {
            init: function () {
                this.members = new (System.Collections.Generic.List$1(SupportActivator)).$ctor2(128);
            }
        },
        methods: {
            /*TowerRuntimeIndex.Clear start.*/
            Clear: function () {
                this.members.clear();
            },
            /*TowerRuntimeIndex.Clear end.*/

            /*TowerRuntimeIndex.Register start.*/
            Register: function (activator) {
                if (!(UnityEngine.MonoBehaviour.op_Equality(activator, null)) && !this.members.contains(activator)) {
                    this.members.add(activator);
                }
            },
            /*TowerRuntimeIndex.Register end.*/

            /*TowerRuntimeIndex.Unregister start.*/
            Unregister: function (activator) {
                if (!(UnityEngine.MonoBehaviour.op_Equality(activator, null))) {
                    this.members.remove(activator);
                }
            },
            /*TowerRuntimeIndex.Unregister end.*/


        }
    });
    /*TowerRuntimeIndex end.*/

    /*TransformExtensions start.*/
    Bridge.define("TransformExtensions", {
        statics: {
            methods: {
                /*TransformExtensions.SmoothLerpLocal:static start.*/
                SmoothLerpLocal: function (transform, runner, targetLocalPos, targetLocalRot, duration) {
                    if (UnityEngine.MonoBehaviour.op_Equality(runner, null)) {
                        return null;
                    }
                    return runner.StartCoroutine$1(TransformExtensions.SmoothLerpLocalCoroutine(transform, targetLocalPos.$clone(), targetLocalRot.$clone(), duration));
                },
                /*TransformExtensions.SmoothLerpLocal:static end.*/

                /*TransformExtensions.SmoothLerpLocalCoroutine:static start.*/
                SmoothLerpLocalCoroutine: function (t, targetPos, targetRot, duration) {
                    var $step = 0,
                        $jumpFromFinally,
                        $returnValue,
                        startPos,
                        startRot,
                        time,
                        t2,
                        $async_e;

                    var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                        try {
                            for (;;) {
                                switch ($step) {
                                    case 0: {
                                        if (UnityEngine.Component.op_Equality(t, null)) {
                                                $step = 1;
                                                continue;
                                            } 
                                            $step = 2;
                                            continue;
                                    }
                                    case 1: {
                                        return false;
                                    }
                                    case 2: {
                                        if (duration <= 0.0) {
                                                $step = 3;
                                                continue;
                                            } 
                                            $step = 4;
                                            continue;
                                    }
                                    case 3: {
                                        t.localPosition = targetPos.$clone();
                                            t.localRotation = targetRot.$clone();
                                            return false;
                                        $step = 4;
                                        continue;
                                    }
                                    case 4: {
                                        startPos = t.localPosition.$clone();
                                            startRot = t.localRotation.$clone();
                                            time = 0.0;
                                        $step = 5;
                                        continue;
                                    }
                                    case 5: {
                                        if ( time < duration ) {
                                                $step = 6;
                                                continue;
                                            } 
                                            $step = 8;
                                            continue;
                                    }
                                    case 6: {
                                        t2 = time / duration;
                                            t.localPosition = new pc.Vec3().lerp( startPos, targetPos, t2 );
                                            t.localRotation = new pc.Quat().slerp( startRot, targetRot, t2 );
                                            time += UnityEngine.Time.deltaTime;
                                            $enumerator.current = null;
                                            $step = 7;
                                            return true;
                                    }
                                    case 7: {
                                        
                                            $step = 5;
                                            continue;
                                    }
                                    case 8: {
                                        t.localPosition = targetPos.$clone();
                                            t.localRotation = targetRot.$clone();

                                    }
                                    default: {
                                        return false;
                                    }
                                }
                            }
                        } catch($async_e1) {
                            $async_e = System.Exception.create($async_e1);
                            throw $async_e;
                        }
                    }));
                    return $enumerator;
                },
                /*TransformExtensions.SmoothLerpLocalCoroutine:static end.*/


            }
        }
    });
    /*TransformExtensions end.*/

    /*TriggerDetector start.*/
    Bridge.define("TriggerDetector", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            OnTrigger: null,
            detectedLayerMask: null
        },
        ctors: {
            init: function () {
                this.detectedLayerMask = new UnityEngine.LayerMask();
            }
        },
        methods: {
            /*TriggerDetector.OnTriggerEnter start.*/
            OnTriggerEnter: function (other) {
                if (((1 << other.gameObject.layer) & UnityEngine.LayerMask.op_Implicit(this.detectedLayerMask)) !== 0) {
                    !Bridge.staticEquals(this.OnTrigger, null) ? this.OnTrigger() : null;
                }
            },
            /*TriggerDetector.OnTriggerEnter end.*/


        }
    });
    /*TriggerDetector end.*/

    /*TutoCursor start.*/
    Bridge.define("TutoCursor", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            cursorImage: null
        },
        methods: {
            /*TutoCursor.Start start.*/
            Start: function () {
                var $t;
                this.cursorImage.enabled = PlayableSettings.instance.enableMovingHand;
                this.cursorImage.sprite = ($t = PlayableSettings.instance.cursors)[PlayableSettings.instance.handCursor];
                this.cursorImage.transform.localScale = new pc.Vec3( 1, 1, 1 ).clone().scale( PlayableSettings.instance.cursorScale );
            },
            /*TutoCursor.Start end.*/


        }
    });
    /*TutoCursor end.*/

    /*UIManager start.*/
    Bridge.define("UIManager", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                instance: null
            }
        },
        fields: {
            playScreen: null,
            winScreen: null,
            loseScreen: null,
            shootScreen: null,
            timerText: null,
            objectiveAmount: null,
            objectiveSlider: null,
            timeBarImage: null,
            anim: null,
            isTimerAnimPlaying: false,
            topBanner: null,
            midBanner: null,
            bottomBanner: null,
            handCursor: null,
            handTutoCursor: null,
            introText: null
        },
        methods: {
            /*UIManager.Awake start.*/
            Awake: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(UIManager.instance, null)) {
                    UIManager.instance = this;
                }
                this.playScreen.SetActive(true);
            },
            /*UIManager.Awake end.*/

            /*UIManager.UpdateTimer start.*/
            UpdateTimer: function (amount) {
                var minutes = Math.floor(amount / 60.0);
                var seconds = Math.floor(amount % 60.0);
                if (UnityEngine.MonoBehaviour.op_Inequality(this.timerText, null)) {
                    this.timerText.text = System.String.format("{0:0}:{1:00}", Bridge.box(minutes, System.Int32), Bridge.box(seconds, System.Int32));
                }
                this.UpdateTimeBar(amount);
                if (amount < 5.0 && !this.isTimerAnimPlaying) {
                    this.anim.Play$2("Timer Low");
                    this.isTimerAnimPlaying = true;
                }
            },
            /*UIManager.UpdateTimer end.*/

            /*UIManager.UpdateTimeBar start.*/
            UpdateTimeBar: function (currentTime) {
                if (UnityEngine.MonoBehaviour.op_Inequality(this.timeBarImage, null)) {
                    var fillAmount = currentTime / PlayableSettings.instance.gameTimeInSeconds;
                    this.timeBarImage.fillAmount = Math.max(0, Math.min(1, fillAmount));
                }
            },
            /*UIManager.UpdateTimeBar end.*/

            /*UIManager.UpdateSlider start.*/
            UpdateSlider: function (amount) {
                this.objectiveAmount.text = System.Single.format(amount) + " / " + PlayableSettings.instance.maxObjectiveAmount;
                this.objectiveSlider.value = amount / PlayableSettings.instance.maxObjectiveAmount;
            },
            /*UIManager.UpdateSlider end.*/

            /*UIManager.ShowShootScreen start.*/
            ShowShootScreen: function () {
                this.shootScreen.SetActive(true);
                Luna.Unity.Analytics.LogEvent$1("screen_shoot_showed", 1);
                if (UnityEngine.MonoBehaviour.op_Inequality(this.handCursor, null)) {
                    this.handCursor.SetForceHidden(true);
                }
            },
            /*UIManager.ShowShootScreen end.*/

            /*UIManager.HideShootScreenAfterShoot start.*/
            HideShootScreenAfterShoot: function () {
                this.shootScreen.SetActive(false);
                if (UnityEngine.MonoBehaviour.op_Inequality(this.handCursor, null)) {
                    this.handCursor.SetForceHidden(false);
                }
            },
            /*UIManager.HideShootScreenAfterShoot end.*/

            /*UIManager.ShowEndScreen start.*/
            ShowEndScreen: function (isWin) {
                var screen = (isWin ? this.winScreen : this.loseScreen);
                this.playScreen.gameObject.SetActive(false);
                screen.SetActive(true);
                Luna.Unity.Analytics.LogEvent(Luna.Unity.Analytics.EventType.EndCardShown);
                if (isWin) {
                    Luna.Unity.Analytics.LogEvent$1("screen_win_showed", 1);
                } else {
                    Luna.Unity.Analytics.LogEvent$1("screen_lose_showed", 1);
                }
            },
            /*UIManager.ShowEndScreen end.*/

            /*UIManager.OnButtonClick start.*/
            OnButtonClick: function () {
                Luna.Unity.Playable.InstallFullGame();
                Luna.Unity.Analytics.LogEvent$1("Button clicked", 1);
                Luna.Unity.LifeCycle.GameEnded();
            },
            /*UIManager.OnButtonClick end.*/

            /*UIManager.ShowIntroText start.*/
            ShowIntroText: function (text) {
                if (UnityEngine.MonoBehaviour.op_Inequality(this.introText, null)) {
                    this.introText.text = text;
                    this.introText.gameObject.SetActive(true);
                }
            },
            /*UIManager.ShowIntroText end.*/

            /*UIManager.HideIntroText start.*/
            HideIntroText: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(this.introText, null)) {
                    this.introText.gameObject.SetActive(false);
                }
            },
            /*UIManager.HideIntroText end.*/


        }
    });
    /*UIManager end.*/

    /*Utils start.*/
    Bridge.define("Utils", {
        methods: {
            /*Utils.SwitchChild start.*/
            SwitchChild: function (parent, index) {
                for (var i = 0; i < parent.childCount; i = (i + 1) | 0) {
                    parent.GetChild(i).gameObject.SetActive(false);
                }
                parent.GetChild(index).gameObject.SetActive(true);
            },
            /*Utils.SwitchChild end.*/

            /*Utils.WrapIndex start.*/
            WrapIndex: function (bounds, index) {
                var result = index;
                if (result > ((bounds - 1) | 0)) {
                    result = 0;
                }
                if (result < 0) {
                    result = (bounds - 1) | 0;
                }
                return result;
            },
            /*Utils.WrapIndex end.*/


        }
    });
    /*Utils end.*/

    if ( MODULE_reflection ) {
    var $m = Bridge.setMetadata,
        $n = ["UnityEngine","System","System.Collections","System.Collections.Generic","UnityEngine.UI","Cinemachine","HG.Playables.Tools"];

    /*AimArrow start.*/
    $m("AimArrow", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"GetForward","t":8,"pi":[{"n":"reference","pt":$n[0].Transform,"ps":0}],"sn":"GetForward","rt":$n[0].Vector3,"p":[$n[0].Transform]},{"a":1,"n":"OnEnable","t":8,"sn":"OnEnable","rt":$n[1].Void},{"a":2,"n":"SetArrowColor","t":8,"pi":[{"n":"color","pt":$n[0].Color,"ps":0}],"sn":"SetArrowColor","rt":$n[1].Void,"p":[$n[0].Color]},{"a":2,"n":"SetVisible","t":8,"pi":[{"n":"isVisible","pt":$n[1].Boolean,"ps":0}],"sn":"SetVisible","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"_angle","t":4,"rt":$n[1].Single,"sn":"_angle","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_dir","t":4,"rt":$n[1].Int32,"sn":"_dir","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"arrowSprites","t":4,"rt":System.Array.type(UnityEngine.SpriteRenderer),"sn":"arrowSprites"},{"a":2,"n":"maxAngle","t":4,"rt":$n[1].Single,"sn":"maxAngle","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"minAngle","t":4,"rt":$n[1].Single,"sn":"minAngle","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"speed","t":4,"rt":$n[1].Single,"sn":"speed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"visible","t":4,"rt":$n[1].Boolean,"sn":"visible","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*AimArrow end.*/

    /*AudioClipSetterLuna start.*/
    $m("AudioClipSetterLuna", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"playSoundAwake","t":4,"rt":$n[1].Boolean,"sn":"playSoundAwake","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"source","t":4,"rt":$n[0].AudioSource,"sn":"source"}]}; }, $n);
    /*AudioClipSetterLuna end.*/

    /*AudioManager start.*/
    $m("AudioManager", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"GetAudioClip","t":8,"pi":[{"n":"soundEffect","pt":SoundEffect,"ps":0}],"sn":"GetAudioClip","rt":$n[0].AudioClip,"p":[SoundEffect]},{"a":1,"n":"GetAvailableAudioSource","t":8,"sn":"GetAvailableAudioSource","rt":$n[0].AudioSource},{"a":1,"n":"GetVolumeForSoundType","t":8,"pi":[{"n":"soundEffect","pt":SoundEffect,"ps":0}],"sn":"GetVolumeForSoundType","rt":$n[1].Single,"p":[SoundEffect],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"InitializeAudioSources","t":8,"sn":"InitializeAudioSources","rt":$n[1].Void},{"a":1,"n":"InitializePool","t":8,"sn":"InitializePool","rt":$n[1].Void},{"a":1,"n":"OnDestroy","t":8,"sn":"OnDestroy","rt":$n[1].Void},{"a":1,"n":"OnMute","t":8,"sn":"OnMute","rt":$n[1].Void},{"a":1,"n":"OnUnmute","t":8,"sn":"OnUnmute","rt":$n[1].Void},{"a":2,"n":"PlayFailSound","t":8,"sn":"PlayFailSound","rt":$n[1].Void},{"a":2,"n":"PlayHoleGrowSound","t":8,"sn":"PlayHoleGrowSound","rt":$n[1].Void},{"a":2,"n":"PlayIntroSound","t":8,"sn":"PlayIntroSound","rt":$n[1].Void},{"a":2,"n":"PlayShootSound","t":8,"sn":"PlayShootSound","rt":$n[1].Void},{"a":2,"n":"PlaySound","t":8,"pi":[{"n":"soundEffect","pt":SoundEffect,"ps":0},{"n":"volume","dv":1.0,"o":true,"pt":$n[1].Single,"ps":1},{"n":"pitch","dv":1.0,"o":true,"pt":$n[1].Single,"ps":2}],"sn":"PlaySound","rt":$n[1].Void,"p":[SoundEffect,$n[1].Single,$n[1].Single]},{"a":2,"n":"PlaySoundOneShot","t":8,"pi":[{"n":"soundEffect","pt":SoundEffect,"ps":0},{"n":"volume","dv":1.0,"o":true,"pt":$n[1].Single,"ps":1},{"n":"pitch","dv":1.0,"o":true,"pt":$n[1].Single,"ps":2}],"sn":"PlaySoundOneShot","rt":$n[1].Void,"p":[SoundEffect,$n[1].Single,$n[1].Single]},{"a":2,"n":"PlayTowerHitSound","t":8,"sn":"PlayTowerHitSound","rt":$n[1].Void},{"a":2,"n":"PlayWinSound","t":8,"sn":"PlayWinSound","rt":$n[1].Void},{"a":1,"n":"ReturnToPoolWhenFinished","t":8,"pi":[{"n":"source","pt":$n[0].AudioSource,"ps":0}],"sn":"ReturnToPoolWhenFinished","rt":$n[2].IEnumerator,"p":[$n[0].AudioSource]},{"a":2,"n":"SetMusicVolume","t":8,"pi":[{"n":"volume","pt":$n[1].Single,"ps":0}],"sn":"SetMusicVolume","rt":$n[1].Void,"p":[$n[1].Single]},{"a":2,"n":"SetSFXVolume","t":8,"pi":[{"n":"volume","pt":$n[1].Single,"ps":0}],"sn":"SetSFXVolume","rt":$n[1].Void,"p":[$n[1].Single]},{"a":2,"n":"SetUIVolume","t":8,"pi":[{"n":"volume","pt":$n[1].Single,"ps":0}],"sn":"SetUIVolume","rt":$n[1].Void,"p":[$n[1].Single]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"StopAllSounds","t":8,"sn":"StopAllSounds","rt":$n[1].Void},{"a":1,"n":"UpdateVolumesFromSettings","t":8,"sn":"UpdateVolumesFromSettings","rt":$n[1].Void},{"a":1,"n":"PlayableSettings","t":16,"rt":PlayableSettings,"g":{"a":1,"n":"get_PlayableSettings","t":8,"rt":PlayableSettings,"fg":"PlayableSettings"},"fn":"PlayableSettings"},{"a":1,"n":"POOL_SIZE","is":true,"t":4,"rt":$n[1].Int32,"sn":"POOL_SIZE","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"activeAudioSources","t":4,"rt":$n[3].List$1(UnityEngine.AudioSource),"sn":"activeAudioSources"},{"a":1,"n":"audioSourcePool","t":4,"rt":$n[3].Queue$1(UnityEngine.AudioSource),"sn":"audioSourcePool"},{"a":2,"n":"instance","is":true,"t":4,"rt":AudioManager,"sn":"instance"},{"a":1,"n":"isMuted","t":4,"rt":$n[1].Boolean,"sn":"isMuted","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Audio Sources"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"musicSource","t":4,"rt":$n[0].AudioSource,"sn":"musicSource"},{"at":[new UnityEngine.HeaderAttribute("Settings"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"musicVolume","t":4,"rt":$n[1].Single,"sn":"musicVolume","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"sfxSource","t":4,"rt":$n[0].AudioSource,"sn":"sfxSource"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"sfxVolume","t":4,"rt":$n[1].Single,"sn":"sfxVolume","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"uiSource","t":4,"rt":$n[0].AudioSource,"sn":"uiSource"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"uiVolume","t":4,"rt":$n[1].Single,"sn":"uiVolume","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*AudioManager end.*/

    /*AudioManagerSetup start.*/
    $m("AudioManagerSetup", function () { return {"att":1056769,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"CreateAudioManager","t":8,"sn":"CreateAudioManager","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Create Audio Manager")],"a":2,"n":"CreateAudioManagerManually","t":8,"sn":"CreateAudioManagerManually","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"at":[new UnityEngine.HeaderAttribute("Audio Manager Setup"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"createAudioManagerOnStart","t":4,"rt":$n[1].Boolean,"sn":"createAudioManagerOnStart","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*AudioManagerSetup end.*/

    /*ColoredMaterial start.*/
    $m("ColoredMaterial", function () { return {"att":1056769,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"ColorField","t":4,"rt":$n[1].String,"sn":"ColorField"},{"a":2,"n":"DefaultColor","t":4,"rt":$n[0].Color,"sn":"DefaultColor"},{"a":2,"n":"Material","t":4,"rt":$n[0].Material,"sn":"Material"},{"a":2,"n":"MaterialHolder","t":4,"rt":MaterialHolder,"sn":"MaterialHolder","box":function ($v) { return Bridge.box($v, MaterialHolder, System.Enum.toStringFn(MaterialHolder));}},{"a":2,"n":"TextureField","t":4,"rt":$n[1].String,"sn":"TextureField"},{"a":2,"n":"Textures","t":4,"rt":System.Array.type(UnityEngine.Texture),"sn":"Textures"}]}; }, $n);
    /*ColoredMaterial end.*/

    /*FontSetterLuna start.*/
    $m("FontSetterLuna", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"textReference","t":4,"rt":$n[4].Text,"sn":"textReference"}]}; }, $n);
    /*FontSetterLuna end.*/

    /*GameManager start.*/
    $m("GameManager", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"AreAllThrowablesInactive","t":8,"sn":"AreAllThrowablesInactive","rt":$n[1].Boolean,"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"AutoRedirectAfterDelay","t":8,"pi":[{"n":"delay","pt":$n[1].Single,"ps":0}],"sn":"AutoRedirectAfterDelay","rt":$n[2].IEnumerator,"p":[$n[1].Single]},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"CheckTowerShootingConditions","t":8,"sn":"CheckTowerShootingConditions","rt":$n[1].Void},{"a":2,"n":"GameOver","t":8,"pi":[{"n":"isWin","pt":$n[1].Boolean,"ps":0}],"sn":"GameOver","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"GameOverCoroutine","t":8,"pi":[{"n":"isWin","pt":$n[1].Boolean,"ps":0}],"sn":"GameOverCoroutine","rt":$n[2].IEnumerator,"p":[$n[1].Boolean]},{"a":1,"n":"LoadLevel","t":8,"pi":[{"n":"level","pt":$n[1].Int32,"ps":0}],"sn":"LoadLevel","rt":$n[1].Void,"p":[$n[1].Int32]},{"a":2,"n":"OnBottomBannerClick","t":8,"sn":"OnBottomBannerClick","rt":$n[1].Void},{"a":2,"n":"OnButtonClick","t":8,"sn":"OnButtonClick","rt":$n[1].Void},{"a":1,"n":"OnIntroCompleted","t":8,"sn":"OnIntroCompleted","rt":$n[1].Void},{"a":2,"n":"OnPlayerShot","t":8,"sn":"OnPlayerShot","rt":$n[1].Void},{"a":2,"n":"OnTowerHit","t":8,"sn":"OnTowerHit","rt":$n[1].Void},{"a":1,"n":"SetupThrowableObjects","t":8,"sn":"SetupThrowableObjects","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"UpdateTimer","t":8,"sn":"UpdateTimer","rt":$n[2].IEnumerator},{"a":1,"n":"PlayableSettings","t":16,"rt":PlayableSettings,"g":{"a":1,"n":"get_PlayableSettings","t":8,"rt":PlayableSettings,"fg":"PlayableSettings"},"fn":"PlayableSettings"},{"a":1,"n":"_maxObjectiveAmount","t":4,"rt":$n[1].Int32,"sn":"_maxObjectiveAmount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_shotTime","t":4,"rt":$n[1].Single,"sn":"_shotTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"currentObjectiveAmount","t":4,"rt":$n[1].Int32,"sn":"currentObjectiveAmount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"currentTime","t":4,"rt":$n[1].Single,"sn":"currentTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"flower","t":4,"rt":$n[0].GameObject,"sn":"flower"},{"a":2,"n":"gravity","t":4,"rt":$n[1].Single,"sn":"gravity","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"hasShot","t":4,"rt":$n[1].Boolean,"sn":"hasShot","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"instance","is":true,"t":4,"rt":GameManager,"sn":"instance"},{"a":2,"n":"isGameOver","t":4,"rt":$n[1].Boolean,"sn":"isGameOver","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"levelContainer","t":4,"rt":$n[0].Transform,"sn":"levelContainer"},{"a":2,"n":"levels","t":4,"rt":System.Array.type(UnityEngine.GameObject),"sn":"levels"},{"at":[new UnityEngine.HeaderAttribute("Throwable Objects")],"a":2,"n":"pumpkinsParent","t":4,"rt":$n[0].GameObject,"sn":"pumpkinsParent"},{"a":2,"n":"towerHit","t":4,"rt":$n[1].Boolean,"sn":"towerHit","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"towerMissed","t":4,"rt":$n[1].Boolean,"sn":"towerMissed","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"watermelonsParent","t":4,"rt":$n[0].GameObject,"sn":"watermelonsParent"},{"a":2,"n":"OnGameOver","is":true,"t":2,"ad":{"a":2,"n":"add_OnGameOver","is":true,"t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"addOnGameOver","rt":$n[1].Void,"p":[Function]},"r":{"a":2,"n":"remove_OnGameOver","is":true,"t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"removeOnGameOver","rt":$n[1].Void,"p":[Function]}}]}; }, $n);
    /*GameManager end.*/

    /*HandCursor start.*/
    $m("HandCursor", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"SetForceHidden","t":8,"pi":[{"n":"hidden","pt":$n[1].Boolean,"ps":0}],"sn":"SetForceHidden","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"_forceHidden","t":4,"rt":$n[1].Boolean,"sn":"_forceHidden","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"cursorImage","t":4,"rt":$n[4].Image,"sn":"cursorImage"}]}; }, $n);
    /*HandCursor end.*/

    /*HandCursorSkin start.*/
    $m("HandCursorSkin", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"CartoonHand","is":true,"t":4,"rt":HandCursorSkin,"sn":"CartoonHand","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Default","is":true,"t":4,"rt":HandCursorSkin,"sn":"Default","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Realistic_Female_White_1","is":true,"t":4,"rt":HandCursorSkin,"sn":"Realistic_Female_White_1","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Realistic_Tan_1","is":true,"t":4,"rt":HandCursorSkin,"sn":"Realistic_Tan_1","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Realistic_White_1","is":true,"t":4,"rt":HandCursorSkin,"sn":"Realistic_White_1","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Realistic_White_2","is":true,"t":4,"rt":HandCursorSkin,"sn":"Realistic_White_2","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}}]}; }, $n);
    /*HandCursorSkin end.*/

    /*HoleController start.*/
    $m("HoleController", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Grow","t":8,"sn":"Grow","rt":$n[1].Void},{"a":1,"n":"IsCollectible","t":8,"pi":[{"n":"other","pt":$n[0].GameObject,"ps":0}],"sn":"IsCollectible","rt":$n[1].Boolean,"p":[$n[0].GameObject],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"OnDestroy","t":8,"sn":"OnDestroy","rt":$n[1].Void},{"a":1,"n":"OnTriggerEnter","t":8,"pi":[{"n":"other","pt":$n[0].Collider,"ps":0}],"sn":"OnTriggerEnter","rt":$n[1].Void,"p":[$n[0].Collider]},{"a":1,"n":"OnTriggerExit","t":8,"pi":[{"n":"other","pt":$n[0].Collider,"ps":0}],"sn":"OnTriggerExit","rt":$n[1].Void,"p":[$n[0].Collider]},{"a":1,"n":"PickUpThrowable","t":8,"pi":[{"n":"ti","pt":ThrowableItem,"ps":0}],"sn":"PickUpThrowable","rt":$n[1].Void,"p":[ThrowableItem]},{"a":1,"n":"ReleaseNeighbors","t":8,"pi":[{"n":"fromPosition","pt":$n[0].Vector3,"ps":0}],"sn":"ReleaseNeighbors","rt":$n[1].Void,"p":[$n[0].Vector3]},{"a":2,"n":"ResetThrowableState","t":8,"sn":"ResetThrowableState","rt":$n[1].Void},{"a":1,"n":"ScaleOverTime","t":8,"sn":"ScaleOverTime","rt":$n[2].IEnumerator},{"a":1,"n":"SetIndicatorColor","t":8,"pi":[{"n":"color","pt":$n[0].Color,"ps":0}],"sn":"SetIndicatorColor","rt":$n[1].Void,"p":[$n[0].Color]},{"a":1,"n":"SetIndicatorVisible","t":8,"pi":[{"n":"visible","pt":$n[1].Boolean,"ps":0}],"sn":"SetIndicatorVisible","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"StartFakeMovement","t":8,"sn":"StartFakeMovement","rt":$n[1].Void},{"a":1,"n":"SwallowVictim","t":8,"pi":[{"n":"victimRb","pt":$n[0].Rigidbody,"ps":0}],"sn":"SwallowVictim","rt":$n[1].Void,"p":[$n[0].Rigidbody]},{"a":2,"n":"Throw","t":8,"sn":"Throw","rt":$n[1].Void},{"a":1,"n":"ThrowHeld","t":8,"pi":[{"n":"dir","pt":$n[0].Vector3,"ps":0}],"sn":"ThrowHeld","rt":$n[1].Void,"p":[$n[0].Vector3]},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"UpdateFakeMovement","t":8,"sn":"UpdateFakeMovement","rt":$n[1].Void},{"a":2,"n":"IsFakeMoving","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsFakeMoving","t":8,"rt":$n[1].Boolean,"fg":"IsFakeMoving","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsFakeMoving"},{"a":1,"n":"_fakeControlUsed","t":4,"rt":$n[1].Boolean,"sn":"_fakeControlUsed","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_fakeStartPosition","t":4,"rt":$n[0].Vector3,"sn":"_fakeStartPosition"},{"a":1,"n":"_fakeTargetPosition","t":4,"rt":$n[0].Vector3,"sn":"_fakeTargetPosition"},{"a":1,"n":"_growCounter","t":4,"rt":$n[1].Int32,"sn":"_growCounter","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_held","t":4,"rt":ThrowableItem,"sn":"_held"},{"a":1,"n":"_isFakeMoving","t":4,"rt":$n[1].Boolean,"sn":"_isFakeMoving","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_lastPhysicsCheck","t":4,"rt":$n[1].Single,"sn":"_lastPhysicsCheck","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_lastPos","t":4,"rt":$n[0].Vector3,"sn":"_lastPos"},{"a":1,"n":"_playerMovement","t":4,"rt":PlayerMovement,"sn":"_playerMovement"},{"a":1,"n":"_releaseBuffer","t":4,"rt":System.Array.type(UnityEngine.Collider),"sn":"_releaseBuffer"},{"a":1,"n":"_utils","t":4,"rt":Utils,"sn":"_utils"},{"a":1,"n":"_victimsBuffer","t":4,"rt":System.Array.type(UnityEngine.Collider),"sn":"_victimsBuffer"},{"at":[new UnityEngine.HeaderAttribute("Throwable")],"a":2,"n":"aimArrow","t":4,"rt":AimArrow,"sn":"aimArrow"},{"a":2,"n":"collectSFX","t":4,"rt":$n[0].AudioSource,"sn":"collectSFX"},{"a":2,"n":"detector","t":4,"rt":$n[0].SphereCollider,"sn":"detector"},{"a":2,"n":"growThreshold","t":4,"rt":$n[1].Single,"sn":"growThreshold","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"growThresholdMultiplier","t":4,"rt":$n[1].Single,"sn":"growThresholdMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"indicatorHideWhenIdle","t":4,"rt":$n[1].Boolean,"sn":"indicatorHideWhenIdle","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"indicatorIdleSpeedThreshold","t":4,"rt":$n[1].Single,"sn":"indicatorIdleSpeedThreshold","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"indicatorRotationSpeed","t":4,"rt":$n[1].Single,"sn":"indicatorRotationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.TooltipAttribute("Cap how many neighbors we release per event to avoid spikes")],"a":2,"n":"maxReleasesPerEvent","t":4,"rt":$n[1].Int32,"sn":"maxReleasesPerEvent","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"moveSpeed","t":4,"rt":$n[1].Single,"sn":"moveSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Movement Indicator")],"a":2,"n":"movementIndicatorPivot","t":4,"rt":$n[0].Transform,"sn":"movementIndicatorPivot"},{"at":[new UnityEngine.HeaderAttribute("Physics Optimization")],"a":2,"n":"physicsCheckInterval","t":4,"rt":$n[1].Single,"sn":"physicsCheckInterval","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.TooltipAttribute("Height above the removed item to check for neighbors")],"a":2,"n":"releaseHeight","t":4,"rt":$n[1].Single,"sn":"releaseHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.TooltipAttribute("Radius around a removed item to release neighbors")],"a":2,"n":"releaseRadius","t":4,"rt":$n[1].Single,"sn":"releaseRadius","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Hole Grow")],"a":2,"n":"scaleDuration","t":4,"rt":$n[1].Single,"sn":"scaleDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"scaleMultiplier","t":4,"rt":$n[1].Single,"sn":"scaleMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"skinsParent","t":4,"rt":$n[0].Transform,"sn":"skinsParent"},{"a":2,"n":"speedMultiplier","t":4,"rt":$n[1].Single,"sn":"speedMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"swallowPower","t":4,"rt":$n[1].Single,"sn":"swallowPower","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"triangleSpriteRenderer","t":4,"rt":$n[0].Renderer,"sn":"triangleSpriteRenderer"},{"at":[new UnityEngine.HeaderAttribute("Hole Collect")],"a":2,"n":"victimLayer","t":4,"rt":$n[0].LayerMask,"sn":"victimLayer"}]}; }, $n);
    /*HoleController end.*/

    /*IntroManager start.*/
    $m("IntroManager", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"CompleteIntro","t":8,"sn":"CompleteIntro","rt":$n[1].Void},{"a":2,"n":"ConfigureIntro","t":8,"pi":[{"n":"enable","pt":$n[1].Boolean,"ps":0},{"n":"duration","pt":$n[1].Single,"ps":1},{"n":"startAngle","pt":$n[0].Vector3,"ps":2},{"n":"endAngle","pt":$n[0].Vector3,"ps":3},{"n":"transitionDuration","pt":$n[1].Single,"ps":4}],"sn":"ConfigureIntro","rt":$n[1].Void,"p":[$n[1].Boolean,$n[1].Single,$n[0].Vector3,$n[0].Vector3,$n[1].Single]},{"a":2,"n":"ForceHideIntroText","t":8,"sn":"ForceHideIntroText","rt":$n[1].Void},{"a":1,"n":"HideIntroText","t":8,"sn":"HideIntroText","rt":$n[1].Void},{"a":1,"n":"IntroSequence","t":8,"sn":"IntroSequence","rt":$n[2].IEnumerator},{"a":1,"n":"SetPlayerInputEnabled","t":8,"pi":[{"n":"enabled","pt":$n[1].Boolean,"ps":0}],"sn":"SetPlayerInputEnabled","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":2,"n":"SkipIntro","t":8,"sn":"SkipIntro","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"StartIntro","t":8,"sn":"StartIntro","rt":$n[1].Void},{"a":1,"n":"StartIntroText","t":8,"sn":"StartIntroText","rt":$n[1].Void},{"a":1,"n":"TransitionCameraAngle","t":8,"sn":"TransitionCameraAngle","rt":$n[2].IEnumerator},{"a":1,"n":"WaitForDuration","t":8,"sn":"WaitForDuration","rt":$n[2].IEnumerator},{"a":1,"n":"WaitForTouch","t":8,"sn":"WaitForTouch","rt":$n[2].IEnumerator},{"a":1,"n":"WaitForTouchOrDuration","t":8,"sn":"WaitForTouchOrDuration","rt":$n[2].IEnumerator},{"a":2,"n":"IsIntroActive","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsIntroActive","t":8,"rt":$n[1].Boolean,"fg":"IsIntroActive","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsIntroActive"},{"a":2,"n":"IsIntroCompleted","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsIntroCompleted","t":8,"rt":$n[1].Boolean,"fg":"IsIntroCompleted","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsIntroCompleted"},{"a":2,"n":"IsIntroTextHidden","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsIntroTextHidden","t":8,"rt":$n[1].Boolean,"fg":"IsIntroTextHidden","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsIntroTextHidden"},{"a":2,"n":"IsIntroTextVisible","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsIntroTextVisible","t":8,"rt":$n[1].Boolean,"fg":"IsIntroTextVisible","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsIntroTextVisible"},{"a":1,"n":"PlayableSettings","t":16,"rt":PlayableSettings,"g":{"a":1,"n":"get_PlayableSettings","t":8,"rt":PlayableSettings,"fg":"PlayableSettings"},"fn":"PlayableSettings"},{"a":2,"n":"OnIntroCompleted","t":4,"rt":Function,"sn":"OnIntroCompleted"},{"a":2,"n":"OnIntroStarted","t":4,"rt":Function,"sn":"OnIntroStarted"},{"a":1,"n":"cameraOffset","t":4,"rt":CinemachineCameraOffset,"sn":"cameraOffset"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"cameraOffsetRef","t":4,"rt":CinemachineCameraOffset,"sn":"cameraOffsetRef"},{"at":[new UnityEngine.HeaderAttribute("Intro Settings"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"cameraTransitionCurve","t":4,"rt":pc.AnimationCurve,"sn":"cameraTransitionCurve"},{"a":2,"n":"instance","is":true,"t":4,"rt":IntroManager,"sn":"instance"},{"a":1,"n":"introCompleted","t":4,"rt":$n[1].Boolean,"sn":"introCompleted","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isIntroActive","t":4,"rt":$n[1].Boolean,"sn":"isIntroActive","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isIntroTextHidden","t":4,"rt":$n[1].Boolean,"sn":"isIntroTextHidden","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isIntroTextVisible","t":4,"rt":$n[1].Boolean,"sn":"isIntroTextVisible","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"playerCamera","t":4,"rt":$n[0].Transform,"sn":"playerCamera"},{"at":[new UnityEngine.HeaderAttribute("Camera References"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"playerCameraRef","t":4,"rt":$n[0].Transform,"sn":"playerCameraRef"},{"a":1,"n":"virtualCamera","t":4,"rt":$n[5].CinemachineVirtualCamera,"sn":"virtualCamera"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"virtualCameraRef","t":4,"rt":$n[5].CinemachineVirtualCamera,"sn":"virtualCameraRef"}]}; }, $n);
    /*IntroManager end.*/

    /*IntroManagerSetup start.*/
    $m("IntroManagerSetup", function () { return {"att":1056769,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"CreateIntroManager","t":8,"sn":"CreateIntroManager","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Create Intro Manager")],"a":2,"n":"CreateIntroManagerManually","t":8,"sn":"CreateIntroManagerManually","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"at":[new UnityEngine.HeaderAttribute("Intro Manager Setup"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"createIntroManagerOnStart","t":4,"rt":$n[1].Boolean,"sn":"createIntroManagerOnStart","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*IntroManagerSetup end.*/

    /*MaterialHolder start.*/
    $m("MaterialHolder", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Ground","is":true,"t":4,"rt":MaterialHolder,"sn":"Ground","box":function ($v) { return Bridge.box($v, MaterialHolder, System.Enum.toStringFn(MaterialHolder));}},{"a":2,"n":"Hole","is":true,"t":4,"rt":MaterialHolder,"sn":"Hole","box":function ($v) { return Bridge.box($v, MaterialHolder, System.Enum.toStringFn(MaterialHolder));}}]}; }, $n);
    /*MaterialHolder end.*/

    /*MovingMovement start.*/
    $m("MovingMovement", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"movingImage","t":4,"rt":$n[4].Image,"sn":"movingImage"}]}; }, $n);
    /*MovingMovement end.*/

    /*PhysicsObjectPool start.*/
    $m("PhysicsObjectPool", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"ClearPools","is":true,"t":8,"sn":"ClearPools","rt":$n[1].Void},{"a":2,"n":"GetColliders","is":true,"t":8,"pi":[{"n":"size","pt":$n[1].Int32,"ps":0}],"sn":"GetColliders","rt":System.Array.type(UnityEngine.Collider),"p":[$n[1].Int32]},{"a":2,"n":"GetRaycastHits","is":true,"t":8,"pi":[{"n":"size","pt":$n[1].Int32,"ps":0}],"sn":"GetRaycastHits","rt":System.Array.type(UnityEngine.RaycastHit),"p":[$n[1].Int32]},{"a":2,"n":"ReturnColliders","is":true,"t":8,"pi":[{"n":"array","pt":System.Array.type(UnityEngine.Collider),"ps":0}],"sn":"ReturnColliders","rt":$n[1].Void,"p":[System.Array.type(UnityEngine.Collider)]},{"a":2,"n":"ReturnRaycastHits","is":true,"t":8,"pi":[{"n":"array","pt":System.Array.type(UnityEngine.RaycastHit),"ps":0}],"sn":"ReturnRaycastHits","rt":$n[1].Void,"p":[System.Array.type(UnityEngine.RaycastHit)]},{"a":1,"n":"MAX_POOL_SIZE","is":true,"t":4,"rt":$n[1].Int32,"sn":"MAX_POOL_SIZE","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_colliderPools","is":true,"t":4,"rt":$n[3].Dictionary$2(System.Int32,System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.Collider))),"sn":"_colliderPools","ro":true},{"a":1,"n":"_raycastHitPools","is":true,"t":4,"rt":$n[3].Dictionary$2(System.Int32,System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.RaycastHit))),"sn":"_raycastHitPools","ro":true}]}; }, $n);
    /*PhysicsObjectPool end.*/

    /*PlayableSettings start.*/
    $m("PlayableSettings", function () { return {"nested":[PlayableSettings.PlayerSkinIndex,PlayableSettings.LevelIndex],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ApplyAimArrowColor","t":8,"sn":"ApplyAimArrowColor","rt":$n[1].Void},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":2,"n":"CameraZoomOut","t":8,"pi":[{"n":"value","pt":$n[1].Single,"ps":0}],"sn":"CameraZoomOut","rt":$n[1].Void,"p":[$n[1].Single]},{"a":1,"n":"SetMaterials","t":8,"sn":"SetMaterials","rt":$n[1].Void},{"a":1,"n":"SmoothCameraZoomOut","t":8,"pi":[{"n":"value","pt":$n[1].Single,"ps":0}],"sn":"SmoothCameraZoomOut","rt":$n[2].IEnumerator,"p":[$n[1].Single]},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Level", 0, "General", false, null)],"a":2,"n":"Level","t":4,"rt":PlayableSettings.LevelIndex,"sn":"Level","box":function ($v) { return Bridge.box($v, PlayableSettings.LevelIndex, System.Enum.toStringFn(PlayableSettings.LevelIndex));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Aim Arrow Color", 4, "Player Controls", false, null)],"a":2,"n":"aimArrowColor","t":4,"rt":$n[0].Color,"sn":"aimArrowColor"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Block Player Input", 7, "Intro", false, null)],"a":2,"n":"blockPlayerInput","t":4,"rt":$n[1].Boolean,"sn":"blockPlayerInput","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Camera Angle", 0, "General", false, null)],"a":2,"n":"cameraAngle","t":4,"rt":$n[0].Vector3,"sn":"cameraAngle"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Camera Transition Duration", 6, "Intro", false, null)],"a":2,"n":"cameraTransitionDuration","t":4,"rt":$n[1].Single,"sn":"cameraTransitionDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"coloredMaterials","t":4,"rt":System.Array.type(ColoredMaterial),"sn":"coloredMaterials"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hand Cursor Scale", 0, "General", false, null)],"a":2,"n":"cursorScale","t":4,"rt":$n[1].Single,"sn":"cursorScale","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"cursors","t":4,"rt":System.Array.type(UnityEngine.Sprite),"sn":"cursors"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Display Bottom Banner", 2, "Banner", false, null)],"a":2,"n":"displayBotBanner","t":4,"rt":$n[1].Boolean,"sn":"displayBotBanner","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Display Mid Banner", 1, "Banner", false, null)],"a":2,"n":"displayMidBanner","t":4,"rt":$n[1].Boolean,"sn":"displayMidBanner","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Banner"),new UnityEngine.LunaPlaygroundFieldAttribute("Display Top Banner", 0, "Banner", false, null)],"a":2,"n":"displayTopBanner","t":4,"rt":$n[1].Boolean,"sn":"displayTopBanner","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Fake Control", 13, "Intro", false, null)],"a":2,"n":"enableFakeControl","t":4,"rt":$n[1].Boolean,"sn":"enableFakeControl","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Throwable Visual Effects"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Floating Animation", 0, "Throwable Effects", false, null)],"a":2,"n":"enableFloatingAnimation","t":4,"rt":$n[1].Boolean,"sn":"enableFloatingAnimation","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Hand Cursor", 0, "General", false, null)],"a":2,"n":"enableHandCursor","t":4,"rt":$n[1].Boolean,"sn":"enableHandCursor","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Intro Settings"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Intro", 0, "Intro", false, null)],"a":2,"n":"enableIntro","t":4,"rt":$n[1].Boolean,"sn":"enableIntro","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("DisplayMovingHand", 15, "Intro", false, null)],"a":2,"n":"enableMovingHand","t":4,"rt":$n[1].Boolean,"sn":"enableMovingHand","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("DisplayMovingVisual", 14, "Intro", false, null)],"a":2,"n":"enableMovingVisual","t":4,"rt":$n[1].Boolean,"sn":"enableMovingVisual","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Self Rotation", 3, "Throwable Effects", false, null)],"a":2,"n":"enableSelfRotation","t":4,"rt":$n[1].Boolean,"sn":"enableSelfRotation","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Tower Shooting Lose", 1, "Tower Shooting", false, null)],"a":2,"n":"enableTowerShootingLose","t":4,"rt":$n[1].Boolean,"sn":"enableTowerShootingLose","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Tower Shooting Win/Lose"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Tower Shooting Win", 0, "Tower Shooting", false, null)],"a":2,"n":"enableTowerShootingWin","t":4,"rt":$n[1].Boolean,"sn":"enableTowerShootingWin","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("End Camera Angle", 3, "Intro", false, null)],"a":2,"n":"endCameraAngle","t":4,"rt":$n[0].Vector3,"sn":"endCameraAngle"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("End Camera Position", 5, "Intro", false, null)],"a":2,"n":"endCameraPosition","t":4,"rt":$n[0].Vector3,"sn":"endCameraPosition"},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Fail Sound", 4, "Audio")],"a":2,"n":"failSound","t":4,"rt":$n[0].AudioClip,"sn":"failSound"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Floating Height", 1, "Throwable Effects", false, null)],"a":2,"n":"floatingHeight","t":4,"rt":$n[1].Single,"sn":"floatingHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Floating Speed", 2, "Throwable Effects", false, null)],"a":2,"n":"floatingSpeed","t":4,"rt":$n[1].Single,"sn":"floatingSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Game Over Delay", 0, "General", false, null)],"a":2,"n":"gameOverScreenDelay","t":4,"rt":$n[1].Single,"sn":"gameOverScreenDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Game playable config"),new UnityEngine.LunaPlaygroundFieldAttribute("Gameplay Timer", 1, "General", false, null)],"a":2,"n":"gameTimeInSeconds","t":4,"rt":$n[1].Single,"sn":"gameTimeInSeconds","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Ground Color", 0, "Environment Controls", false, null)],"a":2,"n":"groundColor","t":4,"rt":$n[0].Color,"sn":"groundColor"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Ground Texture", 0, "Environment Controls", false, null)],"a":2,"n":"groundTexture","t":4,"rt":$n[1].Int32,"sn":"groundTexture","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hand Cursor", 0, "General", false, null)],"a":2,"n":"handCursor","t":4,"rt":HandCursorSkin,"sn":"handCursor","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hide Intro Text on Player Touch", 11, "Intro", false, null)],"a":2,"n":"hideIntroTextOnPlayerTouch","t":4,"rt":$n[1].Boolean,"sn":"hideIntroTextOnPlayerTouch","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hole Color", 2, "Player Controls", false, null)],"a":2,"n":"holeColor","t":4,"rt":$n[0].Color,"sn":"holeColor"},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Hole Grow Sound", 6, "Audio")],"a":2,"n":"holeGrowSound","t":4,"rt":$n[0].AudioClip,"sn":"holeGrowSound"},{"at":[new UnityEngine.HeaderAttribute("Player playable config"),new UnityEngine.LunaPlaygroundFieldAttribute("Player Speed", 1, "Player Controls", false, null)],"a":2,"n":"holeMoveSpeed","t":4,"rt":$n[1].Single,"sn":"holeMoveSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hole Skin", 2, "Player Controls", false, null)],"a":2,"n":"holeSkin","t":4,"rt":$n[1].Int32,"sn":"holeSkin","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"instance","is":true,"t":4,"rt":PlayableSettings,"sn":"instance"},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Intro Sound", 5, "Audio")],"a":2,"n":"introSound","t":4,"rt":$n[0].AudioClip,"sn":"introSound"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Intro Text", 9, "Intro", false, null)],"a":2,"n":"introText","t":4,"rt":$n[1].String,"sn":"introText"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Intro Text Duration", 10, "Intro", false, null)],"a":2,"n":"introTextDuration","t":4,"rt":$n[1].Single,"sn":"introTextDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Intro Text Hide After Duration", 12, "Intro", false, null)],"a":2,"n":"introTextHideAfterDuration","t":4,"rt":$n[1].Boolean,"sn":"introTextHideAfterDuration","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Max Objective", 0, "General", false, null)],"a":2,"n":"maxObjectiveAmount","t":4,"rt":$n[1].Int32,"sn":"maxObjectiveAmount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HeaderAttribute("Movement Settings"),new UnityEngine.LunaPlaygroundFieldAttribute("Min Speed Factor", 0, "General", false, null)],"a":2,"n":"minSpeed","t":4,"rt":$n[1].Single,"sn":"minSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Movement Indicator Color", 3, "Player Controls", false, null)],"a":2,"n":"movementIndicatorColor","t":4,"rt":$n[0].Color,"sn":"movementIndicatorColor"},{"at":[new UnityEngine.HeaderAttribute("Serializable Data")],"a":2,"n":"playerCamera","t":4,"rt":$n[0].Transform,"sn":"playerCamera"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Rotation Speed", 4, "Throwable Effects", false, null)],"a":2,"n":"rotationSpeed","t":4,"rt":$n[1].Single,"sn":"rotationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Shoot Sound", 3, "Audio")],"a":2,"n":"shootSound","t":4,"rt":$n[0].AudioClip,"sn":"shootSound"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Show Flower", 0, "General", false, null)],"a":2,"n":"showFlower","t":4,"rt":$n[1].Boolean,"sn":"showFlower","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Show Intro Text", 8, "Intro", false, null)],"a":2,"n":"showIntroText","t":4,"rt":$n[1].Boolean,"sn":"showIntroText","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Speed Multiplier", 0, "General", false, null)],"a":2,"n":"speedMultiplier","t":4,"rt":$n[1].Single,"sn":"speedMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Start Camera Angle", 2, "Intro", false, null)],"a":2,"n":"startCameraAngle","t":4,"rt":$n[0].Vector3,"sn":"startCameraAngle"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Start Camera Position", 4, "Intro", false, null)],"a":2,"n":"startCameraPosition","t":4,"rt":$n[0].Vector3,"sn":"startCameraPosition"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Start Gameplay Timer on Touch", 1, "General", false, null)],"a":2,"n":"startGameplayTimerOnTouch","t":4,"rt":$n[1].Boolean,"sn":"startGameplayTimerOnTouch","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Throwable Object Type", 0, "General", false, null)],"a":2,"n":"throwableObjectType","t":4,"rt":ThrowableObjectType,"sn":"throwableObjectType","box":function ($v) { return Bridge.box($v, ThrowableObjectType, System.Enum.toStringFn(ThrowableObjectType));}},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Tower Hit Sound", 2, "Audio")],"a":2,"n":"towerHitSound","t":4,"rt":$n[0].AudioClip,"sn":"towerHitSound"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Tower Miss Check Delay (seconds)", 3, "Tower Shooting", false, null)],"a":2,"n":"towerMissCheckDelay","t":4,"rt":$n[1].Single,"sn":"towerMissCheckDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Auto Redirect Delay (seconds)", 2, "Tower Shooting", false, null)],"a":2,"n":"towerWinAutoRedirectDelay","t":4,"rt":$n[1].Single,"sn":"towerWinAutoRedirectDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Audio Settings"),new UnityEngine.LunaPlaygroundAssetAttribute("Win Sound", 1, "Audio")],"a":2,"n":"winSound","t":4,"rt":$n[0].AudioClip,"sn":"winSound"}]}; }, $n);
    /*PlayableSettings end.*/

    /*PlayableSettings+PlayerSkinIndex start.*/
    $m("PlayableSettings.PlayerSkinIndex", function () { return {"td":PlayableSettings,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Default","is":true,"t":4,"rt":PlayableSettings.PlayerSkinIndex,"sn":"Default","box":function ($v) { return Bridge.box($v, PlayableSettings.PlayerSkinIndex, System.Enum.toStringFn(PlayableSettings.PlayerSkinIndex));}}]}; }, $n);
    /*PlayableSettings+PlayerSkinIndex end.*/

    /*PlayableSettings+LevelIndex start.*/
    $m("PlayableSettings.LevelIndex", function () { return {"td":PlayableSettings,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"FruitTower_SideFruit","is":true,"t":4,"rt":PlayableSettings.LevelIndex,"sn":"FruitTower_SideFruit","box":function ($v) { return Bridge.box($v, PlayableSettings.LevelIndex, System.Enum.toStringFn(PlayableSettings.LevelIndex));}},{"a":2,"n":"HalloweenTower_SideFruit","is":true,"t":4,"rt":PlayableSettings.LevelIndex,"sn":"HalloweenTower_SideFruit","box":function ($v) { return Bridge.box($v, PlayableSettings.LevelIndex, System.Enum.toStringFn(PlayableSettings.LevelIndex));}},{"a":2,"n":"HalloweenTower_SideHalloween","is":true,"t":4,"rt":PlayableSettings.LevelIndex,"sn":"HalloweenTower_SideHalloween","box":function ($v) { return Bridge.box($v, PlayableSettings.LevelIndex, System.Enum.toStringFn(PlayableSettings.LevelIndex));}}]}; }, $n);
    /*PlayableSettings+LevelIndex end.*/

    /*PlayerMovement start.*/
    $m("PlayerMovement", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"UpdateMovement","t":8,"pi":[{"n":"target","pt":$n[0].Transform,"ps":0},{"n":"moveSpeed","pt":$n[1].Single,"ps":1}],"sn":"UpdateMovement","rt":$n[1].Void,"p":[$n[0].Transform,$n[1].Single]},{"a":1,"n":"UpdateMovementDirection","t":8,"pi":[{"n":"transform","pt":$n[0].Transform,"ps":0},{"n":"moveSpeed","pt":$n[1].Single,"ps":1}],"sn":"UpdateMovementDirection","rt":$n[1].Void,"p":[$n[0].Transform,$n[1].Single]},{"a":1,"n":"initialMousePosition","t":4,"rt":$n[0].Vector3,"sn":"initialMousePosition"},{"a":1,"n":"lastMousePosition","t":4,"rt":$n[0].Vector3,"sn":"lastMousePosition"},{"at":[new UnityEngine.HeaderAttribute("Movement Settings")],"a":2,"n":"minSpeed","t":4,"rt":$n[1].Single,"sn":"minSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"movementDirection","t":4,"rt":$n[0].Vector3,"sn":"movementDirection"},{"a":2,"n":"speedMultiplier","t":4,"rt":$n[1].Single,"sn":"speedMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*PlayerMovement end.*/

    /*PlayerSkin start.*/
    $m("PlayerSkin", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"animator","t":4,"rt":$n[0].Animator,"sn":"animator"}]}; }, $n);
    /*PlayerSkin end.*/

    /*Pool$1 start.*/
    $m("Pool$1", function (T) { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[T,$n[0].Transform,$n[1].Int32],"pi":[{"n":"prefab","pt":T,"ps":0},{"n":"parent","pt":$n[0].Transform,"ps":1},{"n":"initialSize","pt":$n[1].Int32,"ps":2}],"sn":"ctor"},{"a":2,"n":"Dispose","t":8,"pi":[{"n":"obj","pt":T,"ps":0}],"sn":"Dispose","rt":$n[1].Void,"p":[T]},{"a":2,"n":"Get","t":8,"pi":[{"n":"growIfFull","pt":$n[1].Boolean,"ps":0}],"sn":"Get","rt":T,"p":[$n[1].Boolean]},{"a":1,"n":"Grow","t":8,"sn":"Grow","rt":T},{"a":1,"n":"objects","t":4,"rt":$n[3].List$1(T),"sn":"objects","ro":true},{"a":1,"n":"parent","t":4,"rt":$n[0].Transform,"sn":"parent"},{"a":1,"n":"prefab","t":4,"rt":T,"sn":"prefab"}]}; }, $n);
    /*Pool$1 end.*/

    /*ResourceLoader start.*/
    $m("ResourceLoader", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"AddToList","is":true,"t":8,"pi":[{"n":"name","pt":$n[1].String,"ps":0}],"sn":"AddToList","rt":$n[1].Void,"p":[$n[1].String]},{"a":1,"n":"LoadResource","t":8,"pi":[{"n":"resourceName","pt":$n[1].String,"ps":0}],"sn":"LoadResource","rt":$n[2].IEnumerator,"p":[$n[1].String]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Path","is":true,"t":4,"rt":$n[1].String,"sn":"Path"},{"a":1,"n":"resourceList","is":true,"t":4,"rt":$n[3].List$1(System.String),"sn":"resourceList"},{"a":2,"n":"OnObjectLoaded","is":true,"t":2,"ad":{"a":2,"n":"add_OnObjectLoaded","is":true,"t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"addOnObjectLoaded","rt":$n[1].Void,"p":[Function]},"r":{"a":2,"n":"remove_OnObjectLoaded","is":true,"t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"removeOnObjectLoaded","rt":$n[1].Void,"p":[Function]}}]}; }, $n);
    /*ResourceLoader end.*/

    /*ResourcePlaceholder start.*/
    $m("ResourcePlaceholder", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"EnsureSupportActivator","t":8,"pi":[{"n":"instance","pt":$n[0].Transform,"ps":0}],"sn":"EnsureSupportActivator","rt":$n[1].Void,"p":[$n[0].Transform]},{"a":1,"n":"SpawnInstance","t":8,"pi":[{"n":"prefab","pt":$n[0].Transform,"ps":0}],"sn":"SpawnInstance","rt":$n[1].Void,"p":[$n[0].Transform]},{"a":2,"n":"resourceName","t":4,"rt":$n[1].String,"sn":"resourceName"},{"a":2,"n":"rowIndex","t":4,"rt":$n[1].Int32,"sn":"rowIndex","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"tower","t":4,"rt":$n[0].Transform,"sn":"tower"}]}; }, $n);
    /*ResourcePlaceholder end.*/

    /*RotorRotation start.*/
    $m("RotorRotation", function () { return {"nested":[RotorRotation.RotationAxis],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":2,"n":"rotationAxis","t":4,"rt":RotorRotation.RotationAxis,"sn":"rotationAxis","box":function ($v) { return Bridge.box($v, RotorRotation.RotationAxis, System.Enum.toStringFn(RotorRotation.RotationAxis));}},{"a":2,"n":"rotationSpeed","t":4,"rt":$n[1].Single,"sn":"rotationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*RotorRotation end.*/

    /*RotorRotation+RotationAxis start.*/
    $m("RotorRotation.RotationAxis", function () { return {"td":RotorRotation,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"X","is":true,"t":4,"rt":RotorRotation.RotationAxis,"sn":"X","box":function ($v) { return Bridge.box($v, RotorRotation.RotationAxis, System.Enum.toStringFn(RotorRotation.RotationAxis));}},{"a":2,"n":"Y","is":true,"t":4,"rt":RotorRotation.RotationAxis,"sn":"Y","box":function ($v) { return Bridge.box($v, RotorRotation.RotationAxis, System.Enum.toStringFn(RotorRotation.RotationAxis));}},{"a":2,"n":"Z","is":true,"t":4,"rt":RotorRotation.RotationAxis,"sn":"Z","box":function ($v) { return Bridge.box($v, RotorRotation.RotationAxis, System.Enum.toStringFn(RotorRotation.RotationAxis));}}]}; }, $n);
    /*RotorRotation+RotationAxis end.*/

    /*SoundEffect start.*/
    $m("SoundEffect", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Fail","is":true,"t":4,"rt":SoundEffect,"sn":"Fail","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"HoleGrow","is":true,"t":4,"rt":SoundEffect,"sn":"HoleGrow","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"Intro","is":true,"t":4,"rt":SoundEffect,"sn":"Intro","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"Shoot","is":true,"t":4,"rt":SoundEffect,"sn":"Shoot","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"TowerHit","is":true,"t":4,"rt":SoundEffect,"sn":"TowerHit","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"Win","is":true,"t":4,"rt":SoundEffect,"sn":"Win","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}}]}; }, $n);
    /*SoundEffect end.*/

    /*SupportActivator start.*/
    $m("SupportActivator", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.DisallowMultipleComponent()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ActivatePhysics","t":8,"sn":"ActivatePhysics","rt":$n[1].Void},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"CheckSupport","t":8,"sn":"CheckSupport","rt":$n[1].Void},{"a":2,"n":"ForceActivate","t":8,"sn":"ForceActivate","rt":$n[1].Void},{"a":1,"n":"HasSupportBelow","t":8,"sn":"HasSupportBelow","rt":$n[1].Boolean,"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"OnCollisionEnter","t":8,"pi":[{"n":"collision","pt":$n[0].Collision,"ps":0}],"sn":"OnCollisionEnter","rt":$n[1].Void,"p":[$n[0].Collision]},{"a":1,"n":"OnDestroy","t":8,"sn":"OnDestroy","rt":$n[1].Void},{"a":1,"n":"OnDisable","t":8,"sn":"OnDisable","rt":$n[1].Void},{"a":1,"n":"OnEnable","t":8,"sn":"OnEnable","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"_activationTime","t":4,"rt":$n[1].Single,"sn":"_activationTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_missCounter","t":4,"rt":$n[1].Int32,"sn":"_missCounter","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_rayHits","t":4,"rt":System.Array.type(UnityEngine.RaycastHit),"sn":"_rayHits"},{"a":1,"n":"_rb","t":4,"rt":$n[0].Rigidbody,"sn":"_rb"},{"a":2,"n":"activateAngularDrag","t":4,"rt":$n[1].Single,"sn":"activateAngularDrag","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Physics Activation")],"a":2,"n":"activateDrag","t":4,"rt":$n[1].Single,"sn":"activateDrag","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"checkDistance","t":4,"rt":$n[1].Single,"sn":"checkDistance","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"checkInterval","t":4,"rt":$n[1].Single,"sn":"checkInterval","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"requiredMisses","t":4,"rt":$n[1].Int32,"sn":"requiredMisses","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HideInInspector()],"a":2,"n":"rowIndex","t":4,"rt":$n[1].Int32,"sn":"rowIndex","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HeaderAttribute("Physics Optimization")],"a":2,"n":"sleepDelay","t":4,"rt":$n[1].Single,"sn":"sleepDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Support Detection (Raycast)")],"a":2,"n":"supportMask","t":4,"rt":$n[0].LayerMask,"sn":"supportMask"},{"at":[new UnityEngine.HideInInspector()],"a":2,"n":"tower","t":4,"rt":$n[0].Transform,"sn":"tower"}]}; }, $n);
    /*SupportActivator end.*/

    /*TextureSetterLuna start.*/
    $m("TextureSetterLuna", function () { return {"nested":[TextureSetterLuna.TextureLunaFieldType],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ConvertTextureToSprite","t":8,"pi":[{"n":"texture","pt":$n[0].Texture2D,"ps":0}],"sn":"ConvertTextureToSprite","rt":$n[0].Sprite,"p":[$n[0].Texture2D]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"imageRef","t":4,"rt":$n[4].Image,"sn":"imageRef"},{"a":2,"n":"preserveAspectImage","t":4,"rt":$n[1].Boolean,"sn":"preserveAspectImage","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"textureField","t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"textureField","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}}]}; }, $n);
    /*TextureSetterLuna end.*/

    /*TextureSetterLuna+TextureLunaFieldType start.*/
    $m("TextureSetterLuna.TextureLunaFieldType", function () { return {"td":TextureSetterLuna,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"BottomBanner","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"BottomBanner","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}},{"a":2,"n":"FailImage","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"FailImage","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}},{"a":2,"n":"MidBanner","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"MidBanner","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}},{"a":2,"n":"TopBanner","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"TopBanner","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}},{"a":2,"n":"WinImage","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"WinImage","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}}]}; }, $n);
    /*TextureSetterLuna+TextureLunaFieldType end.*/

    /*ThrowableItem start.*/
    $m("ThrowableItem", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.DisallowMultipleComponent()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"AttachTo","t":8,"pi":[{"n":"hole","pt":$n[0].Transform,"ps":0}],"sn":"AttachTo","rt":$n[1].Void,"p":[$n[0].Transform]},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"CalculateFloatingBasePosition","t":8,"sn":"CalculateFloatingBasePosition","rt":$n[1].Void},{"a":1,"n":"HideMainRenderer","t":8,"sn":"HideMainRenderer","rt":$n[1].Void},{"a":1,"n":"IsPlayerThrown","t":8,"sn":"IsPlayerThrown","rt":$n[1].Boolean,"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"OnCollisionEnter","t":8,"pi":[{"n":"collision","pt":$n[0].Collision,"ps":0}],"sn":"OnCollisionEnter","rt":$n[1].Void,"p":[$n[0].Collision]},{"a":1,"n":"OnTriggerEnter","t":8,"pi":[{"n":"other","pt":$n[0].Collider,"ps":0}],"sn":"OnTriggerEnter","rt":$n[1].Void,"p":[$n[0].Collider]},{"a":1,"n":"RestoreLayersAndCleanupAfterDelay","t":8,"pi":[{"n":"delay","pt":$n[1].Single,"ps":0}],"sn":"RestoreLayersAndCleanupAfterDelay","rt":$n[2].IEnumerator,"p":[$n[1].Single]},{"a":1,"n":"RestoreSavedLayers","t":8,"sn":"RestoreSavedLayers","rt":$n[1].Void},{"a":1,"n":"SaveAndSetLayerRecursively","t":8,"pi":[{"n":"root","pt":$n[0].Transform,"ps":0},{"n":"newLayer","pt":$n[1].Int32,"ps":1}],"sn":"SaveAndSetLayerRecursively","rt":$n[1].Void,"p":[$n[0].Transform,$n[1].Int32]},{"a":1,"n":"ShowMainRenderer","t":8,"sn":"ShowMainRenderer","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"StopVisualEffects","t":8,"sn":"StopVisualEffects","rt":$n[1].Void},{"a":2,"n":"ThrowForward","t":8,"pi":[{"n":"forward","pt":$n[0].Vector3,"ps":0}],"sn":"ThrowForward","rt":$n[1].Void,"p":[$n[0].Vector3]},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"UpdateVisualEffects","t":8,"sn":"UpdateVisualEffects","rt":$n[1].Void},{"a":1,"n":"_colliders","t":4,"rt":System.Array.type(UnityEngine.Collider),"sn":"_colliders"},{"a":1,"n":"_floatingBasePosition","t":4,"rt":$n[0].Vector3,"sn":"_floatingBasePosition"},{"a":1,"n":"_floatingOffset","t":4,"rt":$n[1].Single,"sn":"_floatingOffset","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_originalParent","t":4,"rt":$n[0].Transform,"sn":"_originalParent"},{"a":1,"n":"_originalPosition","t":4,"rt":$n[0].Vector3,"sn":"_originalPosition"},{"a":1,"n":"_rb","t":4,"rt":$n[0].Rigidbody,"sn":"_rb"},{"a":1,"n":"_savedLayerObjects","t":4,"rt":$n[3].List$1(UnityEngine.GameObject),"sn":"_savedLayerObjects","ro":true},{"a":1,"n":"_savedLayers","t":4,"rt":$n[3].List$1(System.Int32),"sn":"_savedLayers","ro":true},{"a":1,"n":"_savedPosition","t":4,"rt":$n[0].Vector3,"sn":"_savedPosition"},{"a":1,"n":"_savedRotation","t":4,"rt":$n[0].Quaternion,"sn":"_savedRotation"},{"a":1,"n":"_throwTime","t":4,"rt":$n[1].Single,"sn":"_throwTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_visualEffectsActive","t":4,"rt":$n[1].Boolean,"sn":"_visualEffectsActive","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"detachDelay","t":4,"rt":$n[1].Single,"sn":"detachDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"hasHitTower","t":4,"rt":$n[1].Boolean,"sn":"hasHitTower","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"pickedUp","t":4,"rt":$n[1].Boolean,"sn":"pickedUp","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"smoothSnap","t":4,"rt":$n[1].Boolean,"sn":"smoothSnap","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"snapDuration","t":4,"rt":$n[1].Single,"sn":"snapDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"snapOffsetY","t":4,"rt":$n[1].Single,"sn":"snapOffsetY","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"spinTorque","t":4,"rt":$n[1].Single,"sn":"spinTorque","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"throwForce","t":4,"rt":$n[1].Single,"sn":"throwForce","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"throwProtectDuration","t":4,"rt":$n[1].Single,"sn":"throwProtectDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"throwUpward","t":4,"rt":$n[1].Single,"sn":"throwUpward","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Visual Effects")],"a":2,"n":"visualChild","t":4,"rt":$n[0].Transform,"sn":"visualChild"}]}; }, $n);
    /*ThrowableItem end.*/

    /*ThrowableObjectType start.*/
    $m("ThrowableObjectType", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Pumpkins","is":true,"t":4,"rt":ThrowableObjectType,"sn":"Pumpkins","box":function ($v) { return Bridge.box($v, ThrowableObjectType, System.Enum.toStringFn(ThrowableObjectType));}},{"a":2,"n":"Watermelon","is":true,"t":4,"rt":ThrowableObjectType,"sn":"Watermelon","box":function ($v) { return Bridge.box($v, ThrowableObjectType, System.Enum.toStringFn(ThrowableObjectType));}}]}; }, $n);
    /*ThrowableObjectType end.*/

    /*ThrowablePusher start.*/
    $m("ThrowablePusher", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.RequireComponent.ctor(UnityEngine.Rigidbody)],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"FixedUpdate","t":8,"sn":"FixedUpdate","rt":$n[1].Void},{"a":1,"n":"OnCollisionEnter","t":8,"pi":[{"n":"collision","pt":$n[0].Collision,"ps":0}],"sn":"OnCollisionEnter","rt":$n[1].Void,"p":[$n[0].Collision]},{"a":1,"n":"OnDestroy","t":8,"sn":"OnDestroy","rt":$n[1].Void},{"a":1,"n":"OnTriggerEnter","t":8,"pi":[{"n":"other","pt":$n[0].Collider,"ps":0}],"sn":"OnTriggerEnter","rt":$n[1].Void,"p":[$n[0].Collider]},{"a":1,"n":"Pulse","t":8,"sn":"Pulse","rt":$n[1].Void},{"a":1,"n":"TriggerCascadeIfTopRows","is":true,"t":8,"pi":[{"n":"sa","pt":SupportActivator,"ps":0}],"sn":"TriggerCascadeIfTopRows","rt":$n[1].Void,"p":[SupportActivator]},{"a":1,"n":"_castHits","t":4,"rt":System.Array.type(UnityEngine.RaycastHit),"sn":"_castHits"},{"a":1,"n":"_overlapBuffer","t":4,"rt":System.Array.type(UnityEngine.Collider),"sn":"_overlapBuffer"},{"a":1,"n":"_rb","t":4,"rt":$n[0].Rigidbody,"sn":"_rb"},{"a":2,"n":"pushForce","t":4,"rt":$n[1].Single,"sn":"pushForce","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"pushRadius","t":4,"rt":$n[1].Single,"sn":"pushRadius","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"victimMask","t":4,"rt":$n[0].LayerMask,"sn":"victimMask"}]}; }, $n);
    /*ThrowablePusher end.*/

    /*TowerRegistry start.*/
    $m("TowerRegistry", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"GetAll","is":true,"t":8,"pi":[{"n":"tower","pt":$n[0].Transform,"ps":0}],"sn":"GetAll","rt":$n[3].List$1(SupportActivator),"p":[$n[0].Transform]},{"a":2,"n":"Register","is":true,"t":8,"pi":[{"n":"tower","pt":$n[0].Transform,"ps":0},{"n":"activator","pt":SupportActivator,"ps":1}],"sn":"Register","rt":$n[1].Void,"p":[$n[0].Transform,SupportActivator]},{"a":2,"n":"Unregister","is":true,"t":8,"pi":[{"n":"tower","pt":$n[0].Transform,"ps":0},{"n":"activator","pt":SupportActivator,"ps":1}],"sn":"Unregister","rt":$n[1].Void,"p":[$n[0].Transform,SupportActivator]},{"a":1,"n":"_empty","is":true,"t":4,"rt":$n[3].List$1(SupportActivator),"sn":"_empty","ro":true},{"a":1,"n":"_map","is":true,"t":4,"rt":$n[3].Dictionary$2(UnityEngine.Transform,System.Collections.Generic.List$1(SupportActivator)),"sn":"_map","ro":true}]}; }, $n);
    /*TowerRegistry end.*/

    /*TowerRuntimeIndex start.*/
    $m("TowerRuntimeIndex", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.DisallowMultipleComponent()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Clear","t":8,"sn":"Clear","rt":$n[1].Void},{"a":2,"n":"Register","t":8,"pi":[{"n":"activator","pt":SupportActivator,"ps":0}],"sn":"Register","rt":$n[1].Void,"p":[SupportActivator]},{"a":2,"n":"Unregister","t":8,"pi":[{"n":"activator","pt":SupportActivator,"ps":0}],"sn":"Unregister","rt":$n[1].Void,"p":[SupportActivator]},{"a":2,"n":"members","t":4,"rt":$n[3].List$1(SupportActivator),"sn":"members","ro":true}]}; }, $n);
    /*TowerRuntimeIndex end.*/

    /*TransformExtensions start.*/
    $m("TransformExtensions", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"SmoothLerpLocal","is":true,"t":8,"pi":[{"n":"transform","pt":$n[0].Transform,"ps":0},{"n":"runner","pt":$n[0].MonoBehaviour,"ps":1},{"n":"targetLocalPos","pt":$n[0].Vector3,"ps":2},{"n":"targetLocalRot","pt":$n[0].Quaternion,"ps":3},{"n":"duration","pt":$n[1].Single,"ps":4}],"sn":"SmoothLerpLocal","rt":$n[0].Coroutine,"p":[$n[0].Transform,$n[0].MonoBehaviour,$n[0].Vector3,$n[0].Quaternion,$n[1].Single]},{"a":1,"n":"SmoothLerpLocalCoroutine","is":true,"t":8,"pi":[{"n":"t","pt":$n[0].Transform,"ps":0},{"n":"targetPos","pt":$n[0].Vector3,"ps":1},{"n":"targetRot","pt":$n[0].Quaternion,"ps":2},{"n":"duration","pt":$n[1].Single,"ps":3}],"sn":"SmoothLerpLocalCoroutine","rt":$n[2].IEnumerator,"p":[$n[0].Transform,$n[0].Vector3,$n[0].Quaternion,$n[1].Single]}]}; }, $n);
    /*TransformExtensions end.*/

    /*TriggerDetector start.*/
    $m("TriggerDetector", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"OnTriggerEnter","t":8,"pi":[{"n":"other","pt":$n[0].Collider,"ps":0}],"sn":"OnTriggerEnter","rt":$n[1].Void,"p":[$n[0].Collider]},{"a":2,"n":"OnTrigger","t":4,"rt":Function,"sn":"OnTrigger"},{"a":2,"n":"detectedLayerMask","t":4,"rt":$n[0].LayerMask,"sn":"detectedLayerMask"}]}; }, $n);
    /*TriggerDetector end.*/

    /*TutoCursor start.*/
    $m("TutoCursor", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"cursorImage","t":4,"rt":$n[4].Image,"sn":"cursorImage"}]}; }, $n);
    /*TutoCursor end.*/

    /*UIManager start.*/
    $m("UIManager", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":2,"n":"HideIntroText","t":8,"sn":"HideIntroText","rt":$n[1].Void},{"a":2,"n":"HideShootScreenAfterShoot","t":8,"sn":"HideShootScreenAfterShoot","rt":$n[1].Void},{"a":2,"n":"OnButtonClick","t":8,"sn":"OnButtonClick","rt":$n[1].Void},{"a":2,"n":"ShowEndScreen","t":8,"pi":[{"n":"isWin","pt":$n[1].Boolean,"ps":0}],"sn":"ShowEndScreen","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":2,"n":"ShowIntroText","t":8,"pi":[{"n":"text","pt":$n[1].String,"ps":0}],"sn":"ShowIntroText","rt":$n[1].Void,"p":[$n[1].String]},{"a":2,"n":"ShowShootScreen","t":8,"sn":"ShowShootScreen","rt":$n[1].Void},{"a":2,"n":"UpdateSlider","t":8,"pi":[{"n":"amount","pt":$n[1].Single,"ps":0}],"sn":"UpdateSlider","rt":$n[1].Void,"p":[$n[1].Single]},{"a":1,"n":"UpdateTimeBar","t":8,"pi":[{"n":"currentTime","pt":$n[1].Single,"ps":0}],"sn":"UpdateTimeBar","rt":$n[1].Void,"p":[$n[1].Single]},{"a":2,"n":"UpdateTimer","t":8,"pi":[{"n":"amount","pt":$n[1].Single,"ps":0}],"sn":"UpdateTimer","rt":$n[1].Void,"p":[$n[1].Single]},{"a":2,"n":"anim","t":4,"rt":$n[0].Animator,"sn":"anim"},{"a":2,"n":"bottomBanner","t":4,"rt":$n[0].GameObject,"sn":"bottomBanner"},{"a":2,"n":"handCursor","t":4,"rt":HandCursor,"sn":"handCursor"},{"a":2,"n":"handTutoCursor","t":4,"rt":TutoCursor,"sn":"handTutoCursor"},{"a":2,"n":"instance","is":true,"t":4,"rt":UIManager,"sn":"instance"},{"at":[new UnityEngine.HeaderAttribute("Intro Text")],"a":2,"n":"introText","t":4,"rt":$n[4].Text,"sn":"introText"},{"a":1,"n":"isTimerAnimPlaying","t":4,"rt":$n[1].Boolean,"sn":"isTimerAnimPlaying","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"loseScreen","t":4,"rt":$n[0].GameObject,"sn":"loseScreen"},{"a":2,"n":"midBanner","t":4,"rt":$n[0].GameObject,"sn":"midBanner"},{"a":2,"n":"objectiveAmount","t":4,"rt":$n[4].Text,"sn":"objectiveAmount"},{"a":2,"n":"objectiveSlider","t":4,"rt":$n[4].Slider,"sn":"objectiveSlider"},{"a":2,"n":"playScreen","t":4,"rt":$n[0].GameObject,"sn":"playScreen"},{"a":2,"n":"shootScreen","t":4,"rt":$n[0].GameObject,"sn":"shootScreen"},{"a":2,"n":"timeBarImage","t":4,"rt":$n[4].Image,"sn":"timeBarImage"},{"a":2,"n":"timerText","t":4,"rt":$n[4].Text,"sn":"timerText"},{"a":2,"n":"topBanner","t":4,"rt":$n[0].GameObject,"sn":"topBanner"},{"a":2,"n":"winScreen","t":4,"rt":$n[0].GameObject,"sn":"winScreen"}]}; }, $n);
    /*UIManager end.*/

    /*Utils start.*/
    $m("Utils", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"SwitchChild","t":8,"pi":[{"n":"parent","pt":$n[0].Transform,"ps":0},{"n":"index","pt":$n[1].Int32,"ps":1}],"sn":"SwitchChild","rt":$n[1].Void,"p":[$n[0].Transform,$n[1].Int32]},{"a":2,"n":"WrapIndex","t":8,"pi":[{"n":"bounds","pt":$n[1].Int32,"ps":0},{"n":"index","pt":$n[1].Int32,"ps":1}],"sn":"WrapIndex","rt":$n[1].Int32,"p":[$n[1].Int32,$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    /*Utils end.*/

    /*HG.Playables.Tools.TowerGenerator start.*/
    $m("HG.Playables.Tools.TowerGenerator", function () { return {"nested":[$n[6].TowerGenerator.TowerShape,$n[6].TowerGenerator.FruitPatternItem,$n[6].TowerGenerator.PatternRowGroup],"att":1048577,"a":2,"at":[new UnityEngine.ExecuteAlwaysAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"BuildCircularFilledPatternRow","t":8,"pi":[{"n":"row","pt":$n[6].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowParent","pt":$n[0].Transform,"ps":1},{"n":"towerRoot","pt":$n[0].Transform,"ps":2},{"n":"rowIndex","pt":$n[1].Int32,"ps":3}],"sn":"BuildCircularFilledPatternRow","rt":$n[1].Void,"p":[$n[6].TowerGenerator.PatternRowGroup,$n[0].Transform,$n[0].Transform,$n[1].Int32]},{"a":1,"n":"BuildCircularPatternRow","t":8,"pi":[{"n":"row","pt":$n[6].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowParent","pt":$n[0].Transform,"ps":1},{"n":"towerRoot","pt":$n[0].Transform,"ps":2},{"n":"rowIndex","pt":$n[1].Int32,"ps":3}],"sn":"BuildCircularPatternRow","rt":$n[1].Void,"p":[$n[6].TowerGenerator.PatternRowGroup,$n[0].Transform,$n[0].Transform,$n[1].Int32]},{"a":1,"n":"BuildSquarePatternRow","t":8,"pi":[{"n":"row","pt":$n[6].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowParent","pt":$n[0].Transform,"ps":1},{"n":"towerRoot","pt":$n[0].Transform,"ps":2},{"n":"rowIndex","pt":$n[1].Int32,"ps":3}],"sn":"BuildSquarePatternRow","rt":$n[1].Void,"p":[$n[6].TowerGenerator.PatternRowGroup,$n[0].Transform,$n[0].Transform,$n[1].Int32]},{"at":[new UnityEngine.ContextMenu.ctor("Build Tower")],"a":2,"n":"BuildTower","t":8,"sn":"BuildTower","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Clear Generated")],"a":2,"n":"ClearGenerated","t":8,"sn":"ClearGenerated","rt":$n[1].Void},{"a":1,"n":"ClearGenerated","is":true,"t":8,"pi":[{"n":"root","pt":$n[0].Transform,"ps":0}],"sn":"ClearGenerated","rt":$n[1].Void,"p":[$n[0].Transform]},{"a":1,"n":"DrawCircleGizmo","is":true,"t":8,"pi":[{"n":"center","pt":$n[0].Vector3,"ps":0},{"n":"radius","pt":$n[1].Single,"ps":1}],"sn":"DrawCircleGizmo","rt":$n[1].Void,"p":[$n[0].Vector3,$n[1].Single]},{"a":1,"n":"DrawSquareGizmo","is":true,"t":8,"pi":[{"n":"center","pt":$n[0].Vector3,"ps":0},{"n":"halfSide","pt":$n[1].Single,"ps":1}],"sn":"DrawSquareGizmo","rt":$n[1].Void,"p":[$n[0].Vector3,$n[1].Single]},{"a":1,"n":"GetFruitFromPattern","t":8,"pi":[{"n":"row","pt":$n[6].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowIndex","pt":$n[1].Int32,"ps":1}],"sn":"GetFruitFromPattern","rt":$n[6].TowerGenerator.FruitPatternItem,"p":[$n[6].TowerGenerator.PatternRowGroup,$n[1].Int32]},{"a":1,"n":"GetOrCreateGeneratedRoot","t":8,"sn":"GetOrCreateGeneratedRoot","rt":$n[0].Transform},{"a":1,"n":"GetPatternRowName","t":8,"pi":[{"n":"rowIndex","pt":$n[1].Int32,"ps":0},{"n":"group","pt":$n[6].TowerGenerator.PatternRowGroup,"ps":1}],"sn":"GetPatternRowName","rt":$n[1].String,"p":[$n[1].Int32,$n[6].TowerGenerator.PatternRowGroup]},{"a":1,"n":"GetRowY","t":8,"pi":[{"n":"rowIndex","pt":$n[1].Int32,"ps":0}],"sn":"GetRowY","rt":$n[1].Single,"p":[$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"GetRowYWithPattern","t":8,"pi":[{"n":"group","pt":$n[6].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowIndex","pt":$n[1].Int32,"ps":1}],"sn":"GetRowYWithPattern","rt":$n[1].Single,"p":[$n[6].TowerGenerator.PatternRowGroup,$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"InstantiatePreservingPrefab","is":true,"t":8,"pi":[{"n":"prefab","pt":$n[0].GameObject,"ps":0},{"n":"parent","pt":$n[0].Transform,"ps":1}],"sn":"InstantiatePreservingPrefab","rt":$n[0].GameObject,"p":[$n[0].GameObject,$n[0].Transform]},{"a":1,"n":"OnDrawGizmosSelected","t":8,"sn":"OnDrawGizmosSelected","rt":$n[1].Void},{"a":1,"n":"SetupTowerComponent","t":8,"pi":[{"n":"instance","pt":$n[0].GameObject,"ps":0},{"n":"towerRoot","pt":$n[0].Transform,"ps":1},{"n":"rowIndex","pt":$n[1].Int32,"ps":2}],"sn":"SetupTowerComponent","rt":$n[1].Void,"p":[$n[0].GameObject,$n[0].Transform,$n[1].Int32]},{"a":1,"n":"GeneratedRootName","is":true,"t":4,"rt":$n[1].String,"sn":"GeneratedRootName"},{"a":2,"n":"clearBeforeBuild","t":4,"rt":$n[1].Boolean,"sn":"clearBeforeBuild","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"parentOverride","t":4,"rt":$n[0].Transform,"sn":"parentOverride"},{"at":[new UnityEngine.HeaderAttribute("Pattern Row Groups (repeating fruit patterns)")],"a":2,"n":"patternRowGroups","t":4,"rt":$n[3].List$1(HG.Playables.Tools.TowerGenerator.PatternRowGroup),"sn":"patternRowGroups"},{"a":2,"n":"rowHeight","t":4,"rt":$n[1].Single,"sn":"rowHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("General Settings")],"a":2,"n":"shape","t":4,"rt":$n[6].TowerGenerator.TowerShape,"sn":"shape","box":function ($v) { return Bridge.box($v, HG.Playables.Tools.TowerGenerator.TowerShape, System.Enum.toStringFn(HG.Playables.Tools.TowerGenerator.TowerShape));}},{"a":2,"n":"startY","t":4,"rt":$n[1].Single,"sn":"startY","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*HG.Playables.Tools.TowerGenerator end.*/

    /*HG.Playables.Tools.TowerGenerator+TowerShape start.*/
    $m("HG.Playables.Tools.TowerGenerator.TowerShape", function () { return {"td":$n[6].TowerGenerator,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Circular","is":true,"t":4,"rt":$n[6].TowerGenerator.TowerShape,"sn":"Circular","box":function ($v) { return Bridge.box($v, HG.Playables.Tools.TowerGenerator.TowerShape, System.Enum.toStringFn(HG.Playables.Tools.TowerGenerator.TowerShape));}},{"a":2,"n":"CircularFilled","is":true,"t":4,"rt":$n[6].TowerGenerator.TowerShape,"sn":"CircularFilled","box":function ($v) { return Bridge.box($v, HG.Playables.Tools.TowerGenerator.TowerShape, System.Enum.toStringFn(HG.Playables.Tools.TowerGenerator.TowerShape));}},{"a":2,"n":"Square","is":true,"t":4,"rt":$n[6].TowerGenerator.TowerShape,"sn":"Square","box":function ($v) { return Bridge.box($v, HG.Playables.Tools.TowerGenerator.TowerShape, System.Enum.toStringFn(HG.Playables.Tools.TowerGenerator.TowerShape));}}]}; }, $n);
    /*HG.Playables.Tools.TowerGenerator+TowerShape end.*/

    /*HG.Playables.Tools.TowerGenerator+FruitPatternItem start.*/
    $m("HG.Playables.Tools.TowerGenerator.FruitPatternItem", function () { return {"td":$n[6].TowerGenerator,"att":1056770,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"angleOffsetDegrees","t":4,"rt":$n[1].Single,"sn":"angleOffsetDegrees","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"fruitPrefab","t":4,"rt":$n[0].GameObject,"sn":"fruitPrefab"},{"a":2,"n":"radius","t":4,"rt":$n[1].Single,"sn":"radius","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"rowHeight","t":4,"rt":$n[1].Single,"sn":"rowHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"scale","t":4,"rt":$n[1].Single,"sn":"scale","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*HG.Playables.Tools.TowerGenerator+FruitPatternItem end.*/

    /*HG.Playables.Tools.TowerGenerator+PatternRowGroup start.*/
    $m("HG.Playables.Tools.TowerGenerator.PatternRowGroup", function () { return {"td":$n[6].TowerGenerator,"att":1056770,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"endRowIndex","t":4,"rt":$n[1].Int32,"sn":"endRowIndex","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"fillSpacing","t":4,"rt":$n[1].Single,"sn":"fillSpacing","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Fruit Pattern")],"a":2,"n":"fruitPattern","t":4,"rt":System.Array.type(HG.Playables.Tools.TowerGenerator.FruitPatternItem),"sn":"fruitPattern"},{"a":2,"n":"itemsInRow","t":4,"rt":$n[1].Int32,"sn":"itemsInRow","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HeaderAttribute("Pattern Settings")],"a":2,"n":"name","t":4,"rt":$n[1].String,"sn":"name"},{"a":2,"n":"patternRepeatCount","t":4,"rt":$n[1].Int32,"sn":"patternRepeatCount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"perRowHeight","t":4,"rt":$n[1].Single,"sn":"perRowHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"startRowIndex","t":4,"rt":$n[1].Int32,"sn":"startRowIndex","box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    /*HG.Playables.Tools.TowerGenerator+PatternRowGroup end.*/

    }});
