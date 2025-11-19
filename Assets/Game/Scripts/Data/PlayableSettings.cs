using System;
using System.Collections;
using System.Linq;
using Cinemachine;
using HomaPlayables;
using UnityEngine;
using UnityEngine.Serialization;

public enum ThrowableObjectType
{
    Pumpkins,
    Watermelon
}

public enum MovementIndicatorType
{
    Triangle,
    Periscope
}

public class PlayableSettings : MonoBehaviour
{
    public static PlayableSettings instance;
    
    [Header("Serializable Data")] 
    public Transform playerCamera;
    public ColoredMaterial[] coloredMaterials;
    public Sprite[] cursors;
    public Sunlight sunlight;

    private void Awake()
    {
        if (instance == null)
            instance = this;
        
        // Only set camera angle if intro is disabled
        if (!enableIntro)
        {
            playerCamera.eulerAngles = cameraAngle;
        }
        
        SetMaterials();

        if (UIManager.instance == null)
        {
            Debug.LogWarning("UIManager.instance is null in PlayableSettings.Awake. Consider checking script execution order.");
            return;
        }
        
        UIManager.instance.topBanner .SetActive(PlayableSettings.instance.displayTopBanner);
        UIManager.instance.midBanner.SetActive(PlayableSettings.instance.displayMidBanner);
        
        UIManager.instance.bottomBanner.SetActive(PlayableSettings.instance.displayBotBanner);
        
        // Initialize joysticks in UIManager
        UIManager.instance.InitializeJoysticks();
    }

    #region General
    
    [Header("Game playable config")] [HomaVar
("Gameplay Timer", 1, "General")]
    public float gameTimeInSeconds = 100f;

    [HomaVar("Start Gameplay Timer on Touch", 1, "General")]
    public bool startGameplayTimerOnTouch = true;

    [HomaVar("Game Over Delay", 0, "General")]
    public float gameOverScreenDelay = 2f;
    
    [HomaVar("Camera Angle", 0, "General")]
    public Vector3 cameraAngle = new Vector3(60, 0, 0);
    
    [HomaVar("Enable Hand Cursor", 0, "General")]
    public bool enableHandCursor = true;
    
    [HomaVar
("Hand Cursor Scale", 0, "General")]
    public float cursorScale = 1f;
    
    [HomaVar
("Hand Cursor", 0, "General")]
    public HandCursorSkin handCursor = 0;
    
    [HomaVar
("Throwable Object Type", 0, "General")]
    public ThrowableObjectType throwableObjectType = ThrowableObjectType.Pumpkins;
    
    [HomaVar
("Show Flower", 0, "General")]
    public bool showFlower = true;
    

    #endregion


    [Header("Gameplay Leveling")]

    [HomaVar
("Level Up Size Increase Multiplier", 0, "Gameplay Leveling")]
    public float levelUpSizeIncreaseMultiplier = 1.2f;

    [HomaVar
("Elements Needed for First Level", 1, "Gameplay Leveling")]
    public int swallowCountFirstLevel = 8;

    [HomaVar
("Swallow Needed Multiplier", 2, "Gameplay Leveling")]
    public float swallowNeededMultiplier = 1.4f;

    public enum HoleSpeedIncreaseType { Additive, Multiplicative }
    [HomaVar
("Hole Speed Increase Type", 3, "Gameplay Leveling")]
    public HoleSpeedIncreaseType holeSpeedIncreaseType = HoleSpeedIncreaseType.Multiplicative;

    [HomaVar
("Hole Speed Increase (0-2)", 4, "Gameplay Leveling")]
    [Range(0f,2f)]
    public float holeSpeedIncrease = 0.2f;

    [HomaVar
("Objective Amount", 5, "Gameplay Leveling")]
    public int objectiveAmount = 30;

    [HomaVar
("Win When Swallow Top Item", 6, "Gameplay Leveling")]
    public bool enableWinOnSwallowTopItem = true;

    #region Intro

    [Header("Intro Settings")]
    [HomaVar
("Enable Intro", 0, "Intro")]
    public bool enableIntro = true;

    [HomaVar
("Start Camera Angle", 2, "Intro")]
    public Vector3 startCameraAngle = new Vector3(20, 0, 0);
    
    [HomaVar
("End Camera Angle", 3, "Intro")]
    public Vector3 endCameraAngle = new Vector3(60, 0, 0);
    
    [HomaVar
("Start Camera Position", 4, "Intro")]
    public Vector3 startCameraPosition = new Vector3(0, 5, -10);
    
