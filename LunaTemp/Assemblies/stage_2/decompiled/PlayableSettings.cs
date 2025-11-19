using System.Collections;
using Cinemachine;
using UnityEngine;

public class PlayableSettings : MonoBehaviour
{
	public enum HoleSpeedIncreaseType
	{
		Additive,
		Multiplicative
	}

	public enum PlayerSkinIndex
	{
		Default
	}

	public enum LevelIndex
	{
		C38V1,
		C38V2,
		C38V3
	}

	public static PlayableSettings instance;

	[Header("Serializable Data")]
	public Transform playerCamera;

	public ColoredMaterial[] coloredMaterials;

	public Sprite[] cursors;

	public Sunlight sunlight;

	[Header("Game playable config")]
	[LunaPlaygroundField("Gameplay Timer", 1, "General", false, null)]
	public float gameTimeInSeconds = 100f;

	[LunaPlaygroundField("Start Gameplay Timer on Touch", 1, "General", false, null)]
	public bool startGameplayTimerOnTouch = true;

	[LunaPlaygroundField("Game Over Delay", 0, "General", false, null)]
	public float gameOverScreenDelay = 2f;

	[LunaPlaygroundField("Camera Angle", 0, "General", false, null)]
	public Vector3 cameraAngle = new Vector3(60f, 0f, 0f);

	[LunaPlaygroundField("Enable Hand Cursor", 0, "General", false, null)]
	public bool enableHandCursor = true;

	[LunaPlaygroundField("Hand Cursor Scale", 0, "General", false, null)]
	public float cursorScale = 1f;

	[LunaPlaygroundField("Hand Cursor", 0, "General", false, null)]
	public HandCursorSkin handCursor = HandCursorSkin.Default;

	[LunaPlaygroundField("Throwable Object Type", 0, "General", false, null)]
	public ThrowableObjectType throwableObjectType = ThrowableObjectType.Pumpkins;

	[LunaPlaygroundField("Show Flower", 0, "General", false, null)]
	public bool showFlower = true;

	[Header("Gameplay Leveling")]
	[LunaPlaygroundField("Level Up Size Increase Multiplier", 0, "Gameplay Leveling", false, null)]
	public float levelUpSizeIncreaseMultiplier = 1.2f;

	[LunaPlaygroundField("Elements Needed for First Level", 1, "Gameplay Leveling", false, null)]
	public int swallowCountFirstLevel = 8;

	[LunaPlaygroundField("Swallow Needed Multiplier", 2, "Gameplay Leveling", false, null)]
	public float swallowNeededMultiplier = 1.4f;

	[LunaPlaygroundField("Hole Speed Increase Type", 3, "Gameplay Leveling", false, null)]
	public HoleSpeedIncreaseType holeSpeedIncreaseType = HoleSpeedIncreaseType.Multiplicative;

	[LunaPlaygroundField("Hole Speed Increase (0-2)", 4, "Gameplay Leveling", false, null)]
	[Range(0f, 2f)]
	public float holeSpeedIncrease = 0.2f;

	[LunaPlaygroundField("Objective Amount", 5, "Gameplay Leveling", false, null)]
	public int objectiveAmount = 30;

	[LunaPlaygroundField("Win When Swallow Top Item", 6, "Gameplay Leveling", false, null)]
	public bool enableWinOnSwallowTopItem = true;

	[Header("Intro Settings")]
	[LunaPlaygroundField("Enable Intro", 0, "Intro", false, null)]
	public bool enableIntro = true;

	[LunaPlaygroundField("Start Camera Angle", 2, "Intro", false, null)]
	public Vector3 startCameraAngle = new Vector3(20f, 0f, 0f);

	[LunaPlaygroundField("End Camera Angle", 3, "Intro", false, null)]
	public Vector3 endCameraAngle = new Vector3(60f, 0f, 0f);

	[LunaPlaygroundField("Start Camera Position", 4, "Intro", false, null)]
	public Vector3 startCameraPosition = new Vector3(0f, 5f, -10f);

	[LunaPlaygroundField("End Camera Position", 5, "Intro", false, null)]
	public Vector3 endCameraPosition = new Vector3(0f, 8f, -6f);

