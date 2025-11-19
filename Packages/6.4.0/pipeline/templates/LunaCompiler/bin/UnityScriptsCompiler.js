/**
 * @compiler Bridge.NET 17.9.42-luna
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
                var array = this.arrowSprites;
                $t = Bridge.getEnumerator(array);
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

    /*ArrowDirection start.*/
    Bridge.define("ArrowDirection", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            targetType: 0,
            arrowModel: 0,
            arrowModel1: null,
            arrowModel2: null,
            arrowPivot: null,
            rotationSpeed: 0,
            updateInterval: 0,
            yoyoSpeed: 0,
            yoyoDistance: 0,
            _lastUpdateTime: 0,
            _currentTarget: null,
            _activeArrowModel: null,
            _isEnabled: false,
            _meshRenderer: null,
            _basePosition: null,
            _yoyoTime: 0,
            minDistance: 0
        },
        ctors: {
            init: function () {
                this._basePosition = new UnityEngine.Vector3();
                this.targetType = ArrowDirection.TargetType.ClosestTopItem;
                this.arrowModel = ArrowDirection.ArrowModelType.Model1;
                this.rotationSpeed = 360.0;
                this.updateInterval = 0.1;
                this.yoyoSpeed = 2.0;
                this.yoyoDistance = 0.2;
                this.minDistance = 2.0;
            }
        },
        methods: {
            /*ArrowDirection.Start start.*/
            Start: function () {
                if (UnityEngine.Component.op_Equality(this.arrowPivot, null)) {
                    this.arrowPivot = this.transform;
                }
                this._isEnabled = UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null) && PlayableSettings.instance.enableArrowDirection;
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    if (this._isEnabled) {
                        this.targetType = PlayableSettings.instance.arrowDirectionTargetType;
                    }
                    this.arrowModel = PlayableSettings.instance.arrowDirectionModel;
                    this.SetArrowColor(PlayableSettings.instance.arrowDirectionColor.$clone());
                    this.SetArrowScale(PlayableSettings.instance.arrowDirectionScale);
                    this.SetArrowPosition(PlayableSettings.instance.arrowDirectionPosition.$clone());
                    this.SetYoyoSettings(PlayableSettings.instance.arrowDirectionYoyoSpeed, PlayableSettings.instance.arrowDirectionYoyoDistance);
                }
                this.SetArrowModel(this.arrowModel);
                this.SetArrowVisible(false);
            },
            /*ArrowDirection.Start end.*/

            /*ArrowDirection.Update start.*/
            Update: function () {
                if (UnityEngine.Component.op_Equality(this.arrowPivot, null) || UnityEngine.GameObject.op_Equality(this._activeArrowModel, null)) {
                    return;
                }
                if (!this._isEnabled) {
                    this.SetArrowVisible(false);
                    return;
                }
                if (UnityEngine.Time.time - this._lastUpdateTime >= this.updateInterval) {
                    this.UpdateTarget();
                    this._lastUpdateTime = UnityEngine.Time.time;
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(this._currentTarget, null) && this._currentTarget.gameObject.activeInHierarchy) {
                    var myPos = this.transform.position.$clone();
                    var targetPos = this._currentTarget.transform.position.$clone();
                    var horizontalDistance = new pc.Vec3( targetPos.x - myPos.x, 0.0, targetPos.z - myPos.z ).length();
                    if (horizontalDistance >= this.minDistance) {
                        this.SetArrowVisible(true);
                        this.RotateTowardTarget();
                        this.UpdateYoyoMovement();
                    } else {
                        this.SetArrowVisible(false);
                    }
                } else {
                    this.SetArrowVisible(false);
                }
            },
            /*ArrowDirection.Update end.*/

            /*ArrowDirection.UpdateTarget start.*/
            UpdateTarget: function () {
                switch (this.targetType) {
                    case ArrowDirection.TargetType.ClosestTopItem: 
                        this._currentTarget = this.FindClosestTopItem();
                        break;
                    case ArrowDirection.TargetType.ClosestItem: 
                        this._currentTarget = this.FindClosestItem();
                        break;
                }
            },
            /*ArrowDirection.UpdateTarget end.*/

            /*ArrowDirection.FindClosestTopItem start.*/
            FindClosestTopItem: function () {
                var $t;
                var closest = null;
                var closestDistance = 3.40282347E+38;
                var myPosition = this.transform.position.$clone();
                var allActivators = UnityEngine.Object.FindObjectsOfType(SupportActivator);
                var array = allActivators;
                $t = Bridge.getEnumerator(array);
                try {
                    while ($t.moveNext()) {
                        var activator = $t.Current;
                        if (!(UnityEngine.MonoBehaviour.op_Equality(activator, null)) && activator.gameObject.activeInHierarchy && activator.isTopItem) {
                            var targetPos = activator.transform.position.$clone();
                            var horizontalDistance = new pc.Vec3( targetPos.x - myPosition.x, 0.0, targetPos.z - myPosition.z ).length();
                            if (!(horizontalDistance < this.minDistance) && horizontalDistance < closestDistance) {
                                closestDistance = horizontalDistance;
                                closest = activator;
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return closest;
            },
            /*ArrowDirection.FindClosestTopItem end.*/

            /*ArrowDirection.FindClosestItem start.*/
            FindClosestItem: function () {
                var $t;
                var closest = null;
                var closestDistance = 3.40282347E+38;
                var myPosition = this.transform.position.$clone();
                var allActivators = UnityEngine.Object.FindObjectsOfType(SupportActivator);
                var array = allActivators;
                $t = Bridge.getEnumerator(array);
                try {
                    while ($t.moveNext()) {
                        var activator = $t.Current;
                        if (!(UnityEngine.MonoBehaviour.op_Equality(activator, null)) && activator.gameObject.activeInHierarchy) {
                            var targetPos = activator.transform.position.$clone();
                            var horizontalDistance = new pc.Vec3( targetPos.x - myPosition.x, 0.0, targetPos.z - myPosition.z ).length();
                            if (!(horizontalDistance < this.minDistance) && horizontalDistance < closestDistance) {
                                closestDistance = horizontalDistance;
                                closest = activator;
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return closest;
            },
            /*ArrowDirection.FindClosestItem end.*/

            /*ArrowDirection.SetArrowVisible start.*/
            SetArrowVisible: function (visible) {
                if (UnityEngine.GameObject.op_Inequality(this._activeArrowModel, null)) {
                    this._activeArrowModel.SetActive(visible);
                }
            },
            /*ArrowDirection.SetArrowVisible end.*/

            /*ArrowDirection.RotateTowardTarget start.*/
            RotateTowardTarget: function () {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this._currentTarget, null))) {
                    var directionToTarget = this._currentTarget.transform.position.$clone().sub( this.transform.position );
                    directionToTarget.y = 0.0;
                    if (!(directionToTarget.lengthSq() < 0.001)) {
                        var targetRotation = new pc.Quat().lookRotation( directionToTarget.clone().normalize(), pc.Vec3.UP.clone() );
                        this.arrowPivot.rotation = pc.Quat.rotateTowards( this.arrowPivot.rotation.$clone(), targetRotation.$clone(), this.rotationSpeed * UnityEngine.Time.deltaTime );
                    }
                }
            },
            /*ArrowDirection.RotateTowardTarget end.*/

            /*ArrowDirection.GetCurrentTarget start.*/
            GetCurrentTarget: function () {
                return this._currentTarget;
            },
            /*ArrowDirection.GetCurrentTarget end.*/

            /*ArrowDirection.SetArrowColor start.*/
            SetArrowColor: function (color) {
                var $t, $t1, $t2, $t3;
                if (UnityEngine.Component.op_Inequality(this._meshRenderer, null) && this._meshRenderer.materials != null && this._meshRenderer.materials.length !== 0) {
                    if (($t = this._meshRenderer.materials)[0] != null) {
                        ($t1 = this._meshRenderer.materials)[0].color = color.$clone();
                    }
                    if (this._meshRenderer.materials.length > 1 && ($t2 = this._meshRenderer.materials)[1] != null && UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                        ($t3 = this._meshRenderer.materials)[1].color = PlayableSettings.instance.arrowDirectionOutlineColor.$clone();
                    }
                }
            },
            /*ArrowDirection.SetArrowColor end.*/

            /*ArrowDirection.SetArrowScale start.*/
            SetArrowScale: function (scale) {
                if (UnityEngine.GameObject.op_Inequality(this._activeArrowModel, null)) {
                    this._activeArrowModel.transform.localScale = new pc.Vec3( 1, 1, 1 ).clone().scale( scale );
                }
            },
            /*ArrowDirection.SetArrowScale end.*/

            /*ArrowDirection.SetArrowPosition start.*/
            SetArrowPosition: function (position) {
                if (UnityEngine.GameObject.op_Inequality(this._activeArrowModel, null)) {
                    this._basePosition = position.$clone();
                    this._activeArrowModel.transform.localPosition = this._basePosition.$clone();
                }
            },
            /*ArrowDirection.SetArrowPosition end.*/

            /*ArrowDirection.SetArrowModel start.*/
            SetArrowModel: function (modelType) {
                if (UnityEngine.GameObject.op_Inequality(this.arrowModel1, null)) {
                    this.arrowModel1.SetActive(false);
                }
                if (UnityEngine.GameObject.op_Inequality(this.arrowModel2, null)) {
                    this.arrowModel2.SetActive(false);
                }
                var selectedModel = ((modelType === ArrowDirection.ArrowModelType.Model1) ? this.arrowModel1 : this.arrowModel2);
                if (UnityEngine.GameObject.op_Inequality(selectedModel, null)) {
                    selectedModel.SetActive(true);
                    this._activeArrowModel = selectedModel;
                    this._meshRenderer = selectedModel.GetComponent(UnityEngine.MeshRenderer);
                    if (UnityEngine.Component.op_Equality(this._meshRenderer, null)) {
                        this._meshRenderer = selectedModel.GetComponentInChildren(UnityEngine.MeshRenderer, true);
                    }
                    if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                        this.SetArrowColor(PlayableSettings.instance.arrowDirectionColor.$clone());
                        this.SetArrowPosition(PlayableSettings.instance.arrowDirectionPosition.$clone());
                    }
                }
            },
            /*ArrowDirection.SetArrowModel end.*/

            /*ArrowDirection.UpdateYoyoMovement start.*/
            UpdateYoyoMovement: function () {
                if (!(UnityEngine.GameObject.op_Equality(this._activeArrowModel, null))) {
                    this._yoyoTime += UnityEngine.Time.deltaTime * this.yoyoSpeed;
                    var yoyoOffset = Math.sin(this._yoyoTime) * this.yoyoDistance;
                    var currentPos = this._basePosition.$clone();
                    currentPos.z += yoyoOffset;
                    this._activeArrowModel.transform.localPosition = currentPos.$clone();
                }
            },
            /*ArrowDirection.UpdateYoyoMovement end.*/

            /*ArrowDirection.SetYoyoSettings start.*/
            SetYoyoSettings: function (speed, distance) {
                this.yoyoSpeed = speed;
                this.yoyoDistance = distance;
            },
            /*ArrowDirection.SetYoyoSettings end.*/


        }
    });
    /*ArrowDirection end.*/

    /*ArrowDirection+ArrowModelType start.*/
    Bridge.define("ArrowDirection.ArrowModelType", {
        $kind: 1006,
        statics: {
            fields: {
                Model1: 0,
                Model2: 1
            }
        }
    });
    /*ArrowDirection+ArrowModelType end.*/

    /*ArrowDirection+TargetType start.*/
    Bridge.define("ArrowDirection.TargetType", {
        $kind: 1006,
        statics: {
            fields: {
                ClosestTopItem: 0,
                ClosestItem: 1
            }
        }
    });
    /*ArrowDirection+TargetType end.*/

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

    /*AxisOptions start.*/
    Bridge.define("AxisOptions", {
        $kind: 6,
        statics: {
            fields: {
                Both: 0,
                Horizontal: 1,
                Vertical: 2
            }
        }
    });
    /*AxisOptions end.*/

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

    /*CopyMainCameraFOV start.*/
    Bridge.define("CopyMainCameraFOV", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            mainCamera: null,
            uiCamera: null
        },
        methods: {
            /*CopyMainCameraFOV.Awake start.*/
            Awake: function () {
                this.uiCamera = this.GetComponent(UnityEngine.Camera);
                if (!UnityEngine.Object.op_Implicit(this.mainCamera)) {
                    this.mainCamera = UnityEngine.Camera.main;
                }
            },
            /*CopyMainCameraFOV.Awake end.*/

            /*CopyMainCameraFOV.LateUpdate start.*/
            LateUpdate: function () {
                if (UnityEngine.Object.op_Implicit(this.mainCamera) && UnityEngine.Object.op_Implicit(this.uiCamera)) {
                    this.uiCamera.fieldOfView = this.mainCamera.fieldOfView;
                }
            },
            /*CopyMainCameraFOV.LateUpdate end.*/


        }
    });
    /*CopyMainCameraFOV end.*/

    /*Joystick start.*/
    Bridge.define("Joystick", {
        inherits: [UnityEngine.MonoBehaviour,UnityEngine.EventSystems.IPointerDownHandler,UnityEngine.EventSystems.IEventSystemHandler,UnityEngine.EventSystems.IDragHandler,UnityEngine.EventSystems.IPointerUpHandler],
        fields: {
            handleRange: 0,
            deadZone: 0,
            axisOptions: 0,
            snapX: false,
            snapY: false,
            background: null,
            joystickHandle: null,
            baseRect: null,
            canvas: null,
            cam: null,
            input: null
        },
        props: {
            Horizontal: {
                get: function () {
                    return this.snapX ? this.SnapFloat(this.input.x, AxisOptions.Horizontal) : this.input.x;
                }
            },
            Vertical: {
                get: function () {
                    return this.snapY ? this.SnapFloat(this.input.y, AxisOptions.Vertical) : this.input.y;
                }
            },
            Direction: {
                get: function () {
                    return new pc.Vec2( this.Horizontal, this.Vertical );
                }
            },
            HandleRange: {
                get: function () {
                    return this.handleRange;
                },
                set: function (value) {
                    this.handleRange = Math.abs(value);
                }
            },
            DeadZone: {
                get: function () {
                    return this.deadZone;
                },
                set: function (value) {
                    this.deadZone = Math.abs(value);
                }
            },
            AxisOptions: {
                get: function () {
                    return this.AxisOptions;
                },
                set: function (value) {
                    this.axisOptions = value;
                }
            },
            SnapX: {
                get: function () {
                    return this.snapX;
                },
                set: function (value) {
                    this.snapX = value;
                }
            },
            SnapY: {
                get: function () {
                    return this.snapY;
                },
                set: function (value) {
                    this.snapY = value;
                }
            }
        },
        alias: [
            "OnPointerDown", "UnityEngine$EventSystems$IPointerDownHandler$OnPointerDown",
            "OnDrag", "UnityEngine$EventSystems$IDragHandler$OnDrag",
            "OnPointerUp", "UnityEngine$EventSystems$IPointerUpHandler$OnPointerUp"
        ],
        ctors: {
            init: function () {
                this.input = new UnityEngine.Vector2();
                this.handleRange = 1.0;
                this.deadZone = 0.0;
                this.axisOptions = AxisOptions.Both;
                this.snapX = false;
                this.snapY = false;
                this.input = pc.Vec2.ZERO.clone();
            }
        },
        methods: {
            /*Joystick.Start start.*/
            Start: function () {
                this.HandleRange = this.handleRange;
                this.DeadZone = this.deadZone;
                this.baseRect = this.GetComponent(UnityEngine.RectTransform);
                this.canvas = this.GetComponentInParent(UnityEngine.Canvas);
                if (UnityEngine.Component.op_Equality(this.canvas, null)) {
                    UnityEngine.Debug.LogError$2("The Joystick is not placed inside a canvas");
                }
                var center = new pc.Vec2( 0.5, 0.5 );
                this.background.pivot = center.$clone();
                this.background.anchorMin = center.$clone();
                this.background.anchorMax = center.$clone();
                this.background.anchoredPosition = pc.Vec2.ZERO.clone();
                this.joystickHandle.anchorMin = center.$clone();
                this.joystickHandle.anchorMax = center.$clone();
                this.joystickHandle.pivot = center.$clone();
                this.joystickHandle.anchoredPosition = pc.Vec2.ZERO.clone();
            },
            /*Joystick.Start end.*/

            /*Joystick.OnPointerDown start.*/
            OnPointerDown: function (eventData) {
                this.OnDrag(eventData);
            },
            /*Joystick.OnPointerDown end.*/

            /*Joystick.OnDrag start.*/
            OnDrag: function (eventData) {
                this.cam = null;
                if (this.canvas.renderMode === UnityEngine.RenderMode.ScreenSpaceCamera) {
                    this.cam = this.canvas.worldCamera;
                }
                var position = UnityEngine.RectTransformUtility.WorldToScreenPoint(this.cam, this.background.position);
                var radius = this.background.sizeDelta.$clone().scale( 1.0 / ( 2.0 ) );
                this.input = (eventData.position.$clone().sub( position )).div( (radius.$clone().scale( this.canvas.scaleFactor )) );
                this.FormatInput();
                this.HandleInput(this.input.length(), this.input.clone().normalize().$clone(), radius.$clone(), this.cam);
                this.joystickHandle.anchoredPosition = this.input.$clone().mul( radius ).scale( this.handleRange );
            },
            /*Joystick.OnDrag end.*/

            /*Joystick.HandleInput start.*/
            HandleInput: function (magnitude, normalised, radius, cam) {
                if (magnitude > this.deadZone) {
                    if (magnitude > 1.0) {
                        this.input = normalised.$clone();
                    }
                } else {
                    this.input = pc.Vec2.ZERO.clone();
                }
            },
            /*Joystick.HandleInput end.*/

            /*Joystick.FormatInput start.*/
            FormatInput: function () {
                if (this.axisOptions === AxisOptions.Horizontal) {
                    this.input = new pc.Vec2( this.input.x, 0.0 );
                } else if (this.axisOptions === AxisOptions.Vertical) {
                    this.input = new pc.Vec2( 0.0, this.input.y );
                }
            },
            /*Joystick.FormatInput end.*/

            /*Joystick.SnapFloat start.*/
            SnapFloat: function (value, snapAxis) {
                if (value === 0.0) {
                    return value;
                }
                if (this.axisOptions === AxisOptions.Both) {
                    var angle = pc.Vec2.angle( this.input, pc.Vec2.UP.clone() );
                    switch (snapAxis) {
                        case AxisOptions.Horizontal: 
                            if (angle < 22.5 || angle > 157.5) {
                                return 0.0;
                            }
                            return (value > 0.0) ? 1 : (-1);
                        case AxisOptions.Vertical: 
                            if (angle > 67.5 && angle < 112.5) {
                                return 0.0;
                            }
                            return (value > 0.0) ? 1 : (-1);
                        default: 
                            return value;
                    }
                }
                if (value > 0.0) {
                    return 1.0;
                }
                if (value < 0.0) {
                    return -1.0;
                }
                return 0.0;
            },
            /*Joystick.SnapFloat end.*/

            /*Joystick.OnPointerUp start.*/
            OnPointerUp: function (eventData) {
                this.input = pc.Vec2.ZERO.clone();
                this.joystickHandle.anchoredPosition = pc.Vec2.ZERO.clone();
            },
            /*Joystick.OnPointerUp end.*/

            /*Joystick.ScreenPointToAnchoredPosition start.*/
            ScreenPointToAnchoredPosition: function (screenPosition) {
                var localPoint = { v : pc.Vec2.ZERO.clone() };
                if (UnityEngine.RectTransformUtility.ScreenPointToLocalPointInRectangle(this.baseRect, screenPosition, this.cam, localPoint)) {
                    var pivotOffset = this.baseRect.pivot.$clone().mul( this.baseRect.sizeDelta );
                    return localPoint.v.$clone().sub( this.background.anchorMax.$clone().mul( this.baseRect.sizeDelta ) ).add( pivotOffset );
                }
                return pc.Vec2.ZERO.clone();
            },
            /*Joystick.ScreenPointToAnchoredPosition end.*/


        }
    });
    /*Joystick end.*/

    /*FloatingFeedback start.*/
    Bridge.define("FloatingFeedback", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            prefab: null,
            pool: null,
            poolSize: 0
        },
        ctors: {
            init: function () {
                this.pool = new (System.Collections.Generic.List$1(FloatingText)).ctor();
                this.poolSize = 10;
            }
        },
        methods: {
            /*FloatingFeedback.Show start.*/
            Show: function (worldPos) {
                if (this.pool.Count !== 0) {
                    var ft = this.pool.getItem(0);
                    this.pool.removeAt(0);
                    this.pool.add(ft);
                    worldPos.x += UnityEngine.Random.Range$1(-0.25, 0.25);
                    worldPos.z += UnityEngine.Random.Range$1(-0.25, 0.25);
                    ft.Show(worldPos.$clone());
                }
            },
            /*FloatingFeedback.Show end.*/


        }
    });
    /*FloatingFeedback end.*/

    /*FloatingText start.*/
    Bridge.define("FloatingText", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            text: null,
            cg: null,
            duration: 0,
            moveSpeed: 0,
            fadeCurve: null,
            moveCurve: null,
            timer: 0,
            active: false
        },
        ctors: {
            init: function () {
                this.duration = 0.8;
                this.moveSpeed = 1.6;
                this.fadeCurve = pc.AnimationCurve.createEaseInOut(0.0, 1.0, 1.0, 0.0);
                this.moveCurve = pc.AnimationCurve.createEaseInOut(0.0, 1.0, 1.0, 0.2);
            }
        },
        methods: {
            /*FloatingText.Awake start.*/
            Awake: function () {
                this.moveSpeed = UnityEngine.Random.Range$1(1.6, 2.6);
                if (!UnityEngine.Object.op_Implicit(this.cg)) {
                    this.cg = this.GetComponent(UnityEngine.CanvasGroup);
                }
                if (!UnityEngine.Object.op_Implicit(this.text)) {
                    this.text = this.GetComponentInChildren(TMPro.TextMeshProUGUI);
                }
            },
            /*FloatingText.Awake end.*/

            /*FloatingText.Show start.*/
            Show: function (worldPos) {
                this.transform.position = worldPos.$clone();
                this.text.text = "1";
                this.cg.alpha = 1.0;
                this.timer = 0.0;
                this.active = true;
                Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.SetActive(true);
            },
            /*FloatingText.Show end.*/

            /*FloatingText.Update start.*/
            Update: function () {
                if (this.active) {
                    this.timer += UnityEngine.Time.deltaTime;
                    var t = Math.max(0, Math.min(1, this.timer / this.duration));
                    var speedFactor = this.moveCurve.value(t);
                    this.transform.position = this.transform.position.$clone().add( pc.Vec3.UP.clone().clone().scale( this.moveSpeed ).clone().scale( speedFactor ).clone().scale( UnityEngine.Time.deltaTime ) );
                    this.cg.alpha = this.fadeCurve.value(t);
                    if (this.timer >= this.duration) {
                        this.active = false;
                        Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.SetActive(false);
                    }
                }
            },
            /*FloatingText.Update end.*/


        }
    });
    /*FloatingText end.*/

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
            useThrowableSystem: false,
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
                this.useThrowableSystem = false;
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
                this._maxObjectiveAmount = PlayableSettings.instance.objectiveAmount;
                this.LoadLevel(PlayableSettings.instance.Level);
                this.currentTime = this.PlayableSettings.gameTimeInSeconds;
                UIManager.instance.UpdateTimer(this.currentTime);
                if (this.useThrowableSystem) {
                    this.SetupThrowableObjects();
                }
                if (UnityEngine.GameObject.op_Inequality(this.flower, null)) {
                    UnityEngine.GameObject.op_Inequality(this.flower, null) ? this.flower.SetActive(this.PlayableSettings.showFlower) : null;
                }
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

            /*GameManager.GameOver start.*/
            GameOver: function (isWin) {
                this.StartCoroutine$1(this.GameOverCoroutine(isWin));
            },
            /*GameManager.GameOver end.*/

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

            /*GameManager.OnButtonClick start.*/
            OnButtonClick: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(StoreRedirectTracker.instance, null)) {
                    StoreRedirectTracker.instance.TriggerManualRedirect("Game over button clicked");
                    return;
                }
                Luna.Unity.Playable.InstallFullGame();
                Luna.Unity.LifeCycle.GameEnded();
                Luna.Unity.Analytics.LogEvent$1("Game over button clicked", 1);
            },
            /*GameManager.OnButtonClick end.*/

            /*GameManager.OnBottomBannerClick start.*/
            OnBottomBannerClick: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(StoreRedirectTracker.instance, null)) {
                    StoreRedirectTracker.instance.TriggerManualRedirect("Bottom banner clicked");
                } else {
                    Luna.Unity.Playable.InstallFullGame();
                }
            },
            /*GameManager.OnBottomBannerClick end.*/

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
                                    if (UnityEngine.MonoBehaviour.op_Inequality(StoreRedirectTracker.instance, null)) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 3;
                                        continue;
                                }
                                case 2: {
                                    StoreRedirectTracker.instance.TriggerManualRedirect("Tower hit auto redirect");
                                        return false;
                                    $step = 3;
                                    continue;
                                }
                                case 3: {
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

            /*GameManager.SetupThrowableObjects start.*/
            SetupThrowableObjects: function () {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this.PlayableSettings, null)) && this.useThrowableSystem) {
                    if (UnityEngine.GameObject.op_Inequality(this.pumpkinsParent, null)) {
                        this.pumpkinsParent.SetActive(this.PlayableSettings.throwableObjectType === ThrowableObjectType.Pumpkins);
                    }
                    if (UnityEngine.GameObject.op_Inequality(this.watermelonsParent, null)) {
                        this.watermelonsParent.SetActive(this.PlayableSettings.throwableObjectType === ThrowableObjectType.Watermelon);
                    }
                }
            },
            /*GameManager.SetupThrowableObjects end.*/


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
                this.cursorImage.enabled = false;
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

                /*HG.Playables.Tools.TowerGenerator.DrawRectangleGizmo:static start.*/
                DrawRectangleGizmo: function (center, gridWidth, gridHeight, radius) {
                    var spacing = radius * 2.0;
                    var halfWidth = (((gridWidth - 1) | 0)) * spacing * 0.5;
                    var halfHeight = (((gridHeight - 1) | 0)) * spacing * 0.5;
                    var a = center.$clone().add( new pc.Vec3( 0.0 - halfWidth, 0.0, 0.0 - halfHeight ) );
                    var b = center.$clone().add( new pc.Vec3( 0.0 - halfWidth, 0.0, halfHeight ) );
                    var c = center.$clone().add( new pc.Vec3( halfWidth, 0.0, halfHeight ) );
                    var d = center.$clone().add( new pc.Vec3( halfWidth, 0.0, 0.0 - halfHeight ) );
                    pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                    pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                    pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                    pc.stubProxy.reportMethod( 'UnityEngine.Gizmos.DrawLine', null );
                },
                /*HG.Playables.Tools.TowerGenerator.DrawRectangleGizmo:static end.*/


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
                        tr.localRotation = new pc.Quat().lookRotation( dir, pc.Vec3.UP.clone() );
                        tr.localScale = new pc.Vec3( 1, 1, 1 ).clone().scale( fruitItem.scale );
                        this.SetupTowerComponent(instance, towerRoot, rowIndex);
                    }
                }
            },
            /*HG.Playables.Tools.TowerGenerator.BuildCircularPatternRow end.*/

            /*HG.Playables.Tools.TowerGenerator.BuildSquarePatternRow start.*/
            BuildSquarePatternRow: function (row, rowParent, towerRoot, rowIndex) {
                var fruitItem = this.GetFruitFromPattern(row, rowIndex);
                if (fruitItem == null || UnityEngine.GameObject.op_Equality(fruitItem.fruitPrefab, null)) {
                    return;
                }
                var gridWidth = row.gridWidth;
                var gridHeight = row.gridHeight;
                var totalItems = Bridge.Int.mul(gridWidth, gridHeight);
                var spacing = fruitItem.radius * 2.0;
                var startX = (((-(((gridWidth - 1) | 0))) | 0)) * spacing * 0.5;
                var startZ = (((-(((gridHeight - 1) | 0))) | 0)) * spacing * 0.5;
                var placed = 0;
                for (var z = 0; z < gridHeight; z = (z + 1) | 0) {
                    for (var x = 0; x < gridWidth; x = (x + 1) | 0) {
                        var localPos = new pc.Vec3( startX + x * spacing, 0.0, startZ + z * spacing );
                        var instance = HG.Playables.Tools.TowerGenerator.InstantiatePreservingPrefab(fruitItem.fruitPrefab, rowParent);
                        instance.name = (fruitItem.fruitPrefab.name || "") + "_" + placed;
                        var tr = instance.transform;
                        tr.localPosition = localPos.$clone();
                        tr.localRotation = pc.Quat.IDENTITY.clone();
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
                        tr.localRotation = new pc.Quat().lookRotation( localPos.clone().normalize(), pc.Vec3.UP.clone() );
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
                        if (this.shape === HG.Playables.Tools.TowerGenerator.TowerShape.Circular || this.shape === HG.Playables.Tools.TowerGenerator.TowerShape.CircularFilled) {
                            HG.Playables.Tools.TowerGenerator.DrawCircleGizmo(this.transform.position.$clone().add( yOffset ), radius);
                        } else if (this.shape === HG.Playables.Tools.TowerGenerator.TowerShape.Square) {
                            HG.Playables.Tools.TowerGenerator.DrawRectangleGizmo(this.transform.position.$clone().add( yOffset ), group.gridWidth, group.gridHeight, radius);
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
            gridWidth: 0,
            gridHeight: 0,
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
                this.gridWidth = 2;
                this.gridHeight = 3;
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
            movementIndicatorPivot: null,
            triangleSpriteRenderer: null,
            periscopeRenderer: null,
            indicatorRotationSpeed: 0,
            _lastPos: null,
            victimLayer: null,
            swallowPower: 0,
            detector: null,
            collectSFX: null,
            evolveVFX: null,
            physicsCheckInterval: 0,
            _lastPhysicsCheck: 0,
            _victimsBuffer: null,
            _releaseBuffer: null,
            supportFlagHeight: 0,
            supportFlagInterval: 0,
            supportFlagRadiusMultiplier: 0,
            _lastSupportFlag: 0,
            _supportFlagBuffer: null,
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
            floatingFeedback: null,
            _playerMovement: null,
            _utils: null,
            _isFakeMoving: false,
            _fakeTargetPosition: null,
            _fakeStartPosition: null,
            _inputEnabled: false,
            _lastSupportPosition: null,
            _settings: null
        },
        props: {
            IsInputEnabled: {
                get: function () {
                    return this._inputEnabled;
                }
            },
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
                this._lastSupportPosition = new UnityEngine.Vector3();
                this.moveSpeed = 2.0;
                this.indicatorRotationSpeed = 720.0;
                this.swallowPower = 2.0;
                this.physicsCheckInterval = 0.1;
                this.supportFlagHeight = 6.0;
                this.supportFlagInterval = 0.05;
                this.supportFlagRadiusMultiplier = 1.1;
                this.releaseRadius = 0.5;
                this.releaseHeight = 1.0;
                this.maxReleasesPerEvent = 12;
                this.scaleDuration = 0.2;
                this.scaleMultiplier = 1.2;
                this.growThreshold = 10.0;
                this.growThresholdMultiplier = 1.2;
                this._isFakeMoving = false;
                this._inputEnabled = true;
            }
        },
        methods: {
            /*HoleController.SetInputEnabled start.*/
            SetInputEnabled: function (enabled) {
                this._inputEnabled = enabled;
                if (!enabled) {
                    this.SetIndicatorVisible(false);
                }
            },
            /*HoleController.SetInputEnabled end.*/

            /*HoleController.Start start.*/
            Start: function () {
                this._settings = PlayableSettings.instance;
                this._playerMovement = new PlayerMovement();
                this._utils = new Utils();
                if (UnityEngine.MonoBehaviour.op_Inequality(this._settings, null)) {
                    this.moveSpeed = this._settings.holeMoveSpeed;
                    this.scaleMultiplier = this._settings.levelUpSizeIncreaseMultiplier;
                    this.growThreshold = this._settings.swallowCountFirstLevel;
                    this.growThresholdMultiplier = this._settings.swallowNeededMultiplier;
                    if (UnityEngine.Component.op_Inequality(this.triangleSpriteRenderer, null) || UnityEngine.GameObject.op_Inequality(this.periscopeRenderer, null)) {
                        this.SetIndicatorVisible(false);
                        if (this._settings.enableMovementIndicator) {
                            this.SetIndicatorColor(this._settings.movementIndicatorColor.$clone());
                        }
                    }
                    if (UnityEngine.Component.op_Inequality(this.skinsParent, null)) {
                        this._utils.SwitchChild(this.skinsParent, this._settings.holeSkin);
                        var intro = this.GetComponent(IntroHoleAnimation);
                        if (UnityEngine.MonoBehaviour.op_Inequality(intro, null)) {
                            intro.Begin();
                        }
                    }
                    if (this._settings.useHoleStartPosition) {
                        this.transform.position = this._settings.holeStartPosition.$clone();
                    }
                }
                this._lastPos = this.transform.position.$clone();
                this._victimsBuffer = PhysicsObjectPool.GetColliders(16);
                this._releaseBuffer = PhysicsObjectPool.GetColliders(this.maxReleasesPerEvent);
                this._supportFlagBuffer = PhysicsObjectPool.GetColliders(32);
                this._lastSupportPosition = this.transform.position.$clone();
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
                if (this._supportFlagBuffer != null) {
                    PhysicsObjectPool.ReturnColliders(this._supportFlagBuffer);
                    this._supportFlagBuffer = null;
                }
            },
            /*HoleController.OnDestroy end.*/

            /*HoleController.Update start.*/
            Update: function () {
                if (GameManager.instance.isGameOver) {
                    return;
                }
                if (!this._isFakeMoving && UnityEngine.MonoBehaviour.op_Equality(this._held, null) && this._inputEnabled) {
                    this._playerMovement.UpdateInputs(this.transform);
                }
                if (this._inputEnabled && UnityEngine.Component.op_Inequality(this.movementIndicatorPivot, null) && UnityEngine.MonoBehaviour.op_Inequality(this._settings, null)) {
                    if (!this._settings.enableMovementIndicator) {
                        this.SetIndicatorVisible(false);
                    } else {
                        var shouldShow = UnityEngine.Input.GetMouseButton(0) || !this._settings.hideMovementIndicatorWhenIdle;
                        this.SetIndicatorVisible(shouldShow);
                        if (shouldShow) {
                            var currentPos = this.transform.position.$clone();
                            var delta = currentPos.$clone().sub( this._lastPos );
                            var planar = new pc.Vec3( delta.x, 0.0, delta.z );
                            if (planar.lengthSq() > 0.0001) {
                                var lookRot = new pc.Quat().lookRotation( planar.clone().normalize(), pc.Vec3.UP.clone() );
                                this.movementIndicatorPivot.rotation = pc.Quat.rotateTowards( this.movementIndicatorPivot.rotation.$clone(), lookRot.$clone(), this.indicatorRotationSpeed * UnityEngine.Time.deltaTime );
                            }
                            this._lastPos = currentPos.$clone();
                        }
                    }
                }
                var movedThisFrame = (this.transform.position.$clone().sub( this._lastSupportPosition )).lengthSq() > 0.0001;
                if (movedThisFrame && UnityEngine.Time.time - this._lastSupportFlag >= this.supportFlagInterval) {
                    this._lastSupportFlag = UnityEngine.Time.time;
                    this.FlagSupportsAboveHole();
                }
                if (movedThisFrame) {
                    this._lastSupportPosition = this.transform.position.$clone();
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
                if (!(this._growCounter > this.growThreshold)) {
                    return;
                }
                this.Grow();
                this._growCounter = 0;
                if (UnityEngine.MonoBehaviour.op_Inequality(this._settings, null)) {
                    this.growThreshold *= this._settings.swallowNeededMultiplier;
                    if (this._settings.holeSpeedIncreaseType === PlayableSettings.HoleSpeedIncreaseType.Additive) {
                        this.moveSpeed += this._settings.holeSpeedIncrease;
                    } else {
                        this.moveSpeed *= UnityEngine.Mathf.Max(1.0, this._settings.holeSpeedIncrease);
                    }
                    this._settings.CameraZoomOut(this.scaleMultiplier);
                    if (this._settings.showHoleGrowVFX) {
                        this.evolveVFX.Play();
                    }
                }
                UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayHoleGrowSound() : null;
            },
            /*HoleController.Update end.*/

            /*HoleController.FixedUpdate start.*/
            FixedUpdate: function () {
                if (!GameManager.instance.isGameOver) {
                    if (this._isFakeMoving) {
                        this.UpdateFakeMovement();
                    } else if (UnityEngine.MonoBehaviour.op_Equality(this._held, null) && this._inputEnabled) {
                        this._playerMovement.ApplyMovement(this.transform, this.moveSpeed);
                    }
                }
            },
            /*HoleController.FixedUpdate end.*/

            /*HoleController.SetIndicatorVisible start.*/
            SetIndicatorVisible: function (visible) {
                if (UnityEngine.MonoBehaviour.op_Equality(this._settings, null)) {
                    return;
                }
                if (!this._settings.enableMovementIndicator) {
                    visible = false;
                }
                if (this._settings.movementIndicatorType === MovementIndicatorType.Triangle) {
                    if (UnityEngine.Component.op_Inequality(this.triangleSpriteRenderer, null)) {
                        this.triangleSpriteRenderer.enabled = visible;
                    }
                    this.periscopeRenderer.SetActive(false);
                } else {
                    this.periscopeRenderer.SetActive(visible);
                    if (UnityEngine.Component.op_Inequality(this.triangleSpriteRenderer, null)) {
                        this.triangleSpriteRenderer.enabled = false;
                    }
                }
            },
            /*HoleController.SetIndicatorVisible end.*/

            /*HoleController.SetIndicatorColor start.*/
            SetIndicatorColor: function (color) {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this._settings, null)) && this._settings.movementIndicatorType === MovementIndicatorType.Triangle && UnityEngine.Component.op_Inequality(this.triangleSpriteRenderer, null)) {
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
                if (!this.IsCollectible(other.gameObject) || !(other.transform.position.y < -0.5)) {
                    return;
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(this._settings, null) && this._settings.displayHoleCountFeedback) {
                    this.floatingFeedback.Show(this.transform.position.$clone());
                }
                var collectedAmount = GameManager.instance.currentObjectiveAmount;
                if (UnityEngine.MonoBehaviour.op_Inequality(this._settings, null) && collectedAmount < this._settings.objectiveAmount) {
                    this.collectSFX.PlayOneShot(this._settings.collectItemSFX);
                    ($t = GameManager.instance).currentObjectiveAmount = ($t.currentObjectiveAmount + 1) | 0;
                    UIManager.instance.UpdateSlider(GameManager.instance.currentObjectiveAmount);
                }
                this._growCounter = (this._growCounter + 1) | 0;
                var removedPos = other.transform.position.$clone();
                this.ReleaseNeighbors(removedPos.$clone());
                var rb = other.GetComponentInParent(UnityEngine.Rigidbody);
                var sa = ((UnityEngine.Component.op_Inequality(rb, null)) ? (rb.GetComponent(SupportActivator) || rb.GetComponentInChildren(SupportActivator)) : (other.GetComponent(SupportActivator) || other.GetComponentInChildren(SupportActivator)));
                if (UnityEngine.MonoBehaviour.op_Inequality(sa, null)) {
                    sa.countInObjectives = false;
                    if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null) && UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance.myObjectivesUISystem, null)) {
                        UIManager.instance.myObjectivesUISystem.HandleSupportSwallowed(sa, this.transform.position.$clone());
                    }
                    if (UnityEngine.MonoBehaviour.op_Inequality(this._settings, null) && this._settings.enableWinOnSwallowTopItem && sa.isTopItem && this.CountRemainingTopItems() === 0 && !GameManager.instance.isGameOver) {
                        Luna.Unity.Analytics.LogEvent$1("win_top_item_swallowed", 1);
                        UnityEngine.MonoBehaviour.op_Inequality(AudioManager.instance, null) ? AudioManager.instance.PlayWinSound() : null;
                        GameManager.instance.GameOver(true);
                    }
                }
                ((UnityEngine.Component.op_Inequality(rb, null)) ? rb.gameObject : other.gameObject).SetActive(false);
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

            /*HoleController.FlagSupportsAboveHole start.*/
            FlagSupportsAboveHole: function () {
                if (UnityEngine.Component.op_Equality(this.detector, null) || this._supportFlagBuffer == null) {
                    return;
                }
                var worldCenter = this.detector.bounds.center.$clone();
                var radius = UnityEngine.Mathf.Max(0.05, this.detector.radius * this.supportFlagRadiusMultiplier);
                var height = UnityEngine.Mathf.Max(0.5, this.supportFlagHeight);
                var p0 = worldCenter.$clone().add( pc.Vec3.UP.clone().clone().scale( 0.05 ) );
                var p1 = p0.$clone().add( pc.Vec3.UP.clone().clone().scale( height ) );
                var hitCount = UnityEngine.Physics.OverlapCapsuleNonAlloc(p0, p1, radius, this._supportFlagBuffer, UnityEngine.LayerMask.op_Implicit(this.victimLayer.$clone()), UnityEngine.QueryTriggerInteraction.Ignore);
                for (var i = 0; i < hitCount; i = (i + 1) | 0) {
                    var hit = this._supportFlagBuffer[i];
                    if (!(UnityEngine.Component.op_Equality(hit, null))) {
                        var activator = hit.GetComponentInParent(SupportActivator);
                        if (!(UnityEngine.MonoBehaviour.op_Equality(activator, null))) {
                            activator.FlaggedByHole();
                        }
                    }
                }
            },
            /*HoleController.FlagSupportsAboveHole end.*/

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
                if (UnityEngine.MonoBehaviour.op_Inequality(this._settings, null) && this._settings.enableFakeControl && !this._isFakeMoving) {
                    this._isFakeMoving = true;
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
                        this.transform.Translate$1(direction.$clone().clone().scale( this.moveSpeed ).clone().scale( UnityEngine.Time.fixedDeltaTime ));
                        return;
                    }
                    this.transform.position = this._fakeTargetPosition.$clone();
                    this._isFakeMoving = false;
                }
            },
            /*HoleController.UpdateFakeMovement end.*/

            /*HoleController.CountRemainingTopItems start.*/
            CountRemainingTopItems: function () {
                var $t;
                var count = 0;
                var allSupports = UnityEngine.Object.FindObjectsOfType(SupportActivator);
                var array = allSupports;
                $t = Bridge.getEnumerator(array);
                try {
                    while ($t.moveNext()) {
                        var support = $t.Current;
                        if (UnityEngine.MonoBehaviour.op_Inequality(support, null) && support.isTopItem && support.countInObjectives && support.gameObject.activeInHierarchy) {
                            count = (count + 1) | 0;
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                return count;
            },
            /*HoleController.CountRemainingTopItems end.*/


        }
    });
    /*HoleController end.*/

    /*HoleSkin start.*/
    Bridge.define("HoleSkin", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            glowSprite: null,
            glowTransform: null
        },
        props: {
            GetSkinHoleTransform: {
                get: function () {
                    return this.transform;
                }
            }
        }
    });
    /*HoleSkin end.*/

    /*IntroHoleAnimation start.*/
    Bridge.define("IntroHoleAnimation", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            holderTransform: null,
            holderScaleCurve: null,
            animationSpeed: 0,
            glowAlphaCurve: null,
            glowScaleCurve: null,
            _holeController: null,
            _originalHolderScale: null,
            _activeHoleSkin: null,
            _originalGlowColor: null,
            _originalGlowScale: null,
            _originalGlowAlpha: 0,
            _animationCoroutine: null,
            _isAnimating: false
        },
        ctors: {
            init: function () {
                this._originalHolderScale = new UnityEngine.Vector3();
                this._originalGlowColor = new UnityEngine.Color();
                this._originalGlowScale = new UnityEngine.Vector3();
                this.holderScaleCurve = pc.AnimationCurve.createEaseInOut(0.0, 1.0, 1.0, 1.0);
                this.animationSpeed = 1.0;
                this.glowAlphaCurve = pc.AnimationCurve.createEaseInOut(0.0, 1.0, 1.0, 1.0);
                this.glowScaleCurve = pc.AnimationCurve.createEaseInOut(0.0, 1.0, 1.0, 1.0);
                this._isAnimating = false;
            }
        },
        methods: {
            /*IntroHoleAnimation.Start start.*/
            Start: function () {
                this._holeController = this.GetComponent(HoleController);
                if (UnityEngine.Component.op_Equality(this.holderTransform, null)) {
                    UnityEngine.Debug.LogWarning$1("IntroHoleAnimation: Holder Transform not assigned!");
                } else {
                    this._originalHolderScale = new pc.Vec3( 1, 1, 1 );
                }
            },
            /*IntroHoleAnimation.Start end.*/

            /*IntroHoleAnimation.Begin start.*/
            Begin: function () {
                this.FindActiveHoleSkin();
                if (UnityEngine.MonoBehaviour.op_Inequality(this._activeHoleSkin, null) && UnityEngine.Component.op_Inequality(this._activeHoleSkin.glowSprite, null)) {
                    this._originalGlowColor = this._activeHoleSkin.glowSprite.color.$clone();
                    this._originalGlowAlpha = this._originalGlowColor.a;
                    var c = this._originalGlowColor.$clone();
                    c.a = 0.0;
                    this._activeHoleSkin.glowSprite.color = c.$clone();
                    this._activeHoleSkin.glowSprite.enabled = false;
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(this._activeHoleSkin, null) && UnityEngine.Component.op_Inequality(this._activeHoleSkin.glowTransform, null)) {
                    this._originalGlowScale = this._activeHoleSkin.glowTransform.localScale.$clone();
                }
                this.StartIdleAnimation();
            },
            /*IntroHoleAnimation.Begin end.*/

            /*IntroHoleAnimation.FindActiveHoleSkin start.*/
            FindActiveHoleSkin: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(this._holeController, null) || UnityEngine.Component.op_Equality(this._holeController.skinsParent, null)) {
                    return;
                }
                var skinsParent = this._holeController.skinsParent;
                for (var i = 0; i < skinsParent.childCount; i = (i + 1) | 0) {
                    var skinChild = skinsParent.GetChild(i);
                    if (!skinChild.gameObject.activeSelf) {
                        continue;
                    }
                    this._activeHoleSkin = skinChild.GetComponent(HoleSkin);
                    if (UnityEngine.MonoBehaviour.op_Inequality(this._activeHoleSkin, null)) {
                        if (UnityEngine.Component.op_Inequality(this._activeHoleSkin.glowSprite, null)) {
                            this._originalGlowColor = this._activeHoleSkin.glowSprite.color.$clone();
                            this._originalGlowAlpha = this._originalGlowColor.a;
                        }
                        if (UnityEngine.Component.op_Inequality(this._activeHoleSkin.glowTransform, null)) {
                            this._originalGlowScale = this._activeHoleSkin.glowTransform.localScale.$clone();
                        }
                    }
                    break;
                }
            },
            /*IntroHoleAnimation.FindActiveHoleSkin end.*/

            /*IntroHoleAnimation.StartIdleAnimation start.*/
            StartIdleAnimation: function () {
                if (!this._isAnimating && !(UnityEngine.Component.op_Equality(this.holderTransform, null))) {
                    this._isAnimating = true;
                    if (this._animationCoroutine != null) {
                        this.StopCoroutine$2(this._animationCoroutine);
                    }
                    this._animationCoroutine = this.StartCoroutine$1(this.AnimateCoroutine());
                }
            },
            /*IntroHoleAnimation.StartIdleAnimation end.*/

            /*IntroHoleAnimation.StopIdleAnimation start.*/
            StopIdleAnimation: function () {
                if (this._isAnimating) {
                    if (this._animationCoroutine != null) {
                        this.StopCoroutine$2(this._animationCoroutine);
                        this._animationCoroutine = null;
                    }
                    this.ResetValues();
                }
            },
            /*IntroHoleAnimation.StopIdleAnimation end.*/

            /*IntroHoleAnimation.AnimateCoroutine start.*/
            AnimateCoroutine: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    time,
                    curveDuration,
                    normalizedTime,
                    holderScaleValue,
                    alphaValue,
                    currentColor,
                    glowScaleValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    time = 0.0;
                                        curveDuration = this.GetCurveDuration();
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( !(UnityEngine.MonoBehaviour.op_Inequality(this._holeController, null)) || !this._holeController.IsInputEnabled || (!UnityEngine.Input.GetMouseButtonDown(0) && (UnityEngine.Input.touchCount <= 0 || UnityEngine.Input.GetTouch(0).phase !== 0)) ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    normalizedTime = time % curveDuration / curveDuration;
                                        holderScaleValue = this.holderScaleCurve.value(normalizedTime);
                                        this.holderTransform.localScale = new pc.Vec3( 1, 1, 1 ).clone().scale( holderScaleValue );
                                        if (UnityEngine.MonoBehaviour.op_Inequality(this._activeHoleSkin, null)) {
                                            if (UnityEngine.Component.op_Inequality(this._activeHoleSkin.glowSprite, null)) {
                                                if (!this._activeHoleSkin.glowSprite.enabled) {
                                                    this._activeHoleSkin.glowSprite.enabled = true;
                                                }
                                                alphaValue = this.glowAlphaCurve.value(normalizedTime);
                                                currentColor = this._originalGlowColor.$clone();
                                                currentColor.a = this._originalGlowAlpha * alphaValue;
                                                this._activeHoleSkin.glowSprite.color = currentColor.$clone();
                                            }
                                            if (UnityEngine.Component.op_Inequality(this._activeHoleSkin.glowTransform, null)) {
                                                glowScaleValue = this.glowScaleCurve.value(normalizedTime);
                                                this._activeHoleSkin.glowTransform.localScale = this._originalGlowScale.$clone().clone().scale( glowScaleValue );
                                            }
                                        }
                                        time += UnityEngine.Time.deltaTime * this.animationSpeed;
                                        $enumerator.current = null;
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 4: {
                                    if (this._animationCoroutine != null) {
                                            this.StopCoroutine$2(this._animationCoroutine);
                                            this._animationCoroutine = null;
                                        }
                                        this.ResetValues();

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
            /*IntroHoleAnimation.AnimateCoroutine end.*/

            /*IntroHoleAnimation.ResetValues start.*/
            ResetValues: function () {
                this.holderTransform.localScale = new pc.Vec3( 1, 1, 1 );
                if (UnityEngine.MonoBehaviour.op_Inequality(this._activeHoleSkin, null)) {
                    if (UnityEngine.Component.op_Inequality(this._activeHoleSkin.glowSprite, null)) {
                        this._activeHoleSkin.glowSprite.color = this._originalGlowColor.$clone();
                        this._activeHoleSkin.glowSprite.enabled = false;
                    }
                    if (UnityEngine.Component.op_Inequality(this._activeHoleSkin.glowTransform, null)) {
                        this._activeHoleSkin.glowTransform.localScale = this._originalGlowScale.$clone();
                    }
                }
                this._isAnimating = false;
            },
            /*IntroHoleAnimation.ResetValues end.*/

            /*IntroHoleAnimation.GetCurveDuration start.*/
            GetCurveDuration: function () {
                var $t, $t1, $t2;
                var maxDuration = 0.0;
                if (this.holderScaleCurve != null && this.holderScaleCurve.keys.length > 0) {
                    maxDuration = UnityEngine.Mathf.Max(maxDuration, ($t = this.holderScaleCurve.keys)[((this.holderScaleCurve.keys.length - 1) | 0)].time);
                }
                if (this.glowAlphaCurve != null && this.glowAlphaCurve.keys.length > 0) {
                    maxDuration = UnityEngine.Mathf.Max(maxDuration, ($t1 = this.glowAlphaCurve.keys)[((this.glowAlphaCurve.keys.length - 1) | 0)].time);
                }
                if (this.glowScaleCurve != null && this.glowScaleCurve.keys.length > 0) {
                    maxDuration = UnityEngine.Mathf.Max(maxDuration, ($t2 = this.glowScaleCurve.keys)[((this.glowScaleCurve.keys.length - 1) | 0)].time);
                }
                return (maxDuration > 0.0) ? maxDuration : 1.0;
            },
            /*IntroHoleAnimation.GetCurveDuration end.*/

            /*IntroHoleAnimation.OnDestroy start.*/
            OnDestroy: function () {
                if (this._animationCoroutine != null) {
                    this.StopCoroutine$2(this._animationCoroutine);
                }
            },
            /*IntroHoleAnimation.OnDestroy end.*/


        }
    });
    /*IntroHoleAnimation end.*/

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
            holeController: null,
            handCursorRef: null,
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
                    this.StartIntroText();
                    this.StartCoroutine$1(this.IntroSequence());
                    if (UnityEngine.MonoBehaviour.op_Inequality(this.PlayableSettings, null) && this.PlayableSettings.blockPlayerInput) {
                        this.StartCoroutine$1(this.BlockInputSequence());
                    }
                }
            },
            /*IntroManager.StartIntro end.*/

            /*IntroManager.BlockInputSequence start.*/
            BlockInputSequence: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    this.SetPlayerInputEnabled(false);
                                        if (this.PlayableSettings.blockInputDuration > 0.0) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 3;
                                        continue;
                                }
                                case 1: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(this.PlayableSettings.blockInputDuration);
                                        $step = 2;
                                        return true;
                                }
                                case 2: {
                                    this.SetPlayerInputEnabled(true);
                                        return false;
                                    $step = 3;
                                    continue;
                                }
                                case 3: {
                                    $enumerator.current = new UnityEngine.WaitUntil(Bridge.fn.bind(this, function () {
                                            return this.introCompleted;
                                        }));
                                        $step = 4;
                                        return true;
                                }
                                case 4: {
                                    this.SetPlayerInputEnabled(true);

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
            /*IntroManager.BlockInputSequence end.*/

            /*IntroManager.IntroSequence start.*/
            IntroSequence: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    hasCameraTransition,
                    hasFovTransition,
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
                                            if (UnityEngine.MonoBehaviour.op_Inequality(this.virtualCamera, null)) {
                                                this.virtualCamera.m_Lens.FieldOfView = this.PlayableSettings.startFOV;
                                            }
                                        }
                                        if (UnityEngine.MonoBehaviour.op_Inequality(this.PlayableSettings, null)) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 16;
                                        continue;
                                }
                                case 1: {
                                    hasCameraTransition = this.PlayableSettings.cameraTransitionDuration > 0.0;
                                        hasFovTransition = this.PlayableSettings.fovTransitionDuration > 0.0;
                                        if (hasCameraTransition && hasFovTransition) {
                                            $step = 2;
                                            continue;
                                        } else  {
                                            $step = 4;
                                            continue;
                                        }
                                }
                                case 2: {
                                    $enumerator.current = this.StartCoroutine$1(this.TransitionCameraAndFOV());
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    $step = 15;
                                    continue;
                                }
                                case 4: {
                                    if (hasCameraTransition) {
                                            $step = 5;
                                            continue;
                                        } else  {
                                            $step = 10;
                                            continue;
                                        }
                                }
                                case 5: {
                                    if (this.PlayableSettings.cameraTransitionDelay > 0.0) {
                                            $step = 6;
                                            continue;
                                        } 
                                        $step = 8;
                                        continue;
                                }
                                case 6: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(this.PlayableSettings.cameraTransitionDelay);
                                        $step = 7;
                                        return true;
                                }
                                case 7: {
                                    $step = 8;
                                    continue;
                                }
                                case 8: {
                                    $enumerator.current = this.StartCoroutine$1(this.TransitionCameraAngle());
                                        $step = 9;
                                        return true;
                                }
                                case 9: {
                                    $step = 14;
                                    continue;
                                }
                                case 10: {
                                    if (hasFovTransition) {
                                            $step = 11;
                                            continue;
                                        } 
                                        $step = 13;
                                        continue;
                                }
                                case 11: {
                                    $enumerator.current = this.StartCoroutine$1(this.TransitionFOV());
                                        $step = 12;
                                        return true;
                                }
                                case 12: {
                                    $step = 13;
                                    continue;
                                }
                                case 13: {
                                    $step = 14;
                                    continue;
                                }
                                case 14: {
                                    $step = 15;
                                    continue;
                                }
                                case 15: {
                                    $step = 16;
                                    continue;
                                }
                                case 16: {
                                    remainingTime = 0.2;
                                        if (remainingTime > 0.0) {
                                            $step = 17;
                                            continue;
                                        } 
                                        $step = 19;
                                        continue;
                                }
                                case 17: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(remainingTime);
                                        $step = 18;
                                        return true;
                                }
                                case 18: {
                                    $step = 19;
                                    continue;
                                }
                                case 19: {
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

            /*IntroManager.TransitionFOV start.*/
            TransitionFOV: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    startFOV,
                    endFOV,
                    transitionDuration,
                    elapsedTime,
                    progress,
                    curveValue,
                    currentFOV,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if (!(UnityEngine.MonoBehaviour.op_Equality(this.PlayableSettings, null)) && !(UnityEngine.MonoBehaviour.op_Equality(this.virtualCamera, null))) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 9;
                                        continue;
                                }
                                case 1: {
                                    if (this.PlayableSettings.fovTransitionDelay > 0.0) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(this.PlayableSettings.fovTransitionDelay);
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    $step = 4;
                                    continue;
                                }
                                case 4: {
                                    startFOV = this.PlayableSettings.startFOV;
                                        endFOV = this.PlayableSettings.endFOV;
                                        transitionDuration = this.PlayableSettings.fovTransitionDuration;
                                        elapsedTime = 0.0;
                                    $step = 5;
                                    continue;
                                }
                                case 5: {
                                    if ( elapsedTime < transitionDuration ) {
                                            $step = 6;
                                            continue;
                                        } 
                                        $step = 8;
                                        continue;
                                }
                                case 6: {
                                    elapsedTime += UnityEngine.Time.deltaTime;
                                        progress = elapsedTime / transitionDuration;
                                        curveValue = this.cameraTransitionCurve.value(progress);
                                        currentFOV = pc.math.lerp(startFOV, endFOV, curveValue);
                                        this.virtualCamera.m_Lens.FieldOfView = currentFOV;
                                        $enumerator.current = null;
                                        $step = 7;
                                        return true;
                                }
                                case 7: {
                                    
                                        $step = 5;
                                        continue;
                                }
                                case 8: {
                                    this.virtualCamera.m_Lens.FieldOfView = endFOV;
                                    $step = 9;
                                    continue;
                                }
                                case 9: {

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
            /*IntroManager.TransitionFOV end.*/

            /*IntroManager.TransitionCameraAndFOV start.*/
            TransitionCameraAndFOV: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    startAngle,
                    endAngle,
                    startPosition,
                    endPosition,
                    cameraTransitionDelay,
                    cameraTransitionDuration,
                    startFOV,
                    endFOV,
                    fovTransitionDelay,
                    fovTransitionDuration,
                    maxDuration,
                    elapsedTime,
                    cameraElapsedTime,
                    fovElapsedTime,
                    cameraTransitionStarted,
                    fovTransitionStarted,
                    progress,
                    curveValue,
                    currentAngle,
                    currentPosition,
                    fovProgress,
                    fovCurveValue,
                    currentFOV,
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
                                        cameraTransitionDelay = this.PlayableSettings.cameraTransitionDelay;
                                        cameraTransitionDuration = this.PlayableSettings.cameraTransitionDuration;
                                        startFOV = this.PlayableSettings.startFOV;
                                        endFOV = this.PlayableSettings.endFOV;
                                        fovTransitionDelay = this.PlayableSettings.fovTransitionDelay;
                                        fovTransitionDuration = this.PlayableSettings.fovTransitionDuration;
                                        maxDuration = UnityEngine.Mathf.Max(cameraTransitionDelay + cameraTransitionDuration, fovTransitionDelay + fovTransitionDuration);
                                        elapsedTime = 0.0;
                                        cameraElapsedTime = 0.0;
                                        fovElapsedTime = 0.0;
                                        cameraTransitionStarted = false;
                                        fovTransitionStarted = false;
                                    $step = 3;
                                    continue;
                                }
                                case 3: {
                                    if ( elapsedTime < maxDuration ) {
                                            $step = 4;
                                            continue;
                                        } 
                                        $step = 6;
                                        continue;
                                }
                                case 4: {
                                    elapsedTime += UnityEngine.Time.deltaTime;
                                        if (!cameraTransitionStarted && elapsedTime >= cameraTransitionDelay) {
                                            cameraTransitionStarted = true;
                                            cameraElapsedTime = 0.0;
                                        }
                                        if (cameraTransitionStarted && cameraElapsedTime < cameraTransitionDuration) {
                                            cameraElapsedTime += UnityEngine.Time.deltaTime;
                                            progress = cameraElapsedTime / cameraTransitionDuration;
                                            curveValue = this.cameraTransitionCurve.value(progress);
                                            currentAngle = new pc.Vec3().lerp( startAngle, endAngle, curveValue );
                                            currentPosition = new pc.Vec3().lerp( startPosition, endPosition, curveValue );
                                            if (UnityEngine.Component.op_Inequality(this.playerCamera, null)) {
                                                this.playerCamera.eulerAngles = currentAngle.$clone();
                                                if (UnityEngine.MonoBehaviour.op_Inequality(this.cameraOffset, null)) {
                                                    this.cameraOffset.m_Offset = currentPosition.$clone();
                                                }
                                            }
                                        } else if (cameraTransitionStarted && UnityEngine.Component.op_Inequality(this.playerCamera, null)) {
                                            this.playerCamera.eulerAngles = endAngle.$clone();
                                            if (UnityEngine.MonoBehaviour.op_Inequality(this.cameraOffset, null)) {
                                                this.cameraOffset.m_Offset = endPosition.$clone();
                                            }
                                        }
                                        if (!fovTransitionStarted && elapsedTime >= fovTransitionDelay) {
                                            fovTransitionStarted = true;
                                            fovElapsedTime = 0.0;
                                        }
                                        if (fovTransitionStarted && UnityEngine.MonoBehaviour.op_Inequality(this.virtualCamera, null)) {
                                            fovElapsedTime += UnityEngine.Time.deltaTime;
                                            if (fovElapsedTime < fovTransitionDuration) {
                                                fovProgress = fovElapsedTime / fovTransitionDuration;
                                                fovCurveValue = this.cameraTransitionCurve.value(fovProgress);
                                                currentFOV = pc.math.lerp(startFOV, endFOV, fovCurveValue);
                                                this.virtualCamera.m_Lens.FieldOfView = currentFOV;
                                            } else {
                                                this.virtualCamera.m_Lens.FieldOfView = endFOV;
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
                                        if (UnityEngine.MonoBehaviour.op_Inequality(this.virtualCamera, null)) {
                                            this.virtualCamera.m_Lens.FieldOfView = endFOV;
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
            /*IntroManager.TransitionCameraAndFOV end.*/

            /*IntroManager.CompleteIntro start.*/
            CompleteIntro: function () {
                this.isIntroActive = false;
                this.introCompleted = true;
                !Bridge.staticEquals(this.OnIntroCompleted, null) ? this.OnIntroCompleted() : null;
            },
            /*IntroManager.CompleteIntro end.*/

            /*IntroManager.SetPlayerInputEnabled start.*/
            SetPlayerInputEnabled: function (enabled) {
                if (UnityEngine.MonoBehaviour.op_Inequality(this.holeController, null)) {
                    this.holeController.SetInputEnabled(enabled);
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(this.handCursorRef, null)) {
                    this.handCursorRef.enabled = enabled;
                    if (!enabled) {
                        this.handCursorRef.gameObject.SetActive(false);
                    } else {
                        this.handCursorRef.gameObject.SetActive(true);
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
                    if (UnityEngine.MonoBehaviour.op_Inequality(this.virtualCamera, null)) {
                        this.virtualCamera.m_Lens.FieldOfView = this.PlayableSettings.endFOV;
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

    /*ItemObjective start.*/
    Bridge.define("ItemObjective", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            itemImage: null,
            itemCountText: null
        }
    });
    /*ItemObjective end.*/

    /*JoystickType start.*/
    Bridge.define("JoystickType", {
        $kind: 6,
        statics: {
            fields: {
                Fixed: 0,
                Floating: 1,
                Dynamic: 2
            }
        }
    });
    /*JoystickType end.*/

    /*LandscapePadding start.*/
    Bridge.define("LandscapePadding", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            target: null,
            moveLeft: false,
            percent: 0,
            lastLandscape: false,
            lastW: 0,
            lastH: 0
        },
        ctors: {
            init: function () {
                this.moveLeft = true;
                this.percent = 0.04;
            }
        },
        methods: {
            /*LandscapePadding.Start start.*/
            Start: function () {
                this.lastW = UnityEngine.Screen.width;
                this.lastH = UnityEngine.Screen.height;
                this.Apply();
            },
            /*LandscapePadding.Start end.*/

            /*LandscapePadding.Update start.*/
            Update: function () {
                if (UnityEngine.Screen.width !== this.lastW || UnityEngine.Screen.height !== this.lastH) {
                    this.lastW = UnityEngine.Screen.width;
                    this.lastH = UnityEngine.Screen.height;
                    this.Apply();
                }
            },
            /*LandscapePadding.Update end.*/

            /*LandscapePadding.Apply start.*/
            Apply: function () {
                if (!((this.lastLandscape = UnityEngine.Screen.width > UnityEngine.Screen.height))) {
                    this.target.anchorMin = new pc.Vec2( 0.0, this.target.anchorMin.y );
                    this.target.anchorMax = new pc.Vec2( 1.0, this.target.anchorMax.y );
                } else {
                    var x = (this.moveLeft ? this.percent : (1.0 - this.percent));
                    this.target.anchorMin = new pc.Vec2( x, this.target.anchorMin.y );
                    this.target.anchorMax = new pc.Vec2( x, this.target.anchorMax.y );
                }
            },
            /*LandscapePadding.Apply end.*/


        }
    });
    /*LandscapePadding end.*/

    /*LandscapePaddingAnchor start.*/
    Bridge.define("LandscapePaddingAnchor", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            target: null,
            moveLeft: false,
            percent: 0,
            lastLandscape: false,
            originalMinX: 0,
            originalMaxX: 0,
            originalStored: false,
            lastW: 0,
            lastH: 0
        },
        ctors: {
            init: function () {
                this.moveLeft = true;
                this.percent = 0.04;
            }
        },
        methods: {
            /*LandscapePaddingAnchor.Start start.*/
            Start: function () {
                this.StoreOriginalAnchors();
                this.lastW = UnityEngine.Screen.width;
                this.lastH = UnityEngine.Screen.height;
                this.Apply(true);
            },
            /*LandscapePaddingAnchor.Start end.*/

            /*LandscapePaddingAnchor.Update start.*/
            Update: function () {
                if (UnityEngine.Screen.width !== this.lastW || UnityEngine.Screen.height !== this.lastH) {
                    this.lastW = UnityEngine.Screen.width;
                    this.lastH = UnityEngine.Screen.height;
                    this.Apply(false);
                }
            },
            /*LandscapePaddingAnchor.Update end.*/

            /*LandscapePaddingAnchor.StoreOriginalAnchors start.*/
            StoreOriginalAnchors: function () {
                if (!this.originalStored) {
                    this.originalStored = true;
                    this.originalMinX = this.target.anchorMin.x;
                    this.originalMaxX = this.target.anchorMax.x;
                }
            },
            /*LandscapePaddingAnchor.StoreOriginalAnchors end.*/

            /*LandscapePaddingAnchor.Apply start.*/
            Apply: function (force) {
                var landscape = UnityEngine.Screen.width > UnityEngine.Screen.height;
                if (force || landscape !== this.lastLandscape) {
                    this.lastLandscape = landscape;
                    if (!landscape) {
                        this.target.anchorMin = new pc.Vec2( this.originalMinX, this.target.anchorMin.y );
                        this.target.anchorMax = new pc.Vec2( this.originalMaxX, this.target.anchorMax.y );
                    } else {
                        var delta = (this.moveLeft ? this.percent : (0.0 - this.percent));
                        this.target.anchorMin = new pc.Vec2( this.originalMinX + delta, this.target.anchorMin.y );
                        this.target.anchorMax = new pc.Vec2( this.originalMaxX + delta, this.target.anchorMax.y );
                    }
                }
            },
            /*LandscapePaddingAnchor.Apply end.*/


        }
    });
    /*LandscapePaddingAnchor end.*/

    /*Level start.*/
    Bridge.define("Level", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            themeGroups: null,
            woodTowers: null
        },
        ctors: {
            init: function () {
                this.themeGroups = new (System.Collections.Generic.List$1(UnityEngine.GameObject)).ctor();
                this.woodTowers = new (System.Collections.Generic.List$1(WoodTower)).ctor();
            }
        },
        methods: {
            /*Level.FindThemeGroups start.*/
            FindThemeGroups: function () {
                var $t;
                this.themeGroups.clear();
                var componentsInChildren = this.GetComponentsInChildren$1(ThemeDisplayGroup, true);
                $t = Bridge.getEnumerator(componentsInChildren);
                try {
                    while ($t.moveNext()) {
                        var tdg = $t.Current;
                        this.themeGroups.add(tdg.gameObject);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*Level.FindThemeGroups end.*/

            /*Level.FindWoodTowers start.*/
            FindWoodTowers: function () {
                var $t;
                this.woodTowers.clear();
                var componentsInChildren = this.GetComponentsInChildren$1(WoodTower, true);
                $t = Bridge.getEnumerator(componentsInChildren);
                try {
                    while ($t.moveNext()) {
                        var tower = $t.Current;
                        this.woodTowers.add(tower);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*Level.FindWoodTowers end.*/

            /*Level.Awake start.*/
            Awake: function () {
                this.ShowOnlyMatchingGroups();
            },
            /*Level.Awake end.*/

            /*Level.Start start.*/
            Start: function () {
                this.StartCoroutine$1(this.DelayedObjectivesInit());
            },
            /*Level.Start end.*/

            /*Level.DelayedObjectivesInit start.*/
            DelayedObjectivesInit: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = null;
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(0.1);
                                        $step = 2;
                                        return true;
                                }
                                case 2: {
                                    if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null) && PlayableSettings.instance.enableObjectivesUI && UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null) && UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance.myObjectivesUISystem, null)) {
                                            UIManager.instance.myObjectivesUISystem.InitializeFromScene(this.woodTowers);
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
            /*Level.DelayedObjectivesInit end.*/

            /*Level.ShowOnlyMatchingGroups start.*/
            ShowOnlyMatchingGroups: function () {
                var $t;
                $t = Bridge.getEnumerator(this.themeGroups);
                try {
                    while ($t.moveNext()) {
                        var go = $t.Current;
                        if (!(UnityEngine.GameObject.op_Equality(go, null))) {
                            go.SetActive(true);
                            var display = go.GetComponent(ThemeDisplayGroup);
                            if (UnityEngine.MonoBehaviour.op_Inequality(display, null)) {
                                display.SyncThemeFromSettings();
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*Level.ShowOnlyMatchingGroups end.*/


        }
    });
    /*Level end.*/

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

    /*MovementIndicatorType start.*/
    Bridge.define("MovementIndicatorType", {
        $kind: 6,
        statics: {
            fields: {
                Triangle: 0,
                Periscope: 1
            }
        }
    });
    /*MovementIndicatorType end.*/

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

    /*MyBox.Billboard start.*/
    Bridge.define("MyBox.Billboard", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            facedObject: null,
            mainCam: null,
            mainCamTransform: null
        },
        methods: {
            /*MyBox.Billboard.Awake start.*/
            Awake: function () {
                this.mainCam = UnityEngine.Camera.main;
                if (UnityEngine.Component.op_Inequality(this.mainCam, null)) {
                    this.mainCamTransform = this.mainCam.transform;
                }
            },
            /*MyBox.Billboard.Awake end.*/

            /*MyBox.Billboard.Update start.*/
            Update: function () {
                if (UnityEngine.Component.op_Inequality(this.facedObject, null)) {
                    this.transform.LookAt(this.facedObject);
                } else if (UnityEngine.Component.op_Inequality(this.mainCam, null)) {
                    this.transform.forward = this.mainCamTransform.forward.$clone();
                }
            },
            /*MyBox.Billboard.Update end.*/


        }
    });
    /*MyBox.Billboard end.*/

    /*ObjectivePickupIcon start.*/
    Bridge.define("ObjectivePickupIcon", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            methods: {
                /*ObjectivePickupIcon.EvaluateCubicBezier:static start.*/
                EvaluateCubicBezier: function (a, b, c, d, t) {
                    var oneMinusT = 1.0 - t;
                    var oneMinusTSqr = oneMinusT * oneMinusT;
                    var tSqr = t * t;
                    return a.$clone().scale( oneMinusTSqr * oneMinusT ).add( b.$clone().scale( 3.0 * oneMinusTSqr * t ) ).add( c.$clone().scale( 3.0 * oneMinusT * tSqr ) ).add( d.$clone().scale( tSqr * t ) );
                },
                /*ObjectivePickupIcon.EvaluateCubicBezier:static end.*/


            }
        },
        fields: {
            iconImage: null,
            rectTransform: null,
            _playRoutine: null
        },
        methods: {
            /*ObjectivePickupIcon.Awake start.*/
            Awake: function () {
                if (UnityEngine.Component.op_Equality(this.rectTransform, null)) {
                    this.rectTransform = this.GetComponent(UnityEngine.RectTransform);
                }
                if (UnityEngine.MonoBehaviour.op_Equality(this.iconImage, null)) {
                    this.iconImage = this.GetComponent(UnityEngine.UI.Image);
                }
            },
            /*ObjectivePickupIcon.Awake end.*/

            /*ObjectivePickupIcon.Play start.*/
            Play: function (sprite, start, controlA, controlB, endPoint, duration, startScale, endScale, onComplete) {
                if (UnityEngine.Component.op_Equality(this.rectTransform, null) || UnityEngine.MonoBehaviour.op_Equality(this.iconImage, null)) {
                    this.Awake();
                }
                this.iconImage.sprite = sprite;
                this.rectTransform.anchoredPosition = start.$clone();
                var startScaleVec = new pc.Vec3( 1, 1, 1 ).clone().scale( startScale );
                var endScaleVec = new pc.Vec3( 1, 1, 1 ).clone().scale( endScale );
                this.rectTransform.localScale = startScaleVec.$clone();
                Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.SetActive(true);
                if (this._playRoutine != null) {
                    this.StopCoroutine$2(this._playRoutine);
                    this._playRoutine = null;
                }
                this._playRoutine = this.StartCoroutine$1(this.PlayRoutine(start.$clone(), controlA.$clone(), controlB.$clone(), endPoint.$clone(), UnityEngine.Mathf.Max(0.01, duration), startScaleVec.$clone(), endScaleVec.$clone(), onComplete));
            },
            /*ObjectivePickupIcon.Play end.*/

            /*ObjectivePickupIcon.StopAndHide start.*/
            StopAndHide: function () {
                if (this._playRoutine != null) {
                    this.StopCoroutine$2(this._playRoutine);
                    this._playRoutine = null;
                }
                Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.SetActive(false);
                this.rectTransform.localScale = new pc.Vec3( 1, 1, 1 );
            },
            /*ObjectivePickupIcon.StopAndHide end.*/

            /*ObjectivePickupIcon.PlayRoutine start.*/
            PlayRoutine: function (start, controlA, controlB, endPoint, duration, startScaleVec, endScaleVec, onComplete) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    elapsed,
                    t,
                    pos,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    elapsed = 0.0;
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( elapsed < duration ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    t = Math.max(0, Math.min(1, elapsed / duration));
                                        pos = ObjectivePickupIcon.EvaluateCubicBezier(start.$clone(), controlA.$clone(), controlB.$clone(), endPoint.$clone(), t);
                                        this.rectTransform.anchoredPosition = pos.$clone();
                                        this.rectTransform.localScale = new pc.Vec3().lerp( startScaleVec, endScaleVec, t );
                                        elapsed += UnityEngine.Time.deltaTime;
                                        $enumerator.current = null;
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 4: {
                                    this.rectTransform.localScale = endScaleVec.$clone();
                                        !Bridge.staticEquals(onComplete, null) ? onComplete() : null;
                                        this._playRoutine = null;

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
            /*ObjectivePickupIcon.PlayRoutine end.*/


        }
    });
    /*ObjectivePickupIcon end.*/

    /*ObjectivesTuto start.*/
    Bridge.define("ObjectivesTuto", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                BoundsRefreshInterval: 0
            },
            ctors: {
                init: function () {
                    this.BoundsRefreshInterval = 0.5;
                }
            }
        },
        fields: {
            objectivesSystem: null,
            mover: null,
            glowImage: null,
            canvasGroup: null,
            boundsPadding: 0,
            legDuration: 0,
            endPause: 0,
            motionCurve: null,
            bobAmplitude: 0,
            bobFrequency: 0,
            scalePulse: 0,
            scaleFrequency: 0,
            glowCurve: null,
            glowPeriod: 0,
            glowBaseAlpha: 0,
            glowMaxAlpha: 0,
            fadeOutDuration: 0,
            _minX: 0,
            _maxX: 0,
            _hasBounds: false,
            _lastBoundsUpdate: 0,
            _cycleStartTime: 0,
            _moverBaseAnchoredPos: null,
            _moverBaseScale: null,
            _hasFaded: false,
            _fading: false,
            _fadeStartTime: 0
        },
        ctors: {
            init: function () {
                this._moverBaseAnchoredPos = new UnityEngine.Vector2();
                this._moverBaseScale = new UnityEngine.Vector3();
                this.boundsPadding = 20.0;
                this.legDuration = 1.0;
                this.endPause = 0.2;
                this.motionCurve = pc.AnimationCurve.createEaseInOut(0.0, 0.0, 1.0, 1.0);
                this.bobAmplitude = 6.0;
                this.bobFrequency = 1.2;
                this.scalePulse = 0.05;
                this.scaleFrequency = 2.0;
                this.glowCurve = pc.AnimationCurve.createEaseInOut(0.0, 0.2, 1.0, 1.0);
                this.glowPeriod = 1.2;
                this.glowBaseAlpha = 0.2;
                this.glowMaxAlpha = 1.0;
                this.fadeOutDuration = 0.35;
                this._moverBaseScale = new pc.Vec3( 1, 1, 1 );
                this._hasFaded = false;
                this._fading = false;
                this._fadeStartTime = 0.0;
            }
        },
        methods: {
            /*ObjectivesTuto.Awake start.*/
            Awake: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(this.objectivesSystem, null) && UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null)) {
                    this.objectivesSystem = UIManager.instance.myObjectivesUISystem;
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    this.ApplySettingsFromPlayable();
                }
            },
            /*ObjectivesTuto.Awake end.*/

            /*ObjectivesTuto.Start start.*/
            Start: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    this.ApplySettingsFromPlayable();
                }
            },
            /*ObjectivesTuto.Start end.*/

            /*ObjectivesTuto.OnEnable start.*/
            OnEnable: function () {
                if (UnityEngine.Component.op_Inequality(this.mover, null)) {
                    this._moverBaseAnchoredPos = this.mover.anchoredPosition.$clone();
                    this._moverBaseScale = this.mover.localScale.$clone();
                }
                this._cycleStartTime = UnityEngine.Time.time;
                this._hasFaded = false;
                this._fading = false;
                this._fadeStartTime = 0.0;
                if (UnityEngine.MonoBehaviour.op_Inequality(this.canvasGroup, null)) {
                    this.canvasGroup.alpha = 1.0;
                }
                this.RefreshBounds();
            },
            /*ObjectivesTuto.OnEnable end.*/

            /*ObjectivesTuto.Update start.*/
            Update: function () {
                var $t, $t1;
                var ps = PlayableSettings.instance;
                if (UnityEngine.MonoBehaviour.op_Inequality(ps, null) && (!ps.enableObjectivesUI || !ps.enableObjectivesTuto)) {
                    if (Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.activeSelf) {
                        Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.SetActive(false);
                    }
                    return;
                }
                if (!this._hasFaded && !this._fading && this.ShouldStartFadeOnTouch()) {
                    this._fading = true;
                    this._fadeStartTime = UnityEngine.Time.time;
                }
                if (this._fading) {
                    var t = ((this.fadeOutDuration <= 0.001) ? 1.0 : Math.max(0, Math.min(1, (UnityEngine.Time.time - this._fadeStartTime) / this.fadeOutDuration)));
                    if (UnityEngine.MonoBehaviour.op_Inequality(this.canvasGroup, null)) {
                        this.canvasGroup.alpha = 1.0 - t;
                    }
                    if (t >= 1.0) {
                        this._fading = false;
                        this._hasFaded = true;
                        if (Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.activeSelf) {
                            Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.SetActive(false);
                        }
                        return;
                    }
                }
                if (UnityEngine.Component.op_Equality(this.mover, null)) {
                    return;
                }
                if (UnityEngine.Time.time - this._lastBoundsUpdate > 0.5) {
                    this.RefreshBounds();
                }
                if (this._hasBounds) {
                    var pathStart = this._minX;
                    var pathEnd = this._maxX;
                    var leg = UnityEngine.Mathf.Max(0.05, this.legDuration);
                    var pause = UnityEngine.Mathf.Max(0.0, this.endPause);
                    var cycle = (leg + pause) * 2.0;
                    var tt = ($t = UnityEngine.Time.time - this._cycleStartTime, $t - Math.floor($t / cycle) * cycle);
                    var u;
                    if (tt < leg) {
                        u = tt / leg;
                    } else if (tt < leg + pause) {
                        u = 1.0;
                    } else if (tt < leg + pause + leg) {
                        var tb = (tt - leg - pause) / leg;
                        u = 1.0 - tb;
                    } else {
                        u = 0.0;
                    }
                    var eased = ((this.motionCurve != null) ? this.motionCurve.value(u) : u);
                    var x = pc.math.lerp(pathStart, pathEnd, eased);
                    var pos = this._moverBaseAnchoredPos.$clone();
                    pos.x = x;
                    this.mover.anchoredPosition = pos.$clone();
                    if (UnityEngine.MonoBehaviour.op_Inequality(this.glowImage, null)) {
                        var phase = ((this.glowPeriod <= 0.01) ? 0.0 : ($t1 = UnityEngine.Time.time / this.glowPeriod, $t1 - Math.floor($t1 / 1.0) * 1.0));
                        var i = ((this.glowCurve != null) ? this.glowCurve.value(phase) : phase);
                        var a = pc.math.lerp(this.glowBaseAlpha, this.glowMaxAlpha, i);
                        var c = this.glowImage.color.$clone();
                        c.a = a;
                        this.glowImage.color = c.$clone();
                    }
                    if (!this.mover.gameObject.activeSelf) {
                        this.mover.gameObject.SetActive(true);
                    }
                } else if (this.mover.gameObject.activeSelf) {
                    this.mover.gameObject.SetActive(false);
                }
            },
            /*ObjectivesTuto.Update end.*/

            /*ObjectivesTuto.ShouldStartFadeOnTouch start.*/
            ShouldStartFadeOnTouch: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null) && UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance.holeController, null) && !UIManager.instance.holeController.IsInputEnabled) {
                    return false;
                }
                if (UnityEngine.Input.GetMouseButtonDown(0)) {
                    return true;
                }
                if (UnityEngine.Input.touchCount > 0 && UnityEngine.Input.GetTouch(0).phase === UnityEngine.TouchPhase.Began) {
                    return true;
                }
                return false;
            },
            /*ObjectivesTuto.ShouldStartFadeOnTouch end.*/

            /*ObjectivesTuto.ApplySettingsFromPlayable start.*/
            ApplySettingsFromPlayable: function () {
                var enabledFlag = PlayableSettings.instance.enableObjectivesTuto && PlayableSettings.instance.enableObjectivesUI;
                Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject.SetActive(enabledFlag);
                var speed = UnityEngine.Mathf.Max(0.0, PlayableSettings.instance.objectivesTutoGlowSpeed);
                this.glowPeriod = ((speed > 0.01) ? (1.0 / speed) : 0.0);
                this.legDuration = UnityEngine.Mathf.Max(0.05, PlayableSettings.instance.objectivesTutoTravelTime);
                this.endPause = UnityEngine.Mathf.Max(0.0, PlayableSettings.instance.objectivesTutoEndPause);
            },
            /*ObjectivesTuto.ApplySettingsFromPlayable end.*/

            /*ObjectivesTuto.RefreshBounds start.*/
            RefreshBounds: function () {
                var $t;
                this._lastBoundsUpdate = UnityEngine.Time.time;
                this._hasBounds = false;
                if (UnityEngine.MonoBehaviour.op_Equality(this.objectivesSystem, null) || this.objectivesSystem.itemObjectivePool == null || this.objectivesSystem.itemObjectivePool.length === 0) {
                    return;
                }
                var minX = Number.POSITIVE_INFINITY;
                var maxX = Number.NEGATIVE_INFINITY;
                var activeCount = 0;
                for (var i = 0; i < this.objectivesSystem.itemObjectivePool.length; i = (i + 1) | 0) {
                    var card = ($t = this.objectivesSystem.itemObjectivePool)[i];
                    if (UnityEngine.MonoBehaviour.op_Equality(card, null) || !card.gameObject.activeInHierarchy) {
                        continue;
                    }
                    var rt = Bridge.as(card.transform, UnityEngine.RectTransform);
                    if (!(UnityEngine.Component.op_Equality(rt, null))) {
                        var x = rt.anchoredPosition.x;
                        if (x < minX) {
                            minX = x;
                        }
                        if (x > maxX) {
                            maxX = x;
                        }
                        activeCount = (activeCount + 1) | 0;
                    }
                }
                if (activeCount >= 1 && minX <= maxX && isFinite(minX) && isFinite(maxX)) {
                    this._minX = minX - Math.abs(this.boundsPadding);
                    this._maxX = maxX + Math.abs(this.boundsPadding);
                    this._hasBounds = true;
                } else {
                    this._hasBounds = false;
                }
            },
            /*ObjectivesTuto.RefreshBounds end.*/


        }
    });
    /*ObjectivesTuto end.*/

    /*ObjectivesUISystem start.*/
    Bridge.define("ObjectivesUISystem", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                PickupIconStartScale: 0,
                PickupIconEndScale: 0,
                CardBounceScale: 0,
                CardBounceDuration: 0,
                ControlOffsetMax: 0,
                ControlOffsetMin: 0
            },
            ctors: {
                init: function () {
                    this.PickupIconStartScale = 0.6;
                    this.PickupIconEndScale = 1.0;
                    this.CardBounceScale = 1.1;
                    this.CardBounceDuration = 0.18;
                    this.ControlOffsetMax = 60.0;
                    this.ControlOffsetMin = 10.0;
                }
            }
        },
        fields: {
            itemObjectivePool: null,
            backgroundRect: null,
            enablePickupFlight: false,
            pickupIconPrefab: null,
            pickupIconContainer: null,
            initialPickupIconPool: 0,
            pickupFlightDuration: 0,
            worldCamera: null,
            _runtimeObjectives: null,
            _objectiveLookup: null,
            _pickupPool: null,
            _activePickupIcons: null,
            _cardBounceRoutines: null,
            _updateInterval: 0,
            _updateRoutine: null,
            _pickupContainerRect: null,
            _canvas: null,
            _uiCamera: null,
            _worldCamera: null
        },
        ctors: {
            init: function () {
                this.enablePickupFlight = false;
                this.initialPickupIconPool = 4;
                this.pickupFlightDuration = 0.6;
                this._runtimeObjectives = new (System.Collections.Generic.List$1(ObjectivesUISystem.RuntimeObjective)).ctor();
                this._objectiveLookup = new (System.Collections.Generic.Dictionary$2(ObjectivesUISystem.ObjectiveKey,ObjectivesUISystem.RuntimeObjective)).ctor();
                this._pickupPool = new (System.Collections.Generic.List$1(ObjectivePickupIcon)).ctor();
                this._activePickupIcons = new (System.Collections.Generic.List$1(ObjectivePickupIcon)).ctor();
                this._cardBounceRoutines = new (System.Collections.Generic.Dictionary$2(UnityEngine.RectTransform,UnityEngine.Coroutine)).ctor();
                this._updateInterval = 0.5;
            }
        },
        methods: {
            /*ObjectivesUISystem.Awake start.*/
            Awake: function () {
                if (UnityEngine.Component.op_Inequality(this.pickupIconContainer, null)) {
                    this._pickupContainerRect = this.pickupIconContainer;
                } else {
                    this._pickupContainerRect = this.GetComponent(UnityEngine.RectTransform);
                }
                this._canvas = this.GetComponentInParent(UnityEngine.Canvas);
                if (UnityEngine.Component.op_Inequality(this._canvas, null)) {
                    this._uiCamera = ((this._canvas.renderMode === UnityEngine.RenderMode.ScreenSpaceOverlay) ? null : this._canvas.worldCamera);
                }
                this._worldCamera = ((UnityEngine.Component.op_Inequality(this.worldCamera, null)) ? this.worldCamera : UnityEngine.Camera.main);
            },
            /*ObjectivesUISystem.Awake end.*/

            /*ObjectivesUISystem.OnEnable start.*/
            OnEnable: function () {
                this.InitializeFromScene();
            },
            /*ObjectivesUISystem.OnEnable end.*/

            /*ObjectivesUISystem.OnDisable start.*/
            OnDisable: function () {
                if (this._updateRoutine != null) {
                    this.StopCoroutine$2(this._updateRoutine);
                    this._updateRoutine = null;
                }
                this.ClearActivePickupIcons();
            },
            /*ObjectivesUISystem.OnDisable end.*/

            /*ObjectivesUISystem.InitializeFromScene start.*/
            InitializeFromScene: function (woodTowers) {
                var $t, $t1, $t2, $t3, $t4, $t5;
                if (woodTowers === void 0) { woodTowers = null; }
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    this.enablePickupFlight = PlayableSettings.instance.enableObjectivePickupFlight;
                    this.pickupFlightDuration = UnityEngine.Mathf.Max(0.1, PlayableSettings.instance.objectivePickupFlightDuration);
                }
                this._runtimeObjectives.clear();
                this._objectiveLookup.clear();
                this.ClearActivePickupIcons();
                if (this.itemObjectivePool != null) {
                    for (var i = 0; i < this.itemObjectivePool.length; i = (i + 1) | 0) {
                        if (UnityEngine.MonoBehaviour.op_Inequality(this.itemObjectivePool[i], null) && this.itemObjectivePool[i].gameObject.activeSelf) {
                            this.itemObjectivePool[i].gameObject.SetActive(false);
                        }
                    }
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null) && !PlayableSettings.instance.enableObjectivesUI) {
                    if (this._updateRoutine != null) {
                        this.StopCoroutine$2(this._updateRoutine);
                    }
                    this._updateRoutine = null;
                    return;
                }
                var poolIndex = 0;
                var allSupports;
                if (woodTowers != null && woodTowers.Count > 0) {
                    allSupports = new (System.Collections.Generic.List$1(SupportActivator)).ctor();
                    $t = Bridge.getEnumerator(woodTowers);
                    try {
                        while ($t.moveNext()) {
                            var tower = $t.Current;
                            if (UnityEngine.MonoBehaviour.op_Inequality(tower, null)) {
                                var topItemActivator = tower.GetActiveTopItemSupportActivator();
                                if (UnityEngine.MonoBehaviour.op_Inequality(topItemActivator, null)) {
                                    allSupports.add(topItemActivator);
                                }
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    var otherSupports = UnityEngine.Object.FindObjectsOfType(SupportActivator);
                    var array = otherSupports;
                    $t1 = Bridge.getEnumerator(array);
                    try {
                        while ($t1.moveNext()) {
                            var support = $t1.Current;
                            if (UnityEngine.MonoBehaviour.op_Inequality(support, null) && !support.isTopItem && support.countInObjectives) {
                                allSupports.add(support);
                            }
                        }
                    } finally {
                        if (Bridge.is($t1, System.IDisposable)) {
                            $t1.System$IDisposable$Dispose();
                        }
                    }
                } else {
                    allSupports = ($t2 = SupportActivator, System.Linq.Enumerable.from(UnityEngine.Object.FindObjectsOfType(SupportActivator), $t2).toList($t2));
                }
                if (allSupports == null || allSupports.Count === 0) {
                    if (this._updateRoutine != null) {
                        this.StopCoroutine$2(this._updateRoutine);
                    }
                    this._updateRoutine = null;
                    return;
                }
                var topItems = System.Linq.Enumerable.from(allSupports, SupportActivator).where(function (s) {
                        return UnityEngine.MonoBehaviour.op_Inequality(s, null) && s.isTopItem && s.objectiveIcon != null;
                    }).toList(SupportActivator);
                if (topItems.Count > 0 && poolIndex < this.itemObjectivePool.length) {
                    var firstTopItem = topItems.getItem(0);
                    var card2 = this.itemObjectivePool[Bridge.identity(poolIndex, ((poolIndex = (poolIndex + 1) | 0)))];
                    if (UnityEngine.MonoBehaviour.op_Inequality(card2, null)) {
                        if (UnityEngine.MonoBehaviour.op_Inequality(card2.itemImage, null)) {
                            card2.itemImage.sprite = firstTopItem.objectiveIcon;
                        }
                        var current = System.Linq.Enumerable.from(topItems, SupportActivator).count(function (s) {
                                return UnityEngine.MonoBehaviour.op_Inequality(s, null) && s.gameObject.activeInHierarchy && s.countInObjectives;
                            });
                        if (UnityEngine.MonoBehaviour.op_Inequality(card2.itemCountText, null)) {
                            card2.itemCountText.text = Bridge.toString(current);
                        }
                        card2.gameObject.SetActive(current > 0);
                        this._runtimeObjectives.add(($t3 = new ObjectivesUISystem.RuntimeObjective(), $t3.icon = firstTopItem.objectiveIcon, $t3.card = card2, $t3.lastCount = -1, $t3.supports = topItems, $t3.isTopItem = true, $t3.cardRect = card2.GetComponent(UnityEngine.RectTransform), $t3.pendingVisualRemovals = 0, $t3));
                    }
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null) && PlayableSettings.instance.objectivesOnlyTopItem) {
                    this.BuildObjectiveLookup();
                    this.WarmupPickupPool();
                    this.StartOrRestartLoop();
                    this.RefreshBackground();
                    return;
                }
                var counted = System.Linq.Enumerable.from(allSupports, SupportActivator).where(function (s) {
                        return UnityEngine.MonoBehaviour.op_Inequality(s, null) && s.countInObjectives && !s.isTopItem;
                    }).toList(SupportActivator);
                var groups = System.Linq.Enumerable.from(counted, SupportActivator).groupBy(function (s) {
                        return s.objectiveIcon;
                    });
                $t3 = Bridge.getEnumerator(groups, System.Linq.IGrouping$2);
                try {
                    while ($t3.moveNext()) {
                        var g = $t3.Current;
                        if (poolIndex >= this.itemObjectivePool.length) {
                            break;
                        }
                        var card = this.itemObjectivePool[Bridge.identity(poolIndex, ((poolIndex = (poolIndex + 1) | 0)))];
                        if (UnityEngine.MonoBehaviour.op_Equality(card, null)) {
                            continue;
                        }
                        var icon = g.key();
                        if (UnityEngine.MonoBehaviour.op_Inequality(card.itemImage, null)) {
                            card.itemImage.sprite = icon;
                        }
                        var list = ($t4 = SupportActivator, System.Linq.Enumerable.from(g, $t4).toList($t4));
                        var countNow = 0;
                        for (var j = 0; j < list.Count; j = (j + 1) | 0) {
                            var s2 = list.getItem(j);
                            if (UnityEngine.MonoBehaviour.op_Inequality(s2, null) && s2.countInObjectives && s2.gameObject.activeInHierarchy) {
                                countNow = (countNow + 1) | 0;
                            }
                        }
                        if (UnityEngine.MonoBehaviour.op_Inequality(card.itemCountText, null)) {
                            card.itemCountText.text = Bridge.toString(countNow);
                        }
                        card.gameObject.SetActive(countNow > 0);
                        this._runtimeObjectives.add(($t5 = new ObjectivesUISystem.RuntimeObjective(), $t5.icon = icon, $t5.card = card, $t5.lastCount = -1, $t5.supports = list, $t5.isTopItem = false, $t5.cardRect = card.GetComponent(UnityEngine.RectTransform), $t5.pendingVisualRemovals = 0, $t5));
                    }
                } finally {
                    if (Bridge.is($t3, System.IDisposable)) {
                        $t3.System$IDisposable$Dispose();
                    }
                }
                this.BuildObjectiveLookup();
                this.WarmupPickupPool();
                this.StartOrRestartLoop();
                this.RefreshBackground();
            },
            /*ObjectivesUISystem.InitializeFromScene end.*/

            /*ObjectivesUISystem.UpdateLoop start.*/
            UpdateLoop: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    wait,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    wait = new UnityEngine.WaitForSeconds(this._updateInterval);
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ( true ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    this.UpdateCounts();
                                        $enumerator.current = wait;
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 4: {

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
            /*ObjectivesUISystem.UpdateLoop end.*/

            /*ObjectivesUISystem.UpdateCounts start.*/
            UpdateCounts: function () {
                var changed = false;
                for (var i = 0; i < this._runtimeObjectives.Count; i = (i + 1) | 0) {
                    var ro = this._runtimeObjectives.getItem(i);
                    var count = 0;
                    if (ro.supports != null) {
                        var c = 0;
                        for (var j = 0; j < ro.supports.Count; j = (j + 1) | 0) {
                            var s = ro.supports.getItem(j);
                            if (UnityEngine.MonoBehaviour.op_Inequality(s, null) && s.gameObject.activeInHierarchy && s.countInObjectives) {
                                c = (c + 1) | 0;
                            }
                        }
                        count = c;
                    }
                    var displayCount = UnityEngine.Mathf.Max(0, ((count + ro.pendingVisualRemovals) | 0));
                    if (displayCount === ro.lastCount) {
                        continue;
                    }
                    ro.lastCount = displayCount;
                    if (UnityEngine.MonoBehaviour.op_Inequality(ro.card, null)) {
                        if (UnityEngine.MonoBehaviour.op_Inequality(ro.card.itemCountText, null)) {
                            ro.card.itemCountText.text = Bridge.toString(displayCount);
                        }
                        var active = displayCount > 0;
                        if (ro.card.gameObject.activeSelf !== active) {
                            ro.card.gameObject.SetActive(active);
                            changed = true;
                        }
                    }
                }
                if (changed) {
                    this.RefreshBackground();
                }
            },
            /*ObjectivesUISystem.UpdateCounts end.*/

            /*ObjectivesUISystem.RefreshBackground start.*/
            RefreshBackground: function () {
                var anyVisible = false;
                for (var i = 0; i < this.itemObjectivePool.length; i = (i + 1) | 0) {
                    if (UnityEngine.MonoBehaviour.op_Inequality(this.itemObjectivePool[i], null) && this.itemObjectivePool[i].gameObject.activeSelf) {
                        anyVisible = true;
                        break;
                    }
                }
                UnityEngine.UI.LayoutRebuilder.ForceRebuildLayoutImmediate(this.backgroundRect);
            },
            /*ObjectivesUISystem.RefreshBackground end.*/

            /*ObjectivesUISystem.HandleSupportSwallowed start.*/
            HandleSupportSwallowed: function (support, holeWorldPos) {
                var $t, $t1;
                if (!this.enablePickupFlight || UnityEngine.MonoBehaviour.op_Equality(support, null) || support.objectiveIcon == null) {
                    return;
                }
                var runtime = this.FindRuntimeObjective(support.objectiveIcon, support.isTopItem);
                if (runtime == null || UnityEngine.Component.op_Equality(runtime.cardRect, null)) {
                    return;
                }
                var iconInstance = this.GetPickupIconInstance();
                if (UnityEngine.MonoBehaviour.op_Equality(iconInstance, null)) {
                    return;
                }
                var startPos = { v : new UnityEngine.Vector2() };
                if (!this.TryGetWorldToContainerPosition(holeWorldPos.$clone(), startPos) && !this.TryGetCardPosition(runtime, startPos)) {
                    this.ReleasePickupIcon(iconInstance);
                    return;
                }
                var targetPos = { v : new UnityEngine.Vector2() };
                if (!this.TryGetCardPosition(runtime, targetPos)) {
                    this.ReleasePickupIcon(iconInstance);
                    return;
                }
                runtime.pendingVisualRemovals = (runtime.pendingVisualRemovals + 1) | 0;
                this.UpdateCounts();
                var corner = new pc.Vec2( targetPos.v.x, startPos.v.y );
                var directionX = ($t = corner.x - startPos.v.x, ($t === 0 ? 1 : Math.sign($t)));
                if (UnityEngine.Mathf.Approximately(directionX, 0.0)) {
                    directionX = 1.0;
                }
                var directionY = ($t1 = targetPos.v.y - corner.y, ($t1 === 0 ? 1 : Math.sign($t1)));
                if (UnityEngine.Mathf.Approximately(directionY, 0.0)) {
                    directionY = 1.0;
                }
                var controlA = new pc.Vec2( corner.x - directionX * 0.0, startPos.v.y );
                var controlB = new pc.Vec2( corner.x, corner.y + directionY * 0.0 );
                iconInstance.Play(support.objectiveIcon, startPos.v.$clone(), controlA.$clone(), controlB.$clone(), targetPos.v.$clone(), this.pickupFlightDuration, 0.6, 1.0, Bridge.fn.bind(this, function () {
                    runtime.pendingVisualRemovals = UnityEngine.Mathf.Max(0, ((runtime.pendingVisualRemovals - 1) | 0));
                    this.TriggerCardBounce(runtime);
                    this.ReleasePickupIcon(iconInstance);
                    this.UpdateCounts();
                }));
            },
            /*ObjectivesUISystem.HandleSupportSwallowed end.*/

            /*ObjectivesUISystem.TriggerCardBounce start.*/
            TriggerCardBounce: function (runtime) {
                if (runtime != null && !(UnityEngine.Component.op_Equality(runtime.cardRect, null))) {
                    var rect = runtime.cardRect;
                    var routine = { };
                    if (this._cardBounceRoutines.tryGetValue(rect, routine) && routine.v != null) {
                        this.StopCoroutine$2(routine.v);
                    }
                    rect.localScale = new pc.Vec3( 1, 1, 1 );
                    var newRoutine = this.StartCoroutine$1(this.BounceRoutine(rect));
                    this._cardBounceRoutines.setItem(rect, newRoutine);
                }
            },
            /*ObjectivesUISystem.TriggerCardBounce end.*/

            /*ObjectivesUISystem.BounceRoutine start.*/
            BounceRoutine: function (rect) {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    baseScale,
                    targetScale,
                    halfDuration,
                    elapsed2,
                    t,
                    t2,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    if (!(UnityEngine.Component.op_Equality(rect, null))) {
                                            $step = 1;
                                            continue;
                                        } 
                                        $step = 10;
                                        continue;
                                }
                                case 1: {
                                    baseScale = new pc.Vec3( 1, 1, 1 );
                                        targetScale = baseScale.$clone().clone().scale( UnityEngine.Mathf.Max(1.0, 1.1) );
                                        halfDuration = UnityEngine.Mathf.Max(0.01, 0.18) * 0.5;
                                        elapsed2 = 0.0;
                                    $step = 2;
                                    continue;
                                }
                                case 2: {
                                    if ( elapsed2 < halfDuration ) {
                                            $step = 3;
                                            continue;
                                        } 
                                        $step = 5;
                                        continue;
                                }
                                case 3: {
                                    t = elapsed2 / halfDuration;
                                        rect.localScale = new pc.Vec3().lerp( baseScale, targetScale, t );
                                        elapsed2 += UnityEngine.Time.deltaTime;
                                        $enumerator.current = null;
                                        $step = 4;
                                        return true;
                                }
                                case 4: {
                                    
                                        $step = 2;
                                        continue;
                                }
                                case 5: {
                                    rect.localScale = targetScale.$clone();
                                        elapsed2 = 0.0;
                                    $step = 6;
                                    continue;
                                }
                                case 6: {
                                    if ( elapsed2 < halfDuration ) {
                                            $step = 7;
                                            continue;
                                        } 
                                        $step = 9;
                                        continue;
                                }
                                case 7: {
                                    t2 = elapsed2 / halfDuration;
                                        rect.localScale = new pc.Vec3().lerp( targetScale, baseScale, t2 );
                                        elapsed2 += UnityEngine.Time.deltaTime;
                                        $enumerator.current = null;
                                        $step = 8;
                                        return true;
                                }
                                case 8: {
                                    
                                        $step = 6;
                                        continue;
                                }
                                case 9: {
                                    rect.localScale = baseScale.$clone();
                                        this._cardBounceRoutines.setItem(rect, null);
                                    $step = 10;
                                    continue;
                                }
                                case 10: {

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
            /*ObjectivesUISystem.BounceRoutine end.*/

            /*ObjectivesUISystem.TryGetWorldToContainerPosition start.*/
            TryGetWorldToContainerPosition: function (worldPos, localPoint) {
                localPoint.v = pc.Vec2.ZERO.clone();
                if (UnityEngine.Component.op_Equality(this._pickupContainerRect, null)) {
                    return false;
                }
                if (UnityEngine.Component.op_Equality(this._worldCamera, null)) {
                    this._worldCamera = ((UnityEngine.Component.op_Inequality(this.worldCamera, null)) ? this.worldCamera : UnityEngine.Camera.main);
                }
                if (UnityEngine.Component.op_Equality(this._worldCamera, null)) {
                    return false;
                }
                var screenPoint = this._worldCamera.WorldToScreenPoint(worldPos);
                return UnityEngine.RectTransformUtility.ScreenPointToLocalPointInRectangle(this._pickupContainerRect, UnityEngine.Vector2.FromVector3(screenPoint), this._uiCamera, localPoint);
            },
            /*ObjectivesUISystem.TryGetWorldToContainerPosition end.*/

            /*ObjectivesUISystem.TryGetCardPosition start.*/
            TryGetCardPosition: function (runtime, localPoint) {
                localPoint.v = pc.Vec2.ZERO.clone();
                if (UnityEngine.Component.op_Equality(this._pickupContainerRect, null) || runtime == null || UnityEngine.Component.op_Equality(runtime.cardRect, null)) {
                    return false;
                }
                var centerWorld = runtime.cardRect.TransformPoint$1(UnityEngine.Vector3.FromVector2(runtime.cardRect.rect.center));
                var screenPoint = UnityEngine.RectTransformUtility.WorldToScreenPoint(this._uiCamera, centerWorld);
                return UnityEngine.RectTransformUtility.ScreenPointToLocalPointInRectangle(this._pickupContainerRect, screenPoint, this._uiCamera, localPoint);
            },
            /*ObjectivesUISystem.TryGetCardPosition end.*/

            /*ObjectivesUISystem.WarmupPickupPool start.*/
            WarmupPickupPool: function () {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this.pickupIconPrefab, null)) && !(UnityEngine.Component.op_Equality(this._pickupContainerRect, null))) {
                    var targetCount = UnityEngine.Mathf.Max(0, this.initialPickupIconPool);
                    var total = (this._pickupPool.Count + this._activePickupIcons.Count) | 0;
                    for (var i = total; i < targetCount; i = (i + 1) | 0) {
                        var icon = UnityEngine.Object.Instantiate(ObjectivePickupIcon, this.pickupIconPrefab, this._pickupContainerRect);
                        icon.gameObject.SetActive(false);
                        this._pickupPool.add(icon);
                    }
                }
            },
            /*ObjectivesUISystem.WarmupPickupPool end.*/

            /*ObjectivesUISystem.GetPickupIconInstance start.*/
            GetPickupIconInstance: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(this.pickupIconPrefab, null) || UnityEngine.Component.op_Equality(this._pickupContainerRect, null)) {
                    return null;
                }
                var instance;
                if (this._pickupPool.Count > 0) {
                    var last = (this._pickupPool.Count - 1) | 0;
                    instance = this._pickupPool.getItem(last);
                    this._pickupPool.removeAt(last);
                } else {
                    instance = UnityEngine.Object.Instantiate(ObjectivePickupIcon, this.pickupIconPrefab, this._pickupContainerRect);
                }
                if (UnityEngine.MonoBehaviour.op_Equality(instance, null)) {
                    return null;
                }
                this._activePickupIcons.add(instance);
                return instance;
            },
            /*ObjectivesUISystem.GetPickupIconInstance end.*/

            /*ObjectivesUISystem.ReleasePickupIcon start.*/
            ReleasePickupIcon: function (icon) {
                if (!(UnityEngine.MonoBehaviour.op_Equality(icon, null))) {
                    icon.StopAndHide();
                    this._activePickupIcons.remove(icon);
                    if (!this._pickupPool.contains(icon)) {
                        this._pickupPool.add(icon);
                    }
                }
            },
            /*ObjectivesUISystem.ReleasePickupIcon end.*/

            /*ObjectivesUISystem.ClearActivePickupIcons start.*/
            ClearActivePickupIcons: function () {
                var $t;
                for (var i = 0; i < this._activePickupIcons.Count; i = (i + 1) | 0) {
                    var icon = this._activePickupIcons.getItem(i);
                    if (!(UnityEngine.MonoBehaviour.op_Equality(icon, null))) {
                        icon.StopAndHide();
                        if (!this._pickupPool.contains(icon)) {
                            this._pickupPool.add(icon);
                        }
                    }
                }
                this._activePickupIcons.clear();
                if (this._cardBounceRoutines.Count <= 0) {
                    return;
                }
                $t = Bridge.getEnumerator(this._cardBounceRoutines);
                try {
                    while ($t.moveNext()) {
                        var kvp = $t.Current;
                        if (kvp.value != null) {
                            this.StopCoroutine$2(kvp.value);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                this._cardBounceRoutines.clear();
            },
            /*ObjectivesUISystem.ClearActivePickupIcons end.*/

            /*ObjectivesUISystem.BuildObjectiveLookup start.*/
            BuildObjectiveLookup: function () {
                this._objectiveLookup.clear();
                for (var i = 0; i < this._runtimeObjectives.Count; i = (i + 1) | 0) {
                    var runtime = this._runtimeObjectives.getItem(i);
                    if (runtime != null && !(runtime.icon == null)) {
                        var objectiveKey = Bridge.getDefaultValue(ObjectivesUISystem.ObjectiveKey);
                        objectiveKey.icon = runtime.icon;
                        objectiveKey.isTopItem = runtime.isTopItem;
                        var key = objectiveKey.$clone();
                        if (!this._objectiveLookup.containsKey(key.$clone())) {
                            this._objectiveLookup.add(key.$clone(), runtime);
                        }
                    }
                }
            },
            /*ObjectivesUISystem.BuildObjectiveLookup end.*/

            /*ObjectivesUISystem.FindRuntimeObjective start.*/
            FindRuntimeObjective: function (icon, isTopItem) {
                if (icon == null) {
                    return null;
                }
                var objectiveKey = Bridge.getDefaultValue(ObjectivesUISystem.ObjectiveKey);
                objectiveKey.icon = icon;
                objectiveKey.isTopItem = isTopItem;
                var key = objectiveKey.$clone();
                var runtime = { };
                if (this._objectiveLookup.tryGetValue(key.$clone(), runtime)) {
                    return runtime.v;
                }
                return null;
            },
            /*ObjectivesUISystem.FindRuntimeObjective end.*/

            /*ObjectivesUISystem.StartOrRestartLoop start.*/
            StartOrRestartLoop: function () {
                if (this._updateRoutine != null) {
                    this.StopCoroutine$2(this._updateRoutine);
                }
                this._updateRoutine = this.StartCoroutine$1(this.UpdateLoop());
            },
            /*ObjectivesUISystem.StartOrRestartLoop end.*/


        }
    });
    /*ObjectivesUISystem end.*/

    /*ObjectivesUISystem+ObjectiveKey start.*/
    Bridge.define("ObjectivesUISystem.ObjectiveKey", {
        $kind: 1004,
        statics: {
            methods: {
                getDefaultValue: function () { return new ObjectivesUISystem.ObjectiveKey(); }
            }
        },
        fields: {
            icon: null,
            isTopItem: false
        },
        ctors: {
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            /*ObjectivesUISystem+ObjectiveKey.getHashCode start.*/
            getHashCode: function () {
                return (Bridge.Int.mul(((this.icon != null) ? Bridge.getHashCode(this.icon) : 0), 397)) ^ Bridge.getHashCode(this.isTopItem);
            },
            /*ObjectivesUISystem+ObjectiveKey.getHashCode end.*/

            /*ObjectivesUISystem+ObjectiveKey.equals start.*/
            equals: function (obj) {
                var other = new ObjectivesUISystem.ObjectiveKey();
                if (!(((other = Bridge.is(obj, ObjectivesUISystem.ObjectiveKey) ? System.Nullable.getValue(Bridge.cast(Bridge.unbox(obj, ObjectivesUISystem.ObjectiveKey), ObjectivesUISystem.ObjectiveKey)) : null)) != null) || false) {
                    return false;
                }
                return Bridge.referenceEquals(this.icon, other.icon) && this.isTopItem === other.isTopItem;
            },
            /*ObjectivesUISystem+ObjectiveKey.equals end.*/

            $clone: function (to) {
                var s = to || new ObjectivesUISystem.ObjectiveKey();
                s.icon = this.icon;
                s.isTopItem = this.isTopItem;
                return s;
            }
        },
        overloads: {
            "GetHashCode()": "getHashCode",
            "Equals(object)": "equals"
        }
    });
    /*ObjectivesUISystem+ObjectiveKey end.*/

    /*ObjectivesUISystem+RuntimeObjective start.*/
    Bridge.define("ObjectivesUISystem.RuntimeObjective", {
        $kind: 1002,
        fields: {
            icon: null,
            card: null,
            lastCount: 0,
            supports: null,
            isTopItem: false,
            pendingVisualRemovals: 0,
            cardRect: null
        }
    });
    /*ObjectivesUISystem+RuntimeObjective end.*/

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
            sunlight: null,
            gameTimeInSeconds: 0,
            startGameplayTimerOnTouch: false,
            gameOverScreenDelay: 0,
            cameraAngle: null,
            enableHandCursor: false,
            cursorScale: 0,
            handCursor: 0,
            throwableObjectType: 0,
            showFlower: false,
            levelUpSizeIncreaseMultiplier: 0,
            swallowCountFirstLevel: 0,
            swallowNeededMultiplier: 0,
            holeSpeedIncreaseType: 0,
            holeSpeedIncrease: 0,
            objectiveAmount: 0,
            enableWinOnSwallowTopItem: false,
            enableIntro: false,
            startCameraAngle: null,
            endCameraAngle: null,
            startCameraPosition: null,
            endCameraPosition: null,
            cameraTransitionDelay: 0,
            cameraTransitionDuration: 0,
            startFOV: 0,
            endFOV: 0,
            fovTransitionDelay: 0,
            fovTransitionDuration: 0,
            blockPlayerInput: false,
            blockInputDuration: 0,
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
            selectedTopItem: 0,
            enableTopItemFloating: false,
            topItemFloatingHeight: 0,
            topItemFloatingSpeed: 0,
            enableTopItemRotation: false,
            topItemRotationSpeed: 0,
            enableSparkleParticle: false,
            towerWidth: 0,
            towerHeight: 0,
            topItemSizeMultiplier: 0,
            enableTowerShootingWin: false,
            enableTowerShootingLose: false,
            towerWinAutoRedirectDelay: 0,
            towerMissCheckDelay: 0,
            groundColor: null,
            groundTexture: 0,
            lightColor: null,
            lightIntensity: 0,
            lightRotation: null,
            enableJoystick: false,
            enableTutoJoystick: false,
            tutoJoystickShowAtStart: false,
            tutoJoystickDisplayDelay: 0,
            enableTutoJoystickAfterTouch: false,
            tutoJoystickShowTimesAfterTouch: 0,
            holeMoveSpeed: 0,
            holeColor: null,
            holeSkin: 0,
            movementIndicatorColor: null,
            enableMovementIndicator: false,
            hideMovementIndicatorWhenIdle: false,
            movementIndicatorType: 0,
            aimArrowColor: null,
            useHoleStartPosition: false,
            holeStartPosition: null,
            displayHoleCountFeedback: false,
            enableArrowDirection: false,
            arrowDirectionTargetType: 0,
            arrowDirectionColor: null,
            arrowDirectionOutlineColor: null,
            arrowDirectionScale: 0,
            arrowDirectionPosition: null,
            arrowDirectionModel: 0,
            arrowDirectionYoyoSpeed: 0,
            arrowDirectionYoyoDistance: 0,
            showHoleGrowVFX: false,
            Level: 0,
            corridorTheme: 0,
            circularTheme: 0,
            lvlCircular1Theme: 0,
            lvlCircular2Theme: 0,
            lvlCircular3Theme: 0,
            lvlCircular4Theme: 0,
            displayTopBanner: false,
            displayMidBanner: false,
            displayBotBanner: false,
            winSound: null,
            towerHitSound: null,
            shootSound: null,
            failSound: null,
            introSound: null,
            holeGrowSound: null,
            collectItemSFX: null,
            enableClickRedirection: false,
            clicksToRedirect: 0,
            enableTimeRedirection: false,
            timeToRedirect: 0,
            redirectAfterThrow: false,
            redirectDelayAfterThrow: 0,
            enableRedirectAfterFirst: false,
            enableObjectivesUI: false,
            objectivesOnlyTopItem: false,
            enableObjectivesTuto: false,
            objectivesTutoGlowSpeed: 0,
            objectivesTutoTravelTime: 0,
            objectivesTutoEndPause: 0,
            enableObjectivePickupFlight: false,
            objectivePickupFlightDuration: 0
        },
        ctors: {
            init: function () {
                this.cameraAngle = new UnityEngine.Vector3();
                this.startCameraAngle = new UnityEngine.Vector3();
                this.endCameraAngle = new UnityEngine.Vector3();
                this.startCameraPosition = new UnityEngine.Vector3();
                this.endCameraPosition = new UnityEngine.Vector3();
                this.groundColor = new UnityEngine.Color();
                this.lightColor = new UnityEngine.Color();
                this.lightRotation = new UnityEngine.Vector3();
                this.holeColor = new UnityEngine.Color();
                this.movementIndicatorColor = new UnityEngine.Color();
                this.aimArrowColor = new UnityEngine.Color();
                this.holeStartPosition = new UnityEngine.Vector3();
                this.arrowDirectionColor = new UnityEngine.Color();
                this.arrowDirectionOutlineColor = new UnityEngine.Color();
                this.arrowDirectionPosition = new UnityEngine.Vector3();
                this.gameTimeInSeconds = 100.0;
                this.startGameplayTimerOnTouch = true;
                this.gameOverScreenDelay = 2.0;
                this.cameraAngle = new pc.Vec3( 60.0, 0.0, 0.0 );
                this.enableHandCursor = true;
                this.cursorScale = 1.0;
                this.handCursor = HandCursorSkin.Default;
                this.throwableObjectType = ThrowableObjectType.Pumpkins;
                this.showFlower = true;
                this.levelUpSizeIncreaseMultiplier = 1.2;
                this.swallowCountFirstLevel = 8;
                this.swallowNeededMultiplier = 1.4;
                this.holeSpeedIncreaseType = PlayableSettings.HoleSpeedIncreaseType.Multiplicative;
                this.holeSpeedIncrease = 0.2;
                this.objectiveAmount = 30;
                this.enableWinOnSwallowTopItem = true;
                this.enableIntro = true;
                this.startCameraAngle = new pc.Vec3( 20.0, 0.0, 0.0 );
                this.endCameraAngle = new pc.Vec3( 60.0, 0.0, 0.0 );
                this.startCameraPosition = new pc.Vec3( 0.0, 5.0, -10.0 );
                this.endCameraPosition = new pc.Vec3( 0.0, 8.0, -6.0 );
                this.cameraTransitionDelay = 0.5;
                this.cameraTransitionDuration = 2.0;
                this.startFOV = 40.0;
                this.endFOV = 40.0;
                this.fovTransitionDelay = 0.5;
                this.fovTransitionDuration = 2.0;
                this.blockPlayerInput = true;
                this.blockInputDuration = 0.0;
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
                this.selectedTopItem = WoodTower.TopItemType.Banana;
                this.enableTopItemFloating = true;
                this.topItemFloatingHeight = 0.3;
                this.topItemFloatingSpeed = 2.0;
                this.enableTopItemRotation = true;
                this.topItemRotationSpeed = 45.0;
                this.enableSparkleParticle = true;
                this.towerWidth = 1.5;
                this.towerHeight = 10;
                this.topItemSizeMultiplier = 1.0;
                this.enableTowerShootingWin = false;
                this.enableTowerShootingLose = false;
                this.towerWinAutoRedirectDelay = 1.0;
                this.towerMissCheckDelay = 2.0;
                this.groundColor = new pc.Color( 1, 1, 1, 1 );
                this.groundTexture = 0;
                this.lightColor = new pc.Color( 1.0, 0.942483246, 0.8726415, 1.0 );
                this.lightIntensity = 0.75;
                this.lightRotation = new pc.Vec3( 50.0, -139.995, 0.0 );
                this.enableJoystick = false;
                this.enableTutoJoystick = false;
                this.tutoJoystickShowAtStart = true;
                this.tutoJoystickDisplayDelay = 0.0;
                this.enableTutoJoystickAfterTouch = false;
                this.tutoJoystickShowTimesAfterTouch = 3.0;
                this.holeMoveSpeed = 2.0;
                this.holeColor = new pc.Color( 0, 0, 0, 1 );
                this.holeSkin = 0;
                this.movementIndicatorColor = new pc.Color( 1, 1, 1, 1 );
                this.enableMovementIndicator = true;
                this.hideMovementIndicatorWhenIdle = true;
                this.movementIndicatorType = MovementIndicatorType.Triangle;
                this.aimArrowColor = new pc.Color( 1, 1, 1, 1 );
                this.useHoleStartPosition = false;
                this.holeStartPosition = pc.Vec3.ZERO.clone();
                this.displayHoleCountFeedback = false;
                this.enableArrowDirection = false;
                this.arrowDirectionTargetType = ArrowDirection.TargetType.ClosestTopItem;
                this.arrowDirectionColor = new pc.Color( 1, 1, 1, 1 );
                this.arrowDirectionOutlineColor = new pc.Color( 1, 1, 1, 1 );
                this.arrowDirectionScale = 1.0;
                this.arrowDirectionPosition = new pc.Vec3( 0.0, 0.5, 0.7 );
                this.arrowDirectionModel = ArrowDirection.ArrowModelType.Model1;
                this.arrowDirectionYoyoSpeed = 2.0;
                this.arrowDirectionYoyoDistance = 0.2;
                this.showHoleGrowVFX = true;
                this.Level = PlayableSettings.LevelIndex.C38V1;
                this.displayTopBanner = false;
                this.displayMidBanner = false;
                this.displayBotBanner = false;
                this.enableClickRedirection = true;
                this.clicksToRedirect = 3;
                this.enableTimeRedirection = true;
                this.timeToRedirect = 30.0;
                this.redirectAfterThrow = true;
                this.redirectDelayAfterThrow = 1.0;
                this.enableRedirectAfterFirst = true;
                this.enableObjectivesUI = true;
                this.objectivesOnlyTopItem = false;
                this.enableObjectivesTuto = true;
                this.objectivesTutoGlowSpeed = 1.0;
                this.objectivesTutoTravelTime = 1.0;
                this.objectivesTutoEndPause = 0.2;
                this.enableObjectivePickupFlight = false;
                this.objectivePickupFlightDuration = 0.6;
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
                if (UnityEngine.MonoBehaviour.op_Equality(UIManager.instance, null)) {
                    UnityEngine.Debug.LogWarning$1("UIManager.instance is null in PlayableSettings.Awake. Consider checking script execution order.");
                    return;
                }
                UIManager.instance.topBanner.SetActive(PlayableSettings.instance.displayTopBanner);
                UIManager.instance.midBanner.SetActive(PlayableSettings.instance.displayMidBanner);
                UIManager.instance.bottomBanner.SetActive(PlayableSettings.instance.displayBotBanner);
                UIManager.instance.InitializeJoysticks();
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
                this.ApplyArrowDirectionSettings();
                this.ApplyLightSettings();
            },
            /*PlayableSettings.SetMaterials end.*/

            /*PlayableSettings.ApplyArrowDirectionSettings start.*/
            ApplyArrowDirectionSettings: function () {
                var arrowDirection = UnityEngine.Object.FindObjectOfType(ArrowDirection);
                if (UnityEngine.MonoBehaviour.op_Inequality(arrowDirection, null)) {
                    arrowDirection.SetArrowColor(this.arrowDirectionColor.$clone());
                    arrowDirection.SetArrowScale(this.arrowDirectionScale);
                    arrowDirection.SetArrowPosition(this.arrowDirectionPosition.$clone());
                    arrowDirection.SetArrowModel(this.arrowDirectionModel);
                    arrowDirection.SetYoyoSettings(this.arrowDirectionYoyoSpeed, this.arrowDirectionYoyoDistance);
                }
            },
            /*PlayableSettings.ApplyArrowDirectionSettings end.*/

            /*PlayableSettings.ApplyLightSettings start.*/
            ApplyLightSettings: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(this.sunlight, null) && UnityEngine.Component.op_Inequality(this.sunlight.sunlightLight, null)) {
                    this.sunlight.sunlightLight.color = this.lightColor.$clone();
                    this.sunlight.sunlightLight.intensity = this.lightIntensity;
                    this.sunlight.transform.eulerAngles = this.lightRotation.$clone();
                }
            },
            /*PlayableSettings.ApplyLightSettings end.*/


        }
    });
    /*PlayableSettings end.*/

    /*PlayableSettings+HoleSpeedIncreaseType start.*/
    Bridge.define("PlayableSettings.HoleSpeedIncreaseType", {
        $kind: 1006,
        statics: {
            fields: {
                Additive: 0,
                Multiplicative: 1
            }
        }
    });
    /*PlayableSettings+HoleSpeedIncreaseType end.*/

    /*PlayableSettings+LevelIndex start.*/
    Bridge.define("PlayableSettings.LevelIndex", {
        $kind: 1006,
        statics: {
            fields: {
                C38V1: 0,
                C38V2: 1,
                C38V3: 2
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
        statics: {
            fields: {
                minSpeed: 0,
                speedMultiplier: 0
            },
            ctors: {
                init: function () {
                    this.minSpeed = 0.1;
                    this.speedMultiplier = 0.1;
                }
            }
        },
        fields: {
            movementDirection: null,
            initialMousePosition: null,
            currentMousePosition: null,
            isTouching: false
        },
        ctors: {
            init: function () {
                this.movementDirection = new UnityEngine.Vector3();
                this.initialMousePosition = new UnityEngine.Vector3();
                this.currentMousePosition = new UnityEngine.Vector3();
                this.isTouching = false;
            }
        },
        methods: {
            /*PlayerMovement.UpdateInputs start.*/
            UpdateInputs: function (target) {
                if (UnityEngine.Input.GetMouseButtonDown(0)) {
                    this.initialMousePosition = UnityEngine.Input.mousePosition.$clone();
                    this.currentMousePosition = UnityEngine.Input.mousePosition.$clone();
                    this.isTouching = true;
                    if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null)) {
                        UIManager.instance.OnPlayerTouch();
                    }
                    if (PlayableSettings.instance.enableFakeControl) {
                        var holeController = target.GetComponent(HoleController);
                        if (UnityEngine.MonoBehaviour.op_Inequality(holeController, null) && !holeController.IsFakeMoving) {
                            holeController.StartFakeMovement();
                            this.isTouching = false;
                            return;
                        }
                    }
                }
                if (UnityEngine.Input.GetMouseButtonUp(0)) {
                    this.movementDirection = pc.Vec3.ZERO.clone();
                    this.isTouching = false;
                    if (UnityEngine.MonoBehaviour.op_Inequality(UIManager.instance, null)) {
                        UIManager.instance.OnPlayerTouchRelease();
                    }
                }
                if (UnityEngine.Input.GetMouseButton(0) && this.isTouching) {
                    this.currentMousePosition = UnityEngine.Input.mousePosition.$clone();
                }
            },
            /*PlayerMovement.UpdateInputs end.*/

            /*PlayerMovement.ApplyMovement start.*/
            ApplyMovement: function (transform, moveSpeed) {
                if (this.isTouching) {
                    var mouseDelta = this.currentMousePosition.$clone().sub( this.initialMousePosition );
                    this.movementDirection = new pc.Vec3( mouseDelta.x, 0.0, mouseDelta.y ).clone().normalize().$clone();
                    var dragDistance = new pc.Vec3( mouseDelta.x, 0.0, mouseDelta.y ).length();
                    var speedFactor = Math.max(0.1, Math.min(dragDistance * 0.1, 1.0));
                    transform.Translate$1(this.movementDirection.$clone().clone().scale( moveSpeed ).clone().scale( speedFactor ).clone().scale( UnityEngine.Time.fixedDeltaTime ));
                }
            },
            /*PlayerMovement.ApplyMovement end.*/


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

    /*ResourceLoader+LevelShape start.*/
    Bridge.define("ResourceLoader.LevelShape", {
        $kind: 1006,
        statics: {
            fields: {
                Corridor: 0,
                Circular: 1,
                LvlCircular1: 2,
                LvlCircular2: 3,
                LvlCircular3: 4,
                LvlCircular4: 5
            }
        }
    });
    /*ResourceLoader+LevelShape end.*/

    /*ResourceLoader+LevelTheme start.*/
    Bridge.define("ResourceLoader.LevelTheme", {
        $kind: 1006,
        statics: {
            fields: {
                Cherry: 0,
                Flower: 1,
                Maki: 2,
                Sushi: 3,
                Donut: 4,
                Strawberry: 5,
                PineappleRing: 6,
                FigBlue: 7,
                Watermelon: 8,
                WatermelonQuarter: 9,
                Starfruit: 10,
                DragonfruitHalf: 11,
                DragonfruitPinkQuarter: 12,
                DragonfruitPink: 13
            }
        }
    });
    /*ResourceLoader+LevelTheme end.*/

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

            /*ResourcePlaceholder.ApplyResourceName start.*/
            ApplyResourceName: function (newResourceName) {
                if (!System.String.isNullOrEmpty(newResourceName)) {
                    var previous = this.resourceName;
                    this.resourceName = newResourceName;
                    ResourceLoader.AddToList(this.resourceName);
                }
            },
            /*ResourcePlaceholder.ApplyResourceName end.*/

            /*ResourcePlaceholder.SpawnInstance start.*/
            SpawnInstance: function (prefab) {
                if (!(!Bridge.referenceEquals(this.resourceName, prefab.name)) && !(UnityEngine.Component.op_Equality(prefab, null))) {
                    var tr = this.transform;
                    var instance = UnityEngine.Object.Instantiate$3(UnityEngine.Transform, prefab, tr.position, tr.rotation, tr.parent);
                    instance.localScale = tr.localScale.$clone();
                    instance.name = this.resourceName;
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

    /*ResourceSetter start.*/
    Bridge.define("ResourceSetter", {
        inherits: [UnityEngine.MonoBehaviour],
        methods: {
            /*ResourceSetter.Awake start.*/
            Awake: function () {
                this.EnsureSupportActivator(this.transform);
            },
            /*ResourceSetter.Awake end.*/

            /*ResourceSetter.EnsureSupportActivator start.*/
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
            },
            /*ResourceSetter.EnsureSupportActivator end.*/


        }
    });
    /*ResourceSetter end.*/

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
                this.transform.Rotate$1(axis, this.rotationSpeed * UnityEngine.Time.deltaTime);
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

    /*StoreRedirectInitializer start.*/
    Bridge.define("StoreRedirectInitializer", {
        inherits: [UnityEngine.MonoBehaviour],
        methods: {
            /*StoreRedirectInitializer.Awake start.*/
            Awake: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(StoreRedirectTracker.instance, null)) {
                    var trackerObject = new UnityEngine.GameObject.$ctor2("StoreRedirectTracker");
                    trackerObject.AddComponent(StoreRedirectTracker);
                }
            },
            /*StoreRedirectInitializer.Awake end.*/


        }
    });
    /*StoreRedirectInitializer end.*/

    /*StoreRedirectTracker start.*/
    Bridge.define("StoreRedirectTracker", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            fields: {
                instance: null
            }
        },
        fields: {
            totalClicks: 0,
            timeElapsed: 0,
            isTrackingClicks: false,
            isTrackingTime: false,
            hasRedirected: false,
            isTracking: false,
            playableSettings: null
        },
        ctors: {
            init: function () {
                this.totalClicks = 0;
                this.timeElapsed = 0.0;
                this.isTrackingClicks = false;
                this.isTrackingTime = false;
                this.hasRedirected = false;
                this.isTracking = true;
            }
        },
        methods: {
            /*StoreRedirectTracker.Awake start.*/
            Awake: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(StoreRedirectTracker.instance, null)) {
                    StoreRedirectTracker.instance = this;
                    UnityEngine.Object.DontDestroyOnLoad(Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject);
                } else {
                    UnityEngine.Object.Destroy(Bridge.ensureBaseProperty(this, "gameObject").$UnityEngine$Component$gameObject);
                }
            },
            /*StoreRedirectTracker.Awake end.*/

            /*StoreRedirectTracker.Start start.*/
            Start: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    this.playableSettings = PlayableSettings.instance;
                    this.InitializeTracking();
                }
            },
            /*StoreRedirectTracker.Start end.*/

            /*StoreRedirectTracker.Update start.*/
            Update: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(this.playableSettings, null) && UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    this.playableSettings = PlayableSettings.instance;
                    this.InitializeTracking();
                }
                if (this.isTracking) {
                    if (this.isTrackingTime && UnityEngine.MonoBehaviour.op_Inequality(this.playableSettings, null) && this.playableSettings.enableTimeRedirection) {
                        this.timeElapsed += UnityEngine.Time.deltaTime;
                        this.CheckTimeRedirection();
                    }
                    this.TrackInput();
                }
            },
            /*StoreRedirectTracker.Update end.*/

            /*StoreRedirectTracker.TrackInput start.*/
            TrackInput: function () {
                if (UnityEngine.Input.GetMouseButtonDown(0) || (UnityEngine.Input.touchCount > 0 && UnityEngine.Input.GetTouch(0).phase === UnityEngine.TouchPhase.Began)) {
                    this.OnClick();
                }
            },
            /*StoreRedirectTracker.TrackInput end.*/

            /*StoreRedirectTracker.InitializeTracking start.*/
            InitializeTracking: function () {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this.playableSettings, null))) {
                    this.isTrackingClicks = this.playableSettings.enableClickRedirection;
                    this.isTrackingTime = this.playableSettings.enableTimeRedirection;
                    this.ResetCounters();
                }
            },
            /*StoreRedirectTracker.InitializeTracking end.*/

            /*StoreRedirectTracker.ResetCounters start.*/
            ResetCounters: function () {
                this.totalClicks = 0;
                this.timeElapsed = 0.0;
                this.hasRedirected = false;
            },
            /*StoreRedirectTracker.ResetCounters end.*/

            /*StoreRedirectTracker.OnClick start.*/
            OnClick: function () {
                if (this.hasRedirected) {
                    this.TriggerStoreRedirection("Redirect after first redirection");
                } else if (this.isTrackingClicks && !(UnityEngine.MonoBehaviour.op_Equality(this.playableSettings, null)) && this.playableSettings.enableClickRedirection) {
                    this.totalClicks = (this.totalClicks + 1) | 0;
                    if (this.totalClicks >= this.playableSettings.clicksToRedirect) {
                        this.TriggerStoreRedirection("Click count reached");
                    }
                }
            },
            /*StoreRedirectTracker.OnClick end.*/

            /*StoreRedirectTracker.OnThrow start.*/
            OnThrow: function () {
                if (this.hasRedirected) {
                    this.TriggerStoreRedirection("Redirect after first redirection");
                } else if (this.isTracking && !(UnityEngine.MonoBehaviour.op_Equality(this.playableSettings, null)) && this.playableSettings.redirectAfterThrow) {
                    this.StartCoroutine$1(this.RedirectAfterThrowCoroutine());
                }
            },
            /*StoreRedirectTracker.OnThrow end.*/

            /*StoreRedirectTracker.RedirectAfterThrowCoroutine start.*/
            RedirectAfterThrowCoroutine: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(this.playableSettings.redirectDelayAfterThrow);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    this.TriggerStoreRedirection("After throw");

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
            /*StoreRedirectTracker.RedirectAfterThrowCoroutine end.*/

            /*StoreRedirectTracker.CheckClickRedirection start.*/
            CheckClickRedirection: function () {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this.playableSettings, null)) && this.playableSettings.enableClickRedirection && this.totalClicks >= this.playableSettings.clicksToRedirect) {
                    this.TriggerStoreRedirection("Click count reached");
                }
            },
            /*StoreRedirectTracker.CheckClickRedirection end.*/

            /*StoreRedirectTracker.CheckTimeRedirection start.*/
            CheckTimeRedirection: function () {
                if (!(UnityEngine.MonoBehaviour.op_Equality(this.playableSettings, null)) && this.playableSettings.enableTimeRedirection && this.isTrackingTime && !this.hasRedirected && this.timeElapsed >= this.playableSettings.timeToRedirect) {
                    this.TriggerStoreRedirection("Time limit reached");
                }
            },
            /*StoreRedirectTracker.CheckTimeRedirection end.*/

            /*StoreRedirectTracker.TriggerStoreRedirection start.*/
            TriggerStoreRedirection: function (reason) {
                if (!this.hasRedirected) {
                    this.hasRedirected = true;
                }
                Luna.Unity.Analytics.LogEvent$1("Store Redirect - " + (reason || ""), 1);
                Luna.Unity.Playable.InstallFullGame();
                Luna.Unity.LifeCycle.GameEnded();
            },
            /*StoreRedirectTracker.TriggerStoreRedirection end.*/

            /*StoreRedirectTracker.GetTotalClicks start.*/
            GetTotalClicks: function () {
                return this.totalClicks;
            },
            /*StoreRedirectTracker.GetTotalClicks end.*/

            /*StoreRedirectTracker.GetTimeElapsed start.*/
            GetTimeElapsed: function () {
                return this.timeElapsed;
            },
            /*StoreRedirectTracker.GetTimeElapsed end.*/

            /*StoreRedirectTracker.HasRedirected start.*/
            HasRedirected: function () {
                return this.hasRedirected;
            },
            /*StoreRedirectTracker.HasRedirected end.*/

            /*StoreRedirectTracker.TriggerManualRedirect start.*/
            TriggerManualRedirect: function (reason) {
                if (reason === void 0) { reason = "Manual redirect"; }
                this.TriggerStoreRedirection(reason);
            },
            /*StoreRedirectTracker.TriggerManualRedirect end.*/

            /*StoreRedirectTracker.SetTrackingEnabled start.*/
            SetTrackingEnabled: function (enabled) {
                this.isTracking = enabled;
            },
            /*StoreRedirectTracker.SetTrackingEnabled end.*/

            /*StoreRedirectTracker.ResetAllCounters start.*/
            ResetAllCounters: function () {
                this.ResetCounters();
            },
            /*StoreRedirectTracker.ResetAllCounters end.*/

            /*StoreRedirectTracker.ClearRedirectState start.*/
            ClearRedirectState: function () {
                this.hasRedirected = false;
            },
            /*StoreRedirectTracker.ClearRedirectState end.*/


        }
    });
    /*StoreRedirectTracker end.*/

    /*Sunlight start.*/
    Bridge.define("Sunlight", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            sunlightLight: null
        }
    });
    /*Sunlight end.*/

    /*SupportActivator start.*/
    Bridge.define("SupportActivator", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            supportMask: null,
            checkDistance: 0,
            checkInterval: 0,
            requiredMisses: 0,
            sleepDelay: 0,
            countInObjectives: false,
            objectiveIcon: null,
            isTopItem: false,
            _rb: null,
            _col: null,
            _missCounter: 0,
            _rayHits: null,
            _checkTimer: 0,
            tower: null,
            rowIndex: 0,
            _activationTime: 0,
            _forceHoleDrop: false
        },
        ctors: {
            init: function () {
                this.supportMask = new UnityEngine.LayerMask();
                this.checkDistance = 0.25;
                this.checkInterval = 0.01;
                this.requiredMisses = 2;
                this.sleepDelay = 3.0;
                this.countInObjectives = false;
                this.isTopItem = false;
                this._rayHits = System.Array.init(4, function (){
                    return new UnityEngine.RaycastHit();
                }, UnityEngine.RaycastHit);
            }
        },
        methods: {
            /*SupportActivator.Awake start.*/
            Awake: function () {
                this._rb = this.GetComponent(UnityEngine.Rigidbody);
                if (UnityEngine.Component.op_Equality(this._rb, null)) {
                    this._rb = this.GetComponentInParent(UnityEngine.Rigidbody);
                }
                this._col = this.GetComponent(UnityEngine.Collider);
                if (UnityEngine.Component.op_Equality(this._col, null)) {
                    this._col = this.GetComponentInParent(UnityEngine.Collider);
                }
                this._rb.isKinematic = true;
                this._rb.drag = 0.0;
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

            /*SupportActivator.OnEnable start.*/
            OnEnable: function () {
                this._checkTimer = 0.0;
                var index = ((UnityEngine.Component.op_Inequality(this.tower, null)) ? this.tower.GetComponent(TowerRuntimeIndex) : null);
                if (UnityEngine.MonoBehaviour.op_Inequality(index, null)) {
                    index.Register(this);
                }
            },
            /*SupportActivator.OnEnable end.*/

            /*SupportActivator.OnDisable start.*/
            OnDisable: function () {
                var index = ((UnityEngine.Component.op_Inequality(this.tower, null)) ? this.tower.GetComponent(TowerRuntimeIndex) : null);
                if (UnityEngine.MonoBehaviour.op_Inequality(index, null)) {
                    index.Unregister(this);
                }
            },
            /*SupportActivator.OnDisable end.*/

            /*SupportActivator.EvaluateSupport start.*/
            EvaluateSupport: function () {
                if (this._forceHoleDrop || UnityEngine.Component.op_Equality(this._rb, null) || !this._rb.isKinematic) {
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
            /*SupportActivator.EvaluateSupport end.*/

            /*SupportActivator.ActivatePhysics start.*/
            ActivatePhysics: function () {
                if (!(UnityEngine.Component.op_Equality(this._rb, null))) {
                    this._rb.isKinematic = false;
                    this._rb.WakeUp();
                    this._activationTime = UnityEngine.Time.time;
                }
            },
            /*SupportActivator.ActivatePhysics end.*/

            /*SupportActivator.ForceActivate start.*/
            ForceActivate: function () {
                if (!(UnityEngine.Component.op_Equality(this._rb, null))) {
                    this._forceHoleDrop = true;
                    this.ActivatePhysics();
                }
            },
            /*SupportActivator.ForceActivate end.*/

            /*SupportActivator.FlaggedByHole start.*/
            FlaggedByHole: function () {
                this._forceHoleDrop = true;
                this.ActivatePhysics();
            },
            /*SupportActivator.FlaggedByHole end.*/

            /*SupportActivator.HasSupportBelow start.*/
            HasSupportBelow: function () {
                var b = ((UnityEngine.Component.op_Inequality(this._col, null)) ? this._col.bounds : new pc.BoundingBox( this.transform.position.$clone(), pc.Vec3.ZERO.clone().scale( 0.5 ) ));
                var origin = new pc.Vec3( b.center.x, b.min.y + 0.01, b.center.z );
                var direction = pc.Vec3.DOWN.clone();
                var distance = UnityEngine.Mathf.Max(this.checkDistance, 0.1);
                UnityEngine.Debug.DrawRay$2(origin, direction.$clone().clone().scale( distance ), new pc.Color( 1, 0, 0, 1 ), this.checkInterval);
                var hitCount = UnityEngine.Physics.RaycastNonAlloc$2(origin, direction, this._rayHits, distance, UnityEngine.LayerMask.op_Implicit(this.supportMask.$clone()), UnityEngine.QueryTriggerInteraction.Ignore);
                if (hitCount === 0) {
                    return false;
                }
                for (var i = 0; i < hitCount; i = (i + 1) | 0) {
                    var hit = this._rayHits[i].$clone();
                    var col = hit.collider;
                    if (!(UnityEngine.Component.op_Equality(col, null))) {
                        var hitRb = ((UnityEngine.Component.op_Inequality(hit.rigidbody, null)) ? hit.rigidbody : col.GetComponentInParent(UnityEngine.Rigidbody));
                        if (!(UnityEngine.Component.op_Equality(hitRb, this._rb))) {
                            UnityEngine.Debug.DrawRay$2(origin, direction.$clone().clone().scale( hit.distance ), new pc.Color( 0, 1, 0, 1 ), this.checkInterval);
                            return true;
                        }
                    }
                }
                return false;
            },
            /*SupportActivator.HasSupportBelow end.*/

            /*SupportActivator.Update start.*/
            Update: function () {
                if (UnityEngine.Component.op_Equality(this._rb, null)) {
                    return;
                }
                if (this._forceHoleDrop) {
                    if (this._rb.isKinematic) {
                        this.ActivatePhysics();
                    }
                } else if (this._rb.isKinematic) {
                    this._checkTimer += UnityEngine.Time.deltaTime;
                    var interval = UnityEngine.Mathf.Max(0.02, this.checkInterval);
                    if (this._checkTimer >= interval) {
                        this._checkTimer = 0.0;
                        this.EvaluateSupport();
                    }
                } else if (UnityEngine.Time.time - this._activationTime > this.sleepDelay) {
                    this._rb.isKinematic = true;
                }
            },
            /*SupportActivator.Update end.*/

            /*SupportActivator.OnCollisionEnter start.*/
            OnCollisionEnter: function (collision) {
                if (!this._forceHoleDrop && UnityEngine.Component.op_Inequality(this._rb, null) && this._rb.isKinematic) {
                    this._rb.isKinematic = false;
                    this._activationTime = UnityEngine.Time.time;
                }
            },
            /*SupportActivator.OnCollisionEnter end.*/


        }
    });
    /*SupportActivator end.*/

    /*SwallowElements start.*/
    Bridge.define("SwallowElements", {
        inherits: [UnityEngine.MonoBehaviour],
        methods: {
            /*SwallowElements.Start start.*/
            Start: function () { },
            /*SwallowElements.Start end.*/

            /*SwallowElements.Update start.*/
            Update: function () { },
            /*SwallowElements.Update end.*/


        }
    });
    /*SwallowElements end.*/

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

    /*ThemeDisplayGroup start.*/
    Bridge.define("ThemeDisplayGroup", {
        inherits: [UnityEngine.MonoBehaviour],
        statics: {
            methods: {
                /*ThemeDisplayGroup.GetCollectableName:static start.*/
                GetCollectableName: function (levelTheme) {
                    switch (levelTheme) {
                        case ResourceLoader.LevelTheme.Cherry: 
                            return "4 - CherryLeaf";
                        case ResourceLoader.LevelTheme.Flower: 
                            return "None";
                        case ResourceLoader.LevelTheme.Maki: 
                            return "44 - Maki1";
                        case ResourceLoader.LevelTheme.Sushi: 
                            return "43 - Sushi1";
                        case ResourceLoader.LevelTheme.Donut: 
                            return "45 - Donut";
                        case ResourceLoader.LevelTheme.Strawberry: 
                            return "46 - Strawb";
                        case ResourceLoader.LevelTheme.PineappleRing: 
                            return "47 - pineappl_slice";
                        case ResourceLoader.LevelTheme.FigBlue: 
                            return "48 - Fig";
                        case ResourceLoader.LevelTheme.Watermelon: 
                            return "53 - Watermellon";
                        case ResourceLoader.LevelTheme.WatermelonQuarter: 
                            return "54 - Watermelon_Quarter";
                        case ResourceLoader.LevelTheme.Starfruit: 
                            return "52 - Starfruit";
                        case ResourceLoader.LevelTheme.DragonfruitHalf: 
                            return "50 - Dragonfruit_Half";
                        case ResourceLoader.LevelTheme.DragonfruitPinkQuarter: 
                            return "51 - Dragonfruit_Quarter";
                        case ResourceLoader.LevelTheme.DragonfruitPink: 
                            return "49 - Dragonfruit";
                        default: 
                            return null;
                    }
                },
                /*ThemeDisplayGroup.GetCollectableName:static end.*/


            }
        },
        fields: {
            shape: 0,
            theme: 0,
            searchRoot: null,
            placeholders: null
        },
        ctors: {
            init: function () {
                this.placeholders = new (System.Collections.Generic.List$1(ThemeDisplayGroup.ThemePlaceholderEntry)).ctor();
            }
        },
        methods: {
            /*ThemeDisplayGroup.Awake start.*/
            Awake: function () {
                this.SyncThemeFromSettings();
            },
            /*ThemeDisplayGroup.Awake end.*/

            /*ThemeDisplayGroup.Start start.*/
            Start: function () {
                this.SyncThemeFromSettings();
            },
            /*ThemeDisplayGroup.Start end.*/

            /*ThemeDisplayGroup.SyncThemeFromSettings start.*/
            SyncThemeFromSettings: function () {
                this.ResolveThemeFromSettings();
                this.ApplyTheme();
            },
            /*ThemeDisplayGroup.SyncThemeFromSettings end.*/

            /*ThemeDisplayGroup.ResolveThemeFromSettings start.*/
            ResolveThemeFromSettings: function () {
                var settings = PlayableSettings.instance;
                if (!(UnityEngine.MonoBehaviour.op_Equality(settings, null))) {
                    var previousTheme = this.theme;
                    switch (this.shape) {
                        case ResourceLoader.LevelShape.Corridor: 
                            this.theme = settings.corridorTheme;
                            break;
                        case ResourceLoader.LevelShape.Circular: 
                            this.theme = settings.circularTheme;
                            break;
                        case ResourceLoader.LevelShape.LvlCircular1: 
                            this.theme = settings.lvlCircular1Theme;
                            break;
                        case ResourceLoader.LevelShape.LvlCircular2: 
                            this.theme = settings.lvlCircular2Theme;
                            break;
                        case ResourceLoader.LevelShape.LvlCircular3: 
                            this.theme = settings.lvlCircular3Theme;
                            break;
                        case ResourceLoader.LevelShape.LvlCircular4: 
                            this.theme = settings.lvlCircular4Theme;
                            break;
                    }
                }
            },
            /*ThemeDisplayGroup.ResolveThemeFromSettings end.*/

            /*ThemeDisplayGroup.ApplyTheme start.*/
            ApplyTheme: function () {
                var $t;
                if (this.placeholders == null || this.placeholders.Count === 0) {
                    return;
                }
                $t = Bridge.getEnumerator(this.placeholders);
                try {
                    while ($t.moveNext()) {
                        var entry = $t.Current;
                        if (entry == null || UnityEngine.MonoBehaviour.op_Equality(entry.placeholder, null)) {
                            continue;
                        }
                        var targetName = entry.GetResourceName(this.theme);
                        if (System.String.isNullOrEmpty(targetName)) {
                            targetName = ThemeDisplayGroup.GetCollectableName(this.theme);
                            if (System.String.isNullOrEmpty(targetName)) {
                                continue;
                            }
                        }
                        entry.placeholder.ApplyResourceName(targetName);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*ThemeDisplayGroup.ApplyTheme end.*/


        }
    });
    /*ThemeDisplayGroup end.*/

    /*ThemeDisplayGroup+ThemePlaceholderEntry start.*/
    Bridge.define("ThemeDisplayGroup.ThemePlaceholderEntry", {
        $kind: 1002,
        fields: {
            placeholder: null,
            defaultResourceName: null,
            overrides: null
        },
        ctors: {
            init: function () {
                this.overrides = new (System.Collections.Generic.List$1(ThemeDisplayGroup.ThemeResourceOverride)).ctor();
            }
        },
        methods: {
            /*ThemeDisplayGroup+ThemePlaceholderEntry.GetResourceName start.*/
            GetResourceName: function (currentTheme) {
                var $t;
                if (this.overrides != null) {
                    $t = Bridge.getEnumerator(this.overrides);
                    try {
                        while ($t.moveNext()) {
                            var item = $t.Current;
                            if (item != null && item.theme === currentTheme && !System.String.isNullOrEmpty(item.resourceName)) {
                                return item.resourceName;
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                }
                return null;
            },
            /*ThemeDisplayGroup+ThemePlaceholderEntry.GetResourceName end.*/


        }
    });
    /*ThemeDisplayGroup+ThemePlaceholderEntry end.*/

    /*ThemeDisplayGroup+ThemeResourceOverride start.*/
    Bridge.define("ThemeDisplayGroup.ThemeResourceOverride", {
        $kind: 1002,
        fields: {
            theme: 0,
            resourceName: null
        }
    });
    /*ThemeDisplayGroup+ThemeResourceOverride end.*/

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
                if (UnityEngine.MonoBehaviour.op_Inequality(StoreRedirectTracker.instance, null)) {
                    StoreRedirectTracker.instance.OnThrow();
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

    /*ToonyColorsPro.Runtime.TCP2_CameraDepth start.*/
    Bridge.define("ToonyColorsPro.Runtime.TCP2_CameraDepth", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            RenderDepth: false
        },
        ctors: {
            init: function () {
                this.RenderDepth = true;
            }
        },
        methods: {
            /*ToonyColorsPro.Runtime.TCP2_CameraDepth.OnEnable start.*/
            OnEnable: function () {
                this.SetCameraDepth();
            },
            /*ToonyColorsPro.Runtime.TCP2_CameraDepth.OnEnable end.*/

            /*ToonyColorsPro.Runtime.TCP2_CameraDepth.OnValidate start.*/
            OnValidate: function () {
                this.SetCameraDepth();
            },
            /*ToonyColorsPro.Runtime.TCP2_CameraDepth.OnValidate end.*/

            /*ToonyColorsPro.Runtime.TCP2_CameraDepth.SetCameraDepth start.*/
            SetCameraDepth: function () {
                var cam = this.GetComponent(UnityEngine.Camera);
                if (this.RenderDepth) {
                    cam.depthTextureMode |= UnityEngine.DepthTextureMode.Depth;
                } else {
                    cam.depthTextureMode &= -2;
                }
            },
            /*ToonyColorsPro.Runtime.TCP2_CameraDepth.SetCameraDepth end.*/


        }
    });
    /*ToonyColorsPro.Runtime.TCP2_CameraDepth end.*/

    /*ToonyColorsPro.Runtime.TCP2_RuntimeUtils start.*/
    Bridge.define("ToonyColorsPro.Runtime.TCP2_RuntimeUtils", {
        statics: {
            fields: {
                BASE_SHADER_PATH: null,
                VARIANT_SHADER_PATH: null,
                BASE_SHADER_NAME: null,
                BASE_SHADER_NAME_MOB: null,
                ShaderVariants: null
            },
            ctors: {
                init: function () {
                    this.BASE_SHADER_PATH = "Toony Colors Pro 2/";
                    this.VARIANT_SHADER_PATH = "Hidden/Toony Colors Pro 2/Variants/";
                    this.BASE_SHADER_NAME = "Desktop";
                    this.BASE_SHADER_NAME_MOB = "Mobile";
                    this.ShaderVariants = function (_o1) {
                            _o1.add(System.Array.init(["Specular", "TCP2_SPEC"], System.String));
                            _o1.add(System.Array.init(["Reflection", "TCP2_REFLECTION", "TCP2_REFLECTION_MASKED"], System.String));
                            _o1.add(System.Array.init(["Matcap", "TCP2_MC"], System.String));
                            _o1.add(System.Array.init(["Rim", "TCP2_RIM"], System.String));
                            _o1.add(System.Array.init(["RimOutline", "TCP2_RIMO"], System.String));
                            _o1.add(System.Array.init(["Outline", "OUTLINES"], System.String));
                            _o1.add(System.Array.init(["OutlineBlending", "OUTLINE_BLENDING"], System.String));
                            return _o1;
                        }(new (System.Collections.Generic.List$1(System.Array.type(System.String))).ctor());
                }
            },
            methods: {
                /*ToonyColorsPro.Runtime.TCP2_RuntimeUtils.GetShaderWithKeywords:static start.*/
                GetShaderWithKeywords: function (material) {
                    var $t, $t1;
                    var baseName = ((material.shader != null && System.String.contains(material.shader.name.toLowerCase(),"mobile")) ? "Mobile" : "Desktop");
                    var newShader = baseName;
                    $t = Bridge.getEnumerator(ToonyColorsPro.Runtime.TCP2_RuntimeUtils.ShaderVariants);
                    try {
                        while ($t.moveNext()) {
                            var variantKeywords = $t.Current;
                            var shaderKeywords = material.shaderKeywords;
                            $t1 = Bridge.getEnumerator(shaderKeywords);
                            try {
                                while ($t1.moveNext()) {
                                    var keyword = $t1.Current;
                                    for (var i = 1; i < variantKeywords.length; i = (i + 1) | 0) {
                                        if (Bridge.referenceEquals(keyword, variantKeywords[i])) {
                                            newShader = (newShader || "") + " " + (variantKeywords[0] || "");
                                        }
                                    }
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$Dispose();
                                }
                            }
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }
                    newShader = System.String.trimEnd(newShader);
                    var basePath = "Toony Colors Pro 2/";
                    if (!Bridge.referenceEquals(newShader, baseName)) {
                        basePath = "Hidden/Toony Colors Pro 2/Variants/";
                    }
                    return UnityEngine.Shader.Find((basePath || "") + (newShader || ""));
                },
                /*ToonyColorsPro.Runtime.TCP2_RuntimeUtils.GetShaderWithKeywords:static end.*/


            }
        }
    });
    /*ToonyColorsPro.Runtime.TCP2_RuntimeUtils end.*/

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
                                            t.localRotation = new pc.Quat().slerpUnclamped( startRot, targetRot, pc.math.clamp( t2, 0, 1 ) );
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
            timeBarImage: null,
            anim: null,
            isTimerAnimPlaying: false,
            topBanner: null,
            midBanner: null,
            bottomBanner: null,
            handCursor: null,
            joystick: null,
            tutoJoystick: null,
            introText: null,
            holeController: null,
            myObjectivesUISystem: null,
            tutoJoystickHidden: false,
            lastTouchReleaseTime: 0,
            showAfterDelayCoroutine: null,
            isTouching: false
        },
        ctors: {
            init: function () {
                this.tutoJoystickHidden = false;
                this.lastTouchReleaseTime = 0.0;
                this.isTouching = false;
            }
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

            /*UIManager.Start start.*/
            Start: function () {
                this.InitializeJoysticks();
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null) && !PlayableSettings.instance.showIntroText && UnityEngine.MonoBehaviour.op_Inequality(this.introText, null)) {
                    this.introText.text = "";
                }
            },
            /*UIManager.Start end.*/

            /*UIManager.InitializeJoysticks start.*/
            InitializeJoysticks: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(PlayableSettings.instance, null)) {
                    return;
                }
                if (UnityEngine.GameObject.op_Inequality(this.joystick, null)) {
                    this.joystick.SetActive(PlayableSettings.instance.enableJoystick);
                }
                if (!(UnityEngine.GameObject.op_Inequality(this.tutoJoystick, null))) {
                    return;
                }
                if (PlayableSettings.instance.enableTutoJoystick) {
                    var shouldShow = PlayableSettings.instance.tutoJoystickShowAtStart || PlayableSettings.instance.enableTutoJoystickAfterTouch;
                    if (shouldShow && PlayableSettings.instance.tutoJoystickDisplayDelay > 0.0) {
                        this.tutoJoystick.SetActive(false);
                        this.StartCoroutine$1(this.DelayedShowTutoJoystick());
                    } else {
                        this.tutoJoystick.SetActive(shouldShow);
                    }
                } else {
                    this.tutoJoystick.SetActive(false);
                }
            },
            /*UIManager.InitializeJoysticks end.*/

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
                    var fillAmount = 1.0 - currentTime / PlayableSettings.instance.gameTimeInSeconds;
                    this.timeBarImage.fillAmount = Math.max(0, Math.min(1, fillAmount));
                }
            },
            /*UIManager.UpdateTimeBar end.*/

            /*UIManager.UpdateSlider start.*/
            UpdateSlider: function (amount) { },
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
                if (UnityEngine.MonoBehaviour.op_Inequality(StoreRedirectTracker.instance, null)) {
                    StoreRedirectTracker.instance.TriggerManualRedirect("UI Button clicked");
                    return;
                }
                Luna.Unity.Playable.InstallFullGame();
                Luna.Unity.Analytics.LogEvent$1("Button clicked", 1);
                Luna.Unity.LifeCycle.GameEnded();
            },
            /*UIManager.OnButtonClick end.*/

            /*UIManager.OnBannerClick start.*/
            OnBannerClick: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(StoreRedirectTracker.instance, null)) {
                    StoreRedirectTracker.instance.TriggerManualRedirect("Banner clicked");
                    return;
                }
                Luna.Unity.Playable.InstallFullGame();
                Luna.Unity.Analytics.LogEvent$1("Banner clicked", 1);
                Luna.Unity.LifeCycle.GameEnded();
            },
            /*UIManager.OnBannerClick end.*/

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
                    this.introText.text = "";
                }
            },
            /*UIManager.HideIntroText end.*/

            /*UIManager.OnPlayerTouch start.*/
            OnPlayerTouch: function () {
                if (UnityEngine.GameObject.op_Equality(this.tutoJoystick, null) || !PlayableSettings.instance.enableTutoJoystick || (UnityEngine.MonoBehaviour.op_Inequality(this.holeController, null) && !this.holeController.IsInputEnabled)) {
                    return;
                }
                this.isTouching = true;
                if (PlayableSettings.instance.tutoJoystickShowAtStart && !this.tutoJoystickHidden) {
                    this.tutoJoystick.SetActive(false);
                    this.tutoJoystickHidden = true;
                }
                if (PlayableSettings.instance.enableTutoJoystickAfterTouch) {
                    this.tutoJoystick.SetActive(false);
                    if (this.showAfterDelayCoroutine != null) {
                        this.StopCoroutine$2(this.showAfterDelayCoroutine);
                    }
                }
            },
            /*UIManager.OnPlayerTouch end.*/

            /*UIManager.OnPlayerTouchRelease start.*/
            OnPlayerTouchRelease: function () {
                if (!(UnityEngine.GameObject.op_Equality(this.tutoJoystick, null)) && PlayableSettings.instance.enableTutoJoystick) {
                    this.isTouching = false;
                    if (PlayableSettings.instance.enableTutoJoystickAfterTouch) {
                        this.lastTouchReleaseTime = UnityEngine.Time.time;
                        this.showAfterDelayCoroutine = this.StartCoroutine$1(this.ShowTutoJoystickAfterDelay());
                    }
                }
            },
            /*UIManager.OnPlayerTouchRelease end.*/

            /*UIManager.ShowTutoJoystickAfterDelay start.*/
            ShowTutoJoystickAfterDelay: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(PlayableSettings.instance.tutoJoystickShowTimesAfterTouch);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    if ( UnityEngine.Time.time - this.lastTouchReleaseTime < PlayableSettings.instance.tutoJoystickShowTimesAfterTouch || UnityEngine.Input.GetMouseButton(0) || UnityEngine.Input.touchCount > 0 ) {
                                            $step = 2;
                                            continue;
                                        } 
                                        $step = 4;
                                        continue;
                                }
                                case 2: {
                                    $enumerator.current = null;
                                        $step = 3;
                                        return true;
                                }
                                case 3: {
                                    
                                        $step = 1;
                                        continue;
                                }
                                case 4: {
                                    if (UnityEngine.GameObject.op_Inequality(this.tutoJoystick, null) && PlayableSettings.instance.enableTutoJoystick && !this.isTouching) {
                                            this.tutoJoystick.SetActive(true);
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
            /*UIManager.ShowTutoJoystickAfterDelay end.*/

            /*UIManager.DelayedShowTutoJoystick start.*/
            DelayedShowTutoJoystick: function () {
                var $step = 0,
                    $jumpFromFinally,
                    $returnValue,
                    $async_e;

                var $enumerator = new Bridge.GeneratorEnumerator(Bridge.fn.bind(this, function () {
                    try {
                        for (;;) {
                            switch ($step) {
                                case 0: {
                                    $enumerator.current = new UnityEngine.WaitForSeconds(PlayableSettings.instance.tutoJoystickDisplayDelay);
                                        $step = 1;
                                        return true;
                                }
                                case 1: {
                                    if (UnityEngine.GameObject.op_Inequality(this.tutoJoystick, null) && PlayableSettings.instance.enableTutoJoystick && !this.isTouching) {
                                            this.tutoJoystick.SetActive(true);
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
            /*UIManager.DelayedShowTutoJoystick end.*/

            /*UIManager.Update start.*/
            Update: function () {
                if (UnityEngine.Input.GetMouseButton(0) || UnityEngine.Input.touchCount > 0) {
                    this.isTouching = true;
                }
            },
            /*UIManager.Update end.*/


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

    /*WoodTower start.*/
    Bridge.define("WoodTower", {
        inherits: [UnityEngine.MonoBehaviour],
        fields: {
            woodSupportPrefab: null,
            finalWoodSupportPrefab: null,
            holder: null,
            topItem: null,
            elementScale: null,
            numberOfLevels: 0,
            verticalSpacing: 0,
            topOffset: null,
            sparkleParticle: null,
            topItemList: null,
            spawnAtStart: false,
            _floatingOffset: 0,
            _activeTopItemObject: null,
            _originalTopItemLocalPos: null,
            _originalPosCaptured: false,
            _topItemRigidbody: null,
            _visualEffectsActive: false,
            _currentFloatingY: 0,
            _originalCheckDistance: 0,
            _activeSupportActivator: null
        },
        ctors: {
            init: function () {
                this.elementScale = new UnityEngine.Vector3();
                this.topOffset = new UnityEngine.Vector3();
                this._originalTopItemLocalPos = new UnityEngine.Vector3();
                this.elementScale = new pc.Vec3( 1, 1, 1 );
                this.numberOfLevels = 10;
                this.verticalSpacing = 0.2;
                this.topOffset = new pc.Vec3( 0.0, 0.1, 0.0 );
                this.topItemList = new (System.Collections.Generic.List$1(WoodTower.TopItemEntry)).ctor();
                this.spawnAtStart = true;
                this._originalPosCaptured = false;
                this._visualEffectsActive = true;
                this._currentFloatingY = 0.0;
                this._originalCheckDistance = 0.0;
            }
        },
        methods: {
            /*WoodTower.GetActiveTopItemSupportActivator start.*/
            GetActiveTopItemSupportActivator: function () {
                return this._activeSupportActivator;
            },
            /*WoodTower.GetActiveTopItemSupportActivator end.*/

            /*WoodTower.Start start.*/
            Start: function () {
                this.ApplyTopItemSizeMultiplier();
                if (UnityEngine.Application.isPlaying && this.spawnAtStart) {
                    this.SpawnTower();
                }
                this._floatingOffset = UnityEngine.Random.Range$1(0.0, 6.28318548);
            },
            /*WoodTower.Start end.*/

            /*WoodTower.Update start.*/
            Update: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    this.UpdateTopItemAnimations();
                }
                this.UpdateParticlePosition();
            },
            /*WoodTower.Update end.*/

            /*WoodTower.SpawnTower start.*/
            SpawnTower: function () {
                if (UnityEngine.Component.op_Equality(this.holder, null) || UnityEngine.GameObject.op_Equality(this.woodSupportPrefab, null) || UnityEngine.GameObject.op_Equality(this.finalWoodSupportPrefab, null)) {
                    return;
                }
                this.CleanTower();
                var levelsToUse = this.GetLevelsToUse();
                for (var i = 0; i < levelsToUse; i = (i + 1) | 0) {
                    var sourcePrefab = ((i === ((levelsToUse - 1) | 0)) ? this.finalWoodSupportPrefab : this.woodSupportPrefab);
                    var instance = this.InstantiateChildKeepingPrefabLink(sourcePrefab, this.holder);
                    instance.transform.localPosition = new pc.Vec3( 0.0, i * this.verticalSpacing, 0.0 );
                    instance.transform.localRotation = pc.Quat.IDENTITY.clone();
                    var scaleToApply = this.elementScale.$clone();
                    if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                        scaleToApply.x = PlayableSettings.instance.towerWidth;
                        scaleToApply.z = PlayableSettings.instance.towerWidth;
                    }
                    instance.transform.localScale = scaleToApply.$clone();
                }
                this.UpdateTopItemPosition();
                this.UpdateTopItemVisual();
                if (UnityEngine.Component.op_Inequality(this.sparkleParticle, null) && UnityEngine.GameObject.op_Inequality(this._activeTopItemObject, null)) {
                    if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null) && PlayableSettings.instance.enableSparkleParticle) {
                        this.sparkleParticle.transform.position = this._activeTopItemObject.transform.position.$clone().add( pc.Vec3.UP.clone().clone().scale( 1.5 ) );
                        this.sparkleParticle.Play();
                    } else {
                        this.sparkleParticle.Stop();
                    }
                }
                if (UnityEngine.Application.isPlaying && UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    this.UpdateTopItemAnimations();
                }
            },
            /*WoodTower.SpawnTower end.*/

            /*WoodTower.CleanTower start.*/
            CleanTower: function () {
                var $t, $t1;
                if (UnityEngine.Component.op_Equality(this.holder, null)) {
                    return;
                }
                var toDestroy = new (System.Collections.Generic.List$1(UnityEngine.GameObject)).ctor();
                $t = Bridge.getEnumerator(this.holder);
                try {
                    while ($t.moveNext()) {
                        var child = Bridge.cast($t.Current, UnityEngine.Transform);
                        toDestroy.add(child.gameObject);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                $t1 = Bridge.getEnumerator(toDestroy);
                try {
                    while ($t1.moveNext()) {
                        var go = $t1.Current;
                        UnityEngine.Object.Destroy(go);
                    }
                } finally {
                    if (Bridge.is($t1, System.IDisposable)) {
                        $t1.System$IDisposable$Dispose();
                    }
                }
            },
            /*WoodTower.CleanTower end.*/

            /*WoodTower.GetLevelsToUse start.*/
            GetLevelsToUse: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    return PlayableSettings.instance.towerHeight;
                }
                return this.numberOfLevels;
            },
            /*WoodTower.GetLevelsToUse end.*/

            /*WoodTower.UpdateTopItemPosition start.*/
            UpdateTopItemPosition: function () {
                if (!(UnityEngine.Component.op_Equality(this.topItem, null))) {
                    var lastY = this.GetLevelsToUse() * this.verticalSpacing;
                    this.topItem.localPosition = new pc.Vec3( 0.0, lastY, 0.0 ).add( this.topOffset );
                }
            },
            /*WoodTower.UpdateTopItemPosition end.*/

            /*WoodTower.ApplyTopItemSizeMultiplier start.*/
            ApplyTopItemSizeMultiplier: function () {
                var $t;
                if (this.topItemList == null || this.topItemList.Count === 0) {
                    return;
                }
                var sizeMultiplier = 1.0;
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    sizeMultiplier = PlayableSettings.instance.topItemSizeMultiplier;
                }
                $t = Bridge.getEnumerator(this.topItemList);
                try {
                    while ($t.moveNext()) {
                        var entry = $t.Current;
                        if (UnityEngine.GameObject.op_Inequality(entry.gameObject, null)) {
                            var currentScale = entry.gameObject.transform.localScale.$clone();
                            entry.gameObject.transform.localScale = currentScale.$clone().clone().scale( sizeMultiplier );
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            },
            /*WoodTower.ApplyTopItemSizeMultiplier end.*/

            /*WoodTower.UpdateTopItemVisual start.*/
            UpdateTopItemVisual: function () {
                var $t;
                if (this.topItemList == null || this.topItemList.Count === 0) {
                    return;
                }
                var currentSelectedItem = WoodTower.TopItemType.Banana;
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null)) {
                    currentSelectedItem = PlayableSettings.instance.selectedTopItem;
                }
                var previousActiveItem = this._activeTopItemObject;
                this._activeTopItemObject = null;
                $t = Bridge.getEnumerator(this.topItemList);
                try {
                    while ($t.moveNext()) {
                        var entry = $t.Current;
                        if (UnityEngine.GameObject.op_Equality(entry.gameObject, null)) {
                            continue;
                        }
                        if (entry.type === currentSelectedItem) {
                            this._activeTopItemObject = entry.gameObject;
                            if (UnityEngine.GameObject.op_Inequality(entry.gameObject, previousActiveItem)) {
                                this._topItemRigidbody = entry.rigidbody;
                                this._activeSupportActivator = entry.supportActivator;
                                var currentPos = entry.gameObject.transform.localPosition.$clone();
                                entry.gameObject.transform.localPosition = new pc.Vec3( currentPos.x, 0.0, currentPos.z );
                                this._originalTopItemLocalPos = entry.gameObject.transform.localPosition.$clone();
                                if (UnityEngine.MonoBehaviour.op_Inequality(this._activeSupportActivator, null)) {
                                    this._originalCheckDistance = this._activeSupportActivator.checkDistance;
                                }
                                this._originalPosCaptured = true;
                                this._visualEffectsActive = true;
                                this._currentFloatingY = 0.0;
                                entry.gameObject.SetActive(true);
                            } else {
                                entry.gameObject.SetActive(true);
                            }
                        } else {
                            entry.gameObject.SetActive(false);
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                if (UnityEngine.GameObject.op_Equality(this._activeTopItemObject, null)) {
                    this._originalPosCaptured = false;
                }
            },
            /*WoodTower.UpdateTopItemVisual end.*/

            /*WoodTower.UpdateTopItemAnimations start.*/
            UpdateTopItemAnimations: function () {
                if (UnityEngine.MonoBehaviour.op_Equality(PlayableSettings.instance, null) || UnityEngine.Component.op_Equality(this.topItem, null)) {
                    return;
                }
                if (UnityEngine.GameObject.op_Equality(this._activeTopItemObject, null) || !this._activeTopItemObject.activeSelf) {
                    this._originalPosCaptured = false;
                    this.UpdateTopItemVisual();
                }
                if (UnityEngine.GameObject.op_Equality(this._activeTopItemObject, null) || !this._originalPosCaptured || !this._visualEffectsActive) {
                    return;
                }
                if (UnityEngine.Component.op_Inequality(this._topItemRigidbody, null) && !this._topItemRigidbody.isKinematic) {
                    this.StopVisualEffects();
                    return;
                }
                var settings = PlayableSettings.instance;
                var lastY = this.GetLevelsToUse() * this.verticalSpacing;
                this.topItem.localPosition = new pc.Vec3( 0.0, lastY, 0.0 ).add( this.topOffset );
                if (settings.enableTopItemFloating && UnityEngine.GameObject.op_Inequality(this._activeTopItemObject, null)) {
                    var sinValue = Math.sin((UnityEngine.Time.time + this._floatingOffset) * settings.topItemFloatingSpeed);
                    this._currentFloatingY = (sinValue + 1.0) * 0.5 * settings.topItemFloatingHeight;
                    var finalY = this._originalTopItemLocalPos.y + this._currentFloatingY;
                    this._activeTopItemObject.transform.localPosition = new pc.Vec3( this._originalTopItemLocalPos.x, finalY, this._originalTopItemLocalPos.z );
                } else if (UnityEngine.GameObject.op_Inequality(this._activeTopItemObject, null)) {
                    this._currentFloatingY = 0.0;
                    this._activeTopItemObject.transform.localPosition = this._originalTopItemLocalPos.$clone();
                }
                this.UpdateSupportActivatorCheckDistances();
                if (settings.enableTopItemRotation && UnityEngine.GameObject.op_Inequality(this._activeTopItemObject, null)) {
                    this._activeTopItemObject.transform.Rotate$1(pc.Vec3.UP.clone(), settings.topItemRotationSpeed * UnityEngine.Time.deltaTime);
                }
            },
            /*WoodTower.UpdateTopItemAnimations end.*/

            /*WoodTower.StopVisualEffects start.*/
            StopVisualEffects: function () {
                this._visualEffectsActive = false;
                this._currentFloatingY = 0.0;
                if (UnityEngine.GameObject.op_Inequality(this._activeTopItemObject, null) && this._originalPosCaptured) {
                    this._activeTopItemObject.transform.localPosition = this._originalTopItemLocalPos.$clone();
                }
            },
            /*WoodTower.StopVisualEffects end.*/

            /*WoodTower.UpdateSupportActivatorCheckDistances start.*/
            UpdateSupportActivatorCheckDistances: function () {
                if (UnityEngine.MonoBehaviour.op_Inequality(this._activeSupportActivator, null)) {
                    this._activeSupportActivator.checkDistance = this._originalCheckDistance + this._currentFloatingY;
                }
            },
            /*WoodTower.UpdateSupportActivatorCheckDistances end.*/

            /*WoodTower.UpdateParticlePosition start.*/
            UpdateParticlePosition: function () {
                if (UnityEngine.GameObject.op_Equality(this._activeTopItemObject, null) || UnityEngine.Component.op_Equality(this.sparkleParticle, null)) {
                    return;
                }
                if (UnityEngine.MonoBehaviour.op_Inequality(PlayableSettings.instance, null) && !PlayableSettings.instance.enableSparkleParticle) {
                    if (this.sparkleParticle.isPlaying) {
                        this.sparkleParticle.Stop();
                    }
                    return;
                }
                var itemWorldPos = this._activeTopItemObject.transform.position.$clone();
                this.sparkleParticle.transform.position = itemWorldPos.$clone().add( pc.Vec3.UP.clone().clone().scale( 1.5 ) );
                if (itemWorldPos.y < 2.0 && this.sparkleParticle.isPlaying) {
                    this.sparkleParticle.Stop();
                }
            },
            /*WoodTower.UpdateParticlePosition end.*/

            /*WoodTower.InstantiateChildKeepingPrefabLink start.*/
            InstantiateChildKeepingPrefabLink: function (prefab, parent) {
                return UnityEngine.Object.Instantiate(UnityEngine.GameObject, prefab, parent);
            },
            /*WoodTower.InstantiateChildKeepingPrefabLink end.*/


        }
    });
    /*WoodTower end.*/

    /*WoodTower+TopItemEntry start.*/
    Bridge.define("WoodTower.TopItemEntry", {
        $kind: 1002,
        fields: {
            type: 0,
            gameObject: null,
            rigidbody: null,
            supportActivator: null
        }
    });
    /*WoodTower+TopItemEntry end.*/

    /*WoodTower+TopItemType start.*/
    Bridge.define("WoodTower.TopItemType", {
        $kind: 1006,
        statics: {
            fields: {
                Banana: 0,
                Watermelon: 1,
                Eggplant: 2,
                Cucumber: 3,
                Strawberry: 4,
                Donut: 5
            }
        }
    });
    /*WoodTower+TopItemType end.*/

    /*DynamicJoystick start.*/
    Bridge.define("DynamicJoystick", {
        inherits: [Joystick],
        fields: {
            moveThreshold: 0
        },
        props: {
            MoveThreshold: {
                get: function () {
                    return this.moveThreshold;
                },
                set: function (value) {
                    this.moveThreshold = Math.abs(value);
                }
            }
        },
        alias: [
            "OnPointerDown", "UnityEngine$EventSystems$IPointerDownHandler$OnPointerDown",
            "OnPointerUp", "UnityEngine$EventSystems$IPointerUpHandler$OnPointerUp"
        ],
        ctors: {
            init: function () {
                this.moveThreshold = 1.0;
            }
        },
        methods: {
            /*DynamicJoystick.Start start.*/
            Start: function () {
                this.MoveThreshold = this.moveThreshold;
                Joystick.prototype.Start.call(this);
                this.background.gameObject.SetActive(false);
            },
            /*DynamicJoystick.Start end.*/

            /*DynamicJoystick.OnPointerDown start.*/
            OnPointerDown: function (eventData) {
                this.background.anchoredPosition = this.ScreenPointToAnchoredPosition(eventData.position.$clone());
                this.background.gameObject.SetActive(true);
                Joystick.prototype.OnPointerDown.call(this, eventData);
            },
            /*DynamicJoystick.OnPointerDown end.*/

            /*DynamicJoystick.OnPointerUp start.*/
            OnPointerUp: function (eventData) {
                this.background.gameObject.SetActive(false);
                Joystick.prototype.OnPointerUp.call(this, eventData);
            },
            /*DynamicJoystick.OnPointerUp end.*/

            /*DynamicJoystick.HandleInput start.*/
            HandleInput: function (magnitude, normalised, radius, cam) {
                if (magnitude > this.moveThreshold) {
                    var difference = normalised.$clone().scale( (magnitude - this.moveThreshold) ).mul( radius );
                    this.background.anchoredPosition = this.background.anchoredPosition.$clone().add( difference.$clone() );
                }
                Joystick.prototype.HandleInput.call(this, magnitude, normalised.$clone(), radius.$clone(), cam);
            },
            /*DynamicJoystick.HandleInput end.*/


        }
    });
    /*DynamicJoystick end.*/

    /*FixedJoystick start.*/
    Bridge.define("FixedJoystick", {
        inherits: [Joystick]
    });
    /*FixedJoystick end.*/

    /*FloatingJoystick start.*/
    Bridge.define("FloatingJoystick", {
        inherits: [Joystick],
        alias: [
            "OnPointerDown", "UnityEngine$EventSystems$IPointerDownHandler$OnPointerDown",
            "OnPointerUp", "UnityEngine$EventSystems$IPointerUpHandler$OnPointerUp"
        ],
        methods: {
            /*FloatingJoystick.Start start.*/
            Start: function () {
                Joystick.prototype.Start.call(this);
                this.background.gameObject.SetActive(false);
            },
            /*FloatingJoystick.Start end.*/

            /*FloatingJoystick.OnPointerDown start.*/
            OnPointerDown: function (eventData) {
                this.background.anchoredPosition = this.ScreenPointToAnchoredPosition(eventData.position.$clone());
                this.background.gameObject.SetActive(true);
                Joystick.prototype.OnPointerDown.call(this, eventData);
            },
            /*FloatingJoystick.OnPointerDown end.*/

            /*FloatingJoystick.OnPointerUp start.*/
            OnPointerUp: function (eventData) {
                this.background.gameObject.SetActive(false);
                Joystick.prototype.OnPointerUp.call(this, eventData);
            },
            /*FloatingJoystick.OnPointerUp end.*/


        }
    });
    /*FloatingJoystick end.*/

    /*VariableJoystick start.*/
    Bridge.define("VariableJoystick", {
        inherits: [Joystick],
        fields: {
            moveThreshold: 0,
            joystickType: 0,
            fixedPosition: null
        },
        props: {
            MoveThreshold: {
                get: function () {
                    return this.moveThreshold;
                },
                set: function (value) {
                    this.moveThreshold = Math.abs(value);
                }
            }
        },
        alias: [
            "OnPointerDown", "UnityEngine$EventSystems$IPointerDownHandler$OnPointerDown",
            "OnPointerUp", "UnityEngine$EventSystems$IPointerUpHandler$OnPointerUp"
        ],
        ctors: {
            init: function () {
                this.fixedPosition = new UnityEngine.Vector2();
                this.moveThreshold = 1.0;
                this.joystickType = JoystickType.Fixed;
                this.fixedPosition = pc.Vec2.ZERO.clone();
            }
        },
        methods: {
            /*VariableJoystick.SetMode start.*/
            SetMode: function (joystickType) {
                this.joystickType = joystickType;
                if (joystickType === JoystickType.Fixed) {
                    this.background.anchoredPosition = this.fixedPosition.$clone();
                    this.background.gameObject.SetActive(true);
                } else {
                    this.background.gameObject.SetActive(false);
                }
            },
            /*VariableJoystick.SetMode end.*/

            /*VariableJoystick.Start start.*/
            Start: function () {
                Joystick.prototype.Start.call(this);
                this.fixedPosition = this.background.anchoredPosition.$clone();
                this.SetMode(this.joystickType);
            },
            /*VariableJoystick.Start end.*/

            /*VariableJoystick.OnPointerDown start.*/
            OnPointerDown: function (eventData) {
                if (this.joystickType !== 0) {
                    this.background.anchoredPosition = this.ScreenPointToAnchoredPosition(eventData.position.$clone());
                    this.background.gameObject.SetActive(true);
                }
                Joystick.prototype.OnPointerDown.call(this, eventData);
            },
            /*VariableJoystick.OnPointerDown end.*/

            /*VariableJoystick.OnPointerUp start.*/
            OnPointerUp: function (eventData) {
                if (this.joystickType !== 0) {
                    this.background.gameObject.SetActive(false);
                }
                Joystick.prototype.OnPointerUp.call(this, eventData);
            },
            /*VariableJoystick.OnPointerUp end.*/

            /*VariableJoystick.HandleInput start.*/
            HandleInput: function (magnitude, normalised, radius, cam) {
                if (this.joystickType === JoystickType.Dynamic && magnitude > this.moveThreshold) {
                    var difference = normalised.$clone().scale( (magnitude - this.moveThreshold) ).mul( radius );
                    this.background.anchoredPosition = this.background.anchoredPosition.$clone().add( difference.$clone() );
                }
                Joystick.prototype.HandleInput.call(this, magnitude, normalised.$clone(), radius.$clone(), cam);
            },
            /*VariableJoystick.HandleInput end.*/


        }
    });
    /*VariableJoystick end.*/

    if ( MODULE_reflection ) {
    var $m = Bridge.setMetadata,
        $n = ["UnityEngine","System","System.Collections","System.Collections.Generic","UnityEngine.EventSystems","TMPro","UnityEngine.UI","Cinemachine","HG.Playables.Tools"];

    /*AimArrow start.*/
    $m("AimArrow", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"GetForward","t":8,"pi":[{"n":"reference","pt":$n[0].Transform,"ps":0}],"sn":"GetForward","rt":$n[0].Vector3,"p":[$n[0].Transform]},{"a":1,"n":"OnEnable","t":8,"sn":"OnEnable","rt":$n[1].Void},{"a":2,"n":"SetArrowColor","t":8,"pi":[{"n":"color","pt":$n[0].Color,"ps":0}],"sn":"SetArrowColor","rt":$n[1].Void,"p":[$n[0].Color]},{"a":2,"n":"SetVisible","t":8,"pi":[{"n":"isVisible","pt":$n[1].Boolean,"ps":0}],"sn":"SetVisible","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"_angle","t":4,"rt":$n[1].Single,"sn":"_angle","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_dir","t":4,"rt":$n[1].Int32,"sn":"_dir","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"arrowSprites","t":4,"rt":System.Array.type(UnityEngine.SpriteRenderer),"sn":"arrowSprites"},{"a":2,"n":"maxAngle","t":4,"rt":$n[1].Single,"sn":"maxAngle","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"minAngle","t":4,"rt":$n[1].Single,"sn":"minAngle","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"speed","t":4,"rt":$n[1].Single,"sn":"speed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"visible","t":4,"rt":$n[1].Boolean,"sn":"visible","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*AimArrow end.*/

    /*ArrowDirection start.*/
    $m("ArrowDirection", function () { return {"nested":[ArrowDirection.TargetType,ArrowDirection.ArrowModelType],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"FindClosestItem","t":8,"sn":"FindClosestItem","rt":SupportActivator},{"a":1,"n":"FindClosestTopItem","t":8,"sn":"FindClosestTopItem","rt":SupportActivator},{"a":2,"n":"GetCurrentTarget","t":8,"sn":"GetCurrentTarget","rt":SupportActivator},{"a":1,"n":"RotateTowardTarget","t":8,"sn":"RotateTowardTarget","rt":$n[1].Void},{"a":2,"n":"SetArrowColor","t":8,"pi":[{"n":"color","pt":$n[0].Color,"ps":0}],"sn":"SetArrowColor","rt":$n[1].Void,"p":[$n[0].Color]},{"a":2,"n":"SetArrowModel","t":8,"pi":[{"n":"modelType","pt":ArrowDirection.ArrowModelType,"ps":0}],"sn":"SetArrowModel","rt":$n[1].Void,"p":[ArrowDirection.ArrowModelType]},{"a":2,"n":"SetArrowPosition","t":8,"pi":[{"n":"position","pt":$n[0].Vector3,"ps":0}],"sn":"SetArrowPosition","rt":$n[1].Void,"p":[$n[0].Vector3]},{"a":2,"n":"SetArrowScale","t":8,"pi":[{"n":"scale","pt":$n[1].Single,"ps":0}],"sn":"SetArrowScale","rt":$n[1].Void,"p":[$n[1].Single]},{"a":1,"n":"SetArrowVisible","t":8,"pi":[{"n":"visible","pt":$n[1].Boolean,"ps":0}],"sn":"SetArrowVisible","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":2,"n":"SetYoyoSettings","t":8,"pi":[{"n":"speed","pt":$n[1].Single,"ps":0},{"n":"distance","pt":$n[1].Single,"ps":1}],"sn":"SetYoyoSettings","rt":$n[1].Void,"p":[$n[1].Single,$n[1].Single]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"UpdateTarget","t":8,"sn":"UpdateTarget","rt":$n[1].Void},{"a":1,"n":"UpdateYoyoMovement","t":8,"sn":"UpdateYoyoMovement","rt":$n[1].Void},{"a":1,"n":"_activeArrowModel","t":4,"rt":$n[0].GameObject,"sn":"_activeArrowModel"},{"a":1,"n":"_basePosition","t":4,"rt":$n[0].Vector3,"sn":"_basePosition"},{"a":1,"n":"_currentTarget","t":4,"rt":SupportActivator,"sn":"_currentTarget"},{"a":1,"n":"_isEnabled","t":4,"rt":$n[1].Boolean,"sn":"_isEnabled","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_lastUpdateTime","t":4,"rt":$n[1].Single,"sn":"_lastUpdateTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_meshRenderer","t":4,"rt":$n[0].MeshRenderer,"sn":"_meshRenderer"},{"a":1,"n":"_yoyoTime","t":4,"rt":$n[1].Single,"sn":"_yoyoTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.TooltipAttribute("Will be overridden by PlayableSettings if enabled")],"a":2,"n":"arrowModel","t":4,"rt":ArrowDirection.ArrowModelType,"sn":"arrowModel","box":function ($v) { return Bridge.box($v, ArrowDirection.ArrowModelType, System.Enum.toStringFn(ArrowDirection.ArrowModelType));}},{"at":[new UnityEngine.HeaderAttribute("Arrow Models"),new UnityEngine.TooltipAttribute("First arrow model GameObject")],"a":2,"n":"arrowModel1","t":4,"rt":$n[0].GameObject,"sn":"arrowModel1"},{"at":[new UnityEngine.TooltipAttribute("Second arrow model GameObject")],"a":2,"n":"arrowModel2","t":4,"rt":$n[0].GameObject,"sn":"arrowModel2"},{"at":[new UnityEngine.HeaderAttribute("Arrow Settings"),new UnityEngine.TooltipAttribute("Transform that rotates to point at target")],"a":2,"n":"arrowPivot","t":4,"rt":$n[0].Transform,"sn":"arrowPivot"},{"a":1,"n":"minDistance","t":4,"rt":$n[1].Single,"sn":"minDistance","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"rotationSpeed","t":4,"rt":$n[1].Single,"sn":"rotationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Arrow Direction Settings"),new UnityEngine.TooltipAttribute("Will be overridden by PlayableSettings if enabled")],"a":2,"n":"targetType","t":4,"rt":ArrowDirection.TargetType,"sn":"targetType","box":function ($v) { return Bridge.box($v, ArrowDirection.TargetType, System.Enum.toStringFn(ArrowDirection.TargetType));}},{"a":2,"n":"updateInterval","t":4,"rt":$n[1].Single,"sn":"updateInterval","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"yoyoDistance","t":4,"rt":$n[1].Single,"sn":"yoyoDistance","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Yoyo Movement")],"a":2,"n":"yoyoSpeed","t":4,"rt":$n[1].Single,"sn":"yoyoSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*ArrowDirection end.*/

    /*ArrowDirection+TargetType start.*/
    $m("ArrowDirection.TargetType", function () { return {"td":ArrowDirection,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"ClosestItem","is":true,"t":4,"rt":ArrowDirection.TargetType,"sn":"ClosestItem","box":function ($v) { return Bridge.box($v, ArrowDirection.TargetType, System.Enum.toStringFn(ArrowDirection.TargetType));}},{"a":2,"n":"ClosestTopItem","is":true,"t":4,"rt":ArrowDirection.TargetType,"sn":"ClosestTopItem","box":function ($v) { return Bridge.box($v, ArrowDirection.TargetType, System.Enum.toStringFn(ArrowDirection.TargetType));}}]}; }, $n);
    /*ArrowDirection+TargetType end.*/

    /*ArrowDirection+ArrowModelType start.*/
    $m("ArrowDirection.ArrowModelType", function () { return {"td":ArrowDirection,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Model1","is":true,"t":4,"rt":ArrowDirection.ArrowModelType,"sn":"Model1","box":function ($v) { return Bridge.box($v, ArrowDirection.ArrowModelType, System.Enum.toStringFn(ArrowDirection.ArrowModelType));}},{"a":2,"n":"Model2","is":true,"t":4,"rt":ArrowDirection.ArrowModelType,"sn":"Model2","box":function ($v) { return Bridge.box($v, ArrowDirection.ArrowModelType, System.Enum.toStringFn(ArrowDirection.ArrowModelType));}}]}; }, $n);
    /*ArrowDirection+ArrowModelType end.*/

    /*AudioClipSetterLuna start.*/
    $m("AudioClipSetterLuna", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"playSoundAwake","t":4,"rt":$n[1].Boolean,"sn":"playSoundAwake","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"source","t":4,"rt":$n[0].AudioSource,"sn":"source"}]}; }, $n);
    /*AudioClipSetterLuna end.*/

    /*AudioManager start.*/
    $m("AudioManager", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"GetAudioClip","t":8,"pi":[{"n":"soundEffect","pt":SoundEffect,"ps":0}],"sn":"GetAudioClip","rt":$n[0].AudioClip,"p":[SoundEffect]},{"a":1,"n":"GetAvailableAudioSource","t":8,"sn":"GetAvailableAudioSource","rt":$n[0].AudioSource},{"a":1,"n":"GetVolumeForSoundType","t":8,"pi":[{"n":"soundEffect","pt":SoundEffect,"ps":0}],"sn":"GetVolumeForSoundType","rt":$n[1].Single,"p":[SoundEffect],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"InitializeAudioSources","t":8,"sn":"InitializeAudioSources","rt":$n[1].Void},{"a":1,"n":"InitializePool","t":8,"sn":"InitializePool","rt":$n[1].Void},{"a":1,"n":"OnDestroy","t":8,"sn":"OnDestroy","rt":$n[1].Void},{"a":1,"n":"OnMute","t":8,"sn":"OnMute","rt":$n[1].Void},{"a":1,"n":"OnUnmute","t":8,"sn":"OnUnmute","rt":$n[1].Void},{"a":2,"n":"PlayFailSound","t":8,"sn":"PlayFailSound","rt":$n[1].Void},{"a":2,"n":"PlayHoleGrowSound","t":8,"sn":"PlayHoleGrowSound","rt":$n[1].Void},{"a":2,"n":"PlayIntroSound","t":8,"sn":"PlayIntroSound","rt":$n[1].Void},{"a":2,"n":"PlayShootSound","t":8,"sn":"PlayShootSound","rt":$n[1].Void},{"a":2,"n":"PlaySound","t":8,"pi":[{"n":"soundEffect","pt":SoundEffect,"ps":0},{"n":"volume","dv":1.0,"o":true,"pt":$n[1].Single,"ps":1},{"n":"pitch","dv":1.0,"o":true,"pt":$n[1].Single,"ps":2}],"sn":"PlaySound","rt":$n[1].Void,"p":[SoundEffect,$n[1].Single,$n[1].Single]},{"a":2,"n":"PlaySoundOneShot","t":8,"pi":[{"n":"soundEffect","pt":SoundEffect,"ps":0},{"n":"volume","dv":1.0,"o":true,"pt":$n[1].Single,"ps":1},{"n":"pitch","dv":1.0,"o":true,"pt":$n[1].Single,"ps":2}],"sn":"PlaySoundOneShot","rt":$n[1].Void,"p":[SoundEffect,$n[1].Single,$n[1].Single]},{"a":2,"n":"PlayTowerHitSound","t":8,"sn":"PlayTowerHitSound","rt":$n[1].Void},{"a":2,"n":"PlayWinSound","t":8,"sn":"PlayWinSound","rt":$n[1].Void},{"a":1,"n":"ReturnToPoolWhenFinished","t":8,"pi":[{"n":"source","pt":$n[0].AudioSource,"ps":0}],"sn":"ReturnToPoolWhenFinished","rt":$n[2].IEnumerator,"p":[$n[0].AudioSource]},{"a":2,"n":"SetMusicVolume","t":8,"pi":[{"n":"volume","pt":$n[1].Single,"ps":0}],"sn":"SetMusicVolume","rt":$n[1].Void,"p":[$n[1].Single]},{"a":2,"n":"SetSFXVolume","t":8,"pi":[{"n":"volume","pt":$n[1].Single,"ps":0}],"sn":"SetSFXVolume","rt":$n[1].Void,"p":[$n[1].Single]},{"a":2,"n":"SetUIVolume","t":8,"pi":[{"n":"volume","pt":$n[1].Single,"ps":0}],"sn":"SetUIVolume","rt":$n[1].Void,"p":[$n[1].Single]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"StopAllSounds","t":8,"sn":"StopAllSounds","rt":$n[1].Void},{"a":1,"n":"UpdateVolumesFromSettings","t":8,"sn":"UpdateVolumesFromSettings","rt":$n[1].Void},{"a":1,"n":"PlayableSettings","t":16,"rt":PlayableSettings,"g":{"a":1,"n":"get_PlayableSettings","t":8,"rt":PlayableSettings,"fg":"PlayableSettings"},"fn":"PlayableSettings"},{"a":1,"n":"POOL_SIZE","is":true,"t":4,"rt":$n[1].Int32,"sn":"POOL_SIZE","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"activeAudioSources","t":4,"rt":$n[3].List$1(UnityEngine.AudioSource),"sn":"activeAudioSources"},{"a":1,"n":"audioSourcePool","t":4,"rt":$n[3].Queue$1(UnityEngine.AudioSource),"sn":"audioSourcePool"},{"a":2,"n":"instance","is":true,"t":4,"rt":AudioManager,"sn":"instance"},{"a":1,"n":"isMuted","t":4,"rt":$n[1].Boolean,"sn":"isMuted","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Audio Sources"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"musicSource","t":4,"rt":$n[0].AudioSource,"sn":"musicSource"},{"at":[new UnityEngine.HeaderAttribute("Settings"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"musicVolume","t":4,"rt":$n[1].Single,"sn":"musicVolume","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"sfxSource","t":4,"rt":$n[0].AudioSource,"sn":"sfxSource"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"sfxVolume","t":4,"rt":$n[1].Single,"sn":"sfxVolume","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"uiSource","t":4,"rt":$n[0].AudioSource,"sn":"uiSource"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"uiVolume","t":4,"rt":$n[1].Single,"sn":"uiVolume","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*AudioManager end.*/

    /*AudioManagerSetup start.*/
    $m("AudioManagerSetup", function () { return {"att":1056769,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"CreateAudioManager","t":8,"sn":"CreateAudioManager","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Create Audio Manager")],"a":2,"n":"CreateAudioManagerManually","t":8,"sn":"CreateAudioManagerManually","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"at":[new UnityEngine.HeaderAttribute("Audio Manager Setup"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"createAudioManagerOnStart","t":4,"rt":$n[1].Boolean,"sn":"createAudioManagerOnStart","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*AudioManagerSetup end.*/

    /*AxisOptions start.*/
    $m("AxisOptions", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Both","is":true,"t":4,"rt":AxisOptions,"sn":"Both","box":function ($v) { return Bridge.box($v, AxisOptions, System.Enum.toStringFn(AxisOptions));}},{"a":2,"n":"Horizontal","is":true,"t":4,"rt":AxisOptions,"sn":"Horizontal","box":function ($v) { return Bridge.box($v, AxisOptions, System.Enum.toStringFn(AxisOptions));}},{"a":2,"n":"Vertical","is":true,"t":4,"rt":AxisOptions,"sn":"Vertical","box":function ($v) { return Bridge.box($v, AxisOptions, System.Enum.toStringFn(AxisOptions));}}]}; }, $n);
    /*AxisOptions end.*/

    /*ColoredMaterial start.*/
    $m("ColoredMaterial", function () { return {"att":1056769,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"ColorField","t":4,"rt":$n[1].String,"sn":"ColorField"},{"a":2,"n":"DefaultColor","t":4,"rt":$n[0].Color,"sn":"DefaultColor"},{"a":2,"n":"Material","t":4,"rt":$n[0].Material,"sn":"Material"},{"a":2,"n":"MaterialHolder","t":4,"rt":MaterialHolder,"sn":"MaterialHolder","box":function ($v) { return Bridge.box($v, MaterialHolder, System.Enum.toStringFn(MaterialHolder));}},{"a":2,"n":"TextureField","t":4,"rt":$n[1].String,"sn":"TextureField"},{"a":2,"n":"Textures","t":4,"rt":System.Array.type(UnityEngine.Texture),"sn":"Textures"}]}; }, $n);
    /*ColoredMaterial end.*/

    /*CopyMainCameraFOV start.*/
    $m("CopyMainCameraFOV", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.ExecuteAlwaysAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"LateUpdate","t":8,"sn":"LateUpdate","rt":$n[1].Void},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"mainCamera","t":4,"rt":$n[0].Camera,"sn":"mainCamera"},{"a":1,"n":"uiCamera","t":4,"rt":$n[0].Camera,"sn":"uiCamera"}]}; }, $n);
    /*CopyMainCameraFOV end.*/

    /*DynamicJoystick start.*/
    $m("DynamicJoystick", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":3,"n":"HandleInput","t":8,"pi":[{"n":"magnitude","pt":$n[1].Single,"ps":0},{"n":"normalised","pt":$n[0].Vector2,"ps":1},{"n":"radius","pt":$n[0].Vector2,"ps":2},{"n":"cam","pt":$n[0].Camera,"ps":3}],"sn":"HandleInput","rt":$n[1].Void,"p":[$n[1].Single,$n[0].Vector2,$n[0].Vector2,$n[0].Camera]},{"ov":true,"a":2,"n":"OnPointerDown","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnPointerDown","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"ov":true,"a":2,"n":"OnPointerUp","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnPointerUp","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"ov":true,"a":3,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"MoveThreshold","t":16,"rt":$n[1].Single,"g":{"a":2,"n":"get_MoveThreshold","t":8,"rt":$n[1].Single,"fg":"MoveThreshold","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_MoveThreshold","t":8,"p":[$n[1].Single],"rt":$n[1].Void,"fs":"MoveThreshold"},"fn":"MoveThreshold"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"moveThreshold","t":4,"rt":$n[1].Single,"sn":"moveThreshold","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*DynamicJoystick end.*/

    /*FixedJoystick start.*/
    $m("FixedJoystick", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"}]}; }, $n);
    /*FixedJoystick end.*/

    /*FloatingFeedback start.*/
    $m("FloatingFeedback", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Show","t":8,"pi":[{"n":"worldPos","pt":$n[0].Vector3,"ps":0}],"sn":"Show","rt":$n[1].Void,"p":[$n[0].Vector3]},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"pool","t":4,"rt":$n[3].List$1(FloatingText),"sn":"pool"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"poolSize","t":4,"rt":$n[1].Int32,"sn":"poolSize","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"prefab","t":4,"rt":$n[0].GameObject,"sn":"prefab"}]}; }, $n);
    /*FloatingFeedback end.*/

    /*FloatingJoystick start.*/
    $m("FloatingJoystick", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":2,"n":"OnPointerDown","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnPointerDown","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"ov":true,"a":2,"n":"OnPointerUp","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnPointerUp","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"ov":true,"a":3,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void}]}; }, $n);
    /*FloatingJoystick end.*/

    /*FloatingText start.*/
    $m("FloatingText", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":2,"n":"Show","t":8,"pi":[{"n":"worldPos","pt":$n[0].Vector3,"ps":0}],"sn":"Show","rt":$n[1].Void,"p":[$n[0].Vector3]},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"active","t":4,"rt":$n[1].Boolean,"sn":"active","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"cg","t":4,"rt":$n[0].CanvasGroup,"sn":"cg"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"duration","t":4,"rt":$n[1].Single,"sn":"duration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"fadeCurve","t":4,"rt":pc.AnimationCurve,"sn":"fadeCurve"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"moveCurve","t":4,"rt":pc.AnimationCurve,"sn":"moveCurve"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"moveSpeed","t":4,"rt":$n[1].Single,"sn":"moveSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"text","t":4,"rt":$n[5].TextMeshProUGUI,"sn":"text"},{"a":1,"n":"timer","t":4,"rt":$n[1].Single,"sn":"timer","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*FloatingText end.*/

    /*FontSetterLuna start.*/
    $m("FontSetterLuna", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"textReference","t":4,"rt":$n[6].Text,"sn":"textReference"}]}; }, $n);
    /*FontSetterLuna end.*/

    /*GameManager start.*/
    $m("GameManager", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"AreAllThrowablesInactive","t":8,"sn":"AreAllThrowablesInactive","rt":$n[1].Boolean,"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"AutoRedirectAfterDelay","t":8,"pi":[{"n":"delay","pt":$n[1].Single,"ps":0}],"sn":"AutoRedirectAfterDelay","rt":$n[2].IEnumerator,"p":[$n[1].Single]},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"CheckTowerShootingConditions","t":8,"sn":"CheckTowerShootingConditions","rt":$n[1].Void},{"a":2,"n":"GameOver","t":8,"pi":[{"n":"isWin","pt":$n[1].Boolean,"ps":0}],"sn":"GameOver","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"GameOverCoroutine","t":8,"pi":[{"n":"isWin","pt":$n[1].Boolean,"ps":0}],"sn":"GameOverCoroutine","rt":$n[2].IEnumerator,"p":[$n[1].Boolean]},{"a":1,"n":"LoadLevel","t":8,"pi":[{"n":"level","pt":$n[1].Int32,"ps":0}],"sn":"LoadLevel","rt":$n[1].Void,"p":[$n[1].Int32]},{"a":2,"n":"OnBottomBannerClick","t":8,"sn":"OnBottomBannerClick","rt":$n[1].Void},{"a":2,"n":"OnButtonClick","t":8,"sn":"OnButtonClick","rt":$n[1].Void},{"a":1,"n":"OnIntroCompleted","t":8,"sn":"OnIntroCompleted","rt":$n[1].Void},{"a":2,"n":"OnPlayerShot","t":8,"sn":"OnPlayerShot","rt":$n[1].Void},{"a":2,"n":"OnTowerHit","t":8,"sn":"OnTowerHit","rt":$n[1].Void},{"a":1,"n":"SetupThrowableObjects","t":8,"sn":"SetupThrowableObjects","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"UpdateTimer","t":8,"sn":"UpdateTimer","rt":$n[2].IEnumerator},{"a":1,"n":"PlayableSettings","t":16,"rt":PlayableSettings,"g":{"a":1,"n":"get_PlayableSettings","t":8,"rt":PlayableSettings,"fg":"PlayableSettings"},"fn":"PlayableSettings"},{"a":1,"n":"_maxObjectiveAmount","t":4,"rt":$n[1].Int32,"sn":"_maxObjectiveAmount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_shotTime","t":4,"rt":$n[1].Single,"sn":"_shotTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"currentObjectiveAmount","t":4,"rt":$n[1].Int32,"sn":"currentObjectiveAmount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"currentTime","t":4,"rt":$n[1].Single,"sn":"currentTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"flower","t":4,"rt":$n[0].GameObject,"sn":"flower"},{"a":2,"n":"gravity","t":4,"rt":$n[1].Single,"sn":"gravity","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"hasShot","t":4,"rt":$n[1].Boolean,"sn":"hasShot","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"instance","is":true,"t":4,"rt":GameManager,"sn":"instance"},{"a":2,"n":"isGameOver","t":4,"rt":$n[1].Boolean,"sn":"isGameOver","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"levelContainer","t":4,"rt":$n[0].Transform,"sn":"levelContainer"},{"a":2,"n":"levels","t":4,"rt":System.Array.type(UnityEngine.GameObject),"sn":"levels"},{"a":2,"n":"pumpkinsParent","t":4,"rt":$n[0].GameObject,"sn":"pumpkinsParent"},{"a":2,"n":"towerHit","t":4,"rt":$n[1].Boolean,"sn":"towerHit","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"towerMissed","t":4,"rt":$n[1].Boolean,"sn":"towerMissed","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Throwable")],"a":2,"n":"useThrowableSystem","t":4,"rt":$n[1].Boolean,"sn":"useThrowableSystem","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"watermelonsParent","t":4,"rt":$n[0].GameObject,"sn":"watermelonsParent"},{"a":2,"n":"OnGameOver","is":true,"t":2,"ad":{"a":2,"n":"add_OnGameOver","is":true,"t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"addOnGameOver","rt":$n[1].Void,"p":[Function]},"r":{"a":2,"n":"remove_OnGameOver","is":true,"t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"removeOnGameOver","rt":$n[1].Void,"p":[Function]}}]}; }, $n);
    /*GameManager end.*/

    /*HandCursor start.*/
    $m("HandCursor", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"SetForceHidden","t":8,"pi":[{"n":"hidden","pt":$n[1].Boolean,"ps":0}],"sn":"SetForceHidden","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"_forceHidden","t":4,"rt":$n[1].Boolean,"sn":"_forceHidden","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"cursorImage","t":4,"rt":$n[6].Image,"sn":"cursorImage"}]}; }, $n);
    /*HandCursor end.*/

    /*HandCursorSkin start.*/
    $m("HandCursorSkin", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"CartoonHand","is":true,"t":4,"rt":HandCursorSkin,"sn":"CartoonHand","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Default","is":true,"t":4,"rt":HandCursorSkin,"sn":"Default","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Realistic_Female_White_1","is":true,"t":4,"rt":HandCursorSkin,"sn":"Realistic_Female_White_1","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Realistic_Tan_1","is":true,"t":4,"rt":HandCursorSkin,"sn":"Realistic_Tan_1","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Realistic_White_1","is":true,"t":4,"rt":HandCursorSkin,"sn":"Realistic_White_1","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"a":2,"n":"Realistic_White_2","is":true,"t":4,"rt":HandCursorSkin,"sn":"Realistic_White_2","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}}]}; }, $n);
    /*HandCursorSkin end.*/

    /*HoleController start.*/
    $m("HoleController", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"CountRemainingTopItems","t":8,"sn":"CountRemainingTopItems","rt":$n[1].Int32,"box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"FixedUpdate","t":8,"sn":"FixedUpdate","rt":$n[1].Void},{"a":1,"n":"FlagSupportsAboveHole","t":8,"sn":"FlagSupportsAboveHole","rt":$n[1].Void},{"a":1,"n":"Grow","t":8,"sn":"Grow","rt":$n[1].Void},{"a":1,"n":"IsCollectible","t":8,"pi":[{"n":"other","pt":$n[0].GameObject,"ps":0}],"sn":"IsCollectible","rt":$n[1].Boolean,"p":[$n[0].GameObject],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"OnDestroy","t":8,"sn":"OnDestroy","rt":$n[1].Void},{"a":1,"n":"OnTriggerEnter","t":8,"pi":[{"n":"other","pt":$n[0].Collider,"ps":0}],"sn":"OnTriggerEnter","rt":$n[1].Void,"p":[$n[0].Collider]},{"a":1,"n":"OnTriggerExit","t":8,"pi":[{"n":"other","pt":$n[0].Collider,"ps":0}],"sn":"OnTriggerExit","rt":$n[1].Void,"p":[$n[0].Collider]},{"a":1,"n":"PickUpThrowable","t":8,"pi":[{"n":"ti","pt":ThrowableItem,"ps":0}],"sn":"PickUpThrowable","rt":$n[1].Void,"p":[ThrowableItem]},{"a":1,"n":"ReleaseNeighbors","t":8,"pi":[{"n":"fromPosition","pt":$n[0].Vector3,"ps":0}],"sn":"ReleaseNeighbors","rt":$n[1].Void,"p":[$n[0].Vector3]},{"a":2,"n":"ResetThrowableState","t":8,"sn":"ResetThrowableState","rt":$n[1].Void},{"a":1,"n":"ScaleOverTime","t":8,"sn":"ScaleOverTime","rt":$n[2].IEnumerator},{"a":1,"n":"SetIndicatorColor","t":8,"pi":[{"n":"color","pt":$n[0].Color,"ps":0}],"sn":"SetIndicatorColor","rt":$n[1].Void,"p":[$n[0].Color]},{"a":1,"n":"SetIndicatorVisible","t":8,"pi":[{"n":"visible","pt":$n[1].Boolean,"ps":0}],"sn":"SetIndicatorVisible","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":2,"n":"SetInputEnabled","t":8,"pi":[{"n":"enabled","pt":$n[1].Boolean,"ps":0}],"sn":"SetInputEnabled","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"StartFakeMovement","t":8,"sn":"StartFakeMovement","rt":$n[1].Void},{"a":1,"n":"SwallowVictim","t":8,"pi":[{"n":"victimRb","pt":$n[0].Rigidbody,"ps":0}],"sn":"SwallowVictim","rt":$n[1].Void,"p":[$n[0].Rigidbody]},{"a":2,"n":"Throw","t":8,"sn":"Throw","rt":$n[1].Void},{"a":1,"n":"ThrowHeld","t":8,"pi":[{"n":"dir","pt":$n[0].Vector3,"ps":0}],"sn":"ThrowHeld","rt":$n[1].Void,"p":[$n[0].Vector3]},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"UpdateFakeMovement","t":8,"sn":"UpdateFakeMovement","rt":$n[1].Void},{"a":2,"n":"IsFakeMoving","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsFakeMoving","t":8,"rt":$n[1].Boolean,"fg":"IsFakeMoving","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsFakeMoving"},{"a":2,"n":"IsInputEnabled","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsInputEnabled","t":8,"rt":$n[1].Boolean,"fg":"IsInputEnabled","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsInputEnabled"},{"a":1,"n":"_fakeStartPosition","t":4,"rt":$n[0].Vector3,"sn":"_fakeStartPosition"},{"a":1,"n":"_fakeTargetPosition","t":4,"rt":$n[0].Vector3,"sn":"_fakeTargetPosition"},{"a":1,"n":"_growCounter","t":4,"rt":$n[1].Int32,"sn":"_growCounter","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_held","t":4,"rt":ThrowableItem,"sn":"_held"},{"a":1,"n":"_inputEnabled","t":4,"rt":$n[1].Boolean,"sn":"_inputEnabled","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_isFakeMoving","t":4,"rt":$n[1].Boolean,"sn":"_isFakeMoving","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_lastPhysicsCheck","t":4,"rt":$n[1].Single,"sn":"_lastPhysicsCheck","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_lastPos","t":4,"rt":$n[0].Vector3,"sn":"_lastPos"},{"a":1,"n":"_lastSupportFlag","t":4,"rt":$n[1].Single,"sn":"_lastSupportFlag","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_lastSupportPosition","t":4,"rt":$n[0].Vector3,"sn":"_lastSupportPosition"},{"a":1,"n":"_playerMovement","t":4,"rt":PlayerMovement,"sn":"_playerMovement"},{"a":1,"n":"_releaseBuffer","t":4,"rt":System.Array.type(UnityEngine.Collider),"sn":"_releaseBuffer"},{"a":1,"n":"_settings","t":4,"rt":PlayableSettings,"sn":"_settings"},{"a":1,"n":"_supportFlagBuffer","t":4,"rt":System.Array.type(UnityEngine.Collider),"sn":"_supportFlagBuffer"},{"a":1,"n":"_utils","t":4,"rt":Utils,"sn":"_utils"},{"a":1,"n":"_victimsBuffer","t":4,"rt":System.Array.type(UnityEngine.Collider),"sn":"_victimsBuffer"},{"at":[new UnityEngine.HeaderAttribute("Throwable")],"a":2,"n":"aimArrow","t":4,"rt":AimArrow,"sn":"aimArrow"},{"a":2,"n":"collectSFX","t":4,"rt":$n[0].AudioSource,"sn":"collectSFX"},{"a":2,"n":"detector","t":4,"rt":$n[0].SphereCollider,"sn":"detector"},{"a":2,"n":"evolveVFX","t":4,"rt":$n[0].ParticleSystem,"sn":"evolveVFX"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"floatingFeedback","t":4,"rt":FloatingFeedback,"sn":"floatingFeedback"},{"a":2,"n":"growThreshold","t":4,"rt":$n[1].Single,"sn":"growThreshold","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"growThresholdMultiplier","t":4,"rt":$n[1].Single,"sn":"growThresholdMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"indicatorRotationSpeed","t":4,"rt":$n[1].Single,"sn":"indicatorRotationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"maxReleasesPerEvent","t":4,"rt":$n[1].Int32,"sn":"maxReleasesPerEvent","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"moveSpeed","t":4,"rt":$n[1].Single,"sn":"moveSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Movement Indicator")],"a":2,"n":"movementIndicatorPivot","t":4,"rt":$n[0].Transform,"sn":"movementIndicatorPivot"},{"a":2,"n":"periscopeRenderer","t":4,"rt":$n[0].GameObject,"sn":"periscopeRenderer"},{"at":[new UnityEngine.HeaderAttribute("Physics Optimization")],"a":2,"n":"physicsCheckInterval","t":4,"rt":$n[1].Single,"sn":"physicsCheckInterval","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"releaseHeight","t":4,"rt":$n[1].Single,"sn":"releaseHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"releaseRadius","t":4,"rt":$n[1].Single,"sn":"releaseRadius","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Hole Grow")],"a":2,"n":"scaleDuration","t":4,"rt":$n[1].Single,"sn":"scaleDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"scaleMultiplier","t":4,"rt":$n[1].Single,"sn":"scaleMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"skinsParent","t":4,"rt":$n[0].Transform,"sn":"skinsParent"},{"at":[new UnityEngine.HeaderAttribute("Support Flagging")],"a":2,"n":"supportFlagHeight","t":4,"rt":$n[1].Single,"sn":"supportFlagHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"supportFlagInterval","t":4,"rt":$n[1].Single,"sn":"supportFlagInterval","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.RangeAttribute(0.1, 2.0)],"a":2,"n":"supportFlagRadiusMultiplier","t":4,"rt":$n[1].Single,"sn":"supportFlagRadiusMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"swallowPower","t":4,"rt":$n[1].Single,"sn":"swallowPower","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"triangleSpriteRenderer","t":4,"rt":$n[0].Renderer,"sn":"triangleSpriteRenderer"},{"at":[new UnityEngine.HeaderAttribute("Hole Collect")],"a":2,"n":"victimLayer","t":4,"rt":$n[0].LayerMask,"sn":"victimLayer"}]}; }, $n);
    /*HoleController end.*/

    /*HoleSkin start.*/
    $m("HoleSkin", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"GetSkinHoleTransform","t":16,"rt":$n[0].Transform,"g":{"a":2,"n":"get_GetSkinHoleTransform","t":8,"rt":$n[0].Transform,"fg":"GetSkinHoleTransform"},"fn":"GetSkinHoleTransform"},{"a":2,"n":"glowSprite","t":4,"rt":$n[0].SpriteRenderer,"sn":"glowSprite"},{"a":2,"n":"glowTransform","t":4,"rt":$n[0].Transform,"sn":"glowTransform"}]}; }, $n);
    /*HoleSkin end.*/

    /*IntroHoleAnimation start.*/
    $m("IntroHoleAnimation", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"AnimateCoroutine","t":8,"sn":"AnimateCoroutine","rt":$n[2].IEnumerator},{"a":2,"n":"Begin","t":8,"sn":"Begin","rt":$n[1].Void},{"a":1,"n":"FindActiveHoleSkin","t":8,"sn":"FindActiveHoleSkin","rt":$n[1].Void},{"a":1,"n":"GetCurveDuration","t":8,"sn":"GetCurveDuration","rt":$n[1].Single,"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"OnDestroy","t":8,"sn":"OnDestroy","rt":$n[1].Void},{"a":1,"n":"ResetValues","t":8,"sn":"ResetValues","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"StartIdleAnimation","t":8,"sn":"StartIdleAnimation","rt":$n[1].Void},{"a":2,"n":"StopIdleAnimation","t":8,"sn":"StopIdleAnimation","rt":$n[1].Void},{"a":1,"n":"_activeHoleSkin","t":4,"rt":HoleSkin,"sn":"_activeHoleSkin"},{"a":1,"n":"_animationCoroutine","t":4,"rt":$n[0].Coroutine,"sn":"_animationCoroutine"},{"a":1,"n":"_holeController","t":4,"rt":HoleController,"sn":"_holeController"},{"a":1,"n":"_isAnimating","t":4,"rt":$n[1].Boolean,"sn":"_isAnimating","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_originalGlowAlpha","t":4,"rt":$n[1].Single,"sn":"_originalGlowAlpha","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_originalGlowColor","t":4,"rt":$n[0].Color,"sn":"_originalGlowColor"},{"a":1,"n":"_originalGlowScale","t":4,"rt":$n[0].Vector3,"sn":"_originalGlowScale"},{"a":1,"n":"_originalHolderScale","t":4,"rt":$n[0].Vector3,"sn":"_originalHolderScale"},{"a":2,"n":"animationSpeed","t":4,"rt":$n[1].Single,"sn":"animationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Glow Animation")],"a":2,"n":"glowAlphaCurve","t":4,"rt":pc.AnimationCurve,"sn":"glowAlphaCurve"},{"a":2,"n":"glowScaleCurve","t":4,"rt":pc.AnimationCurve,"sn":"glowScaleCurve"},{"a":2,"n":"holderScaleCurve","t":4,"rt":pc.AnimationCurve,"sn":"holderScaleCurve"},{"at":[new UnityEngine.HeaderAttribute("Holder Animation")],"a":2,"n":"holderTransform","t":4,"rt":$n[0].Transform,"sn":"holderTransform"}]}; }, $n);
    /*IntroHoleAnimation end.*/

    /*IntroManager start.*/
    $m("IntroManager", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"BlockInputSequence","t":8,"sn":"BlockInputSequence","rt":$n[2].IEnumerator},{"a":1,"n":"CompleteIntro","t":8,"sn":"CompleteIntro","rt":$n[1].Void},{"a":2,"n":"ConfigureIntro","t":8,"pi":[{"n":"enable","pt":$n[1].Boolean,"ps":0},{"n":"duration","pt":$n[1].Single,"ps":1},{"n":"startAngle","pt":$n[0].Vector3,"ps":2},{"n":"endAngle","pt":$n[0].Vector3,"ps":3},{"n":"transitionDuration","pt":$n[1].Single,"ps":4}],"sn":"ConfigureIntro","rt":$n[1].Void,"p":[$n[1].Boolean,$n[1].Single,$n[0].Vector3,$n[0].Vector3,$n[1].Single]},{"a":2,"n":"ForceHideIntroText","t":8,"sn":"ForceHideIntroText","rt":$n[1].Void},{"a":1,"n":"HideIntroText","t":8,"sn":"HideIntroText","rt":$n[1].Void},{"a":1,"n":"IntroSequence","t":8,"sn":"IntroSequence","rt":$n[2].IEnumerator},{"a":1,"n":"SetPlayerInputEnabled","t":8,"pi":[{"n":"enabled","pt":$n[1].Boolean,"ps":0}],"sn":"SetPlayerInputEnabled","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":2,"n":"SkipIntro","t":8,"sn":"SkipIntro","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"StartIntro","t":8,"sn":"StartIntro","rt":$n[1].Void},{"a":1,"n":"StartIntroText","t":8,"sn":"StartIntroText","rt":$n[1].Void},{"a":1,"n":"TransitionCameraAndFOV","t":8,"sn":"TransitionCameraAndFOV","rt":$n[2].IEnumerator},{"a":1,"n":"TransitionCameraAngle","t":8,"sn":"TransitionCameraAngle","rt":$n[2].IEnumerator},{"a":1,"n":"TransitionFOV","t":8,"sn":"TransitionFOV","rt":$n[2].IEnumerator},{"a":1,"n":"WaitForDuration","t":8,"sn":"WaitForDuration","rt":$n[2].IEnumerator},{"a":1,"n":"WaitForTouch","t":8,"sn":"WaitForTouch","rt":$n[2].IEnumerator},{"a":1,"n":"WaitForTouchOrDuration","t":8,"sn":"WaitForTouchOrDuration","rt":$n[2].IEnumerator},{"a":2,"n":"IsIntroActive","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsIntroActive","t":8,"rt":$n[1].Boolean,"fg":"IsIntroActive","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsIntroActive"},{"a":2,"n":"IsIntroCompleted","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsIntroCompleted","t":8,"rt":$n[1].Boolean,"fg":"IsIntroCompleted","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsIntroCompleted"},{"a":2,"n":"IsIntroTextHidden","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsIntroTextHidden","t":8,"rt":$n[1].Boolean,"fg":"IsIntroTextHidden","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsIntroTextHidden"},{"a":2,"n":"IsIntroTextVisible","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_IsIntroTextVisible","t":8,"rt":$n[1].Boolean,"fg":"IsIntroTextVisible","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"fn":"IsIntroTextVisible"},{"a":1,"n":"PlayableSettings","t":16,"rt":PlayableSettings,"g":{"a":1,"n":"get_PlayableSettings","t":8,"rt":PlayableSettings,"fg":"PlayableSettings"},"fn":"PlayableSettings"},{"a":2,"n":"OnIntroCompleted","t":4,"rt":Function,"sn":"OnIntroCompleted"},{"a":2,"n":"OnIntroStarted","t":4,"rt":Function,"sn":"OnIntroStarted"},{"a":1,"n":"cameraOffset","t":4,"rt":CinemachineCameraOffset,"sn":"cameraOffset"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"cameraOffsetRef","t":4,"rt":CinemachineCameraOffset,"sn":"cameraOffsetRef"},{"at":[new UnityEngine.HeaderAttribute("Intro Settings"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"cameraTransitionCurve","t":4,"rt":pc.AnimationCurve,"sn":"cameraTransitionCurve"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"handCursorRef","t":4,"rt":HandCursor,"sn":"handCursorRef"},{"at":[new UnityEngine.HeaderAttribute("References"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"holeController","t":4,"rt":HoleController,"sn":"holeController"},{"a":2,"n":"instance","is":true,"t":4,"rt":IntroManager,"sn":"instance"},{"a":1,"n":"introCompleted","t":4,"rt":$n[1].Boolean,"sn":"introCompleted","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isIntroActive","t":4,"rt":$n[1].Boolean,"sn":"isIntroActive","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isIntroTextHidden","t":4,"rt":$n[1].Boolean,"sn":"isIntroTextHidden","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isIntroTextVisible","t":4,"rt":$n[1].Boolean,"sn":"isIntroTextVisible","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"playerCamera","t":4,"rt":$n[0].Transform,"sn":"playerCamera"},{"at":[new UnityEngine.HeaderAttribute("Camera References"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"playerCameraRef","t":4,"rt":$n[0].Transform,"sn":"playerCameraRef"},{"a":1,"n":"virtualCamera","t":4,"rt":$n[7].CinemachineVirtualCamera,"sn":"virtualCamera"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"virtualCameraRef","t":4,"rt":$n[7].CinemachineVirtualCamera,"sn":"virtualCameraRef"}]}; }, $n);
    /*IntroManager end.*/

    /*IntroManagerSetup start.*/
    $m("IntroManagerSetup", function () { return {"att":1056769,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"CreateIntroManager","t":8,"sn":"CreateIntroManager","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Create Intro Manager")],"a":2,"n":"CreateIntroManagerManually","t":8,"sn":"CreateIntroManagerManually","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"at":[new UnityEngine.HeaderAttribute("Intro Manager Setup"),new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"createIntroManagerOnStart","t":4,"rt":$n[1].Boolean,"sn":"createIntroManagerOnStart","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*IntroManagerSetup end.*/

    /*ItemObjective start.*/
    $m("ItemObjective", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"itemCountText","t":4,"rt":$n[5].TextMeshProUGUI,"sn":"itemCountText"},{"a":2,"n":"itemImage","t":4,"rt":$n[6].Image,"sn":"itemImage"}]}; }, $n);
    /*ItemObjective end.*/

    /*Joystick start.*/
    $m("Joystick", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"FormatInput","t":8,"sn":"FormatInput","rt":$n[1].Void},{"v":true,"a":3,"n":"HandleInput","t":8,"pi":[{"n":"magnitude","pt":$n[1].Single,"ps":0},{"n":"normalised","pt":$n[0].Vector2,"ps":1},{"n":"radius","pt":$n[0].Vector2,"ps":2},{"n":"cam","pt":$n[0].Camera,"ps":3}],"sn":"HandleInput","rt":$n[1].Void,"p":[$n[1].Single,$n[0].Vector2,$n[0].Vector2,$n[0].Camera]},{"a":2,"n":"OnDrag","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnDrag","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"v":true,"a":2,"n":"OnPointerDown","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnPointerDown","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"v":true,"a":2,"n":"OnPointerUp","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnPointerUp","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"a":3,"n":"ScreenPointToAnchoredPosition","t":8,"pi":[{"n":"screenPosition","pt":$n[0].Vector2,"ps":0}],"sn":"ScreenPointToAnchoredPosition","rt":$n[0].Vector2,"p":[$n[0].Vector2]},{"a":1,"n":"SnapFloat","t":8,"pi":[{"n":"value","pt":$n[1].Single,"ps":0},{"n":"snapAxis","pt":AxisOptions,"ps":1}],"sn":"SnapFloat","rt":$n[1].Single,"p":[$n[1].Single,AxisOptions],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"v":true,"a":3,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"AxisOptions","t":16,"rt":AxisOptions,"g":{"a":2,"n":"get_AxisOptions","t":8,"rt":AxisOptions,"fg":"AxisOptions","box":function ($v) { return Bridge.box($v, AxisOptions, System.Enum.toStringFn(AxisOptions));}},"s":{"a":2,"n":"set_AxisOptions","t":8,"p":[AxisOptions],"rt":$n[1].Void,"fs":"AxisOptions"},"fn":"AxisOptions"},{"a":2,"n":"DeadZone","t":16,"rt":$n[1].Single,"g":{"a":2,"n":"get_DeadZone","t":8,"rt":$n[1].Single,"fg":"DeadZone","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_DeadZone","t":8,"p":[$n[1].Single],"rt":$n[1].Void,"fs":"DeadZone"},"fn":"DeadZone"},{"a":2,"n":"Direction","t":16,"rt":$n[0].Vector2,"g":{"a":2,"n":"get_Direction","t":8,"rt":$n[0].Vector2,"fg":"Direction"},"fn":"Direction"},{"a":2,"n":"HandleRange","t":16,"rt":$n[1].Single,"g":{"a":2,"n":"get_HandleRange","t":8,"rt":$n[1].Single,"fg":"HandleRange","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_HandleRange","t":8,"p":[$n[1].Single],"rt":$n[1].Void,"fs":"HandleRange"},"fn":"HandleRange"},{"a":2,"n":"Horizontal","t":16,"rt":$n[1].Single,"g":{"a":2,"n":"get_Horizontal","t":8,"rt":$n[1].Single,"fg":"Horizontal","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"fn":"Horizontal"},{"a":2,"n":"SnapX","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_SnapX","t":8,"rt":$n[1].Boolean,"fg":"SnapX","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"s":{"a":2,"n":"set_SnapX","t":8,"p":[$n[1].Boolean],"rt":$n[1].Void,"fs":"SnapX"},"fn":"SnapX"},{"a":2,"n":"SnapY","t":16,"rt":$n[1].Boolean,"g":{"a":2,"n":"get_SnapY","t":8,"rt":$n[1].Boolean,"fg":"SnapY","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},"s":{"a":2,"n":"set_SnapY","t":8,"p":[$n[1].Boolean],"rt":$n[1].Void,"fs":"SnapY"},"fn":"SnapY"},{"a":2,"n":"Vertical","t":16,"rt":$n[1].Single,"g":{"a":2,"n":"get_Vertical","t":8,"rt":$n[1].Single,"fg":"Vertical","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"fn":"Vertical"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"axisOptions","t":4,"rt":AxisOptions,"sn":"axisOptions","box":function ($v) { return Bridge.box($v, AxisOptions, System.Enum.toStringFn(AxisOptions));}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":3,"n":"background","t":4,"rt":$n[0].RectTransform,"sn":"background"},{"a":1,"n":"baseRect","t":4,"rt":$n[0].RectTransform,"sn":"baseRect"},{"a":1,"n":"cam","t":4,"rt":$n[0].Camera,"sn":"cam"},{"a":1,"n":"canvas","t":4,"rt":$n[0].Canvas,"sn":"canvas"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"deadZone","t":4,"rt":$n[1].Single,"sn":"deadZone","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"handleRange","t":4,"rt":$n[1].Single,"sn":"handleRange","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"input","t":4,"rt":$n[0].Vector2,"sn":"input"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"joystickHandle","t":4,"rt":$n[0].RectTransform,"sn":"joystickHandle"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"snapX","t":4,"rt":$n[1].Boolean,"sn":"snapX","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"snapY","t":4,"rt":$n[1].Boolean,"sn":"snapY","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*Joystick end.*/

    /*JoystickType start.*/
    $m("JoystickType", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Dynamic","is":true,"t":4,"rt":JoystickType,"sn":"Dynamic","box":function ($v) { return Bridge.box($v, JoystickType, System.Enum.toStringFn(JoystickType));}},{"a":2,"n":"Fixed","is":true,"t":4,"rt":JoystickType,"sn":"Fixed","box":function ($v) { return Bridge.box($v, JoystickType, System.Enum.toStringFn(JoystickType));}},{"a":2,"n":"Floating","is":true,"t":4,"rt":JoystickType,"sn":"Floating","box":function ($v) { return Bridge.box($v, JoystickType, System.Enum.toStringFn(JoystickType));}}]}; }, $n);
    /*JoystickType end.*/

    /*LandscapePadding start.*/
    $m("LandscapePadding", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Apply","t":8,"sn":"Apply","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"lastH","t":4,"rt":$n[1].Int32,"sn":"lastH","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"lastLandscape","t":4,"rt":$n[1].Boolean,"sn":"lastLandscape","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"lastW","t":4,"rt":$n[1].Int32,"sn":"lastW","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"moveLeft","t":4,"rt":$n[1].Boolean,"sn":"moveLeft","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"percent","t":4,"rt":$n[1].Single,"sn":"percent","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"target","t":4,"rt":$n[0].RectTransform,"sn":"target"}]}; }, $n);
    /*LandscapePadding end.*/

    /*LandscapePaddingAnchor start.*/
    $m("LandscapePaddingAnchor", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Apply","t":8,"pi":[{"n":"force","pt":$n[1].Boolean,"ps":0}],"sn":"Apply","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"StoreOriginalAnchors","t":8,"sn":"StoreOriginalAnchors","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"lastH","t":4,"rt":$n[1].Int32,"sn":"lastH","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"lastLandscape","t":4,"rt":$n[1].Boolean,"sn":"lastLandscape","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"lastW","t":4,"rt":$n[1].Int32,"sn":"lastW","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"moveLeft","t":4,"rt":$n[1].Boolean,"sn":"moveLeft","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"originalMaxX","t":4,"rt":$n[1].Single,"sn":"originalMaxX","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"originalMinX","t":4,"rt":$n[1].Single,"sn":"originalMinX","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"originalStored","t":4,"rt":$n[1].Boolean,"sn":"originalStored","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"percent","t":4,"rt":$n[1].Single,"sn":"percent","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"target","t":4,"rt":$n[0].RectTransform,"sn":"target"}]}; }, $n);
    /*LandscapePaddingAnchor end.*/

    /*Level start.*/
    $m("Level", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"DelayedObjectivesInit","t":8,"sn":"DelayedObjectivesInit","rt":$n[2].IEnumerator},{"at":[new UnityEngine.ContextMenu.ctor("Auto-Find Theme Groups")],"a":1,"n":"FindThemeGroups","t":8,"sn":"FindThemeGroups","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Auto-Find Wood Towers")],"a":1,"n":"FindWoodTowers","t":8,"sn":"FindWoodTowers","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Refresh Theme Groups")],"a":1,"n":"ShowOnlyMatchingGroups","t":8,"sn":"ShowOnlyMatchingGroups","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"at":[new UnityEngine.TooltipAttribute("Registered Theme Display Groups. Use context menu to auto-populate.")],"a":2,"n":"themeGroups","t":4,"rt":$n[3].List$1(UnityEngine.GameObject),"sn":"themeGroups"},{"at":[new UnityEngine.TooltipAttribute("Wood Towers in this level. Use context menu to auto-populate.")],"a":2,"n":"woodTowers","t":4,"rt":$n[3].List$1(WoodTower),"sn":"woodTowers"}]}; }, $n);
    /*Level end.*/

    /*MaterialHolder start.*/
    $m("MaterialHolder", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Ground","is":true,"t":4,"rt":MaterialHolder,"sn":"Ground","box":function ($v) { return Bridge.box($v, MaterialHolder, System.Enum.toStringFn(MaterialHolder));}},{"a":2,"n":"Hole","is":true,"t":4,"rt":MaterialHolder,"sn":"Hole","box":function ($v) { return Bridge.box($v, MaterialHolder, System.Enum.toStringFn(MaterialHolder));}}]}; }, $n);
    /*MaterialHolder end.*/

    /*MovementIndicatorType start.*/
    $m("MovementIndicatorType", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Periscope","is":true,"t":4,"rt":MovementIndicatorType,"sn":"Periscope","box":function ($v) { return Bridge.box($v, MovementIndicatorType, System.Enum.toStringFn(MovementIndicatorType));}},{"a":2,"n":"Triangle","is":true,"t":4,"rt":MovementIndicatorType,"sn":"Triangle","box":function ($v) { return Bridge.box($v, MovementIndicatorType, System.Enum.toStringFn(MovementIndicatorType));}}]}; }, $n);
    /*MovementIndicatorType end.*/

    /*MovingMovement start.*/
    $m("MovingMovement", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"movingImage","t":4,"rt":$n[6].Image,"sn":"movingImage"}]}; }, $n);
    /*MovingMovement end.*/

    /*ObjectivePickupIcon start.*/
    $m("ObjectivePickupIcon", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.RequireComponent.$ctor1(UnityEngine.RectTransform, UnityEngine.UI.Image)],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"EvaluateCubicBezier","is":true,"t":8,"pi":[{"n":"a","pt":$n[0].Vector2,"ps":0},{"n":"b","pt":$n[0].Vector2,"ps":1},{"n":"c","pt":$n[0].Vector2,"ps":2},{"n":"d","pt":$n[0].Vector2,"ps":3},{"n":"t","pt":$n[1].Single,"ps":4}],"sn":"EvaluateCubicBezier","rt":$n[0].Vector2,"p":[$n[0].Vector2,$n[0].Vector2,$n[0].Vector2,$n[0].Vector2,$n[1].Single]},{"a":2,"n":"Play","t":8,"pi":[{"n":"sprite","pt":$n[0].Sprite,"ps":0},{"n":"start","pt":$n[0].Vector2,"ps":1},{"n":"controlA","pt":$n[0].Vector2,"ps":2},{"n":"controlB","pt":$n[0].Vector2,"ps":3},{"n":"endPoint","pt":$n[0].Vector2,"ps":4},{"n":"duration","pt":$n[1].Single,"ps":5},{"n":"startScale","pt":$n[1].Single,"ps":6},{"n":"endScale","pt":$n[1].Single,"ps":7},{"n":"onComplete","pt":Function,"ps":8}],"sn":"Play","rt":$n[1].Void,"p":[$n[0].Sprite,$n[0].Vector2,$n[0].Vector2,$n[0].Vector2,$n[0].Vector2,$n[1].Single,$n[1].Single,$n[1].Single,Function]},{"a":1,"n":"PlayRoutine","t":8,"pi":[{"n":"start","pt":$n[0].Vector2,"ps":0},{"n":"controlA","pt":$n[0].Vector2,"ps":1},{"n":"controlB","pt":$n[0].Vector2,"ps":2},{"n":"endPoint","pt":$n[0].Vector2,"ps":3},{"n":"duration","pt":$n[1].Single,"ps":4},{"n":"startScaleVec","pt":$n[0].Vector3,"ps":5},{"n":"endScaleVec","pt":$n[0].Vector3,"ps":6},{"n":"onComplete","pt":Function,"ps":7}],"sn":"PlayRoutine","rt":$n[2].IEnumerator,"p":[$n[0].Vector2,$n[0].Vector2,$n[0].Vector2,$n[0].Vector2,$n[1].Single,$n[0].Vector3,$n[0].Vector3,Function]},{"a":2,"n":"StopAndHide","t":8,"sn":"StopAndHide","rt":$n[1].Void},{"a":1,"n":"_playRoutine","t":4,"rt":$n[0].Coroutine,"sn":"_playRoutine"},{"a":2,"n":"iconImage","t":4,"rt":$n[6].Image,"sn":"iconImage"},{"a":2,"n":"rectTransform","t":4,"rt":$n[0].RectTransform,"sn":"rectTransform"}]}; }, $n);
    /*ObjectivePickupIcon end.*/

    /*ObjectivesTuto start.*/
    $m("ObjectivesTuto", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ApplySettingsFromPlayable","t":8,"sn":"ApplySettingsFromPlayable","rt":$n[1].Void},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"OnEnable","t":8,"sn":"OnEnable","rt":$n[1].Void},{"a":1,"n":"RefreshBounds","t":8,"sn":"RefreshBounds","rt":$n[1].Void},{"a":1,"n":"ShouldStartFadeOnTouch","t":8,"sn":"ShouldStartFadeOnTouch","rt":$n[1].Boolean,"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"BoundsRefreshInterval","is":true,"t":4,"rt":$n[1].Single,"sn":"BoundsRefreshInterval","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_cycleStartTime","t":4,"rt":$n[1].Single,"sn":"_cycleStartTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_fadeStartTime","t":4,"rt":$n[1].Single,"sn":"_fadeStartTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_fading","t":4,"rt":$n[1].Boolean,"sn":"_fading","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_hasBounds","t":4,"rt":$n[1].Boolean,"sn":"_hasBounds","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_hasFaded","t":4,"rt":$n[1].Boolean,"sn":"_hasFaded","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_lastBoundsUpdate","t":4,"rt":$n[1].Single,"sn":"_lastBoundsUpdate","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_maxX","t":4,"rt":$n[1].Single,"sn":"_maxX","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_minX","t":4,"rt":$n[1].Single,"sn":"_minX","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_moverBaseAnchoredPos","t":4,"rt":$n[0].Vector2,"sn":"_moverBaseAnchoredPos"},{"a":1,"n":"_moverBaseScale","t":4,"rt":$n[0].Vector3,"sn":"_moverBaseScale"},{"at":[new UnityEngine.HeaderAttribute("Bob & Scale (optional)")],"a":2,"n":"bobAmplitude","t":4,"rt":$n[1].Single,"sn":"bobAmplitude","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"bobFrequency","t":4,"rt":$n[1].Single,"sn":"bobFrequency","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Motion Settings")],"a":2,"n":"boundsPadding","t":4,"rt":$n[1].Single,"sn":"boundsPadding","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"canvasGroup","t":4,"rt":$n[0].CanvasGroup,"sn":"canvasGroup"},{"a":2,"n":"endPause","t":4,"rt":$n[1].Single,"sn":"endPause","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Fade Settings")],"a":2,"n":"fadeOutDuration","t":4,"rt":$n[1].Single,"sn":"fadeOutDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"glowBaseAlpha","t":4,"rt":$n[1].Single,"sn":"glowBaseAlpha","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Glow Settings")],"a":2,"n":"glowCurve","t":4,"rt":pc.AnimationCurve,"sn":"glowCurve"},{"a":2,"n":"glowImage","t":4,"rt":$n[6].Image,"sn":"glowImage"},{"a":2,"n":"glowMaxAlpha","t":4,"rt":$n[1].Single,"sn":"glowMaxAlpha","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"glowPeriod","t":4,"rt":$n[1].Single,"sn":"glowPeriod","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"legDuration","t":4,"rt":$n[1].Single,"sn":"legDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"motionCurve","t":4,"rt":pc.AnimationCurve,"sn":"motionCurve"},{"a":2,"n":"mover","t":4,"rt":$n[0].RectTransform,"sn":"mover"},{"at":[new UnityEngine.HeaderAttribute("References")],"a":2,"n":"objectivesSystem","t":4,"rt":ObjectivesUISystem,"sn":"objectivesSystem"},{"a":2,"n":"scaleFrequency","t":4,"rt":$n[1].Single,"sn":"scaleFrequency","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"scalePulse","t":4,"rt":$n[1].Single,"sn":"scalePulse","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*ObjectivesTuto end.*/

    /*ObjectivesUISystem start.*/
    $m("ObjectivesUISystem", function () { return {"nested":[ObjectivesUISystem.RuntimeObjective,ObjectivesUISystem.ObjectiveKey],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"BounceRoutine","t":8,"pi":[{"n":"rect","pt":$n[0].RectTransform,"ps":0}],"sn":"BounceRoutine","rt":$n[2].IEnumerator,"p":[$n[0].RectTransform]},{"a":1,"n":"BuildObjectiveLookup","t":8,"sn":"BuildObjectiveLookup","rt":$n[1].Void},{"a":1,"n":"ClearActivePickupIcons","t":8,"sn":"ClearActivePickupIcons","rt":$n[1].Void},{"a":1,"n":"FindRuntimeObjective","t":8,"pi":[{"n":"icon","pt":$n[0].Sprite,"ps":0},{"n":"isTopItem","pt":$n[1].Boolean,"ps":1}],"sn":"FindRuntimeObjective","rt":ObjectivesUISystem.RuntimeObjective,"p":[$n[0].Sprite,$n[1].Boolean]},{"a":1,"n":"GetPickupIconInstance","t":8,"sn":"GetPickupIconInstance","rt":ObjectivePickupIcon},{"a":2,"n":"HandleSupportSwallowed","t":8,"pi":[{"n":"support","pt":SupportActivator,"ps":0},{"n":"holeWorldPos","pt":$n[0].Vector3,"ps":1}],"sn":"HandleSupportSwallowed","rt":$n[1].Void,"p":[SupportActivator,$n[0].Vector3]},{"a":2,"n":"InitializeFromScene","t":8,"pi":[{"n":"woodTowers","dv":null,"o":true,"pt":$n[3].List$1(WoodTower),"ps":0}],"sn":"InitializeFromScene","rt":$n[1].Void,"p":[$n[3].List$1(WoodTower)]},{"a":1,"n":"OnDisable","t":8,"sn":"OnDisable","rt":$n[1].Void},{"a":1,"n":"OnEnable","t":8,"sn":"OnEnable","rt":$n[1].Void},{"a":1,"n":"RefreshBackground","t":8,"sn":"RefreshBackground","rt":$n[1].Void},{"a":1,"n":"ReleasePickupIcon","t":8,"pi":[{"n":"icon","pt":ObjectivePickupIcon,"ps":0}],"sn":"ReleasePickupIcon","rt":$n[1].Void,"p":[ObjectivePickupIcon]},{"a":1,"n":"StartOrRestartLoop","t":8,"sn":"StartOrRestartLoop","rt":$n[1].Void},{"a":1,"n":"TriggerCardBounce","t":8,"pi":[{"n":"runtime","pt":ObjectivesUISystem.RuntimeObjective,"ps":0}],"sn":"TriggerCardBounce","rt":$n[1].Void,"p":[ObjectivesUISystem.RuntimeObjective]},{"a":1,"n":"TryGetCardPosition","t":8,"pi":[{"n":"runtime","pt":ObjectivesUISystem.RuntimeObjective,"ps":0},{"n":"localPoint","out":true,"pt":$n[0].Vector2,"ps":1}],"sn":"TryGetCardPosition","rt":$n[1].Boolean,"p":[ObjectivesUISystem.RuntimeObjective,$n[0].Vector2],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"TryGetWorldToContainerPosition","t":8,"pi":[{"n":"worldPos","pt":$n[0].Vector3,"ps":0},{"n":"localPoint","out":true,"pt":$n[0].Vector2,"ps":1}],"sn":"TryGetWorldToContainerPosition","rt":$n[1].Boolean,"p":[$n[0].Vector3,$n[0].Vector2],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"UpdateCounts","t":8,"sn":"UpdateCounts","rt":$n[1].Void},{"a":1,"n":"UpdateLoop","t":8,"sn":"UpdateLoop","rt":$n[2].IEnumerator},{"a":1,"n":"WarmupPickupPool","t":8,"sn":"WarmupPickupPool","rt":$n[1].Void},{"a":1,"n":"CardBounceDuration","is":true,"t":4,"rt":$n[1].Single,"sn":"CardBounceDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"CardBounceScale","is":true,"t":4,"rt":$n[1].Single,"sn":"CardBounceScale","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"ControlOffsetMax","is":true,"t":4,"rt":$n[1].Single,"sn":"ControlOffsetMax","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"ControlOffsetMin","is":true,"t":4,"rt":$n[1].Single,"sn":"ControlOffsetMin","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"PickupIconEndScale","is":true,"t":4,"rt":$n[1].Single,"sn":"PickupIconEndScale","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"PickupIconStartScale","is":true,"t":4,"rt":$n[1].Single,"sn":"PickupIconStartScale","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_activePickupIcons","t":4,"rt":$n[3].List$1(ObjectivePickupIcon),"sn":"_activePickupIcons","ro":true},{"a":1,"n":"_canvas","t":4,"rt":$n[0].Canvas,"sn":"_canvas"},{"a":1,"n":"_cardBounceRoutines","t":4,"rt":$n[3].Dictionary$2(UnityEngine.RectTransform,UnityEngine.Coroutine),"sn":"_cardBounceRoutines","ro":true},{"a":1,"n":"_objectiveLookup","t":4,"rt":$n[3].Dictionary$2(ObjectivesUISystem.ObjectiveKey,ObjectivesUISystem.RuntimeObjective),"sn":"_objectiveLookup","ro":true},{"a":1,"n":"_pickupContainerRect","t":4,"rt":$n[0].RectTransform,"sn":"_pickupContainerRect"},{"a":1,"n":"_pickupPool","t":4,"rt":$n[3].List$1(ObjectivePickupIcon),"sn":"_pickupPool","ro":true},{"a":1,"n":"_runtimeObjectives","t":4,"rt":$n[3].List$1(ObjectivesUISystem.RuntimeObjective),"sn":"_runtimeObjectives","ro":true},{"a":1,"n":"_uiCamera","t":4,"rt":$n[0].Camera,"sn":"_uiCamera"},{"a":1,"n":"_updateInterval","t":4,"rt":$n[1].Single,"sn":"_updateInterval","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_updateRoutine","t":4,"rt":$n[0].Coroutine,"sn":"_updateRoutine"},{"a":1,"n":"_worldCamera","t":4,"rt":$n[0].Camera,"sn":"_worldCamera"},{"a":2,"n":"backgroundRect","t":4,"rt":$n[0].RectTransform,"sn":"backgroundRect"},{"at":[new UnityEngine.HeaderAttribute("Pickup Feedback")],"a":2,"n":"enablePickupFlight","t":4,"rt":$n[1].Boolean,"sn":"enablePickupFlight","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"initialPickupIconPool","t":4,"rt":$n[1].Int32,"sn":"initialPickupIconPool","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"itemObjectivePool","t":4,"rt":System.Array.type(ItemObjective),"sn":"itemObjectivePool"},{"a":2,"n":"pickupFlightDuration","t":4,"rt":$n[1].Single,"sn":"pickupFlightDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"pickupIconContainer","t":4,"rt":$n[0].RectTransform,"sn":"pickupIconContainer"},{"a":2,"n":"pickupIconPrefab","t":4,"rt":ObjectivePickupIcon,"sn":"pickupIconPrefab"},{"a":2,"n":"worldCamera","t":4,"rt":$n[0].Camera,"sn":"worldCamera"}]}; }, $n);
    /*ObjectivesUISystem end.*/

    /*ObjectivesUISystem+RuntimeObjective start.*/
    $m("ObjectivesUISystem.RuntimeObjective", function () { return {"td":ObjectivesUISystem,"att":1048579,"a":1,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"card","t":4,"rt":ItemObjective,"sn":"card"},{"a":2,"n":"cardRect","t":4,"rt":$n[0].RectTransform,"sn":"cardRect"},{"a":2,"n":"icon","t":4,"rt":$n[0].Sprite,"sn":"icon"},{"a":2,"n":"isTopItem","t":4,"rt":$n[1].Boolean,"sn":"isTopItem","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"lastCount","t":4,"rt":$n[1].Int32,"sn":"lastCount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"pendingVisualRemovals","t":4,"rt":$n[1].Int32,"sn":"pendingVisualRemovals","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"supports","t":4,"rt":$n[3].List$1(SupportActivator),"sn":"supports"}]}; }, $n);
    /*ObjectivesUISystem+RuntimeObjective end.*/

    /*ObjectivesUISystem+ObjectiveKey start.*/
    $m("ObjectivesUISystem.ObjectiveKey", function () { return {"td":ObjectivesUISystem,"att":1048843,"a":1,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":2,"n":"Equals","t":8,"pi":[{"n":"obj","pt":$n[1].Object,"ps":0}],"sn":"equals","rt":$n[1].Boolean,"p":[$n[1].Object],"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"ov":true,"a":2,"n":"GetHashCode","t":8,"sn":"getHashCode","rt":$n[1].Int32,"box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"icon","t":4,"rt":$n[0].Sprite,"sn":"icon"},{"a":2,"n":"isTopItem","t":4,"rt":$n[1].Boolean,"sn":"isTopItem","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*ObjectivesUISystem+ObjectiveKey end.*/

    /*PhysicsObjectPool start.*/
    $m("PhysicsObjectPool", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"ClearPools","is":true,"t":8,"sn":"ClearPools","rt":$n[1].Void},{"a":2,"n":"GetColliders","is":true,"t":8,"pi":[{"n":"size","pt":$n[1].Int32,"ps":0}],"sn":"GetColliders","rt":System.Array.type(UnityEngine.Collider),"p":[$n[1].Int32]},{"a":2,"n":"GetRaycastHits","is":true,"t":8,"pi":[{"n":"size","pt":$n[1].Int32,"ps":0}],"sn":"GetRaycastHits","rt":System.Array.type(UnityEngine.RaycastHit),"p":[$n[1].Int32]},{"a":2,"n":"ReturnColliders","is":true,"t":8,"pi":[{"n":"array","pt":System.Array.type(UnityEngine.Collider),"ps":0}],"sn":"ReturnColliders","rt":$n[1].Void,"p":[System.Array.type(UnityEngine.Collider)]},{"a":2,"n":"ReturnRaycastHits","is":true,"t":8,"pi":[{"n":"array","pt":System.Array.type(UnityEngine.RaycastHit),"ps":0}],"sn":"ReturnRaycastHits","rt":$n[1].Void,"p":[System.Array.type(UnityEngine.RaycastHit)]},{"a":1,"n":"MAX_POOL_SIZE","is":true,"t":4,"rt":$n[1].Int32,"sn":"MAX_POOL_SIZE","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_colliderPools","is":true,"t":4,"rt":$n[3].Dictionary$2(System.Int32,System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.Collider))),"sn":"_colliderPools","ro":true},{"a":1,"n":"_raycastHitPools","is":true,"t":4,"rt":$n[3].Dictionary$2(System.Int32,System.Collections.Generic.Queue$1(System.Array.type(UnityEngine.RaycastHit))),"sn":"_raycastHitPools","ro":true}]}; }, $n);
    /*PhysicsObjectPool end.*/

    /*PlayableSettings start.*/
    $m("PlayableSettings", function () { return {"nested":[PlayableSettings.HoleSpeedIncreaseType,PlayableSettings.PlayerSkinIndex,PlayableSettings.LevelIndex],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ApplyArrowDirectionSettings","t":8,"sn":"ApplyArrowDirectionSettings","rt":$n[1].Void},{"a":1,"n":"ApplyLightSettings","t":8,"sn":"ApplyLightSettings","rt":$n[1].Void},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":2,"n":"CameraZoomOut","t":8,"pi":[{"n":"value","pt":$n[1].Single,"ps":0}],"sn":"CameraZoomOut","rt":$n[1].Void,"p":[$n[1].Single]},{"a":1,"n":"SetMaterials","t":8,"sn":"SetMaterials","rt":$n[1].Void},{"a":1,"n":"SmoothCameraZoomOut","t":8,"pi":[{"n":"value","pt":$n[1].Single,"ps":0}],"sn":"SmoothCameraZoomOut","rt":$n[2].IEnumerator,"p":[$n[1].Single]},{"at":[new UnityEngine.HeaderAttribute("Level Settings"),new UnityEngine.LunaPlaygroundFieldAttribute("Level", 0, "Level Settings", false, null)],"a":2,"n":"Level","t":4,"rt":PlayableSettings.LevelIndex,"sn":"Level","box":function ($v) { return Bridge.box($v, PlayableSettings.LevelIndex, System.Enum.toStringFn(PlayableSettings.LevelIndex));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Aim Arrow Color", 4, "Player Controls", false, null)],"a":2,"n":"aimArrowColor","t":4,"rt":$n[0].Color,"sn":"aimArrowColor"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Arrow Direction Color", 10, "Player Controls", false, null)],"a":2,"n":"arrowDirectionColor","t":4,"rt":$n[0].Color,"sn":"arrowDirectionColor"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Arrow Direction Model", 14, "Player Controls", false, null)],"a":2,"n":"arrowDirectionModel","t":4,"rt":ArrowDirection.ArrowModelType,"sn":"arrowDirectionModel","box":function ($v) { return Bridge.box($v, ArrowDirection.ArrowModelType, System.Enum.toStringFn(ArrowDirection.ArrowModelType));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Arrow Direction Outline Color", 11, "Player Controls", false, null)],"a":2,"n":"arrowDirectionOutlineColor","t":4,"rt":$n[0].Color,"sn":"arrowDirectionOutlineColor"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Arrow Direction Position", 13, "Player Controls", false, null)],"a":2,"n":"arrowDirectionPosition","t":4,"rt":$n[0].Vector3,"sn":"arrowDirectionPosition"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Arrow Direction Scale", 12, "Player Controls", false, null)],"a":2,"n":"arrowDirectionScale","t":4,"rt":$n[1].Single,"sn":"arrowDirectionScale","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Arrow Direction Target Type", 9, "Player Controls", false, null)],"a":2,"n":"arrowDirectionTargetType","t":4,"rt":ArrowDirection.TargetType,"sn":"arrowDirectionTargetType","box":function ($v) { return Bridge.box($v, ArrowDirection.TargetType, System.Enum.toStringFn(ArrowDirection.TargetType));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Arrow Direction Yoyo Distance", 16, "Player Controls", false, null)],"a":2,"n":"arrowDirectionYoyoDistance","t":4,"rt":$n[1].Single,"sn":"arrowDirectionYoyoDistance","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Arrow Direction Yoyo Speed", 15, "Player Controls", false, null)],"a":2,"n":"arrowDirectionYoyoSpeed","t":4,"rt":$n[1].Single,"sn":"arrowDirectionYoyoSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Block Input Duration", 13, "Intro", false, null)],"a":2,"n":"blockInputDuration","t":4,"rt":$n[1].Single,"sn":"blockInputDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Block Player Input", 12, "Intro", false, null)],"a":2,"n":"blockPlayerInput","t":4,"rt":$n[1].Boolean,"sn":"blockPlayerInput","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Camera Angle", 0, "General", false, null)],"a":2,"n":"cameraAngle","t":4,"rt":$n[0].Vector3,"sn":"cameraAngle"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Camera Transition Delay", 6, "Intro", false, null)],"a":2,"n":"cameraTransitionDelay","t":4,"rt":$n[1].Single,"sn":"cameraTransitionDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Camera Transition Duration", 7, "Intro", false, null)],"a":2,"n":"cameraTransitionDuration","t":4,"rt":$n[1].Single,"sn":"cameraTransitionDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Circular Theme", 2, "Level Settings", false, null)],"a":2,"n":"circularTheme","t":4,"rt":ResourceLoader.LevelTheme,"sn":"circularTheme","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Clicks to Redirect", 1, "Store Redirect", false, null)],"a":2,"n":"clicksToRedirect","t":4,"rt":$n[1].Int32,"sn":"clicksToRedirect","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Hole Collect Sound", 7, "Audio")],"a":2,"n":"collectItemSFX","t":4,"rt":$n[0].AudioClip,"sn":"collectItemSFX"},{"a":2,"n":"coloredMaterials","t":4,"rt":System.Array.type(ColoredMaterial),"sn":"coloredMaterials"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Corridor Theme", 1, "Level Settings", false, null)],"a":2,"n":"corridorTheme","t":4,"rt":ResourceLoader.LevelTheme,"sn":"corridorTheme","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hand Cursor Scale", 0, "General", false, null)],"a":2,"n":"cursorScale","t":4,"rt":$n[1].Single,"sn":"cursorScale","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"cursors","t":4,"rt":System.Array.type(UnityEngine.Sprite),"sn":"cursors"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Display Bottom Banner", 2, "Banner", false, null)],"a":2,"n":"displayBotBanner","t":4,"rt":$n[1].Boolean,"sn":"displayBotBanner","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("HoleCountFeedback", 7, "Player Controls", false, null)],"a":2,"n":"displayHoleCountFeedback","t":4,"rt":$n[1].Boolean,"sn":"displayHoleCountFeedback","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Display Mid Banner", 1, "Banner", false, null)],"a":2,"n":"displayMidBanner","t":4,"rt":$n[1].Boolean,"sn":"displayMidBanner","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Banner"),new UnityEngine.LunaPlaygroundFieldAttribute("Display Top Banner", 0, "Banner", false, null)],"a":2,"n":"displayTopBanner","t":4,"rt":$n[1].Boolean,"sn":"displayTopBanner","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Arrow Direction", 8, "Player Controls", false, null)],"a":2,"n":"enableArrowDirection","t":4,"rt":$n[1].Boolean,"sn":"enableArrowDirection","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Store Redirect Settings"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Click Redirection", 0, "Store Redirect", false, null)],"a":2,"n":"enableClickRedirection","t":4,"rt":$n[1].Boolean,"sn":"enableClickRedirection","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Fake Control", 20, "Intro", false, null)],"a":2,"n":"enableFakeControl","t":4,"rt":$n[1].Boolean,"sn":"enableFakeControl","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Throwable Visual Effects"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Floating Animation", 0, "Throwable Effects", false, null)],"a":2,"n":"enableFloatingAnimation","t":4,"rt":$n[1].Boolean,"sn":"enableFloatingAnimation","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Hand Cursor", 0, "General", false, null)],"a":2,"n":"enableHandCursor","t":4,"rt":$n[1].Boolean,"sn":"enableHandCursor","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Intro Settings"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Intro", 0, "Intro", false, null)],"a":2,"n":"enableIntro","t":4,"rt":$n[1].Boolean,"sn":"enableIntro","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Joystick Settings"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Joystick", 0, "Joystick", false, null)],"a":2,"n":"enableJoystick","t":4,"rt":$n[1].Boolean,"sn":"enableJoystick","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Movement Indicator", 3, "Player Controls", false, null)],"a":2,"n":"enableMovementIndicator","t":4,"rt":$n[1].Boolean,"sn":"enableMovementIndicator","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("DisplayMovingHand", 22, "Intro", false, null)],"a":2,"n":"enableMovingHand","t":4,"rt":$n[1].Boolean,"sn":"enableMovingHand","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("DisplayMovingVisual", 21, "Intro", false, null)],"a":2,"n":"enableMovingVisual","t":4,"rt":$n[1].Boolean,"sn":"enableMovingVisual","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Pickup Flight Feedback", 6, "Objectives", false, null)],"a":2,"n":"enableObjectivePickupFlight","t":4,"rt":$n[1].Boolean,"sn":"enableObjectivePickupFlight","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Show Tutorial Cue", 2, "Objectives", false, null)],"a":2,"n":"enableObjectivesTuto","t":4,"rt":$n[1].Boolean,"sn":"enableObjectivesTuto","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Objectives UI"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Objectives UI", 0, "Objectives", false, null)],"a":2,"n":"enableObjectivesUI","t":4,"rt":$n[1].Boolean,"sn":"enableObjectivesUI","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Redirect After First Redirection", 6, "Store Redirect", false, null)],"a":2,"n":"enableRedirectAfterFirst","t":4,"rt":$n[1].Boolean,"sn":"enableRedirectAfterFirst","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Self Rotation", 3, "Throwable Effects", false, null)],"a":2,"n":"enableSelfRotation","t":4,"rt":$n[1].Boolean,"sn":"enableSelfRotation","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Sparkle Particle", 6, "Wood Tower Top Item", false, null)],"a":2,"n":"enableSparkleParticle","t":4,"rt":$n[1].Boolean,"sn":"enableSparkleParticle","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Time Redirection", 2, "Store Redirect", false, null)],"a":2,"n":"enableTimeRedirection","t":4,"rt":$n[1].Boolean,"sn":"enableTimeRedirection","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Top Item Floating", 1, "Wood Tower Top Item", false, null)],"a":2,"n":"enableTopItemFloating","t":4,"rt":$n[1].Boolean,"sn":"enableTopItemFloating","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Top Item Rotation", 4, "Wood Tower Top Item", false, null)],"a":2,"n":"enableTopItemRotation","t":4,"rt":$n[1].Boolean,"sn":"enableTopItemRotation","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Tower Shooting Lose", 1, "Tower Shooting", false, null)],"a":2,"n":"enableTowerShootingLose","t":4,"rt":$n[1].Boolean,"sn":"enableTowerShootingLose","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Tower Shooting Win/Lose"),new UnityEngine.LunaPlaygroundFieldAttribute("Enable Tower Shooting Win", 0, "Tower Shooting", false, null)],"a":2,"n":"enableTowerShootingWin","t":4,"rt":$n[1].Boolean,"sn":"enableTowerShootingWin","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Tuto Joystick", 1, "Joystick", false, null)],"a":2,"n":"enableTutoJoystick","t":4,"rt":$n[1].Boolean,"sn":"enableTutoJoystick","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Enable Tuto Joystick Redisplay", 4, "Joystick", false, null)],"a":2,"n":"enableTutoJoystickAfterTouch","t":4,"rt":$n[1].Boolean,"sn":"enableTutoJoystickAfterTouch","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Win When Swallow Top Item", 6, "Gameplay Leveling", false, null)],"a":2,"n":"enableWinOnSwallowTopItem","t":4,"rt":$n[1].Boolean,"sn":"enableWinOnSwallowTopItem","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("End Camera Angle", 3, "Intro", false, null)],"a":2,"n":"endCameraAngle","t":4,"rt":$n[0].Vector3,"sn":"endCameraAngle"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("End Camera Position", 5, "Intro", false, null)],"a":2,"n":"endCameraPosition","t":4,"rt":$n[0].Vector3,"sn":"endCameraPosition"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("End FOV", 9, "Intro", false, null)],"a":2,"n":"endFOV","t":4,"rt":$n[1].Single,"sn":"endFOV","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Fail Sound", 4, "Audio")],"a":2,"n":"failSound","t":4,"rt":$n[0].AudioClip,"sn":"failSound"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Floating Height", 1, "Throwable Effects", false, null)],"a":2,"n":"floatingHeight","t":4,"rt":$n[1].Single,"sn":"floatingHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Floating Speed", 2, "Throwable Effects", false, null)],"a":2,"n":"floatingSpeed","t":4,"rt":$n[1].Single,"sn":"floatingSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("FOV Transition Delay", 10, "Intro", false, null)],"a":2,"n":"fovTransitionDelay","t":4,"rt":$n[1].Single,"sn":"fovTransitionDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("FOV Transition Duration", 11, "Intro", false, null)],"a":2,"n":"fovTransitionDuration","t":4,"rt":$n[1].Single,"sn":"fovTransitionDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Game Over Delay", 0, "General", false, null)],"a":2,"n":"gameOverScreenDelay","t":4,"rt":$n[1].Single,"sn":"gameOverScreenDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Game playable config"),new UnityEngine.LunaPlaygroundFieldAttribute("Gameplay Timer", 1, "General", false, null)],"a":2,"n":"gameTimeInSeconds","t":4,"rt":$n[1].Single,"sn":"gameTimeInSeconds","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Ground Color", 0, "Environment Controls", false, null)],"a":2,"n":"groundColor","t":4,"rt":$n[0].Color,"sn":"groundColor"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Ground Texture", 0, "Environment Controls", false, null)],"a":2,"n":"groundTexture","t":4,"rt":$n[1].Int32,"sn":"groundTexture","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hand Cursor", 0, "General", false, null)],"a":2,"n":"handCursor","t":4,"rt":HandCursorSkin,"sn":"handCursor","box":function ($v) { return Bridge.box($v, HandCursorSkin, System.Enum.toStringFn(HandCursorSkin));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hide Intro Text on Player Touch", 18, "Intro", false, null)],"a":2,"n":"hideIntroTextOnPlayerTouch","t":4,"rt":$n[1].Boolean,"sn":"hideIntroTextOnPlayerTouch","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hide Movement Indicator When Idle", 3, "Player Controls", false, null)],"a":2,"n":"hideMovementIndicatorWhenIdle","t":4,"rt":$n[1].Boolean,"sn":"hideMovementIndicatorWhenIdle","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hole Color", 2, "Player Controls", false, null)],"a":2,"n":"holeColor","t":4,"rt":$n[0].Color,"sn":"holeColor"},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Hole Grow Sound", 6, "Audio")],"a":2,"n":"holeGrowSound","t":4,"rt":$n[0].AudioClip,"sn":"holeGrowSound"},{"at":[new UnityEngine.HeaderAttribute("Player playable config"),new UnityEngine.LunaPlaygroundFieldAttribute("Player Speed", 1, "Player Controls", false, null)],"a":2,"n":"holeMoveSpeed","t":4,"rt":$n[1].Single,"sn":"holeMoveSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hole Skin", 2, "Player Controls", false, null)],"a":2,"n":"holeSkin","t":4,"rt":$n[1].Int32,"sn":"holeSkin","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hole Speed Increase (0-2)", 4, "Gameplay Leveling", false, null),new UnityEngine.RangeAttribute(0.0, 2.0)],"a":2,"n":"holeSpeedIncrease","t":4,"rt":$n[1].Single,"sn":"holeSpeedIncrease","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hole Speed Increase Type", 3, "Gameplay Leveling", false, null)],"a":2,"n":"holeSpeedIncreaseType","t":4,"rt":PlayableSettings.HoleSpeedIncreaseType,"sn":"holeSpeedIncreaseType","box":function ($v) { return Bridge.box($v, PlayableSettings.HoleSpeedIncreaseType, System.Enum.toStringFn(PlayableSettings.HoleSpeedIncreaseType));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Hole Start Position", 6, "Player Controls", false, null)],"a":2,"n":"holeStartPosition","t":4,"rt":$n[0].Vector3,"sn":"holeStartPosition"},{"a":2,"n":"instance","is":true,"t":4,"rt":PlayableSettings,"sn":"instance"},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Intro Sound", 5, "Audio")],"a":2,"n":"introSound","t":4,"rt":$n[0].AudioClip,"sn":"introSound"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Intro Text", 16, "Intro", false, null)],"a":2,"n":"introText","t":4,"rt":$n[1].String,"sn":"introText"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Intro Text Duration", 17, "Intro", false, null)],"a":2,"n":"introTextDuration","t":4,"rt":$n[1].Single,"sn":"introTextDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Intro Text Hide After Duration", 19, "Intro", false, null)],"a":2,"n":"introTextHideAfterDuration","t":4,"rt":$n[1].Boolean,"sn":"introTextHideAfterDuration","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Gameplay Leveling"),new UnityEngine.LunaPlaygroundFieldAttribute("Level Up Size Increase Multiplier", 0, "Gameplay Leveling", false, null)],"a":2,"n":"levelUpSizeIncreaseMultiplier","t":4,"rt":$n[1].Single,"sn":"levelUpSizeIncreaseMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Light Color", 1, "Environment Controls", false, null)],"a":2,"n":"lightColor","t":4,"rt":$n[0].Color,"sn":"lightColor"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Light Intensity", 2, "Environment Controls", false, null)],"a":2,"n":"lightIntensity","t":4,"rt":$n[1].Single,"sn":"lightIntensity","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Light Rotation", 3, "Environment Controls", false, null)],"a":2,"n":"lightRotation","t":4,"rt":$n[0].Vector3,"sn":"lightRotation"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("LvlCircular1 Theme", 3, "Level Settings", false, null)],"a":2,"n":"lvlCircular1Theme","t":4,"rt":ResourceLoader.LevelTheme,"sn":"lvlCircular1Theme","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("LvlCircular2 Theme", 4, "Level Settings", false, null)],"a":2,"n":"lvlCircular2Theme","t":4,"rt":ResourceLoader.LevelTheme,"sn":"lvlCircular2Theme","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("LvlCircular3 Theme", 5, "Level Settings", false, null)],"a":2,"n":"lvlCircular3Theme","t":4,"rt":ResourceLoader.LevelTheme,"sn":"lvlCircular3Theme","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("LvlCircular4 Theme", 6, "Level Settings", false, null)],"a":2,"n":"lvlCircular4Theme","t":4,"rt":ResourceLoader.LevelTheme,"sn":"lvlCircular4Theme","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Movement Indicator Color", 3, "Player Controls", false, null)],"a":2,"n":"movementIndicatorColor","t":4,"rt":$n[0].Color,"sn":"movementIndicatorColor"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Movement Indicator Type", 3, "Player Controls", false, null)],"a":2,"n":"movementIndicatorType","t":4,"rt":MovementIndicatorType,"sn":"movementIndicatorType","box":function ($v) { return Bridge.box($v, MovementIndicatorType, System.Enum.toStringFn(MovementIndicatorType));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Objective Amount", 5, "Gameplay Leveling", false, null)],"a":2,"n":"objectiveAmount","t":4,"rt":$n[1].Int32,"sn":"objectiveAmount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Pickup Flight Duration", 7, "Objectives", false, null)],"a":2,"n":"objectivePickupFlightDuration","t":4,"rt":$n[1].Single,"sn":"objectivePickupFlightDuration","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Show Only Top Item", 1, "Objectives", false, null)],"a":2,"n":"objectivesOnlyTopItem","t":4,"rt":$n[1].Boolean,"sn":"objectivesOnlyTopItem","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("End Pause (sec)", 5, "Objectives", false, null)],"a":2,"n":"objectivesTutoEndPause","t":4,"rt":$n[1].Single,"sn":"objectivesTutoEndPause","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Glow Speed", 3, "Objectives", false, null)],"a":2,"n":"objectivesTutoGlowSpeed","t":4,"rt":$n[1].Single,"sn":"objectivesTutoGlowSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Travel Time (sec)", 4, "Objectives", false, null)],"a":2,"n":"objectivesTutoTravelTime","t":4,"rt":$n[1].Single,"sn":"objectivesTutoTravelTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Serializable Data")],"a":2,"n":"playerCamera","t":4,"rt":$n[0].Transform,"sn":"playerCamera"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Redirect After Throw", 4, "Store Redirect", false, null)],"a":2,"n":"redirectAfterThrow","t":4,"rt":$n[1].Boolean,"sn":"redirectAfterThrow","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Redirect Delay After Throw (seconds)", 5, "Store Redirect", false, null)],"a":2,"n":"redirectDelayAfterThrow","t":4,"rt":$n[1].Single,"sn":"redirectDelayAfterThrow","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Rotation Speed", 4, "Throwable Effects", false, null)],"a":2,"n":"rotationSpeed","t":4,"rt":$n[1].Single,"sn":"rotationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Wood Tower Top Item"),new UnityEngine.LunaPlaygroundFieldAttribute("Selected Top Item", 0, "Wood Tower Top Item", false, null)],"a":2,"n":"selectedTopItem","t":4,"rt":WoodTower.TopItemType,"sn":"selectedTopItem","box":function ($v) { return Bridge.box($v, WoodTower.TopItemType, System.Enum.toStringFn(WoodTower.TopItemType));}},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Shoot Sound", 3, "Audio")],"a":2,"n":"shootSound","t":4,"rt":$n[0].AudioClip,"sn":"shootSound"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Show Flower", 0, "General", false, null)],"a":2,"n":"showFlower","t":4,"rt":$n[1].Boolean,"sn":"showFlower","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Show HoleGrowingVFX", 17, "Player Controls", false, null)],"a":2,"n":"showHoleGrowVFX","t":4,"rt":$n[1].Boolean,"sn":"showHoleGrowVFX","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Show Intro Text", 15, "Intro", false, null)],"a":2,"n":"showIntroText","t":4,"rt":$n[1].Boolean,"sn":"showIntroText","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Start Camera Angle", 2, "Intro", false, null)],"a":2,"n":"startCameraAngle","t":4,"rt":$n[0].Vector3,"sn":"startCameraAngle"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Start Camera Position", 4, "Intro", false, null)],"a":2,"n":"startCameraPosition","t":4,"rt":$n[0].Vector3,"sn":"startCameraPosition"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Start FOV", 8, "Intro", false, null)],"a":2,"n":"startFOV","t":4,"rt":$n[1].Single,"sn":"startFOV","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Start Gameplay Timer on Touch", 1, "General", false, null)],"a":2,"n":"startGameplayTimerOnTouch","t":4,"rt":$n[1].Boolean,"sn":"startGameplayTimerOnTouch","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"sunlight","t":4,"rt":Sunlight,"sn":"sunlight"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Elements Needed for First Level", 1, "Gameplay Leveling", false, null)],"a":2,"n":"swallowCountFirstLevel","t":4,"rt":$n[1].Int32,"sn":"swallowCountFirstLevel","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Swallow Needed Multiplier", 2, "Gameplay Leveling", false, null)],"a":2,"n":"swallowNeededMultiplier","t":4,"rt":$n[1].Single,"sn":"swallowNeededMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Throwable Object Type", 0, "General", false, null)],"a":2,"n":"throwableObjectType","t":4,"rt":ThrowableObjectType,"sn":"throwableObjectType","box":function ($v) { return Bridge.box($v, ThrowableObjectType, System.Enum.toStringFn(ThrowableObjectType));}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Time to Redirect (seconds)", 3, "Store Redirect", false, null)],"a":2,"n":"timeToRedirect","t":4,"rt":$n[1].Single,"sn":"timeToRedirect","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Top Item Floating Height", 2, "Wood Tower Top Item", false, null)],"a":2,"n":"topItemFloatingHeight","t":4,"rt":$n[1].Single,"sn":"topItemFloatingHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Top Item Floating Speed", 3, "Wood Tower Top Item", false, null)],"a":2,"n":"topItemFloatingSpeed","t":4,"rt":$n[1].Single,"sn":"topItemFloatingSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Top Item Rotation Speed", 5, "Wood Tower Top Item", false, null)],"a":2,"n":"topItemRotationSpeed","t":4,"rt":$n[1].Single,"sn":"topItemRotationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Top Item Size Multiplier", 9, "Wood Tower Top Item", false, null)],"a":2,"n":"topItemSizeMultiplier","t":4,"rt":$n[1].Single,"sn":"topItemSizeMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Tower Height (Number of Levels)", 8, "Wood Tower Top Item", false, null)],"a":2,"n":"towerHeight","t":4,"rt":$n[1].Int32,"sn":"towerHeight","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.LunaPlaygroundAssetAttribute("Tower Hit Sound", 2, "Audio")],"a":2,"n":"towerHitSound","t":4,"rt":$n[0].AudioClip,"sn":"towerHitSound"},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Tower Miss Check Delay (seconds)", 3, "Tower Shooting", false, null)],"a":2,"n":"towerMissCheckDelay","t":4,"rt":$n[1].Single,"sn":"towerMissCheckDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Tower Width (X/Z)", 7, "Wood Tower Top Item", false, null)],"a":2,"n":"towerWidth","t":4,"rt":$n[1].Single,"sn":"towerWidth","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Auto Redirect Delay (seconds)", 2, "Tower Shooting", false, null)],"a":2,"n":"towerWinAutoRedirectDelay","t":4,"rt":$n[1].Single,"sn":"towerWinAutoRedirectDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Delay Before Display (seconds)", 3, "Joystick", false, null)],"a":2,"n":"tutoJoystickDisplayDelay","t":4,"rt":$n[1].Single,"sn":"tutoJoystickDisplayDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Tuto Joystick Show at Start", 2, "Joystick", false, null)],"a":2,"n":"tutoJoystickShowAtStart","t":4,"rt":$n[1].Boolean,"sn":"tutoJoystickShowAtStart","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Redisplay After Seconds (no touch)", 5, "Joystick", false, null)],"a":2,"n":"tutoJoystickShowTimesAfterTouch","t":4,"rt":$n[1].Single,"sn":"tutoJoystickShowTimesAfterTouch","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.LunaPlaygroundFieldAttribute("Use Hole Start Position", 5, "Player Controls", false, null)],"a":2,"n":"useHoleStartPosition","t":4,"rt":$n[1].Boolean,"sn":"useHoleStartPosition","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"at":[new UnityEngine.HeaderAttribute("Audio Settings"),new UnityEngine.LunaPlaygroundAssetAttribute("Win Sound", 1, "Audio")],"a":2,"n":"winSound","t":4,"rt":$n[0].AudioClip,"sn":"winSound"}]}; }, $n);
    /*PlayableSettings end.*/

    /*PlayableSettings+HoleSpeedIncreaseType start.*/
    $m("PlayableSettings.HoleSpeedIncreaseType", function () { return {"td":PlayableSettings,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Additive","is":true,"t":4,"rt":PlayableSettings.HoleSpeedIncreaseType,"sn":"Additive","box":function ($v) { return Bridge.box($v, PlayableSettings.HoleSpeedIncreaseType, System.Enum.toStringFn(PlayableSettings.HoleSpeedIncreaseType));}},{"a":2,"n":"Multiplicative","is":true,"t":4,"rt":PlayableSettings.HoleSpeedIncreaseType,"sn":"Multiplicative","box":function ($v) { return Bridge.box($v, PlayableSettings.HoleSpeedIncreaseType, System.Enum.toStringFn(PlayableSettings.HoleSpeedIncreaseType));}}]}; }, $n);
    /*PlayableSettings+HoleSpeedIncreaseType end.*/

    /*PlayableSettings+PlayerSkinIndex start.*/
    $m("PlayableSettings.PlayerSkinIndex", function () { return {"td":PlayableSettings,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Default","is":true,"t":4,"rt":PlayableSettings.PlayerSkinIndex,"sn":"Default","box":function ($v) { return Bridge.box($v, PlayableSettings.PlayerSkinIndex, System.Enum.toStringFn(PlayableSettings.PlayerSkinIndex));}}]}; }, $n);
    /*PlayableSettings+PlayerSkinIndex end.*/

    /*PlayableSettings+LevelIndex start.*/
    $m("PlayableSettings.LevelIndex", function () { return {"td":PlayableSettings,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"C38V1","is":true,"t":4,"rt":PlayableSettings.LevelIndex,"sn":"C38V1","box":function ($v) { return Bridge.box($v, PlayableSettings.LevelIndex, System.Enum.toStringFn(PlayableSettings.LevelIndex));}},{"a":2,"n":"C38V2","is":true,"t":4,"rt":PlayableSettings.LevelIndex,"sn":"C38V2","box":function ($v) { return Bridge.box($v, PlayableSettings.LevelIndex, System.Enum.toStringFn(PlayableSettings.LevelIndex));}},{"a":2,"n":"C38V3","is":true,"t":4,"rt":PlayableSettings.LevelIndex,"sn":"C38V3","box":function ($v) { return Bridge.box($v, PlayableSettings.LevelIndex, System.Enum.toStringFn(PlayableSettings.LevelIndex));}}]}; }, $n);
    /*PlayableSettings+LevelIndex end.*/

    /*PlayerMovement start.*/
    $m("PlayerMovement", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"ApplyMovement","t":8,"pi":[{"n":"transform","pt":$n[0].Transform,"ps":0},{"n":"moveSpeed","pt":$n[1].Single,"ps":1}],"sn":"ApplyMovement","rt":$n[1].Void,"p":[$n[0].Transform,$n[1].Single]},{"a":2,"n":"UpdateInputs","t":8,"pi":[{"n":"target","pt":$n[0].Transform,"ps":0}],"sn":"UpdateInputs","rt":$n[1].Void,"p":[$n[0].Transform]},{"a":1,"n":"currentMousePosition","t":4,"rt":$n[0].Vector3,"sn":"currentMousePosition"},{"a":1,"n":"initialMousePosition","t":4,"rt":$n[0].Vector3,"sn":"initialMousePosition"},{"a":1,"n":"isTouching","t":4,"rt":$n[1].Boolean,"sn":"isTouching","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"minSpeed","is":true,"t":4,"rt":$n[1].Single,"sn":"minSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"movementDirection","t":4,"rt":$n[0].Vector3,"sn":"movementDirection"},{"a":1,"n":"speedMultiplier","is":true,"t":4,"rt":$n[1].Single,"sn":"speedMultiplier","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*PlayerMovement end.*/

    /*PlayerSkin start.*/
    $m("PlayerSkin", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"animator","t":4,"rt":$n[0].Animator,"sn":"animator"}]}; }, $n);
    /*PlayerSkin end.*/

    /*Pool$1 start.*/
    $m("Pool$1", function (T) { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[T,$n[0].Transform,$n[1].Int32],"pi":[{"n":"prefab","pt":T,"ps":0},{"n":"parent","pt":$n[0].Transform,"ps":1},{"n":"initialSize","pt":$n[1].Int32,"ps":2}],"sn":"ctor"},{"a":2,"n":"Dispose","t":8,"pi":[{"n":"obj","pt":T,"ps":0}],"sn":"Dispose","rt":$n[1].Void,"p":[T]},{"a":2,"n":"Get","t":8,"pi":[{"n":"growIfFull","pt":$n[1].Boolean,"ps":0}],"sn":"Get","rt":T,"p":[$n[1].Boolean]},{"a":1,"n":"Grow","t":8,"sn":"Grow","rt":T},{"a":1,"n":"objects","t":4,"rt":$n[3].List$1(T),"sn":"objects","ro":true},{"a":1,"n":"parent","t":4,"rt":$n[0].Transform,"sn":"parent"},{"a":1,"n":"prefab","t":4,"rt":T,"sn":"prefab"}]}; }, $n);
    /*Pool$1 end.*/

    /*ResourceLoader start.*/
    $m("ResourceLoader", function () { return {"nested":[ResourceLoader.LevelShape,ResourceLoader.LevelTheme],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"AddToList","is":true,"t":8,"pi":[{"n":"name","pt":$n[1].String,"ps":0}],"sn":"AddToList","rt":$n[1].Void,"p":[$n[1].String]},{"a":1,"n":"LoadResource","t":8,"pi":[{"n":"resourceName","pt":$n[1].String,"ps":0}],"sn":"LoadResource","rt":$n[2].IEnumerator,"p":[$n[1].String]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Path","is":true,"t":4,"rt":$n[1].String,"sn":"Path"},{"a":1,"n":"resourceList","is":true,"t":4,"rt":$n[3].List$1(System.String),"sn":"resourceList"},{"a":2,"n":"OnObjectLoaded","is":true,"t":2,"ad":{"a":2,"n":"add_OnObjectLoaded","is":true,"t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"addOnObjectLoaded","rt":$n[1].Void,"p":[Function]},"r":{"a":2,"n":"remove_OnObjectLoaded","is":true,"t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"removeOnObjectLoaded","rt":$n[1].Void,"p":[Function]}}]}; }, $n);
    /*ResourceLoader end.*/

    /*ResourceLoader+LevelShape start.*/
    $m("ResourceLoader.LevelShape", function () { return {"td":ResourceLoader,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Circular","is":true,"t":4,"rt":ResourceLoader.LevelShape,"sn":"Circular","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelShape, System.Enum.toStringFn(ResourceLoader.LevelShape));}},{"a":2,"n":"Corridor","is":true,"t":4,"rt":ResourceLoader.LevelShape,"sn":"Corridor","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelShape, System.Enum.toStringFn(ResourceLoader.LevelShape));}},{"a":2,"n":"LvlCircular1","is":true,"t":4,"rt":ResourceLoader.LevelShape,"sn":"LvlCircular1","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelShape, System.Enum.toStringFn(ResourceLoader.LevelShape));}},{"a":2,"n":"LvlCircular2","is":true,"t":4,"rt":ResourceLoader.LevelShape,"sn":"LvlCircular2","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelShape, System.Enum.toStringFn(ResourceLoader.LevelShape));}},{"a":2,"n":"LvlCircular3","is":true,"t":4,"rt":ResourceLoader.LevelShape,"sn":"LvlCircular3","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelShape, System.Enum.toStringFn(ResourceLoader.LevelShape));}},{"a":2,"n":"LvlCircular4","is":true,"t":4,"rt":ResourceLoader.LevelShape,"sn":"LvlCircular4","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelShape, System.Enum.toStringFn(ResourceLoader.LevelShape));}}]}; }, $n);
    /*ResourceLoader+LevelShape end.*/

    /*ResourceLoader+LevelTheme start.*/
    $m("ResourceLoader.LevelTheme", function () { return {"td":ResourceLoader,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Cherry","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"Cherry","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"Donut","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"Donut","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"DragonfruitHalf","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"DragonfruitHalf","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"DragonfruitPink","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"DragonfruitPink","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"DragonfruitPinkQuarter","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"DragonfruitPinkQuarter","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"FigBlue","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"FigBlue","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"Flower","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"Flower","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"Maki","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"Maki","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"PineappleRing","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"PineappleRing","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"Starfruit","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"Starfruit","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"Strawberry","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"Strawberry","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"Sushi","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"Sushi","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"Watermelon","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"Watermelon","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}},{"a":2,"n":"WatermelonQuarter","is":true,"t":4,"rt":ResourceLoader.LevelTheme,"sn":"WatermelonQuarter","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}}]}; }, $n);
    /*ResourceLoader+LevelTheme end.*/

    /*ResourcePlaceholder start.*/
    $m("ResourcePlaceholder", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"ApplyResourceName","t":8,"pi":[{"n":"newResourceName","pt":$n[1].String,"ps":0}],"sn":"ApplyResourceName","rt":$n[1].Void,"p":[$n[1].String]},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"EnsureSupportActivator","t":8,"pi":[{"n":"instance","pt":$n[0].Transform,"ps":0}],"sn":"EnsureSupportActivator","rt":$n[1].Void,"p":[$n[0].Transform]},{"a":1,"n":"SpawnInstance","t":8,"pi":[{"n":"prefab","pt":$n[0].Transform,"ps":0}],"sn":"SpawnInstance","rt":$n[1].Void,"p":[$n[0].Transform]},{"a":2,"n":"resourceName","t":4,"rt":$n[1].String,"sn":"resourceName"},{"a":2,"n":"rowIndex","t":4,"rt":$n[1].Int32,"sn":"rowIndex","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"tower","t":4,"rt":$n[0].Transform,"sn":"tower"}]}; }, $n);
    /*ResourcePlaceholder end.*/

    /*ResourceSetter start.*/
    $m("ResourceSetter", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"EnsureSupportActivator","t":8,"pi":[{"n":"instance","pt":$n[0].Transform,"ps":0}],"sn":"EnsureSupportActivator","rt":$n[1].Void,"p":[$n[0].Transform]}]}; }, $n);
    /*ResourceSetter end.*/

    /*RotorRotation start.*/
    $m("RotorRotation", function () { return {"nested":[RotorRotation.RotationAxis],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":2,"n":"rotationAxis","t":4,"rt":RotorRotation.RotationAxis,"sn":"rotationAxis","box":function ($v) { return Bridge.box($v, RotorRotation.RotationAxis, System.Enum.toStringFn(RotorRotation.RotationAxis));}},{"a":2,"n":"rotationSpeed","t":4,"rt":$n[1].Single,"sn":"rotationSpeed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*RotorRotation end.*/

    /*RotorRotation+RotationAxis start.*/
    $m("RotorRotation.RotationAxis", function () { return {"td":RotorRotation,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"X","is":true,"t":4,"rt":RotorRotation.RotationAxis,"sn":"X","box":function ($v) { return Bridge.box($v, RotorRotation.RotationAxis, System.Enum.toStringFn(RotorRotation.RotationAxis));}},{"a":2,"n":"Y","is":true,"t":4,"rt":RotorRotation.RotationAxis,"sn":"Y","box":function ($v) { return Bridge.box($v, RotorRotation.RotationAxis, System.Enum.toStringFn(RotorRotation.RotationAxis));}},{"a":2,"n":"Z","is":true,"t":4,"rt":RotorRotation.RotationAxis,"sn":"Z","box":function ($v) { return Bridge.box($v, RotorRotation.RotationAxis, System.Enum.toStringFn(RotorRotation.RotationAxis));}}]}; }, $n);
    /*RotorRotation+RotationAxis end.*/

    /*SoundEffect start.*/
    $m("SoundEffect", function () { return {"att":257,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Fail","is":true,"t":4,"rt":SoundEffect,"sn":"Fail","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"HoleGrow","is":true,"t":4,"rt":SoundEffect,"sn":"HoleGrow","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"Intro","is":true,"t":4,"rt":SoundEffect,"sn":"Intro","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"Shoot","is":true,"t":4,"rt":SoundEffect,"sn":"Shoot","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"TowerHit","is":true,"t":4,"rt":SoundEffect,"sn":"TowerHit","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}},{"a":2,"n":"Win","is":true,"t":4,"rt":SoundEffect,"sn":"Win","box":function ($v) { return Bridge.box($v, SoundEffect, System.Enum.toStringFn(SoundEffect));}}]}; }, $n);
    /*SoundEffect end.*/

    /*StoreRedirectInitializer start.*/
    $m("StoreRedirectInitializer", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void}]}; }, $n);
    /*StoreRedirectInitializer end.*/

    /*StoreRedirectTracker start.*/
    $m("StoreRedirectTracker", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":2,"n":"CheckClickRedirection","t":8,"sn":"CheckClickRedirection","rt":$n[1].Void},{"a":2,"n":"CheckTimeRedirection","t":8,"sn":"CheckTimeRedirection","rt":$n[1].Void},{"a":2,"n":"ClearRedirectState","t":8,"sn":"ClearRedirectState","rt":$n[1].Void},{"a":2,"n":"GetTimeElapsed","t":8,"sn":"GetTimeElapsed","rt":$n[1].Single,"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"GetTotalClicks","t":8,"sn":"GetTotalClicks","rt":$n[1].Int32,"box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"HasRedirected","t":8,"sn":"HasRedirected","rt":$n[1].Boolean,"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"InitializeTracking","t":8,"sn":"InitializeTracking","rt":$n[1].Void},{"a":2,"n":"OnClick","t":8,"sn":"OnClick","rt":$n[1].Void},{"a":2,"n":"OnThrow","t":8,"sn":"OnThrow","rt":$n[1].Void},{"a":1,"n":"RedirectAfterThrowCoroutine","t":8,"sn":"RedirectAfterThrowCoroutine","rt":$n[2].IEnumerator},{"a":2,"n":"ResetAllCounters","t":8,"sn":"ResetAllCounters","rt":$n[1].Void},{"a":2,"n":"ResetCounters","t":8,"sn":"ResetCounters","rt":$n[1].Void},{"a":2,"n":"SetTrackingEnabled","t":8,"pi":[{"n":"enabled","pt":$n[1].Boolean,"ps":0}],"sn":"SetTrackingEnabled","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"TrackInput","t":8,"sn":"TrackInput","rt":$n[1].Void},{"a":2,"n":"TriggerManualRedirect","t":8,"pi":[{"n":"reason","dv":"Manual redirect","o":true,"pt":$n[1].String,"ps":0}],"sn":"TriggerManualRedirect","rt":$n[1].Void,"p":[$n[1].String]},{"a":1,"n":"TriggerStoreRedirection","t":8,"pi":[{"n":"reason","pt":$n[1].String,"ps":0}],"sn":"TriggerStoreRedirection","rt":$n[1].Void,"p":[$n[1].String]},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"hasRedirected","t":4,"rt":$n[1].Boolean,"sn":"hasRedirected","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"instance","is":true,"t":4,"rt":StoreRedirectTracker,"sn":"instance"},{"a":1,"n":"isTracking","t":4,"rt":$n[1].Boolean,"sn":"isTracking","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isTrackingClicks","t":4,"rt":$n[1].Boolean,"sn":"isTrackingClicks","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isTrackingTime","t":4,"rt":$n[1].Boolean,"sn":"isTrackingTime","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"playableSettings","t":4,"rt":PlayableSettings,"sn":"playableSettings"},{"a":1,"n":"timeElapsed","t":4,"rt":$n[1].Single,"sn":"timeElapsed","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"totalClicks","t":4,"rt":$n[1].Int32,"sn":"totalClicks","box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    /*StoreRedirectTracker end.*/

    /*Sunlight start.*/
    $m("Sunlight", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"sunlightLight","t":4,"rt":$n[0].Light,"sn":"sunlightLight"}]}; }, $n);
    /*Sunlight end.*/

    /*SupportActivator start.*/
    $m("SupportActivator", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.DisallowMultipleComponent()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ActivatePhysics","t":8,"sn":"ActivatePhysics","rt":$n[1].Void},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"EvaluateSupport","t":8,"sn":"EvaluateSupport","rt":$n[1].Void},{"a":2,"n":"FlaggedByHole","t":8,"sn":"FlaggedByHole","rt":$n[1].Void},{"a":2,"n":"ForceActivate","t":8,"sn":"ForceActivate","rt":$n[1].Void},{"a":1,"n":"HasSupportBelow","t":8,"sn":"HasSupportBelow","rt":$n[1].Boolean,"box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"OnCollisionEnter","t":8,"pi":[{"n":"collision","pt":$n[0].Collision,"ps":0}],"sn":"OnCollisionEnter","rt":$n[1].Void,"p":[$n[0].Collision]},{"a":1,"n":"OnDisable","t":8,"sn":"OnDisable","rt":$n[1].Void},{"a":1,"n":"OnEnable","t":8,"sn":"OnEnable","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"_activationTime","t":4,"rt":$n[1].Single,"sn":"_activationTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_checkTimer","t":4,"rt":$n[1].Single,"sn":"_checkTimer","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_col","t":4,"rt":$n[0].Collider,"sn":"_col"},{"a":1,"n":"_forceHoleDrop","t":4,"rt":$n[1].Boolean,"sn":"_forceHoleDrop","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_missCounter","t":4,"rt":$n[1].Int32,"sn":"_missCounter","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"_rayHits","t":4,"rt":System.Array.type(UnityEngine.RaycastHit),"sn":"_rayHits","ro":true},{"a":1,"n":"_rb","t":4,"rt":$n[0].Rigidbody,"sn":"_rb"},{"a":2,"n":"checkDistance","t":4,"rt":$n[1].Single,"sn":"checkDistance","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"checkInterval","t":4,"rt":$n[1].Single,"sn":"checkInterval","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Objectives")],"a":2,"n":"countInObjectives","t":4,"rt":$n[1].Boolean,"sn":"countInObjectives","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"isTopItem","t":4,"rt":$n[1].Boolean,"sn":"isTopItem","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"objectiveIcon","t":4,"rt":$n[0].Sprite,"sn":"objectiveIcon"},{"a":2,"n":"requiredMisses","t":4,"rt":$n[1].Int32,"sn":"requiredMisses","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HideInInspector()],"a":2,"n":"rowIndex","t":4,"rt":$n[1].Int32,"sn":"rowIndex","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HeaderAttribute("Physics Optimization")],"a":2,"n":"sleepDelay","t":4,"rt":$n[1].Single,"sn":"sleepDelay","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Support Detection (Raycast)")],"a":2,"n":"supportMask","t":4,"rt":$n[0].LayerMask,"sn":"supportMask"},{"at":[new UnityEngine.HideInInspector()],"a":2,"n":"tower","t":4,"rt":$n[0].Transform,"sn":"tower"}]}; }, $n);
    /*SupportActivator end.*/

    /*SwallowElements start.*/
    $m("SwallowElements", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void}]}; }, $n);
    /*SwallowElements end.*/

    /*TextureSetterLuna start.*/
    $m("TextureSetterLuna", function () { return {"nested":[TextureSetterLuna.TextureLunaFieldType],"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ConvertTextureToSprite","t":8,"pi":[{"n":"texture","pt":$n[0].Texture2D,"ps":0}],"sn":"ConvertTextureToSprite","rt":$n[0].Sprite,"p":[$n[0].Texture2D]},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"imageRef","t":4,"rt":$n[6].Image,"sn":"imageRef"},{"a":2,"n":"preserveAspectImage","t":4,"rt":$n[1].Boolean,"sn":"preserveAspectImage","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"textureField","t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"textureField","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}}]}; }, $n);
    /*TextureSetterLuna end.*/

    /*TextureSetterLuna+TextureLunaFieldType start.*/
    $m("TextureSetterLuna.TextureLunaFieldType", function () { return {"td":TextureSetterLuna,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"BottomBanner","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"BottomBanner","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}},{"a":2,"n":"FailImage","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"FailImage","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}},{"a":2,"n":"MidBanner","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"MidBanner","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}},{"a":2,"n":"TopBanner","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"TopBanner","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}},{"a":2,"n":"WinImage","is":true,"t":4,"rt":TextureSetterLuna.TextureLunaFieldType,"sn":"WinImage","box":function ($v) { return Bridge.box($v, TextureSetterLuna.TextureLunaFieldType, System.Enum.toStringFn(TextureSetterLuna.TextureLunaFieldType));}}]}; }, $n);
    /*TextureSetterLuna+TextureLunaFieldType end.*/

    /*ThemeDisplayGroup start.*/
    $m("ThemeDisplayGroup", function () { return {"nested":[ThemeDisplayGroup.ThemeResourceOverride,ThemeDisplayGroup.ThemePlaceholderEntry],"att":1048577,"a":2,"at":[new UnityEngine.DefaultExecutionOrder(-100)],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ApplyTheme","t":8,"sn":"ApplyTheme","rt":$n[1].Void},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":2,"n":"GetCollectableName","is":true,"t":8,"pi":[{"n":"levelTheme","pt":ResourceLoader.LevelTheme,"ps":0}],"sn":"GetCollectableName","rt":$n[1].String,"p":[ResourceLoader.LevelTheme]},{"a":2,"n":"ResolveThemeFromSettings","t":8,"sn":"ResolveThemeFromSettings","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"SyncThemeFromSettings","t":8,"sn":"SyncThemeFromSettings","rt":$n[1].Void},{"a":2,"n":"placeholders","t":4,"rt":$n[3].List$1(ThemeDisplayGroup.ThemePlaceholderEntry),"sn":"placeholders"},{"at":[new UnityEngine.TooltipAttribute("Optional root used to collect placeholders when running the context menu.")],"a":2,"n":"searchRoot","t":4,"rt":$n[0].Transform,"sn":"searchRoot"},{"a":2,"n":"shape","t":4,"rt":ResourceLoader.LevelShape,"sn":"shape","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelShape, System.Enum.toStringFn(ResourceLoader.LevelShape));}},{"a":2,"n":"theme","t":4,"rt":ResourceLoader.LevelTheme,"sn":"theme","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}}]}; }, $n);
    /*ThemeDisplayGroup end.*/

    /*ThemeDisplayGroup+ThemeResourceOverride start.*/
    $m("ThemeDisplayGroup.ThemeResourceOverride", function () { return {"td":ThemeDisplayGroup,"att":1056770,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"resourceName","t":4,"rt":$n[1].String,"sn":"resourceName"},{"a":2,"n":"theme","t":4,"rt":ResourceLoader.LevelTheme,"sn":"theme","box":function ($v) { return Bridge.box($v, ResourceLoader.LevelTheme, System.Enum.toStringFn(ResourceLoader.LevelTheme));}}]}; }, $n);
    /*ThemeDisplayGroup+ThemeResourceOverride end.*/

    /*ThemeDisplayGroup+ThemePlaceholderEntry start.*/
    $m("ThemeDisplayGroup.ThemePlaceholderEntry", function () { return {"td":ThemeDisplayGroup,"att":1056770,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"GetResourceName","t":8,"pi":[{"n":"currentTheme","pt":ResourceLoader.LevelTheme,"ps":0}],"sn":"GetResourceName","rt":$n[1].String,"p":[ResourceLoader.LevelTheme]},{"a":2,"n":"defaultResourceName","t":4,"rt":$n[1].String,"sn":"defaultResourceName"},{"a":2,"n":"overrides","t":4,"rt":$n[3].List$1(ThemeDisplayGroup.ThemeResourceOverride),"sn":"overrides"},{"a":2,"n":"placeholder","t":4,"rt":ResourcePlaceholder,"sn":"placeholder"}]}; }, $n);
    /*ThemeDisplayGroup+ThemePlaceholderEntry end.*/

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
    $m("TutoCursor", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"cursorImage","t":4,"rt":$n[6].Image,"sn":"cursorImage"}]}; }, $n);
    /*TutoCursor end.*/

    /*UIManager start.*/
    $m("UIManager", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"DelayedShowTutoJoystick","t":8,"sn":"DelayedShowTutoJoystick","rt":$n[2].IEnumerator},{"a":2,"n":"HideIntroText","t":8,"sn":"HideIntroText","rt":$n[1].Void},{"a":2,"n":"HideShootScreenAfterShoot","t":8,"sn":"HideShootScreenAfterShoot","rt":$n[1].Void},{"a":2,"n":"InitializeJoysticks","t":8,"sn":"InitializeJoysticks","rt":$n[1].Void},{"a":2,"n":"OnBannerClick","t":8,"sn":"OnBannerClick","rt":$n[1].Void},{"a":2,"n":"OnButtonClick","t":8,"sn":"OnButtonClick","rt":$n[1].Void},{"a":2,"n":"OnPlayerTouch","t":8,"sn":"OnPlayerTouch","rt":$n[1].Void},{"a":2,"n":"OnPlayerTouchRelease","t":8,"sn":"OnPlayerTouchRelease","rt":$n[1].Void},{"a":2,"n":"ShowEndScreen","t":8,"pi":[{"n":"isWin","pt":$n[1].Boolean,"ps":0}],"sn":"ShowEndScreen","rt":$n[1].Void,"p":[$n[1].Boolean]},{"a":2,"n":"ShowIntroText","t":8,"pi":[{"n":"text","pt":$n[1].String,"ps":0}],"sn":"ShowIntroText","rt":$n[1].Void,"p":[$n[1].String]},{"a":2,"n":"ShowShootScreen","t":8,"sn":"ShowShootScreen","rt":$n[1].Void},{"a":1,"n":"ShowTutoJoystickAfterDelay","t":8,"sn":"ShowTutoJoystickAfterDelay","rt":$n[2].IEnumerator},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":2,"n":"UpdateSlider","t":8,"pi":[{"n":"amount","pt":$n[1].Single,"ps":0}],"sn":"UpdateSlider","rt":$n[1].Void,"p":[$n[1].Single]},{"a":1,"n":"UpdateTimeBar","t":8,"pi":[{"n":"currentTime","pt":$n[1].Single,"ps":0}],"sn":"UpdateTimeBar","rt":$n[1].Void,"p":[$n[1].Single]},{"a":2,"n":"UpdateTimer","t":8,"pi":[{"n":"amount","pt":$n[1].Single,"ps":0}],"sn":"UpdateTimer","rt":$n[1].Void,"p":[$n[1].Single]},{"a":2,"n":"anim","t":4,"rt":$n[0].Animator,"sn":"anim"},{"a":2,"n":"bottomBanner","t":4,"rt":$n[0].GameObject,"sn":"bottomBanner"},{"a":2,"n":"handCursor","t":4,"rt":HandCursor,"sn":"handCursor"},{"at":[new UnityEngine.HeaderAttribute("References")],"a":2,"n":"holeController","t":4,"rt":HoleController,"sn":"holeController"},{"a":2,"n":"instance","is":true,"t":4,"rt":UIManager,"sn":"instance"},{"at":[new UnityEngine.HeaderAttribute("Intro Text")],"a":2,"n":"introText","t":4,"rt":$n[6].Text,"sn":"introText"},{"a":1,"n":"isTimerAnimPlaying","t":4,"rt":$n[1].Boolean,"sn":"isTimerAnimPlaying","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"isTouching","t":4,"rt":$n[1].Boolean,"sn":"isTouching","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"joystick","t":4,"rt":$n[0].GameObject,"sn":"joystick"},{"a":1,"n":"lastTouchReleaseTime","t":4,"rt":$n[1].Single,"sn":"lastTouchReleaseTime","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"loseScreen","t":4,"rt":$n[0].GameObject,"sn":"loseScreen"},{"a":2,"n":"midBanner","t":4,"rt":$n[0].GameObject,"sn":"midBanner"},{"a":2,"n":"myObjectivesUISystem","t":4,"rt":ObjectivesUISystem,"sn":"myObjectivesUISystem"},{"a":2,"n":"playScreen","t":4,"rt":$n[0].GameObject,"sn":"playScreen"},{"a":2,"n":"shootScreen","t":4,"rt":$n[0].GameObject,"sn":"shootScreen"},{"a":1,"n":"showAfterDelayCoroutine","t":4,"rt":$n[0].Coroutine,"sn":"showAfterDelayCoroutine"},{"a":2,"n":"timeBarImage","t":4,"rt":$n[6].Image,"sn":"timeBarImage"},{"a":2,"n":"timerText","t":4,"rt":$n[6].Text,"sn":"timerText"},{"a":2,"n":"topBanner","t":4,"rt":$n[0].GameObject,"sn":"topBanner"},{"a":2,"n":"tutoJoystick","t":4,"rt":$n[0].GameObject,"sn":"tutoJoystick"},{"a":1,"n":"tutoJoystickHidden","t":4,"rt":$n[1].Boolean,"sn":"tutoJoystickHidden","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"winScreen","t":4,"rt":$n[0].GameObject,"sn":"winScreen"}]}; }, $n);
    /*UIManager end.*/

    /*Utils start.*/
    $m("Utils", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"SwitchChild","t":8,"pi":[{"n":"parent","pt":$n[0].Transform,"ps":0},{"n":"index","pt":$n[1].Int32,"ps":1}],"sn":"SwitchChild","rt":$n[1].Void,"p":[$n[0].Transform,$n[1].Int32]},{"a":2,"n":"WrapIndex","t":8,"pi":[{"n":"bounds","pt":$n[1].Int32,"ps":0},{"n":"index","pt":$n[1].Int32,"ps":1}],"sn":"WrapIndex","rt":$n[1].Int32,"p":[$n[1].Int32,$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    /*Utils end.*/

    /*VariableJoystick start.*/
    $m("VariableJoystick", function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":3,"n":"HandleInput","t":8,"pi":[{"n":"magnitude","pt":$n[1].Single,"ps":0},{"n":"normalised","pt":$n[0].Vector2,"ps":1},{"n":"radius","pt":$n[0].Vector2,"ps":2},{"n":"cam","pt":$n[0].Camera,"ps":3}],"sn":"HandleInput","rt":$n[1].Void,"p":[$n[1].Single,$n[0].Vector2,$n[0].Vector2,$n[0].Camera]},{"ov":true,"a":2,"n":"OnPointerDown","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnPointerDown","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"ov":true,"a":2,"n":"OnPointerUp","t":8,"pi":[{"n":"eventData","pt":$n[4].PointerEventData,"ps":0}],"sn":"OnPointerUp","rt":$n[1].Void,"p":[$n[4].PointerEventData]},{"a":2,"n":"SetMode","t":8,"pi":[{"n":"joystickType","pt":JoystickType,"ps":0}],"sn":"SetMode","rt":$n[1].Void,"p":[JoystickType]},{"ov":true,"a":3,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":2,"n":"MoveThreshold","t":16,"rt":$n[1].Single,"g":{"a":2,"n":"get_MoveThreshold","t":8,"rt":$n[1].Single,"fg":"MoveThreshold","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},"s":{"a":2,"n":"set_MoveThreshold","t":8,"p":[$n[1].Single],"rt":$n[1].Void,"fs":"MoveThreshold"},"fn":"MoveThreshold"},{"a":1,"n":"fixedPosition","t":4,"rt":$n[0].Vector2,"sn":"fixedPosition"},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"joystickType","t":4,"rt":JoystickType,"sn":"joystickType","box":function ($v) { return Bridge.box($v, JoystickType, System.Enum.toStringFn(JoystickType));}},{"at":[new UnityEngine.SerializeFieldAttribute()],"a":1,"n":"moveThreshold","t":4,"rt":$n[1].Single,"sn":"moveThreshold","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*VariableJoystick end.*/

    /*WoodTower start.*/
    $m("WoodTower", function () { return {"nested":[WoodTower.TopItemEntry,WoodTower.TopItemType],"att":1048577,"a":2,"at":[new UnityEngine.ExecuteAlwaysAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"ApplyTopItemSizeMultiplier","t":8,"sn":"ApplyTopItemSizeMultiplier","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Clean Tower")],"a":2,"n":"CleanTower","t":8,"sn":"CleanTower","rt":$n[1].Void},{"a":2,"n":"GetActiveTopItemSupportActivator","t":8,"sn":"GetActiveTopItemSupportActivator","rt":SupportActivator},{"a":1,"n":"GetLevelsToUse","t":8,"sn":"GetLevelsToUse","rt":$n[1].Int32,"box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":1,"n":"InstantiateChildKeepingPrefabLink","t":8,"pi":[{"n":"prefab","pt":$n[0].GameObject,"ps":0},{"n":"parent","pt":$n[0].Transform,"ps":1}],"sn":"InstantiateChildKeepingPrefabLink","rt":$n[0].GameObject,"p":[$n[0].GameObject,$n[0].Transform]},{"at":[new UnityEngine.ContextMenu.ctor("Spawn Tower")],"a":2,"n":"SpawnTower","t":8,"sn":"SpawnTower","rt":$n[1].Void},{"a":1,"n":"Start","t":8,"sn":"Start","rt":$n[1].Void},{"a":1,"n":"StopVisualEffects","t":8,"sn":"StopVisualEffects","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":1,"n":"UpdateParticlePosition","t":8,"sn":"UpdateParticlePosition","rt":$n[1].Void},{"a":1,"n":"UpdateSupportActivatorCheckDistances","t":8,"sn":"UpdateSupportActivatorCheckDistances","rt":$n[1].Void},{"a":1,"n":"UpdateTopItemAnimations","t":8,"sn":"UpdateTopItemAnimations","rt":$n[1].Void},{"a":1,"n":"UpdateTopItemPosition","t":8,"sn":"UpdateTopItemPosition","rt":$n[1].Void},{"a":1,"n":"UpdateTopItemVisual","t":8,"sn":"UpdateTopItemVisual","rt":$n[1].Void},{"a":1,"n":"_activeSupportActivator","t":4,"rt":SupportActivator,"sn":"_activeSupportActivator"},{"a":1,"n":"_activeTopItemObject","t":4,"rt":$n[0].GameObject,"sn":"_activeTopItemObject"},{"a":1,"n":"_currentFloatingY","t":4,"rt":$n[1].Single,"sn":"_currentFloatingY","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_floatingOffset","t":4,"rt":$n[1].Single,"sn":"_floatingOffset","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_originalCheckDistance","t":4,"rt":$n[1].Single,"sn":"_originalCheckDistance","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"_originalPosCaptured","t":4,"rt":$n[1].Boolean,"sn":"_originalPosCaptured","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":1,"n":"_originalTopItemLocalPos","t":4,"rt":$n[0].Vector3,"sn":"_originalTopItemLocalPos"},{"a":1,"n":"_topItemRigidbody","t":4,"rt":$n[0].Rigidbody,"sn":"_topItemRigidbody"},{"a":1,"n":"_visualEffectsActive","t":4,"rt":$n[1].Boolean,"sn":"_visualEffectsActive","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"elementScale","t":4,"rt":$n[0].Vector3,"sn":"elementScale"},{"a":2,"n":"finalWoodSupportPrefab","t":4,"rt":$n[0].GameObject,"sn":"finalWoodSupportPrefab"},{"at":[new UnityEngine.HeaderAttribute("Holder & Layout")],"a":2,"n":"holder","t":4,"rt":$n[0].Transform,"sn":"holder"},{"a":2,"n":"numberOfLevels","t":4,"rt":$n[1].Int32,"sn":"numberOfLevels","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HeaderAttribute("Particle System")],"a":2,"n":"sparkleParticle","t":4,"rt":$n[0].ParticleSystem,"sn":"sparkleParticle"},{"at":[new UnityEngine.HeaderAttribute("Behaviour")],"a":2,"n":"spawnAtStart","t":4,"rt":$n[1].Boolean,"sn":"spawnAtStart","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"topItem","t":4,"rt":$n[0].Transform,"sn":"topItem"},{"a":2,"n":"topItemList","t":4,"rt":$n[3].List$1(WoodTower.TopItemEntry),"sn":"topItemList"},{"at":[new UnityEngine.HeaderAttribute("Top Item Settings")],"a":2,"n":"topOffset","t":4,"rt":$n[0].Vector3,"sn":"topOffset"},{"a":2,"n":"verticalSpacing","t":4,"rt":$n[1].Single,"sn":"verticalSpacing","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Prefabs")],"a":2,"n":"woodSupportPrefab","t":4,"rt":$n[0].GameObject,"sn":"woodSupportPrefab"}]}; }, $n);
    /*WoodTower end.*/

    /*WoodTower+TopItemEntry start.*/
    $m("WoodTower.TopItemEntry", function () { return {"td":WoodTower,"att":1056770,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"gameObject","t":4,"rt":$n[0].GameObject,"sn":"gameObject"},{"a":2,"n":"rigidbody","t":4,"rt":$n[0].Rigidbody,"sn":"rigidbody"},{"a":2,"n":"supportActivator","t":4,"rt":SupportActivator,"sn":"supportActivator"},{"a":2,"n":"type","t":4,"rt":WoodTower.TopItemType,"sn":"type","box":function ($v) { return Bridge.box($v, WoodTower.TopItemType, System.Enum.toStringFn(WoodTower.TopItemType));}}]}; }, $n);
    /*WoodTower+TopItemEntry end.*/

    /*WoodTower+TopItemType start.*/
    $m("WoodTower.TopItemType", function () { return {"td":WoodTower,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Banana","is":true,"t":4,"rt":WoodTower.TopItemType,"sn":"Banana","box":function ($v) { return Bridge.box($v, WoodTower.TopItemType, System.Enum.toStringFn(WoodTower.TopItemType));}},{"a":2,"n":"Cucumber","is":true,"t":4,"rt":WoodTower.TopItemType,"sn":"Cucumber","box":function ($v) { return Bridge.box($v, WoodTower.TopItemType, System.Enum.toStringFn(WoodTower.TopItemType));}},{"a":2,"n":"Donut","is":true,"t":4,"rt":WoodTower.TopItemType,"sn":"Donut","box":function ($v) { return Bridge.box($v, WoodTower.TopItemType, System.Enum.toStringFn(WoodTower.TopItemType));}},{"a":2,"n":"Eggplant","is":true,"t":4,"rt":WoodTower.TopItemType,"sn":"Eggplant","box":function ($v) { return Bridge.box($v, WoodTower.TopItemType, System.Enum.toStringFn(WoodTower.TopItemType));}},{"a":2,"n":"Strawberry","is":true,"t":4,"rt":WoodTower.TopItemType,"sn":"Strawberry","box":function ($v) { return Bridge.box($v, WoodTower.TopItemType, System.Enum.toStringFn(WoodTower.TopItemType));}},{"a":2,"n":"Watermelon","is":true,"t":4,"rt":WoodTower.TopItemType,"sn":"Watermelon","box":function ($v) { return Bridge.box($v, WoodTower.TopItemType, System.Enum.toStringFn(WoodTower.TopItemType));}}]}; }, $n);
    /*WoodTower+TopItemType end.*/

    /*ToonyColorsPro.Runtime.TCP2_CameraDepth start.*/
    $m("ToonyColorsPro.Runtime.TCP2_CameraDepth", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.ExecuteInEditModeAttribute(),new UnityEngine.RequireComponent.ctor(UnityEngine.Camera)],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"OnEnable","t":8,"sn":"OnEnable","rt":$n[1].Void},{"a":1,"n":"OnValidate","t":8,"sn":"OnValidate","rt":$n[1].Void},{"a":1,"n":"SetCameraDepth","t":8,"sn":"SetCameraDepth","rt":$n[1].Void},{"a":2,"n":"RenderDepth","t":4,"rt":$n[1].Boolean,"sn":"RenderDepth","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}}]}; }, $n);
    /*ToonyColorsPro.Runtime.TCP2_CameraDepth end.*/

    /*ToonyColorsPro.Runtime.TCP2_RuntimeUtils start.*/
    $m("ToonyColorsPro.Runtime.TCP2_RuntimeUtils", function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"GetShaderWithKeywords","is":true,"t":8,"pi":[{"n":"material","pt":$n[0].Material,"ps":0}],"sn":"GetShaderWithKeywords","rt":$n[0].Shader,"p":[$n[0].Material]},{"a":1,"n":"BASE_SHADER_NAME","is":true,"t":4,"rt":$n[1].String,"sn":"BASE_SHADER_NAME"},{"a":1,"n":"BASE_SHADER_NAME_MOB","is":true,"t":4,"rt":$n[1].String,"sn":"BASE_SHADER_NAME_MOB"},{"a":1,"n":"BASE_SHADER_PATH","is":true,"t":4,"rt":$n[1].String,"sn":"BASE_SHADER_PATH"},{"a":1,"n":"ShaderVariants","is":true,"t":4,"rt":$n[3].List$1(System.Array.type(System.String)),"sn":"ShaderVariants"},{"a":1,"n":"VARIANT_SHADER_PATH","is":true,"t":4,"rt":$n[1].String,"sn":"VARIANT_SHADER_PATH"}]}; }, $n);
    /*ToonyColorsPro.Runtime.TCP2_RuntimeUtils end.*/

    /*MyBox.Billboard start.*/
    $m("MyBox.Billboard", function () { return {"att":1048577,"a":2,"at":[new UnityEngine.ExecuteAlwaysAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"Awake","t":8,"sn":"Awake","rt":$n[1].Void},{"a":1,"n":"Update","t":8,"sn":"Update","rt":$n[1].Void},{"a":2,"n":"facedObject","t":4,"rt":$n[0].Transform,"sn":"facedObject"},{"a":1,"n":"mainCam","t":4,"rt":$n[0].Camera,"sn":"mainCam"},{"a":1,"n":"mainCamTransform","t":4,"rt":$n[0].Transform,"sn":"mainCamTransform"}]}; }, $n);
    /*MyBox.Billboard end.*/

    /*HG.Playables.Tools.TowerGenerator start.*/
    $m("HG.Playables.Tools.TowerGenerator", function () { return {"nested":[$n[8].TowerGenerator.TowerShape,$n[8].TowerGenerator.FruitPatternItem,$n[8].TowerGenerator.PatternRowGroup],"att":1048577,"a":2,"at":[new UnityEngine.ExecuteAlwaysAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":1,"n":"BuildCircularFilledPatternRow","t":8,"pi":[{"n":"row","pt":$n[8].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowParent","pt":$n[0].Transform,"ps":1},{"n":"towerRoot","pt":$n[0].Transform,"ps":2},{"n":"rowIndex","pt":$n[1].Int32,"ps":3}],"sn":"BuildCircularFilledPatternRow","rt":$n[1].Void,"p":[$n[8].TowerGenerator.PatternRowGroup,$n[0].Transform,$n[0].Transform,$n[1].Int32]},{"a":1,"n":"BuildCircularPatternRow","t":8,"pi":[{"n":"row","pt":$n[8].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowParent","pt":$n[0].Transform,"ps":1},{"n":"towerRoot","pt":$n[0].Transform,"ps":2},{"n":"rowIndex","pt":$n[1].Int32,"ps":3}],"sn":"BuildCircularPatternRow","rt":$n[1].Void,"p":[$n[8].TowerGenerator.PatternRowGroup,$n[0].Transform,$n[0].Transform,$n[1].Int32]},{"a":1,"n":"BuildSquarePatternRow","t":8,"pi":[{"n":"row","pt":$n[8].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowParent","pt":$n[0].Transform,"ps":1},{"n":"towerRoot","pt":$n[0].Transform,"ps":2},{"n":"rowIndex","pt":$n[1].Int32,"ps":3}],"sn":"BuildSquarePatternRow","rt":$n[1].Void,"p":[$n[8].TowerGenerator.PatternRowGroup,$n[0].Transform,$n[0].Transform,$n[1].Int32]},{"at":[new UnityEngine.ContextMenu.ctor("Build Tower")],"a":2,"n":"BuildTower","t":8,"sn":"BuildTower","rt":$n[1].Void},{"at":[new UnityEngine.ContextMenu.ctor("Clear Generated")],"a":2,"n":"ClearGenerated","t":8,"sn":"ClearGenerated","rt":$n[1].Void},{"a":1,"n":"ClearGenerated","is":true,"t":8,"pi":[{"n":"root","pt":$n[0].Transform,"ps":0}],"sn":"ClearGenerated","rt":$n[1].Void,"p":[$n[0].Transform]},{"a":1,"n":"DrawCircleGizmo","is":true,"t":8,"pi":[{"n":"center","pt":$n[0].Vector3,"ps":0},{"n":"radius","pt":$n[1].Single,"ps":1}],"sn":"DrawCircleGizmo","rt":$n[1].Void,"p":[$n[0].Vector3,$n[1].Single]},{"a":1,"n":"DrawRectangleGizmo","is":true,"t":8,"pi":[{"n":"center","pt":$n[0].Vector3,"ps":0},{"n":"gridWidth","pt":$n[1].Int32,"ps":1},{"n":"gridHeight","pt":$n[1].Int32,"ps":2},{"n":"radius","pt":$n[1].Single,"ps":3}],"sn":"DrawRectangleGizmo","rt":$n[1].Void,"p":[$n[0].Vector3,$n[1].Int32,$n[1].Int32,$n[1].Single]},{"a":1,"n":"GetFruitFromPattern","t":8,"pi":[{"n":"row","pt":$n[8].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowIndex","pt":$n[1].Int32,"ps":1}],"sn":"GetFruitFromPattern","rt":$n[8].TowerGenerator.FruitPatternItem,"p":[$n[8].TowerGenerator.PatternRowGroup,$n[1].Int32]},{"a":1,"n":"GetOrCreateGeneratedRoot","t":8,"sn":"GetOrCreateGeneratedRoot","rt":$n[0].Transform},{"a":1,"n":"GetPatternRowName","t":8,"pi":[{"n":"rowIndex","pt":$n[1].Int32,"ps":0},{"n":"group","pt":$n[8].TowerGenerator.PatternRowGroup,"ps":1}],"sn":"GetPatternRowName","rt":$n[1].String,"p":[$n[1].Int32,$n[8].TowerGenerator.PatternRowGroup]},{"a":1,"n":"GetRowY","t":8,"pi":[{"n":"rowIndex","pt":$n[1].Int32,"ps":0}],"sn":"GetRowY","rt":$n[1].Single,"p":[$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"GetRowYWithPattern","t":8,"pi":[{"n":"group","pt":$n[8].TowerGenerator.PatternRowGroup,"ps":0},{"n":"rowIndex","pt":$n[1].Int32,"ps":1}],"sn":"GetRowYWithPattern","rt":$n[1].Single,"p":[$n[8].TowerGenerator.PatternRowGroup,$n[1].Int32],"box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":1,"n":"InstantiatePreservingPrefab","is":true,"t":8,"pi":[{"n":"prefab","pt":$n[0].GameObject,"ps":0},{"n":"parent","pt":$n[0].Transform,"ps":1}],"sn":"InstantiatePreservingPrefab","rt":$n[0].GameObject,"p":[$n[0].GameObject,$n[0].Transform]},{"a":1,"n":"OnDrawGizmosSelected","t":8,"sn":"OnDrawGizmosSelected","rt":$n[1].Void},{"a":1,"n":"SetupTowerComponent","t":8,"pi":[{"n":"instance","pt":$n[0].GameObject,"ps":0},{"n":"towerRoot","pt":$n[0].Transform,"ps":1},{"n":"rowIndex","pt":$n[1].Int32,"ps":2}],"sn":"SetupTowerComponent","rt":$n[1].Void,"p":[$n[0].GameObject,$n[0].Transform,$n[1].Int32]},{"a":1,"n":"GeneratedRootName","is":true,"t":4,"rt":$n[1].String,"sn":"GeneratedRootName"},{"a":2,"n":"clearBeforeBuild","t":4,"rt":$n[1].Boolean,"sn":"clearBeforeBuild","box":function ($v) { return Bridge.box($v, System.Boolean, System.Boolean.toString);}},{"a":2,"n":"parentOverride","t":4,"rt":$n[0].Transform,"sn":"parentOverride"},{"at":[new UnityEngine.HeaderAttribute("Pattern Row Groups (repeating fruit patterns)")],"a":2,"n":"patternRowGroups","t":4,"rt":$n[3].List$1(HG.Playables.Tools.TowerGenerator.PatternRowGroup),"sn":"patternRowGroups"},{"a":2,"n":"rowHeight","t":4,"rt":$n[1].Single,"sn":"rowHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("General Settings")],"a":2,"n":"shape","t":4,"rt":$n[8].TowerGenerator.TowerShape,"sn":"shape","box":function ($v) { return Bridge.box($v, HG.Playables.Tools.TowerGenerator.TowerShape, System.Enum.toStringFn(HG.Playables.Tools.TowerGenerator.TowerShape));}},{"a":2,"n":"startY","t":4,"rt":$n[1].Single,"sn":"startY","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*HG.Playables.Tools.TowerGenerator end.*/

    /*HG.Playables.Tools.TowerGenerator+TowerShape start.*/
    $m("HG.Playables.Tools.TowerGenerator.TowerShape", function () { return {"td":$n[8].TowerGenerator,"att":258,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Circular","is":true,"t":4,"rt":$n[8].TowerGenerator.TowerShape,"sn":"Circular","box":function ($v) { return Bridge.box($v, HG.Playables.Tools.TowerGenerator.TowerShape, System.Enum.toStringFn(HG.Playables.Tools.TowerGenerator.TowerShape));}},{"a":2,"n":"CircularFilled","is":true,"t":4,"rt":$n[8].TowerGenerator.TowerShape,"sn":"CircularFilled","box":function ($v) { return Bridge.box($v, HG.Playables.Tools.TowerGenerator.TowerShape, System.Enum.toStringFn(HG.Playables.Tools.TowerGenerator.TowerShape));}},{"a":2,"n":"Square","is":true,"t":4,"rt":$n[8].TowerGenerator.TowerShape,"sn":"Square","box":function ($v) { return Bridge.box($v, HG.Playables.Tools.TowerGenerator.TowerShape, System.Enum.toStringFn(HG.Playables.Tools.TowerGenerator.TowerShape));}}]}; }, $n);
    /*HG.Playables.Tools.TowerGenerator+TowerShape end.*/

    /*HG.Playables.Tools.TowerGenerator+FruitPatternItem start.*/
    $m("HG.Playables.Tools.TowerGenerator.FruitPatternItem", function () { return {"td":$n[8].TowerGenerator,"att":1056770,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"angleOffsetDegrees","t":4,"rt":$n[1].Single,"sn":"angleOffsetDegrees","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"fruitPrefab","t":4,"rt":$n[0].GameObject,"sn":"fruitPrefab"},{"a":2,"n":"radius","t":4,"rt":$n[1].Single,"sn":"radius","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"rowHeight","t":4,"rt":$n[1].Single,"sn":"rowHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"scale","t":4,"rt":$n[1].Single,"sn":"scale","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}}]}; }, $n);
    /*HG.Playables.Tools.TowerGenerator+FruitPatternItem end.*/

    /*HG.Playables.Tools.TowerGenerator+PatternRowGroup start.*/
    $m("HG.Playables.Tools.TowerGenerator.PatternRowGroup", function () { return {"td":$n[8].TowerGenerator,"att":1056770,"a":2,"at":[new System.SerializableAttribute()],"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"endRowIndex","t":4,"rt":$n[1].Int32,"sn":"endRowIndex","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"fillSpacing","t":4,"rt":$n[1].Single,"sn":"fillSpacing","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"at":[new UnityEngine.HeaderAttribute("Fruit Pattern")],"a":2,"n":"fruitPattern","t":4,"rt":System.Array.type(HG.Playables.Tools.TowerGenerator.FruitPatternItem),"sn":"fruitPattern"},{"a":2,"n":"gridHeight","t":4,"rt":$n[1].Int32,"sn":"gridHeight","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HeaderAttribute("Grid Settings (Square Shape Only)")],"a":2,"n":"gridWidth","t":4,"rt":$n[1].Int32,"sn":"gridWidth","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"itemsInRow","t":4,"rt":$n[1].Int32,"sn":"itemsInRow","box":function ($v) { return Bridge.box($v, System.Int32);}},{"at":[new UnityEngine.HeaderAttribute("Pattern Settings")],"a":2,"n":"name","t":4,"rt":$n[1].String,"sn":"name"},{"a":2,"n":"patternRepeatCount","t":4,"rt":$n[1].Int32,"sn":"patternRepeatCount","box":function ($v) { return Bridge.box($v, System.Int32);}},{"a":2,"n":"perRowHeight","t":4,"rt":$n[1].Single,"sn":"perRowHeight","box":function ($v) { return Bridge.box($v, System.Single, System.Single.format, System.Single.getHashCode);}},{"a":2,"n":"startRowIndex","t":4,"rt":$n[1].Int32,"sn":"startRowIndex","box":function ($v) { return Bridge.box($v, System.Int32);}}]}; }, $n);
    /*HG.Playables.Tools.TowerGenerator+PatternRowGroup end.*/

    }});