    [HomaVar
("End Camera Position", 5, "Intro")]
    public Vector3 endCameraPosition = new Vector3(0, 8, -6);
    
    [HomaVar
("Camera Transition Delay", 6, "Intro")]
    public float cameraTransitionDelay = 0.5f;
    
    [HomaVar
("Camera Transition Duration", 7, "Intro")]
    public float cameraTransitionDuration = 2f;
    
    [HomaVar
("Start FOV", 8, "Intro")]
    public float startFOV = 40f;
    
    [HomaVar
("End FOV", 9, "Intro")]
    public float endFOV = 40f;
    
    [HomaVar
("FOV Transition Delay", 10, "Intro")]
    public float fovTransitionDelay = 0.5f;
    
    [HomaVar
("FOV Transition Duration", 11, "Intro")]
    public float fovTransitionDuration = 2f;
    
    [HomaVar
("Block Player Input", 12, "Intro")]
    public bool blockPlayerInput = true;
    
    [HomaVar
("Block Input Duration", 13, "Intro")]
    public float blockInputDuration = 0f; // How many seconds to block. 0 = block until intro completes
    
    [HomaVar
("Show Intro Text", 15, "Intro")]
    public bool showIntroText = true;
    
    [HomaVar
("Intro Text", 16, "Intro")]
    public string introText = "Welcome to the Game!";
    
    [HomaVar
("Intro Text Duration", 17, "Intro")]
    public float introTextDuration = 2f;
    
    [HomaVar
("Hide Intro Text on Player Touch", 18, "Intro")]
    public bool hideIntroTextOnPlayerTouch = false;
    
    [HomaVar
("Intro Text Hide After Duration", 19, "Intro")]
    public bool introTextHideAfterDuration = true;

    [HomaVar
("Enable Fake Control", 20, "Intro")]
    public bool enableFakeControl = false;

    [HomaVar
("DisplayMovingVisual", 21, "Intro")]
    public bool enableMovingVisual = false;
    
    [HomaVar
("DisplayMovingHand", 22, "Intro")]
    public bool enableMovingHand = false;

    #endregion

    #region Throwable Visual Effects

    [Header("Throwable Visual Effects")]
    [HomaVar
("Enable Floating Animation", 0, "Throwable Effects")]
    public bool enableFloatingAnimation = true;
    
    [HomaVar
("Floating Height", 1, "Throwable Effects")]
    public float floatingHeight = 0.3f;
    
    [HomaVar
("Floating Speed", 2, "Throwable Effects")]
    public float floatingSpeed = 2f;
    
    [HomaVar
("Enable Self Rotation", 3, "Throwable Effects")]
    public bool enableSelfRotation = true;
    
    [HomaVar
("Rotation Speed", 4, "Throwable Effects")]
    public float rotationSpeed = 45f;

    #endregion

    #region Wood Tower Top Item

    [Header("Wood Tower Top Item")]
    [HomaVar
("Selected Top Item", 0, "Wood Tower Top Item")]
    public WoodTower.TopItemType selectedTopItem = WoodTower.TopItemType.Banana;
    
    [HomaVar
("Enable Top Item Floating", 1, "Wood Tower Top Item")]
    public bool enableTopItemFloating = true;
    
    [HomaVar
("Top Item Floating Height", 2, "Wood Tower Top Item")]
    public float topItemFloatingHeight = 0.3f;
    
    [HomaVar
("Top Item Floating Speed", 3, "Wood Tower Top Item")]
    public float topItemFloatingSpeed = 2f;
    
    [HomaVar
("Enable Top Item Rotation", 4, "Wood Tower Top Item")]
    public bool enableTopItemRotation = true;
    
    [HomaVar
("Top Item Rotation Speed", 5, "Wood Tower Top Item")]
    public float topItemRotationSpeed = 45f;
    
    [HomaVar
("Enable Sparkle Particle", 6, "Wood Tower Top Item")]
    public bool enableSparkleParticle = true;
    
    [HomaVar
("Tower Width (X/Z)", 7, "Wood Tower Top Item")]
    public float towerWidth = 1.5f;
    
    [HomaVar
("Tower Height (Number of Levels)", 8, "Wood Tower Top Item")]
    public int towerHeight = 10;
    
    [HomaVar
("Top Item Size Multiplier", 9, "Wood Tower Top Item")]
    public float topItemSizeMultiplier = 1f;

    #endregion

    #region Tower Shooting

    [Header("Tower Shooting Win/Lose")] 
    [HomaVar
("Enable Tower Shooting Win", 0, "Tower Shooting")]
    public bool enableTowerShootingWin = false;
    