	[LunaPlaygroundField("Camera Transition Delay", 6, "Intro", false, null)]
	public float cameraTransitionDelay = 0.5f;

	[LunaPlaygroundField("Camera Transition Duration", 7, "Intro", false, null)]
	public float cameraTransitionDuration = 2f;

	[LunaPlaygroundField("Start FOV", 8, "Intro", false, null)]
	public float startFOV = 40f;

	[LunaPlaygroundField("End FOV", 9, "Intro", false, null)]
	public float endFOV = 40f;

	[LunaPlaygroundField("FOV Transition Delay", 10, "Intro", false, null)]
	public float fovTransitionDelay = 0.5f;

	[LunaPlaygroundField("FOV Transition Duration", 11, "Intro", false, null)]
	public float fovTransitionDuration = 2f;

	[LunaPlaygroundField("Block Player Input", 12, "Intro", false, null)]
	public bool blockPlayerInput = true;

	[LunaPlaygroundField("Block Input Duration", 13, "Intro", false, null)]
	public float blockInputDuration = 0f;

	[LunaPlaygroundField("Show Intro Text", 15, "Intro", false, null)]
	public bool showIntroText = true;

	[LunaPlaygroundField("Intro Text", 16, "Intro", false, null)]
	public string introText = "Welcome to the Game!";

	[LunaPlaygroundField("Intro Text Duration", 17, "Intro", false, null)]
	public float introTextDuration = 2f;

	[LunaPlaygroundField("Hide Intro Text on Player Touch", 18, "Intro", false, null)]
	public bool hideIntroTextOnPlayerTouch = false;

	[LunaPlaygroundField("Intro Text Hide After Duration", 19, "Intro", false, null)]
	public bool introTextHideAfterDuration = true;

	[LunaPlaygroundField("Enable Fake Control", 20, "Intro", false, null)]
	public bool enableFakeControl = false;

	[LunaPlaygroundField("DisplayMovingVisual", 21, "Intro", false, null)]
	public bool enableMovingVisual = false;

	[LunaPlaygroundField("DisplayMovingHand", 22, "Intro", false, null)]
	public bool enableMovingHand = false;

	[Header("Throwable Visual Effects")]
	[LunaPlaygroundField("Enable Floating Animation", 0, "Throwable Effects", false, null)]
	public bool enableFloatingAnimation = true;

	[LunaPlaygroundField("Floating Height", 1, "Throwable Effects", false, null)]
	public float floatingHeight = 0.3f;

	[LunaPlaygroundField("Floating Speed", 2, "Throwable Effects", false, null)]
	public float floatingSpeed = 2f;

	[LunaPlaygroundField("Enable Self Rotation", 3, "Throwable Effects", false, null)]
	public bool enableSelfRotation = true;

	[LunaPlaygroundField("Rotation Speed", 4, "Throwable Effects", false, null)]
	public float rotationSpeed = 45f;

	[Header("Wood Tower Top Item")]
	[LunaPlaygroundField("Selected Top Item", 0, "Wood Tower Top Item", false, null)]
	public WoodTower.TopItemType selectedTopItem = WoodTower.TopItemType.Banana;

	[LunaPlaygroundField("Enable Top Item Floating", 1, "Wood Tower Top Item", false, null)]
	public bool enableTopItemFloating = true;

	[LunaPlaygroundField("Top Item Floating Height", 2, "Wood Tower Top Item", false, null)]
	public float topItemFloatingHeight = 0.3f;

	[LunaPlaygroundField("Top Item Floating Speed", 3, "Wood Tower Top Item", false, null)]
	public float topItemFloatingSpeed = 2f;

	[LunaPlaygroundField("Enable Top Item Rotation", 4, "Wood Tower Top Item", false, null)]
	public bool enableTopItemRotation = true;

	[LunaPlaygroundField("Top Item Rotation Speed", 5, "Wood Tower Top Item", false, null)]
	public float topItemRotationSpeed = 45f;

	[LunaPlaygroundField("Enable Sparkle Particle", 6, "Wood Tower Top Item", false, null)]
	public bool enableSparkleParticle = true;