    [HomaVar
("Enable Tower Shooting Lose", 1, "Tower Shooting")]
    public bool enableTowerShootingLose = false;
    
    [HomaVar
("Auto Redirect Delay (seconds)", 2, "Tower Shooting")]
    public float towerWinAutoRedirectDelay = 1f;
    
    [HomaVar
("Tower Miss Check Delay (seconds)", 3, "Tower Shooting")]
    public float towerMissCheckDelay = 2f;

    #endregion

    #region Environment

    [HomaVar
("Ground Color", 0, "Environment Controls")]
    public Color groundColor = Color.white;
    
    [HomaVar
("Ground Texture", 0, "Environment Controls")]
    public int groundTexture = 0;
    
    [HomaVar
("Light Color", 1, "Environment Controls")]
    public Color lightColor = new Color(1f, 0.94248325f, 0.8726415f, 1f);
    
    [HomaVar
("Light Intensity", 2, "Environment Controls")]
    public float lightIntensity = 0.75f;
    
    [HomaVar
("Light Rotation", 3, "Environment Controls")]
    public Vector3 lightRotation = new Vector3(50f, -139.995f, 0f);

    #endregion
    
    #region Joystick

    [Header("Joystick Settings")]
    [HomaVar
("Enable Joystick", 0, "Joystick")]
    public bool enableJoystick = false;
    
    [HomaVar
("Enable Tuto Joystick", 1, "Joystick")]
    public bool enableTutoJoystick = false;
    
    [HomaVar
("Tuto Joystick Show at Start", 2, "Joystick")]
    public bool tutoJoystickShowAtStart = true;
    
    [HomaVar
("Delay Before Display (seconds)", 3, "Joystick")]
    public float tutoJoystickDisplayDelay = 0f;
    
    [HomaVar
("Enable Tuto Joystick Redisplay", 4, "Joystick")]
    public bool enableTutoJoystickAfterTouch = false;
    
    [HomaVar
("Redisplay After Seconds (no touch)", 5, "Joystick")]
    public float tutoJoystickShowTimesAfterTouch = 3f;

    #endregion
    
    #region Player

    [Header("Player playable config")] 
    
    [HomaVar
("Player Speed", 1, "Player Controls")]
    public float holeMoveSpeed = 2f;

    [HomaVar
("Hole Color", 2, "Player Controls")]
    public Color holeColor = Color.black;
    
    [HomaVar
("Hole Skin", 2, "Player Controls")]
    public int holeSkin = 0;
    
    [HomaVar
("Movement Indicator Color", 3, "Player Controls")]
    public Color movementIndicatorColor = Color.white;
    
    [HomaVar
("Enable Movement Indicator", 3, "Player Controls")]
    public bool enableMovementIndicator = true;

    [HomaVar
("Hide Movement Indicator When Idle", 3, "Player Controls")]
    public bool hideMovementIndicatorWhenIdle = true;
    
    [HomaVar
("Movement Indicator Type", 3, "Player Controls")]
    public MovementIndicatorType movementIndicatorType = MovementIndicatorType.Triangle;
    
    [HomaVar
("Aim Arrow Color", 4, "Player Controls")]
    public Color aimArrowColor = Color.white;
    
    [HomaVar
("Use Hole Start Position", 5, "Player Controls")]
    public bool useHoleStartPosition = false;
    
    [HomaVar
("Hole Start Position", 6, "Player Controls")]
    public Vector3 holeStartPosition = Vector3.zero;

    [HomaVar
("HoleCountFeedback", 7, "Player Controls")]
    public bool displayHoleCountFeedback = false;
    
    [HomaVar
("Enable Arrow Direction", 8, "Player Controls")]
    public bool enableArrowDirection = false;
    
    [HomaVar
("Arrow Direction Target Type", 9, "Player Controls")]
    public ArrowDirection.TargetType arrowDirectionTargetType = ArrowDirection.TargetType.ClosestTopItem;
    
    [HomaVar
("Arrow Direction Color", 10, "Player Controls")]
    public Color arrowDirectionColor = Color.white;
    
    [HomaVar
("Arrow Direction Outline Color", 11, "Player Controls")]
    public Color arrowDirectionOutlineColor = Color.white;
    
    [HomaVar
("Arrow Direction Scale", 12, "Player Controls")]
    public float arrowDirectionScale = 1f;
    
    [HomaVar
("Arrow Direction Position", 13, "Player Controls")]
    public Vector3 arrowDirectionPosition = new Vector3(0f, 0.5f, 0.7f);
    
    [HomaVar
("Arrow Direction Model", 14, "Player Controls")]
    public ArrowDirection.ArrowModelType arrowDirectionModel = ArrowDirection.ArrowModelType.Model1;
    
    [HomaVar
("Arrow Direction Yoyo Speed", 15, "Player Controls")]
    public float arrowDirectionYoyoSpeed = 2f;
    
    [HomaVar
("Arrow Direction Yoyo Distance", 16, "Player Controls")]
    public float arrowDirectionYoyoDistance = 0.2f;
    
    [HomaVar
("Show HoleGrowingVFX", 17, "Player Controls")]
    public bool showHoleGrowVFX =true;
    #endregion

    #region Level Settings

    [Header("Level Settings")]
    [HomaVar
("Level", 0, "Level Settings")]
    public LevelIndex Level = 0;

    [HomaVar
("Corridor Theme", 1, "Level Settings")]
    public ResourceLoader.LevelTheme corridorTheme;
    [HomaVar
("Circular Theme", 2, "Level Settings")]
    public ResourceLoader.LevelTheme circularTheme;
    [HomaVar
("LvlCircular1 Theme", 3, "Level Settings")]
    public ResourceLoader.LevelTheme lvlCircular1Theme;
    [HomaVar
("LvlCircular2 Theme", 4, "Level Settings")]
    public ResourceLoader.LevelTheme lvlCircular2Theme;
    [HomaVar
("LvlCircular3 Theme", 5, "Level Settings")]
    public ResourceLoader.LevelTheme lvlCircular3Theme;
    [HomaVar
("LvlCircular4 Theme", 6, "Level Settings")]
    public ResourceLoader.LevelTheme lvlCircular4Theme;

    #endregion

    [Header("Banner")] 
    
    [HomaVar
("Display Top Banner", 0, "Banner")]
    public bool displayTopBanner = false;
    [HomaVar
("Display Mid Banner", 1, "Banner")]
    public bool displayMidBanner = false;
    [HomaVar
("Display Bottom Banner", 2, "Banner")]
    public bool displayBotBanner = false;
    
    #region Audio
    
    [Header("Audio Settings")]
    [HomaVarAsset("Win Sound", 1, "Audio")]
    public AudioClip winSound;
    
    [HomaVarAsset("Tower Hit Sound", 2, "Audio")]
    public AudioClip towerHitSound;
    
    [HomaVarAsset("Shoot Sound", 3, "Audio")]
    public AudioClip shootSound;
    
    [HomaVarAsset("Fail Sound", 4, "Audio")]
    public AudioClip failSound;
    
    [HomaVarAsset("Intro Sound", 5, "Audio")]
    public AudioClip introSound;
    
    [HomaVarAsset("Hole Grow Sound", 6, "Audio")]
    public AudioClip holeGrowSound;

    [HomaVarAsset("Hole Collect Sound", 7, "Audio")]
    public AudioClip collectItemSFX;
    #endregion
    
    #region Store Redirect Settings
    
    [Header("Store Redirect Settings")]
    [HomaVar
("Enable Click Redirection", 0, "Store Redirect")]
    public bool enableClickRedirection = true;
    
    [HomaVar
("Clicks to Redirect", 1, "Store Redirect")]
    public int clicksToRedirect = 3;
    
    [HomaVar
("Enable Time Redirection", 2, "Store Redirect")]
    public bool enableTimeRedirection = true;
    
    [HomaVar
("Time to Redirect (seconds)", 3, "Store Redirect")]
    public float timeToRedirect = 30f;
    
    [HomaVar
("Redirect After Throw", 4, "Store Redirect")]
    public bool redirectAfterThrow = true;
    
    [HomaVar
("Redirect Delay After Throw (seconds)", 5, "Store Redirect")]
    public float redirectDelayAfterThrow = 1f;
    
    [HomaVar
("Redirect After First Redirection", 6, "Store Redirect")]
    public bool enableRedirectAfterFirst = true;
    
    #endregion
    
    [Header("Objectives UI")]
    [HomaVar
("Enable Objectives UI", 0, "Objectives")] 
    public bool enableObjectivesUI = true;
    [HomaVar
("Show Only Top Item", 1, "Objectives")] 
    public bool objectivesOnlyTopItem = false;
    
    [HomaVar
("Show Tutorial Cue", 2, "Objectives")] 
    public bool enableObjectivesTuto = true;
    
    [HomaVar
("Glow Speed", 3, "Objectives")] 
    public float objectivesTutoGlowSpeed = 1.0f; // higher = faster
    
    [HomaVar
("Travel Time (sec)", 4, "Objectives")] 
    public float objectivesTutoTravelTime = 1.0f; // time to go from left to right
    