	[LunaPlaygroundField("Tower Width (X/Z)", 7, "Wood Tower Top Item", false, null)]
	public float towerWidth = 1.5f;

	[LunaPlaygroundField("Tower Height (Number of Levels)", 8, "Wood Tower Top Item", false, null)]
	public int towerHeight = 10;

	[LunaPlaygroundField("Top Item Size Multiplier", 9, "Wood Tower Top Item", false, null)]
	public float topItemSizeMultiplier = 1f;

	[Header("Tower Shooting Win/Lose")]
	[LunaPlaygroundField("Enable Tower Shooting Win", 0, "Tower Shooting", false, null)]
	public bool enableTowerShootingWin = false;

	[LunaPlaygroundField("Enable Tower Shooting Lose", 1, "Tower Shooting", false, null)]
	public bool enableTowerShootingLose = false;

	[LunaPlaygroundField("Auto Redirect Delay (seconds)", 2, "Tower Shooting", false, null)]
	public float towerWinAutoRedirectDelay = 1f;

	[LunaPlaygroundField("Tower Miss Check Delay (seconds)", 3, "Tower Shooting", false, null)]
	public float towerMissCheckDelay = 2f;

	[LunaPlaygroundField("Ground Color", 0, "Environment Controls", false, null)]
	public Color groundColor = Color.white;

	[LunaPlaygroundField("Ground Texture", 0, "Environment Controls", false, null)]
	public int groundTexture = 0;

	[LunaPlaygroundField("Light Color", 1, "Environment Controls", false, null)]
	public Color lightColor = new Color(1f, 0.94248325f, 0.8726415f, 1f);

	[LunaPlaygroundField("Light Intensity", 2, "Environment Controls", false, null)]
	public float lightIntensity = 0.75f;

	[LunaPlaygroundField("Light Rotation", 3, "Environment Controls", false, null)]
	public Vector3 lightRotation = new Vector3(50f, -139.995f, 0f);

	[Header("Joystick Settings")]
	[LunaPlaygroundField("Enable Joystick", 0, "Joystick", false, null)]
	public bool enableJoystick = false;

	[LunaPlaygroundField("Enable Tuto Joystick", 1, "Joystick", false, null)]
	public bool enableTutoJoystick = false;

	[LunaPlaygroundField("Tuto Joystick Show at Start", 2, "Joystick", false, null)]
	public bool tutoJoystickShowAtStart = true;

	[LunaPlaygroundField("Delay Before Display (seconds)", 3, "Joystick", false, null)]
	public float tutoJoystickDisplayDelay = 0f;

	[LunaPlaygroundField("Enable Tuto Joystick Redisplay", 4, "Joystick", false, null)]
	public bool enableTutoJoystickAfterTouch = false;

	[LunaPlaygroundField("Redisplay After Seconds (no touch)", 5, "Joystick", false, null)]
	public float tutoJoystickShowTimesAfterTouch = 3f;

	[Header("Player playable config")]
	[LunaPlaygroundField("Player Speed", 1, "Player Controls", false, null)]
	public float holeMoveSpeed = 2f;

	[LunaPlaygroundField("Hole Color", 2, "Player Controls", false, null)]
	public Color holeColor = Color.black;

	[LunaPlaygroundField("Hole Skin", 2, "Player Controls", false, null)]
	public int holeSkin = 0;

	[LunaPlaygroundField("Movement Indicator Color", 3, "Player Controls", false, null)]
	public Color movementIndicatorColor = Color.white;

	[LunaPlaygroundField("Enable Movement Indicator", 3, "Player Controls", false, null)]
	public bool enableMovementIndicator = true;

	[LunaPlaygroundField("Hide Movement Indicator When Idle", 3, "Player Controls", false, null)]
	public bool hideMovementIndicatorWhenIdle = true;

	[LunaPlaygroundField("Movement Indicator Type", 3, "Player Controls", false, null)]
	public MovementIndicatorType movementIndicatorType = MovementIndicatorType.Triangle;

	[LunaPlaygroundField("Aim Arrow Color", 4, "Player Controls", false, null)]
	public Color aimArrowColor = Color.white;