    [HomaVar
("End Pause (sec)", 5, "Objectives")] 
    public float objectivesTutoEndPause = 0.2f;

    [HomaVar
("Pickup Flight Feedback", 6, "Objectives")]
    public bool enableObjectivePickupFlight = false;

    [HomaVar("Pickup Flight Duration", 7, "Objectives")]
    public float objectivePickupFlightDuration = 0.6f;
    
    #region Ressource
    // [Header("Resources playable")]
    // [LunaPlaygroundAsset("Font", 1, "Resources Playable")]
    // public Font gameFontLuna;
    // [LunaPlaygroundAsset("Music", 2, "Resources Playable")]
    // public AudioClip musicClipLuna;
    // [LunaPlaygroundAsset("TopBanner", 3, "Resources Playable")]
    // public Texture2D topBannerLuna;
    // [LunaPlaygroundAsset("MidBanner", 4, "Resources Playable")]
    // public Texture2D midBannerLuna;
    // [LunaPlaygroundAsset("BottomBanner", 5, "Resources Playable")]
    // public Texture2D bottomBannerLuna;
    // [LunaPlaygroundAsset("WinImage", 6, "Resources Playable")]
    // public Texture2D winImageLuna;
    // [LunaPlaygroundAsset("FailImage", 7, "Resources Playable")]
    // public Texture2D failImageLuna;

    #endregion

    #region Methods

    public void CameraZoomOut(float value)
    {
        StartCoroutine(SmoothCameraZoomOut(value));
    }
    
    private IEnumerator SmoothCameraZoomOut(float value)
    {
        CinemachineVirtualCamera holeVcCam = playerCamera.GetComponent<CinemachineVirtualCamera>();
        var framingTransposer = holeVcCam.GetCinemachineComponent<CinemachineFramingTransposer>();
        
        if (framingTransposer == null) yield break;
        
        float startDistance = framingTransposer.m_CameraDistance;
        float targetDistance = startDistance + (value * 1.5f);
        float duration = 0.5f; // Smooth zoom duration
        float elapsedTime = 0f;
        
        while (elapsedTime < duration)
        {
            elapsedTime += Time.deltaTime;
            float progress = elapsedTime / duration;
            
            float smoothProgress = Mathf.SmoothStep(0f, 1f, progress);
            framingTransposer.m_CameraDistance = Mathf.Lerp(startDistance, targetDistance, smoothProgress);
            
            yield return null;
        }
        
        framingTransposer.m_CameraDistance = targetDistance;
    }

    private void SetMaterials()
    {
        foreach (var coloredMaterial in coloredMaterials)
        {
            switch (coloredMaterial.MaterialHolder)
            {
                case MaterialHolder.Hole:
                    coloredMaterial.Material.color = holeColor;
                    break;
                case MaterialHolder.Ground:
                    coloredMaterial.Material.color = groundColor;
                    coloredMaterial.Material.SetTexture(coloredMaterial.TextureField, coloredMaterial.Textures[groundTexture]);
                    break;
            }
        }
        
        //ApplyAimArrowColor();
        
        ApplyArrowDirectionSettings();
        
        ApplyLightSettings();
    }
    
    // private void ApplyAimArrowColor()
    // {
    //     var aimArrow = FindObjectOfType<AimArrow>();
    //     if (aimArrow != null)
    //     {
    //         aimArrow.SetArrowColor(aimArrowColor);
    //     }
    // }
    
    private void ApplyArrowDirectionSettings()
    {
        var arrowDirection = FindObjectOfType<ArrowDirection>();
        if (arrowDirection != null)
        {
            arrowDirection.SetArrowColor(arrowDirectionColor);
            arrowDirection.SetArrowScale(arrowDirectionScale);
            arrowDirection.SetArrowPosition(arrowDirectionPosition);
            arrowDirection.SetArrowModel(arrowDirectionModel);
            arrowDirection.SetYoyoSettings(arrowDirectionYoyoSpeed, arrowDirectionYoyoDistance);
        }
    }
    
    private void ApplyLightSettings()
    {
        if (sunlight != null && sunlight.sunlightLight != null)
        {
            sunlight.sunlightLight.color = lightColor;
            sunlight.sunlightLight.intensity = lightIntensity;
            sunlight.transform.eulerAngles = lightRotation;
        }
    }

    #endregion

    public enum PlayerSkinIndex
    {
        Default = 0
    }
    
    public enum LevelIndex
    {
        C38V1 = 0,
        C38V2 = 1,
        C38V3 = 2
    }
}