	[LunaPlaygroundField("Use Hole Start Position", 5, "Player Controls", false, null)]
	public bool useHoleStartPosition = false;

	[LunaPlaygroundField("Hole Start Position", 6, "Player Controls", false, null)]
	public Vector3 holeStartPosition = Vector3.zero;

	[LunaPlaygroundField("HoleCountFeedback", 7, "Player Controls", false, null)]
	public bool displayHoleCountFeedback = false;

	[LunaPlaygroundField("Enable Arrow Direction", 8, "Player Controls", false, null)]
	public bool enableArrowDirection = false;

	[LunaPlaygroundField("Arrow Direction Target Type", 9, "Player Controls", false, null)]
	public ArrowDirection.TargetType arrowDirectionTargetType = ArrowDirection.TargetType.ClosestTopItem;

	[LunaPlaygroundField("Arrow Direction Color", 10, "Player Controls", false, null)]
	public Color arrowDirectionColor = Color.white;

	[LunaPlaygroundField("Arrow Direction Outline Color", 11, "Player Controls", false, null)]
	public Color arrowDirectionOutlineColor = Color.white;

	[LunaPlaygroundField("Arrow Direction Scale", 12, "Player Controls", false, null)]
	public float arrowDirectionScale = 1f;

	[LunaPlaygroundField("Arrow Direction Position", 13, "Player Controls", false, null)]
	public Vector3 arrowDirectionPosition = new Vector3(0f, 0.5f, 0.7f);

	[LunaPlaygroundField("Arrow Direction Model", 14, "Player Controls", false, null)]
	public ArrowDirection.ArrowModelType arrowDirectionModel = ArrowDirection.ArrowModelType.Model1;

	[LunaPlaygroundField("Arrow Direction Yoyo Speed", 15, "Player Controls", false, null)]
	public float arrowDirectionYoyoSpeed = 2f;

	[LunaPlaygroundField("Arrow Direction Yoyo Distance", 16, "Player Controls", false, null)]
	public float arrowDirectionYoyoDistance = 0.2f;

	[LunaPlaygroundField("Show HoleGrowingVFX", 17, "Player Controls", false, null)]
	public bool showHoleGrowVFX = true;

	[Header("Level Settings")]
	[LunaPlaygroundField("Level", 0, "Level Settings", false, null)]
	public LevelIndex Level = LevelIndex.C38V1;

	[LunaPlaygroundField("Corridor Theme", 1, "Level Settings", false, null)]
	public ResourceLoader.LevelTheme corridorTheme;

	[LunaPlaygroundField("Circular Theme", 2, "Level Settings", false, null)]
	public ResourceLoader.LevelTheme circularTheme;

	[LunaPlaygroundField("LvlCircular1 Theme", 3, "Level Settings", false, null)]
	public ResourceLoader.LevelTheme lvlCircular1Theme;

	[LunaPlaygroundField("LvlCircular2 Theme", 4, "Level Settings", false, null)]
	public ResourceLoader.LevelTheme lvlCircular2Theme;

	[LunaPlaygroundField("LvlCircular3 Theme", 5, "Level Settings", false, null)]
	public ResourceLoader.LevelTheme lvlCircular3Theme;

	[LunaPlaygroundField("LvlCircular4 Theme", 6, "Level Settings", false, null)]
	public ResourceLoader.LevelTheme lvlCircular4Theme;

	[Header("Banner")]
	[LunaPlaygroundField("Display Top Banner", 0, "Banner", false, null)]
	public bool displayTopBanner = false;

	[LunaPlaygroundField("Display Mid Banner", 1, "Banner", false, null)]
	public bool displayMidBanner = false;

	[LunaPlaygroundField("Display Bottom Banner", 2, "Banner", false, null)]
	public bool displayBotBanner = false;

	[Header("Audio Settings")]
	[LunaPlaygroundAsset("Win Sound", 1, "Audio")]
	public AudioClip winSound;

	[LunaPlaygroundAsset("Tower Hit Sound", 2, "Audio")]
	public AudioClip towerHitSound;

	[LunaPlaygroundAsset("Shoot Sound", 3, "Audio")]
	public AudioClip shootSound;

	[LunaPlaygroundAsset("Fail Sound", 4, "Audio")]
	public AudioClip failSound;

	[LunaPlaygroundAsset("Intro Sound", 5, "Audio")]
	public AudioClip introSound;

	[LunaPlaygroundAsset("Hole Grow Sound", 6, "Audio")]
	public AudioClip holeGrowSound;

	[LunaPlaygroundAsset("Hole Collect Sound", 7, "Audio")]
	public AudioClip collectItemSFX;

	[Header("Store Redirect Settings")]
	[LunaPlaygroundField("Enable Click Redirection", 0, "Store Redirect", false, null)]
	public bool enableClickRedirection = true;

	[LunaPlaygroundField("Clicks to Redirect", 1, "Store Redirect", false, null)]
	public int clicksToRedirect = 3;

	[LunaPlaygroundField("Enable Time Redirection", 2, "Store Redirect", false, null)]
	public bool enableTimeRedirection = true;

	[LunaPlaygroundField("Time to Redirect (seconds)", 3, "Store Redirect", false, null)]
	public float timeToRedirect = 30f;

	[LunaPlaygroundField("Redirect After Throw", 4, "Store Redirect", false, null)]
	public bool redirectAfterThrow = true;

	[LunaPlaygroundField("Redirect Delay After Throw (seconds)", 5, "Store Redirect", false, null)]
	public float redirectDelayAfterThrow = 1f;

	[LunaPlaygroundField("Redirect After First Redirection", 6, "Store Redirect", false, null)]
	public bool enableRedirectAfterFirst = true;

	[Header("Objectives UI")]
	[LunaPlaygroundField("Enable Objectives UI", 0, "Objectives", false, null)]
	public bool enableObjectivesUI = true;

	[LunaPlaygroundField("Show Only Top Item", 1, "Objectives", false, null)]
	public bool objectivesOnlyTopItem = false;

	[LunaPlaygroundField("Show Tutorial Cue", 2, "Objectives", false, null)]
	public bool enableObjectivesTuto = true;

	[LunaPlaygroundField("Glow Speed", 3, "Objectives", false, null)]
	public float objectivesTutoGlowSpeed = 1f;

	[LunaPlaygroundField("Travel Time (sec)", 4, "Objectives", false, null)]
	public float objectivesTutoTravelTime = 1f;

	[LunaPlaygroundField("End Pause (sec)", 5, "Objectives", false, null)]
	public float objectivesTutoEndPause = 0.2f;

	[LunaPlaygroundField("Pickup Flight Feedback", 6, "Objectives", false, null)]
	public bool enableObjectivePickupFlight = false;

	[LunaPlaygroundField("Pickup Flight Duration", 7, "Objectives", false, null)]
	public float objectivePickupFlightDuration = 0.6f;

	private void Awake()
	{
		if (instance == null)
		{
			instance = this;
		}
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
		UIManager.instance.topBanner.SetActive(instance.displayTopBanner);
		UIManager.instance.midBanner.SetActive(instance.displayMidBanner);
		UIManager.instance.bottomBanner.SetActive(instance.displayBotBanner);
		UIManager.instance.InitializeJoysticks();
	}

	public void CameraZoomOut(float value)
	{
		StartCoroutine(SmoothCameraZoomOut(value));
	}

	private IEnumerator SmoothCameraZoomOut(float value)
	{
		CinemachineVirtualCamera holeVcCam = playerCamera.GetComponent<CinemachineVirtualCamera>();
		CinemachineFramingTransposer framingTransposer = holeVcCam.GetCinemachineComponent<CinemachineFramingTransposer>();
		if (!(framingTransposer == null))
		{
			float startDistance = framingTransposer.m_CameraDistance;
			float targetDistance = startDistance + value * 1.5f;
			float duration = 0.5f;
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
	}

	private void SetMaterials()
	{
		ColoredMaterial[] array = coloredMaterials;
		foreach (ColoredMaterial coloredMaterial in array)
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
		ApplyArrowDirectionSettings();
		ApplyLightSettings();
	}

	private void ApplyArrowDirectionSettings()
	{
		ArrowDirection arrowDirection = Object.FindObjectOfType<ArrowDirection>();
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
}
