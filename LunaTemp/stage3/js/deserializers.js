var Deserializers = {}
Deserializers["UnityEngine.JointSpring"] = function (request, data, root) {
  var i778 = root || request.c( 'UnityEngine.JointSpring' )
  var i779 = data
  i778.spring = i779[0]
  i778.damper = i779[1]
  i778.targetPosition = i779[2]
  return i778
}

Deserializers["UnityEngine.JointMotor"] = function (request, data, root) {
  var i780 = root || request.c( 'UnityEngine.JointMotor' )
  var i781 = data
  i780.m_TargetVelocity = i781[0]
  i780.m_Force = i781[1]
  i780.m_FreeSpin = i781[2]
  return i780
}

Deserializers["UnityEngine.JointLimits"] = function (request, data, root) {
  var i782 = root || request.c( 'UnityEngine.JointLimits' )
  var i783 = data
  i782.m_Min = i783[0]
  i782.m_Max = i783[1]
  i782.m_Bounciness = i783[2]
  i782.m_BounceMinVelocity = i783[3]
  i782.m_ContactDistance = i783[4]
  i782.minBounce = i783[5]
  i782.maxBounce = i783[6]
  return i782
}

Deserializers["UnityEngine.JointDrive"] = function (request, data, root) {
  var i784 = root || request.c( 'UnityEngine.JointDrive' )
  var i785 = data
  i784.m_PositionSpring = i785[0]
  i784.m_PositionDamper = i785[1]
  i784.m_MaximumForce = i785[2]
  return i784
}

Deserializers["UnityEngine.SoftJointLimitSpring"] = function (request, data, root) {
  var i786 = root || request.c( 'UnityEngine.SoftJointLimitSpring' )
  var i787 = data
  i786.m_Spring = i787[0]
  i786.m_Damper = i787[1]
  return i786
}

Deserializers["UnityEngine.SoftJointLimit"] = function (request, data, root) {
  var i788 = root || request.c( 'UnityEngine.SoftJointLimit' )
  var i789 = data
  i788.m_Limit = i789[0]
  i788.m_Bounciness = i789[1]
  i788.m_ContactDistance = i789[2]
  return i788
}

Deserializers["UnityEngine.WheelFrictionCurve"] = function (request, data, root) {
  var i790 = root || request.c( 'UnityEngine.WheelFrictionCurve' )
  var i791 = data
  i790.m_ExtremumSlip = i791[0]
  i790.m_ExtremumValue = i791[1]
  i790.m_AsymptoteSlip = i791[2]
  i790.m_AsymptoteValue = i791[3]
  i790.m_Stiffness = i791[4]
  return i790
}

Deserializers["UnityEngine.JointAngleLimits2D"] = function (request, data, root) {
  var i792 = root || request.c( 'UnityEngine.JointAngleLimits2D' )
  var i793 = data
  i792.m_LowerAngle = i793[0]
  i792.m_UpperAngle = i793[1]
  return i792
}

Deserializers["UnityEngine.JointMotor2D"] = function (request, data, root) {
  var i794 = root || request.c( 'UnityEngine.JointMotor2D' )
  var i795 = data
  i794.m_MotorSpeed = i795[0]
  i794.m_MaximumMotorTorque = i795[1]
  return i794
}

Deserializers["UnityEngine.JointSuspension2D"] = function (request, data, root) {
  var i796 = root || request.c( 'UnityEngine.JointSuspension2D' )
  var i797 = data
  i796.m_DampingRatio = i797[0]
  i796.m_Frequency = i797[1]
  i796.m_Angle = i797[2]
  return i796
}

Deserializers["UnityEngine.JointTranslationLimits2D"] = function (request, data, root) {
  var i798 = root || request.c( 'UnityEngine.JointTranslationLimits2D' )
  var i799 = data
  i798.m_LowerTranslation = i799[0]
  i798.m_UpperTranslation = i799[1]
  return i798
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.Transform"] = function (request, data, root) {
  var i800 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.Transform' )
  var i801 = data
  i800.position = new pc.Vec3( i801[0], i801[1], i801[2] )
  i800.scale = new pc.Vec3( i801[3], i801[4], i801[5] )
  i800.rotation = new pc.Quat(i801[6], i801[7], i801[8], i801[9])
  return i800
}

Deserializers["HoleController"] = function (request, data, root) {
  var i802 = root || request.c( 'HoleController' )
  var i803 = data
  i802.moveSpeed = i803[0]
  request.r(i803[1], i803[2], 0, i802, 'movementIndicatorPivot')
  request.r(i803[3], i803[4], 0, i802, 'triangleSpriteRenderer')
  request.r(i803[5], i803[6], 0, i802, 'periscopeRenderer')
  i802.indicatorRotationSpeed = i803[7]
  i802.victimLayer = UnityEngine.LayerMask.FromIntegerValue( i803[8] )
  i802.swallowPower = i803[9]
  request.r(i803[10], i803[11], 0, i802, 'detector')
  request.r(i803[12], i803[13], 0, i802, 'collectSFX')
  request.r(i803[14], i803[15], 0, i802, 'evolveVFX')
  i802.physicsCheckInterval = i803[16]
  i802.supportFlagHeight = i803[17]
  i802.supportFlagInterval = i803[18]
  i802.supportFlagRadiusMultiplier = i803[19]
  i802.releaseRadius = i803[20]
  i802.releaseHeight = i803[21]
  i802.maxReleasesPerEvent = i803[22]
  request.r(i803[23], i803[24], 0, i802, 'aimArrow')
  i802.scaleDuration = i803[25]
  i802.scaleMultiplier = i803[26]
  i802.growThreshold = i803[27]
  i802.growThresholdMultiplier = i803[28]
  request.r(i803[29], i803[30], 0, i802, 'skinsParent')
  request.r(i803[31], i803[32], 0, i802, 'floatingFeedback')
  return i802
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.SphereCollider"] = function (request, data, root) {
  var i804 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.SphereCollider' )
  var i805 = data
  i804.center = new pc.Vec3( i805[0], i805[1], i805[2] )
  i804.radius = i805[3]
  i804.enabled = !!i805[4]
  i804.isTrigger = !!i805[5]
  request.r(i805[6], i805[7], 0, i804, 'material')
  return i804
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.AudioSource"] = function (request, data, root) {
  var i806 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.AudioSource' )
  var i807 = data
  request.r(i807[0], i807[1], 0, i806, 'clip')
  request.r(i807[2], i807[3], 0, i806, 'outputAudioMixerGroup')
  i806.playOnAwake = !!i807[4]
  i806.loop = !!i807[5]
  i806.time = i807[6]
  i806.volume = i807[7]
  i806.pitch = i807[8]
  i806.enabled = !!i807[9]
  return i806
}

Deserializers["IntroHoleAnimation"] = function (request, data, root) {
  var i808 = root || request.c( 'IntroHoleAnimation' )
  var i809 = data
  request.r(i809[0], i809[1], 0, i808, 'holderTransform')
  i808.holderScaleCurve = new pc.AnimationCurve( { keys_flow: i809[2] } )
  i808.animationSpeed = i809[3]
  i808.glowAlphaCurve = new pc.AnimationCurve( { keys_flow: i809[4] } )
  i808.glowScaleCurve = new pc.AnimationCurve( { keys_flow: i809[5] } )
  return i808
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.MeshFilter"] = function (request, data, root) {
  var i810 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.MeshFilter' )
  var i811 = data
  request.r(i811[0], i811[1], 0, i810, 'sharedMesh')
  return i810
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.MeshRenderer"] = function (request, data, root) {
  var i812 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.MeshRenderer' )
  var i813 = data
  request.r(i813[0], i813[1], 0, i812, 'additionalVertexStreams')
  i812.enabled = !!i813[2]
  request.r(i813[3], i813[4], 0, i812, 'sharedMaterial')
  var i815 = i813[5]
  var i814 = []
  for(var i = 0; i < i815.length; i += 2) {
  request.r(i815[i + 0], i815[i + 1], 2, i814, '')
  }
  i812.sharedMaterials = i814
  i812.receiveShadows = !!i813[6]
  i812.shadowCastingMode = i813[7]
  i812.sortingLayerID = i813[8]
  i812.sortingOrder = i813[9]
  i812.lightmapIndex = i813[10]
  i812.lightmapSceneIndex = i813[11]
  i812.lightmapScaleOffset = new pc.Vec4( i813[12], i813[13], i813[14], i813[15] )
  i812.lightProbeUsage = i813[16]
  i812.reflectionProbeUsage = i813[17]
  return i812
}

Deserializers["Luna.Unity.DTO.UnityEngine.Scene.GameObject"] = function (request, data, root) {
  var i818 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Scene.GameObject' )
  var i819 = data
  i818.name = i819[0]
  i818.tagId = i819[1]
  i818.enabled = !!i819[2]
  i818.isStatic = !!i819[3]
  i818.layer = i819[4]
  return i818
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.BoxCollider"] = function (request, data, root) {
  var i820 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.BoxCollider' )
  var i821 = data
  i820.center = new pc.Vec3( i821[0], i821[1], i821[2] )
  i820.size = new pc.Vec3( i821[3], i821[4], i821[5] )
  i820.enabled = !!i821[6]
  i820.isTrigger = !!i821[7]
  request.r(i821[8], i821[9], 0, i820, 'material')
  return i820
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.SpriteRenderer"] = function (request, data, root) {
  var i822 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.SpriteRenderer' )
  var i823 = data
  i822.color = new pc.Color(i823[0], i823[1], i823[2], i823[3])
  request.r(i823[4], i823[5], 0, i822, 'sprite')
  i822.flipX = !!i823[6]
  i822.flipY = !!i823[7]
  i822.drawMode = i823[8]
  i822.size = new pc.Vec2( i823[9], i823[10] )
  i822.tileMode = i823[11]
  i822.adaptiveModeThreshold = i823[12]
  i822.maskInteraction = i823[13]
  i822.spriteSortPoint = i823[14]
  i822.enabled = !!i823[15]
  request.r(i823[16], i823[17], 0, i822, 'sharedMaterial')
  var i825 = i823[18]
  var i824 = []
  for(var i = 0; i < i825.length; i += 2) {
  request.r(i825[i + 0], i825[i + 1], 2, i824, '')
  }
  i822.sharedMaterials = i824
  i822.receiveShadows = !!i823[19]
  i822.shadowCastingMode = i823[20]
  i822.sortingLayerID = i823[21]
  i822.sortingOrder = i823[22]
  i822.lightmapIndex = i823[23]
  i822.lightmapSceneIndex = i823[24]
  i822.lightmapScaleOffset = new pc.Vec4( i823[25], i823[26], i823[27], i823[28] )
  i822.lightProbeUsage = i823[29]
  i822.reflectionProbeUsage = i823[30]
  return i822
}

Deserializers["HoleSkin"] = function (request, data, root) {
  var i826 = root || request.c( 'HoleSkin' )
  var i827 = data
  request.r(i827[0], i827[1], 0, i826, 'glowSprite')
  request.r(i827[2], i827[3], 0, i826, 'glowTransform')
  return i826
}

Deserializers["AimArrow"] = function (request, data, root) {
  var i828 = root || request.c( 'AimArrow' )
  var i829 = data
  var i831 = i829[0]
  var i830 = []
  for(var i = 0; i < i831.length; i += 2) {
  request.r(i831[i + 0], i831[i + 1], 2, i830, '')
  }
  i828.arrowSprites = i830
  i828.minAngle = i829[1]
  i828.maxAngle = i829[2]
  i828.speed = i829[3]
  i828.visible = !!i829[4]
  return i828
}

Deserializers["FloatingFeedback"] = function (request, data, root) {
  var i834 = root || request.c( 'FloatingFeedback' )
  var i835 = data
  request.r(i835[0], i835[1], 0, i834, 'prefab')
  var i837 = i835[2]
  var i836 = new (System.Collections.Generic.List$1(Bridge.ns('FloatingText')))
  for(var i = 0; i < i837.length; i += 2) {
  request.r(i837[i + 0], i837[i + 1], 1, i836, '')
  }
  i834.pool = i836
  i834.poolSize = i835[3]
  return i834
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.RectTransform"] = function (request, data, root) {
  var i840 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.RectTransform' )
  var i841 = data
  i840.pivot = new pc.Vec2( i841[0], i841[1] )
  i840.anchorMin = new pc.Vec2( i841[2], i841[3] )
  i840.anchorMax = new pc.Vec2( i841[4], i841[5] )
  i840.sizeDelta = new pc.Vec2( i841[6], i841[7] )
  i840.anchoredPosition3D = new pc.Vec3( i841[8], i841[9], i841[10] )
  i840.rotation = new pc.Quat(i841[11], i841[12], i841[13], i841[14])
  i840.scale = new pc.Vec3( i841[15], i841[16], i841[17] )
  return i840
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.Canvas"] = function (request, data, root) {
  var i842 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.Canvas' )
  var i843 = data
  i842.planeDistance = i843[0]
  i842.referencePixelsPerUnit = i843[1]
  i842.isFallbackOverlay = !!i843[2]
  i842.renderMode = i843[3]
  i842.renderOrder = i843[4]
  i842.sortingLayerName = i843[5]
  i842.sortingOrder = i843[6]
  i842.scaleFactor = i843[7]
  request.r(i843[8], i843[9], 0, i842, 'worldCamera')
  i842.overrideSorting = !!i843[10]
  i842.pixelPerfect = !!i843[11]
  i842.targetDisplay = i843[12]
  i842.overridePixelPerfect = !!i843[13]
  i842.enabled = !!i843[14]
  return i842
}

Deserializers["UnityEngine.UI.CanvasScaler"] = function (request, data, root) {
  var i844 = root || request.c( 'UnityEngine.UI.CanvasScaler' )
  var i845 = data
  i844.m_UiScaleMode = i845[0]
  i844.m_ReferencePixelsPerUnit = i845[1]
  i844.m_ScaleFactor = i845[2]
  i844.m_ReferenceResolution = new pc.Vec2( i845[3], i845[4] )
  i844.m_ScreenMatchMode = i845[5]
  i844.m_MatchWidthOrHeight = i845[6]
  i844.m_PhysicalUnit = i845[7]
  i844.m_FallbackScreenDPI = i845[8]
  i844.m_DefaultSpriteDPI = i845[9]
  i844.m_DynamicPixelsPerUnit = i845[10]
  i844.m_PresetInfoIsWorld = !!i845[11]
  return i844
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.CanvasGroup"] = function (request, data, root) {
  var i846 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.CanvasGroup' )
  var i847 = data
  i846.m_Alpha = i847[0]
  i846.m_Interactable = !!i847[1]
  i846.m_BlocksRaycasts = !!i847[2]
  i846.m_IgnoreParentGroups = !!i847[3]
  i846.enabled = !!i847[4]
  return i846
}

Deserializers["FloatingText"] = function (request, data, root) {
  var i848 = root || request.c( 'FloatingText' )
  var i849 = data
  request.r(i849[0], i849[1], 0, i848, 'text')
  request.r(i849[2], i849[3], 0, i848, 'cg')
  i848.duration = i849[4]
  i848.moveSpeed = i849[5]
  i848.fadeCurve = new pc.AnimationCurve( { keys_flow: i849[6] } )
  i848.moveCurve = new pc.AnimationCurve( { keys_flow: i849[7] } )
  return i848
}

Deserializers["MyBox.Billboard"] = function (request, data, root) {
  var i850 = root || request.c( 'MyBox.Billboard' )
  var i851 = data
  request.r(i851[0], i851[1], 0, i850, 'facedObject')
  return i850
}

Deserializers["UnityEngine.UI.HorizontalLayoutGroup"] = function (request, data, root) {
  var i852 = root || request.c( 'UnityEngine.UI.HorizontalLayoutGroup' )
  var i853 = data
  i852.m_Spacing = i853[0]
  i852.m_ChildForceExpandWidth = !!i853[1]
  i852.m_ChildForceExpandHeight = !!i853[2]
  i852.m_ChildControlWidth = !!i853[3]
  i852.m_ChildControlHeight = !!i853[4]
  i852.m_ChildScaleWidth = !!i853[5]
  i852.m_ChildScaleHeight = !!i853[6]
  i852.m_ReverseArrangement = !!i853[7]
  i852.m_Padding = UnityEngine.RectOffset.FromPaddings(i853[8], i853[9], i853[10], i853[11])
  i852.m_ChildAlignment = i853[12]
  return i852
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.CanvasRenderer"] = function (request, data, root) {
  var i854 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.CanvasRenderer' )
  var i855 = data
  i854.cullTransparentMesh = !!i855[0]
  return i854
}

Deserializers["TMPro.TextMeshProUGUI"] = function (request, data, root) {
  var i856 = root || request.c( 'TMPro.TextMeshProUGUI' )
  var i857 = data
  i856.m_hasFontAssetChanged = !!i857[0]
  request.r(i857[1], i857[2], 0, i856, 'm_baseMaterial')
  i856.m_maskOffset = new pc.Vec4( i857[3], i857[4], i857[5], i857[6] )
  i856.m_text = i857[7]
  i856.m_isRightToLeft = !!i857[8]
  request.r(i857[9], i857[10], 0, i856, 'm_fontAsset')
  request.r(i857[11], i857[12], 0, i856, 'm_sharedMaterial')
  var i859 = i857[13]
  var i858 = []
  for(var i = 0; i < i859.length; i += 2) {
  request.r(i859[i + 0], i859[i + 1], 2, i858, '')
  }
  i856.m_fontSharedMaterials = i858
  request.r(i857[14], i857[15], 0, i856, 'm_fontMaterial')
  var i861 = i857[16]
  var i860 = []
  for(var i = 0; i < i861.length; i += 2) {
  request.r(i861[i + 0], i861[i + 1], 2, i860, '')
  }
  i856.m_fontMaterials = i860
  i856.m_fontColor32 = UnityEngine.Color32.ConstructColor(i857[17], i857[18], i857[19], i857[20])
  i856.m_fontColor = new pc.Color(i857[21], i857[22], i857[23], i857[24])
  i856.m_enableVertexGradient = !!i857[25]
  i856.m_colorMode = i857[26]
  i856.m_fontColorGradient = request.d('TMPro.VertexGradient', i857[27], i856.m_fontColorGradient)
  request.r(i857[28], i857[29], 0, i856, 'm_fontColorGradientPreset')
  request.r(i857[30], i857[31], 0, i856, 'm_spriteAsset')
  i856.m_tintAllSprites = !!i857[32]
  request.r(i857[33], i857[34], 0, i856, 'm_StyleSheet')
  i856.m_TextStyleHashCode = i857[35]
  i856.m_overrideHtmlColors = !!i857[36]
  i856.m_faceColor = UnityEngine.Color32.ConstructColor(i857[37], i857[38], i857[39], i857[40])
  i856.m_fontSize = i857[41]
  i856.m_fontSizeBase = i857[42]
  i856.m_fontWeight = i857[43]
  i856.m_enableAutoSizing = !!i857[44]
  i856.m_fontSizeMin = i857[45]
  i856.m_fontSizeMax = i857[46]
  i856.m_fontStyle = i857[47]
  i856.m_HorizontalAlignment = i857[48]
  i856.m_VerticalAlignment = i857[49]
  i856.m_textAlignment = i857[50]
  i856.m_characterSpacing = i857[51]
  i856.m_wordSpacing = i857[52]
  i856.m_lineSpacing = i857[53]
  i856.m_lineSpacingMax = i857[54]
  i856.m_paragraphSpacing = i857[55]
  i856.m_charWidthMaxAdj = i857[56]
  i856.m_enableWordWrapping = !!i857[57]
  i856.m_wordWrappingRatios = i857[58]
  i856.m_overflowMode = i857[59]
  request.r(i857[60], i857[61], 0, i856, 'm_linkedTextComponent')
  request.r(i857[62], i857[63], 0, i856, 'parentLinkedComponent')
  i856.m_enableKerning = !!i857[64]
  i856.m_enableExtraPadding = !!i857[65]
  i856.checkPaddingRequired = !!i857[66]
  i856.m_isRichText = !!i857[67]
  i856.m_parseCtrlCharacters = !!i857[68]
  i856.m_isOrthographic = !!i857[69]
  i856.m_isCullingEnabled = !!i857[70]
  i856.m_horizontalMapping = i857[71]
  i856.m_verticalMapping = i857[72]
  i856.m_uvLineOffset = i857[73]
  i856.m_geometrySortingOrder = i857[74]
  i856.m_IsTextObjectScaleStatic = !!i857[75]
  i856.m_VertexBufferAutoSizeReduction = !!i857[76]
  i856.m_useMaxVisibleDescender = !!i857[77]
  i856.m_pageToDisplay = i857[78]
  i856.m_margin = new pc.Vec4( i857[79], i857[80], i857[81], i857[82] )
  i856.m_isUsingLegacyAnimationComponent = !!i857[83]
  i856.m_isVolumetricText = !!i857[84]
  i856.m_Maskable = !!i857[85]
  request.r(i857[86], i857[87], 0, i856, 'm_Material')
  i856.m_Color = new pc.Color(i857[88], i857[89], i857[90], i857[91])
  i856.m_RaycastTarget = !!i857[92]
  i856.m_RaycastPadding = new pc.Vec4( i857[93], i857[94], i857[95], i857[96] )
  return i856
}

Deserializers["TMPro.VertexGradient"] = function (request, data, root) {
  var i862 = root || request.c( 'TMPro.VertexGradient' )
  var i863 = data
  i862.topLeft = new pc.Color(i863[0], i863[1], i863[2], i863[3])
  i862.topRight = new pc.Color(i863[4], i863[5], i863[6], i863[7])
  i862.bottomLeft = new pc.Color(i863[8], i863[9], i863[10], i863[11])
  i862.bottomRight = new pc.Color(i863[12], i863[13], i863[14], i863[15])
  return i862
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.ParticleSystem"] = function (request, data, root) {
  var i864 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.ParticleSystem' )
  var i865 = data
  i864.main = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.MainModule', i865[0], i864.main)
  i864.colorBySpeed = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ColorBySpeedModule', i865[1], i864.colorBySpeed)
  i864.colorOverLifetime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ColorOverLifetimeModule', i865[2], i864.colorOverLifetime)
  i864.emission = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.EmissionModule', i865[3], i864.emission)
  i864.rotationBySpeed = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.RotationBySpeedModule', i865[4], i864.rotationBySpeed)
  i864.rotationOverLifetime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.RotationOverLifetimeModule', i865[5], i864.rotationOverLifetime)
  i864.shape = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ShapeModule', i865[6], i864.shape)
  i864.sizeBySpeed = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.SizeBySpeedModule', i865[7], i864.sizeBySpeed)
  i864.sizeOverLifetime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.SizeOverLifetimeModule', i865[8], i864.sizeOverLifetime)
  i864.textureSheetAnimation = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.TextureSheetAnimationModule', i865[9], i864.textureSheetAnimation)
  i864.velocityOverLifetime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.VelocityOverLifetimeModule', i865[10], i864.velocityOverLifetime)
  i864.noise = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.NoiseModule', i865[11], i864.noise)
  i864.inheritVelocity = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.InheritVelocityModule', i865[12], i864.inheritVelocity)
  i864.forceOverLifetime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ForceOverLifetimeModule', i865[13], i864.forceOverLifetime)
  i864.limitVelocityOverLifetime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemModules.LimitVelocityOverLifetimeModule', i865[14], i864.limitVelocityOverLifetime)
  i864.useAutoRandomSeed = !!i865[15]
  i864.randomSeed = i865[16]
  return i864
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.MainModule"] = function (request, data, root) {
  var i866 = root || new pc.ParticleSystemMain()
  var i867 = data
  i866.duration = i867[0]
  i866.loop = !!i867[1]
  i866.prewarm = !!i867[2]
  i866.startDelay = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[3], i866.startDelay)
  i866.startLifetime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[4], i866.startLifetime)
  i866.startSpeed = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[5], i866.startSpeed)
  i866.startSize3D = !!i867[6]
  i866.startSizeX = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[7], i866.startSizeX)
  i866.startSizeY = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[8], i866.startSizeY)
  i866.startSizeZ = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[9], i866.startSizeZ)
  i866.startRotation3D = !!i867[10]
  i866.startRotationX = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[11], i866.startRotationX)
  i866.startRotationY = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[12], i866.startRotationY)
  i866.startRotationZ = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[13], i866.startRotationZ)
  i866.startColor = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxGradient', i867[14], i866.startColor)
  i866.gravityModifier = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i867[15], i866.gravityModifier)
  i866.simulationSpace = i867[16]
  request.r(i867[17], i867[18], 0, i866, 'customSimulationSpace')
  i866.simulationSpeed = i867[19]
  i866.useUnscaledTime = !!i867[20]
  i866.scalingMode = i867[21]
  i866.playOnAwake = !!i867[22]
  i866.maxParticles = i867[23]
  i866.emitterVelocityMode = i867[24]
  i866.stopAction = i867[25]
  return i866
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve"] = function (request, data, root) {
  var i868 = root || new pc.MinMaxCurve()
  var i869 = data
  i868.mode = i869[0]
  i868.curveMin = new pc.AnimationCurve( { keys_flow: i869[1] } )
  i868.curveMax = new pc.AnimationCurve( { keys_flow: i869[2] } )
  i868.curveMultiplier = i869[3]
  i868.constantMin = i869[4]
  i868.constantMax = i869[5]
  return i868
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxGradient"] = function (request, data, root) {
  var i870 = root || new pc.MinMaxGradient()
  var i871 = data
  i870.mode = i871[0]
  i870.gradientMin = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Gradient', i871[1], i870.gradientMin)
  i870.gradientMax = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Gradient', i871[2], i870.gradientMax)
  i870.colorMin = new pc.Color(i871[3], i871[4], i871[5], i871[6])
  i870.colorMax = new pc.Color(i871[7], i871[8], i871[9], i871[10])
  return i870
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Gradient"] = function (request, data, root) {
  var i872 = root || request.c( 'Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Gradient' )
  var i873 = data
  i872.mode = i873[0]
  var i875 = i873[1]
  var i874 = []
  for(var i = 0; i < i875.length; i += 1) {
    i874.push( request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Data.GradientColorKey', i875[i + 0]) );
  }
  i872.colorKeys = i874
  var i877 = i873[2]
  var i876 = []
  for(var i = 0; i < i877.length; i += 1) {
    i876.push( request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Data.GradientAlphaKey', i877[i + 0]) );
  }
  i872.alphaKeys = i876
  return i872
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ColorBySpeedModule"] = function (request, data, root) {
  var i878 = root || new pc.ParticleSystemColorBySpeed()
  var i879 = data
  i878.enabled = !!i879[0]
  i878.color = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxGradient', i879[1], i878.color)
  i878.range = new pc.Vec2( i879[2], i879[3] )
  return i878
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Data.GradientColorKey"] = function (request, data, root) {
  var i882 = root || request.c( 'Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Data.GradientColorKey' )
  var i883 = data
  i882.color = new pc.Color(i883[0], i883[1], i883[2], i883[3])
  i882.time = i883[4]
  return i882
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Data.GradientAlphaKey"] = function (request, data, root) {
  var i886 = root || request.c( 'Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Data.GradientAlphaKey' )
  var i887 = data
  i886.alpha = i887[0]
  i886.time = i887[1]
  return i886
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ColorOverLifetimeModule"] = function (request, data, root) {
  var i888 = root || new pc.ParticleSystemColorOverLifetime()
  var i889 = data
  i888.enabled = !!i889[0]
  i888.color = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxGradient', i889[1], i888.color)
  return i888
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.EmissionModule"] = function (request, data, root) {
  var i890 = root || new pc.ParticleSystemEmitter()
  var i891 = data
  i890.enabled = !!i891[0]
  i890.rateOverTime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i891[1], i890.rateOverTime)
  i890.rateOverDistance = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i891[2], i890.rateOverDistance)
  var i893 = i891[3]
  var i892 = []
  for(var i = 0; i < i893.length; i += 1) {
    i892.push( request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Burst', i893[i + 0]) );
  }
  i890.bursts = i892
  return i890
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Burst"] = function (request, data, root) {
  var i896 = root || new pc.ParticleSystemBurst()
  var i897 = data
  i896.count = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i897[0], i896.count)
  i896.cycleCount = i897[1]
  i896.minCount = i897[2]
  i896.maxCount = i897[3]
  i896.repeatInterval = i897[4]
  i896.time = i897[5]
  return i896
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.RotationBySpeedModule"] = function (request, data, root) {
  var i898 = root || new pc.ParticleSystemRotationBySpeed()
  var i899 = data
  i898.enabled = !!i899[0]
  i898.x = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i899[1], i898.x)
  i898.y = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i899[2], i898.y)
  i898.z = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i899[3], i898.z)
  i898.separateAxes = !!i899[4]
  i898.range = new pc.Vec2( i899[5], i899[6] )
  return i898
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.RotationOverLifetimeModule"] = function (request, data, root) {
  var i900 = root || new pc.ParticleSystemRotationOverLifetime()
  var i901 = data
  i900.enabled = !!i901[0]
  i900.x = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i901[1], i900.x)
  i900.y = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i901[2], i900.y)
  i900.z = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i901[3], i900.z)
  i900.separateAxes = !!i901[4]
  return i900
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ShapeModule"] = function (request, data, root) {
  var i902 = root || new pc.ParticleSystemShape()
  var i903 = data
  i902.enabled = !!i903[0]
  i902.shapeType = i903[1]
  i902.randomDirectionAmount = i903[2]
  i902.sphericalDirectionAmount = i903[3]
  i902.randomPositionAmount = i903[4]
  i902.alignToDirection = !!i903[5]
  i902.radius = i903[6]
  i902.radiusMode = i903[7]
  i902.radiusSpread = i903[8]
  i902.radiusSpeed = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i903[9], i902.radiusSpeed)
  i902.radiusThickness = i903[10]
  i902.angle = i903[11]
  i902.length = i903[12]
  i902.boxThickness = new pc.Vec3( i903[13], i903[14], i903[15] )
  i902.meshShapeType = i903[16]
  request.r(i903[17], i903[18], 0, i902, 'mesh')
  request.r(i903[19], i903[20], 0, i902, 'meshRenderer')
  request.r(i903[21], i903[22], 0, i902, 'skinnedMeshRenderer')
  i902.useMeshMaterialIndex = !!i903[23]
  i902.meshMaterialIndex = i903[24]
  i902.useMeshColors = !!i903[25]
  i902.normalOffset = i903[26]
  i902.arc = i903[27]
  i902.arcMode = i903[28]
  i902.arcSpread = i903[29]
  i902.arcSpeed = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i903[30], i902.arcSpeed)
  i902.donutRadius = i903[31]
  i902.position = new pc.Vec3( i903[32], i903[33], i903[34] )
  i902.rotation = new pc.Vec3( i903[35], i903[36], i903[37] )
  i902.scale = new pc.Vec3( i903[38], i903[39], i903[40] )
  return i902
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.SizeBySpeedModule"] = function (request, data, root) {
  var i904 = root || new pc.ParticleSystemSizeBySpeed()
  var i905 = data
  i904.enabled = !!i905[0]
  i904.x = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i905[1], i904.x)
  i904.y = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i905[2], i904.y)
  i904.z = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i905[3], i904.z)
  i904.separateAxes = !!i905[4]
  i904.range = new pc.Vec2( i905[5], i905[6] )
  return i904
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.SizeOverLifetimeModule"] = function (request, data, root) {
  var i906 = root || new pc.ParticleSystemSizeOverLifetime()
  var i907 = data
  i906.enabled = !!i907[0]
  i906.x = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i907[1], i906.x)
  i906.y = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i907[2], i906.y)
  i906.z = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i907[3], i906.z)
  i906.separateAxes = !!i907[4]
  return i906
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.TextureSheetAnimationModule"] = function (request, data, root) {
  var i908 = root || new pc.ParticleSystemTextureSheetAnimation()
  var i909 = data
  i908.enabled = !!i909[0]
  i908.mode = i909[1]
  i908.animation = i909[2]
  i908.numTilesX = i909[3]
  i908.numTilesY = i909[4]
  i908.useRandomRow = !!i909[5]
  i908.frameOverTime = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i909[6], i908.frameOverTime)
  i908.startFrame = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i909[7], i908.startFrame)
  i908.cycleCount = i909[8]
  i908.rowIndex = i909[9]
  i908.flipU = i909[10]
  i908.flipV = i909[11]
  i908.spriteCount = i909[12]
  var i911 = i909[13]
  var i910 = []
  for(var i = 0; i < i911.length; i += 2) {
  request.r(i911[i + 0], i911[i + 1], 2, i910, '')
  }
  i908.sprites = i910
  return i908
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.VelocityOverLifetimeModule"] = function (request, data, root) {
  var i914 = root || new pc.ParticleSystemVelocityOverLifetime()
  var i915 = data
  i914.enabled = !!i915[0]
  i914.x = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[1], i914.x)
  i914.y = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[2], i914.y)
  i914.z = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[3], i914.z)
  i914.radial = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[4], i914.radial)
  i914.speedModifier = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[5], i914.speedModifier)
  i914.space = i915[6]
  i914.orbitalX = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[7], i914.orbitalX)
  i914.orbitalY = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[8], i914.orbitalY)
  i914.orbitalZ = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[9], i914.orbitalZ)
  i914.orbitalOffsetX = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[10], i914.orbitalOffsetX)
  i914.orbitalOffsetY = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[11], i914.orbitalOffsetY)
  i914.orbitalOffsetZ = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i915[12], i914.orbitalOffsetZ)
  return i914
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.NoiseModule"] = function (request, data, root) {
  var i916 = root || new pc.ParticleSystemNoise()
  var i917 = data
  i916.enabled = !!i917[0]
  i916.separateAxes = !!i917[1]
  i916.strengthX = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[2], i916.strengthX)
  i916.strengthY = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[3], i916.strengthY)
  i916.strengthZ = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[4], i916.strengthZ)
  i916.frequency = i917[5]
  i916.damping = !!i917[6]
  i916.octaveCount = i917[7]
  i916.octaveMultiplier = i917[8]
  i916.octaveScale = i917[9]
  i916.quality = i917[10]
  i916.scrollSpeed = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[11], i916.scrollSpeed)
  i916.scrollSpeedMultiplier = i917[12]
  i916.remapEnabled = !!i917[13]
  i916.remapX = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[14], i916.remapX)
  i916.remapY = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[15], i916.remapY)
  i916.remapZ = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[16], i916.remapZ)
  i916.positionAmount = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[17], i916.positionAmount)
  i916.rotationAmount = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[18], i916.rotationAmount)
  i916.sizeAmount = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i917[19], i916.sizeAmount)
  return i916
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.InheritVelocityModule"] = function (request, data, root) {
  var i918 = root || new pc.ParticleSystemInheritVelocity()
  var i919 = data
  i918.enabled = !!i919[0]
  i918.mode = i919[1]
  i918.curve = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i919[2], i918.curve)
  return i918
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ForceOverLifetimeModule"] = function (request, data, root) {
  var i920 = root || new pc.ParticleSystemForceOverLifetime()
  var i921 = data
  i920.enabled = !!i921[0]
  i920.x = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i921[1], i920.x)
  i920.y = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i921[2], i920.y)
  i920.z = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i921[3], i920.z)
  i920.space = i921[4]
  i920.randomized = !!i921[5]
  return i920
}

Deserializers["Luna.Unity.DTO.UnityEngine.ParticleSystemModules.LimitVelocityOverLifetimeModule"] = function (request, data, root) {
  var i922 = root || new pc.ParticleSystemLimitVelocityOverLifetime()
  var i923 = data
  i922.enabled = !!i923[0]
  i922.limit = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i923[1], i922.limit)
  i922.limitX = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i923[2], i922.limitX)
  i922.limitY = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i923[3], i922.limitY)
  i922.limitZ = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i923[4], i922.limitZ)
  i922.dampen = i923[5]
  i922.separateAxes = !!i923[6]
  i922.space = i923[7]
  i922.drag = request.d('Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve', i923[8], i922.drag)
  i922.multiplyDragByParticleSize = !!i923[9]
  i922.multiplyDragByParticleVelocity = !!i923[10]
  return i922
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.ParticleSystemRenderer"] = function (request, data, root) {
  var i924 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.ParticleSystemRenderer' )
  var i925 = data
  request.r(i925[0], i925[1], 0, i924, 'mesh')
  i924.meshCount = i925[2]
  i924.activeVertexStreamsCount = i925[3]
  i924.alignment = i925[4]
  i924.renderMode = i925[5]
  i924.sortMode = i925[6]
  i924.lengthScale = i925[7]
  i924.velocityScale = i925[8]
  i924.cameraVelocityScale = i925[9]
  i924.normalDirection = i925[10]
  i924.sortingFudge = i925[11]
  i924.minParticleSize = i925[12]
  i924.maxParticleSize = i925[13]
  i924.pivot = new pc.Vec3( i925[14], i925[15], i925[16] )
  request.r(i925[17], i925[18], 0, i924, 'trailMaterial')
  i924.applyActiveColorSpace = !!i925[19]
  i924.enabled = !!i925[20]
  request.r(i925[21], i925[22], 0, i924, 'sharedMaterial')
  var i927 = i925[23]
  var i926 = []
  for(var i = 0; i < i927.length; i += 2) {
  request.r(i927[i + 0], i927[i + 1], 2, i926, '')
  }
  i924.sharedMaterials = i926
  i924.receiveShadows = !!i925[24]
  i924.shadowCastingMode = i925[25]
  i924.sortingLayerID = i925[26]
  i924.sortingOrder = i925[27]
  i924.lightmapIndex = i925[28]
  i924.lightmapSceneIndex = i925[29]
  i924.lightmapScaleOffset = new pc.Vec4( i925[30], i925[31], i925[32], i925[33] )
  i924.lightProbeUsage = i925[34]
  i924.reflectionProbeUsage = i925[35]
  return i924
}

Deserializers["ArrowDirection"] = function (request, data, root) {
  var i928 = root || request.c( 'ArrowDirection' )
  var i929 = data
  i928.targetType = i929[0]
  i928.arrowModel = i929[1]
  request.r(i929[2], i929[3], 0, i928, 'arrowModel1')
  request.r(i929[4], i929[5], 0, i928, 'arrowModel2')
  request.r(i929[6], i929[7], 0, i928, 'arrowPivot')
  i928.rotationSpeed = i929[8]
  i928.updateInterval = i929[9]
  i928.yoyoSpeed = i929[10]
  i928.yoyoDistance = i929[11]
  return i928
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Mesh"] = function (request, data, root) {
  var i930 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Mesh' )
  var i931 = data
  i930.name = i931[0]
  i930.halfPrecision = !!i931[1]
  i930.useUInt32IndexFormat = !!i931[2]
  i930.vertexCount = i931[3]
  i930.aabb = i931[4]
  var i933 = i931[5]
  var i932 = []
  for(var i = 0; i < i933.length; i += 1) {
    i932.push( !!i933[i + 0] );
  }
  i930.streams = i932
  i930.vertices = i931[6]
  var i935 = i931[7]
  var i934 = []
  for(var i = 0; i < i935.length; i += 1) {
    i934.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Mesh+SubMesh', i935[i + 0]) );
  }
  i930.subMeshes = i934
  var i937 = i931[8]
  var i936 = []
  for(var i = 0; i < i937.length; i += 16) {
    i936.push( new pc.Mat4().setData(i937[i + 0], i937[i + 1], i937[i + 2], i937[i + 3],  i937[i + 4], i937[i + 5], i937[i + 6], i937[i + 7],  i937[i + 8], i937[i + 9], i937[i + 10], i937[i + 11],  i937[i + 12], i937[i + 13], i937[i + 14], i937[i + 15]) );
  }
  i930.bindposes = i936
  var i939 = i931[9]
  var i938 = []
  for(var i = 0; i < i939.length; i += 1) {
    i938.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Mesh+BlendShape', i939[i + 0]) );
  }
  i930.blendShapes = i938
  return i930
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Mesh+SubMesh"] = function (request, data, root) {
  var i944 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Mesh+SubMesh' )
  var i945 = data
  i944.triangles = i945[0]
  return i944
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Mesh+BlendShape"] = function (request, data, root) {
  var i950 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Mesh+BlendShape' )
  var i951 = data
  i950.name = i951[0]
  var i953 = i951[1]
  var i952 = []
  for(var i = 0; i < i953.length; i += 1) {
    i952.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Mesh+BlendShapeFrame', i953[i + 0]) );
  }
  i950.frames = i952
  return i950
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Material"] = function (request, data, root) {
  var i954 = root || new pc.UnityMaterial()
  var i955 = data
  i954.name = i955[0]
  request.r(i955[1], i955[2], 0, i954, 'shader')
  i954.renderQueue = i955[3]
  i954.enableInstancing = !!i955[4]
  var i957 = i955[5]
  var i956 = []
  for(var i = 0; i < i957.length; i += 1) {
    i956.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Material+FloatParameter', i957[i + 0]) );
  }
  i954.floatParameters = i956
  var i959 = i955[6]
  var i958 = []
  for(var i = 0; i < i959.length; i += 1) {
    i958.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Material+ColorParameter', i959[i + 0]) );
  }
  i954.colorParameters = i958
  var i961 = i955[7]
  var i960 = []
  for(var i = 0; i < i961.length; i += 1) {
    i960.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Material+VectorParameter', i961[i + 0]) );
  }
  i954.vectorParameters = i960
  var i963 = i955[8]
  var i962 = []
  for(var i = 0; i < i963.length; i += 1) {
    i962.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Material+TextureParameter', i963[i + 0]) );
  }
  i954.textureParameters = i962
  var i965 = i955[9]
  var i964 = []
  for(var i = 0; i < i965.length; i += 1) {
    i964.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Material+MaterialFlag', i965[i + 0]) );
  }
  i954.materialFlags = i964
  return i954
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Material+FloatParameter"] = function (request, data, root) {
  var i968 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Material+FloatParameter' )
  var i969 = data
  i968.name = i969[0]
  i968.value = i969[1]
  return i968
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Material+ColorParameter"] = function (request, data, root) {
  var i972 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Material+ColorParameter' )
  var i973 = data
  i972.name = i973[0]
  i972.value = new pc.Color(i973[1], i973[2], i973[3], i973[4])
  return i972
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Material+VectorParameter"] = function (request, data, root) {
  var i976 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Material+VectorParameter' )
  var i977 = data
  i976.name = i977[0]
  i976.value = new pc.Vec4( i977[1], i977[2], i977[3], i977[4] )
  return i976
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Material+TextureParameter"] = function (request, data, root) {
  var i980 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Material+TextureParameter' )
  var i981 = data
  i980.name = i981[0]
  request.r(i981[1], i981[2], 0, i980, 'value')
  return i980
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Material+MaterialFlag"] = function (request, data, root) {
  var i984 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Material+MaterialFlag' )
  var i985 = data
  i984.name = i985[0]
  i984.enabled = !!i985[1]
  return i984
}

Deserializers["Luna.Unity.DTO.UnityEngine.Textures.Texture2D"] = function (request, data, root) {
  var i986 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Textures.Texture2D' )
  var i987 = data
  i986.name = i987[0]
  i986.width = i987[1]
  i986.height = i987[2]
  i986.mipmapCount = i987[3]
  i986.anisoLevel = i987[4]
  i986.filterMode = i987[5]
  i986.hdr = !!i987[6]
  i986.format = i987[7]
  i986.wrapMode = i987[8]
  i986.alphaIsTransparency = !!i987[9]
  i986.alphaSource = i987[10]
  i986.graphicsFormat = i987[11]
  i986.sRGBTexture = !!i987[12]
  i986.desiredColorSpace = i987[13]
  i986.wrapU = i987[14]
  i986.wrapV = i987[15]
  return i986
}

Deserializers["ResourceLoader"] = function (request, data, root) {
  var i988 = root || request.c( 'ResourceLoader' )
  var i989 = data
  return i988
}

Deserializers["Level"] = function (request, data, root) {
  var i990 = root || request.c( 'Level' )
  var i991 = data
  var i993 = i991[0]
  var i992 = new (System.Collections.Generic.List$1(Bridge.ns('UnityEngine.GameObject')))
  for(var i = 0; i < i993.length; i += 2) {
  request.r(i993[i + 0], i993[i + 1], 1, i992, '')
  }
  i990.themeGroups = i992
  var i995 = i991[1]
  var i994 = new (System.Collections.Generic.List$1(Bridge.ns('WoodTower')))
  for(var i = 0; i < i995.length; i += 2) {
  request.r(i995[i + 0], i995[i + 1], 1, i994, '')
  }
  i990.woodTowers = i994
  return i990
}

Deserializers["WoodTower"] = function (request, data, root) {
  var i1000 = root || request.c( 'WoodTower' )
  var i1001 = data
  request.r(i1001[0], i1001[1], 0, i1000, 'woodSupportPrefab')
  request.r(i1001[2], i1001[3], 0, i1000, 'finalWoodSupportPrefab')
  request.r(i1001[4], i1001[5], 0, i1000, 'holder')
  request.r(i1001[6], i1001[7], 0, i1000, 'topItem')
  i1000.elementScale = new pc.Vec3( i1001[8], i1001[9], i1001[10] )
  i1000.numberOfLevels = i1001[11]
  i1000.verticalSpacing = i1001[12]
  i1000.topOffset = new pc.Vec3( i1001[13], i1001[14], i1001[15] )
  request.r(i1001[16], i1001[17], 0, i1000, 'sparkleParticle')
  var i1003 = i1001[18]
  var i1002 = new (System.Collections.Generic.List$1(Bridge.ns('WoodTower+TopItemEntry')))
  for(var i = 0; i < i1003.length; i += 1) {
    i1002.add(request.d('WoodTower+TopItemEntry', i1003[i + 0]));
  }
  i1000.topItemList = i1002
  i1000.spawnAtStart = !!i1001[19]
  return i1000
}

Deserializers["WoodTower+TopItemEntry"] = function (request, data, root) {
  var i1006 = root || request.c( 'WoodTower+TopItemEntry' )
  var i1007 = data
  i1006.type = i1007[0]
  request.r(i1007[1], i1007[2], 0, i1006, 'gameObject')
  request.r(i1007[3], i1007[4], 0, i1006, 'rigidbody')
  request.r(i1007[5], i1007[6], 0, i1006, 'supportActivator')
  return i1006
}

Deserializers["ResourceSetter"] = function (request, data, root) {
  var i1008 = root || request.c( 'ResourceSetter' )
  var i1009 = data
  return i1008
}

Deserializers["SupportActivator"] = function (request, data, root) {
  var i1010 = root || request.c( 'SupportActivator' )
  var i1011 = data
  i1010.supportMask = UnityEngine.LayerMask.FromIntegerValue( i1011[0] )
  i1010.checkDistance = i1011[1]
  i1010.requiredMisses = i1011[2]
  i1010.sleepDelay = i1011[3]
  i1010.countInObjectives = !!i1011[4]
  request.r(i1011[5], i1011[6], 0, i1010, 'objectiveIcon')
  i1010.isTopItem = !!i1011[7]
  request.r(i1011[8], i1011[9], 0, i1010, 'tower')
  i1010.rowIndex = i1011[10]
  return i1010
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.Rigidbody"] = function (request, data, root) {
  var i1012 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.Rigidbody' )
  var i1013 = data
  i1012.mass = i1013[0]
  i1012.drag = i1013[1]
  i1012.angularDrag = i1013[2]
  i1012.useGravity = !!i1013[3]
  i1012.isKinematic = !!i1013[4]
  i1012.constraints = i1013[5]
  i1012.maxAngularVelocity = i1013[6]
  i1012.collisionDetectionMode = i1013[7]
  i1012.interpolation = i1013[8]
  return i1012
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.MeshCollider"] = function (request, data, root) {
  var i1014 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.MeshCollider' )
  var i1015 = data
  request.r(i1015[0], i1015[1], 0, i1014, 'sharedMesh')
  i1014.convex = !!i1015[2]
  i1014.enabled = !!i1015[3]
  i1014.isTrigger = !!i1015[4]
  request.r(i1015[5], i1015[6], 0, i1014, 'material')
  return i1014
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.CapsuleCollider"] = function (request, data, root) {
  var i1016 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.CapsuleCollider' )
  var i1017 = data
  i1016.center = new pc.Vec3( i1017[0], i1017[1], i1017[2] )
  i1016.radius = i1017[3]
  i1016.height = i1017[4]
  i1016.direction = i1017[5]
  i1016.enabled = !!i1017[6]
  i1016.isTrigger = !!i1017[7]
  request.r(i1017[8], i1017[9], 0, i1016, 'material')
  return i1016
}

Deserializers["HG.Playables.Tools.TowerGenerator"] = function (request, data, root) {
  var i1018 = root || request.c( 'HG.Playables.Tools.TowerGenerator' )
  var i1019 = data
  i1018.shape = i1019[0]
  i1018.rowHeight = i1019[1]
  i1018.startY = i1019[2]
  request.r(i1019[3], i1019[4], 0, i1018, 'parentOverride')
  i1018.clearBeforeBuild = !!i1019[5]
  var i1021 = i1019[6]
  var i1020 = new (System.Collections.Generic.List$1(Bridge.ns('HG.Playables.Tools.TowerGenerator+PatternRowGroup')))
  for(var i = 0; i < i1021.length; i += 1) {
    i1020.add(request.d('HG.Playables.Tools.TowerGenerator+PatternRowGroup', i1021[i + 0]));
  }
  i1018.patternRowGroups = i1020
  return i1018
}

Deserializers["HG.Playables.Tools.TowerGenerator+PatternRowGroup"] = function (request, data, root) {
  var i1024 = root || request.c( 'HG.Playables.Tools.TowerGenerator+PatternRowGroup' )
  var i1025 = data
  i1024.name = i1025[0]
  i1024.startRowIndex = i1025[1]
  i1024.endRowIndex = i1025[2]
  i1024.itemsInRow = i1025[3]
  i1024.perRowHeight = i1025[4]
  i1024.fillSpacing = i1025[5]
  i1024.gridWidth = i1025[6]
  i1024.gridHeight = i1025[7]
  var i1027 = i1025[8]
  var i1026 = []
  for(var i = 0; i < i1027.length; i += 1) {
    i1026.push( request.d('HG.Playables.Tools.TowerGenerator+FruitPatternItem', i1027[i + 0]) );
  }
  i1024.fruitPattern = i1026
  i1024.patternRepeatCount = i1025[9]
  return i1024
}

Deserializers["HG.Playables.Tools.TowerGenerator+FruitPatternItem"] = function (request, data, root) {
  var i1030 = root || request.c( 'HG.Playables.Tools.TowerGenerator+FruitPatternItem' )
  var i1031 = data
  request.r(i1031[0], i1031[1], 0, i1030, 'fruitPrefab')
  i1030.scale = i1031[2]
  i1030.radius = i1031[3]
  i1030.angleOffsetDegrees = i1031[4]
  i1030.rowHeight = i1031[5]
  return i1030
}

Deserializers["ThemeDisplayGroup"] = function (request, data, root) {
  var i1032 = root || request.c( 'ThemeDisplayGroup' )
  var i1033 = data
  i1032.shape = i1033[0]
  i1032.theme = i1033[1]
  request.r(i1033[2], i1033[3], 0, i1032, 'searchRoot')
  var i1035 = i1033[4]
  var i1034 = new (System.Collections.Generic.List$1(Bridge.ns('ThemeDisplayGroup+ThemePlaceholderEntry')))
  for(var i = 0; i < i1035.length; i += 1) {
    i1034.add(request.d('ThemeDisplayGroup+ThemePlaceholderEntry', i1035[i + 0]));
  }
  i1032.placeholders = i1034
  return i1032
}

Deserializers["ThemeDisplayGroup+ThemePlaceholderEntry"] = function (request, data, root) {
  var i1038 = root || request.c( 'ThemeDisplayGroup+ThemePlaceholderEntry' )
  var i1039 = data
  request.r(i1039[0], i1039[1], 0, i1038, 'placeholder')
  i1038.defaultResourceName = i1039[2]
  var i1041 = i1039[3]
  var i1040 = new (System.Collections.Generic.List$1(Bridge.ns('ThemeDisplayGroup+ThemeResourceOverride')))
  for(var i = 0; i < i1041.length; i += 1) {
    i1040.add(request.d('ThemeDisplayGroup+ThemeResourceOverride', i1041[i + 0]));
  }
  i1038.overrides = i1040
  return i1038
}

Deserializers["ThemeDisplayGroup+ThemeResourceOverride"] = function (request, data, root) {
  var i1044 = root || request.c( 'ThemeDisplayGroup+ThemeResourceOverride' )
  var i1045 = data
  i1044.theme = i1045[0]
  i1044.resourceName = i1045[1]
  return i1044
}

Deserializers["TowerRuntimeIndex"] = function (request, data, root) {
  var i1046 = root || request.c( 'TowerRuntimeIndex' )
  var i1047 = data
  var i1049 = i1047[0]
  var i1048 = new (System.Collections.Generic.List$1(Bridge.ns('SupportActivator')))
  for(var i = 0; i < i1049.length; i += 2) {
  request.r(i1049[i + 0], i1049[i + 1], 1, i1048, '')
  }
  i1046.members = i1048
  return i1046
}

Deserializers["ResourcePlaceholder"] = function (request, data, root) {
  var i1052 = root || request.c( 'ResourcePlaceholder' )
  var i1053 = data
  i1052.resourceName = i1053[0]
  request.r(i1053[1], i1053[2], 0, i1052, 'tower')
  i1052.rowIndex = i1053[3]
  return i1052
}

Deserializers["SwallowElements"] = function (request, data, root) {
  var i1054 = root || request.c( 'SwallowElements' )
  var i1055 = data
  return i1054
}

Deserializers["UIManager"] = function (request, data, root) {
  var i1056 = root || request.c( 'UIManager' )
  var i1057 = data
  request.r(i1057[0], i1057[1], 0, i1056, 'playScreen')
  request.r(i1057[2], i1057[3], 0, i1056, 'winScreen')
  request.r(i1057[4], i1057[5], 0, i1056, 'loseScreen')
  request.r(i1057[6], i1057[7], 0, i1056, 'shootScreen')
  request.r(i1057[8], i1057[9], 0, i1056, 'timerText')
  request.r(i1057[10], i1057[11], 0, i1056, 'timeBarImage')
  request.r(i1057[12], i1057[13], 0, i1056, 'anim')
  request.r(i1057[14], i1057[15], 0, i1056, 'topBanner')
  request.r(i1057[16], i1057[17], 0, i1056, 'midBanner')
  request.r(i1057[18], i1057[19], 0, i1056, 'bottomBanner')
  request.r(i1057[20], i1057[21], 0, i1056, 'handCursor')
  request.r(i1057[22], i1057[23], 0, i1056, 'joystick')
  request.r(i1057[24], i1057[25], 0, i1056, 'tutoJoystick')
  request.r(i1057[26], i1057[27], 0, i1056, 'introText')
  request.r(i1057[28], i1057[29], 0, i1056, 'holeController')
  request.r(i1057[30], i1057[31], 0, i1056, 'myObjectivesUISystem')
  return i1056
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.Animator"] = function (request, data, root) {
  var i1058 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.Animator' )
  var i1059 = data
  request.r(i1059[0], i1059[1], 0, i1058, 'animatorController')
  request.r(i1059[2], i1059[3], 0, i1058, 'avatar')
  i1058.updateMode = i1059[4]
  i1058.hasTransformHierarchy = !!i1059[5]
  i1058.applyRootMotion = !!i1059[6]
  var i1061 = i1059[7]
  var i1060 = []
  for(var i = 0; i < i1061.length; i += 2) {
  request.r(i1061[i + 0], i1061[i + 1], 2, i1060, '')
  }
  i1058.humanBones = i1060
  i1058.enabled = !!i1059[8]
  return i1058
}

Deserializers["UnityEngine.UI.GraphicRaycaster"] = function (request, data, root) {
  var i1064 = root || request.c( 'UnityEngine.UI.GraphicRaycaster' )
  var i1065 = data
  i1064.m_IgnoreReversedGraphics = !!i1065[0]
  i1064.m_BlockingObjects = i1065[1]
  i1064.m_BlockingMask = UnityEngine.LayerMask.FromIntegerValue( i1065[2] )
  return i1064
}

Deserializers["UnityEngine.UI.Image"] = function (request, data, root) {
  var i1066 = root || request.c( 'UnityEngine.UI.Image' )
  var i1067 = data
  request.r(i1067[0], i1067[1], 0, i1066, 'm_Sprite')
  i1066.m_Type = i1067[2]
  i1066.m_PreserveAspect = !!i1067[3]
  i1066.m_FillCenter = !!i1067[4]
  i1066.m_FillMethod = i1067[5]
  i1066.m_FillAmount = i1067[6]
  i1066.m_FillClockwise = !!i1067[7]
  i1066.m_FillOrigin = i1067[8]
  i1066.m_UseSpriteMesh = !!i1067[9]
  i1066.m_PixelsPerUnitMultiplier = i1067[10]
  i1066.m_Maskable = !!i1067[11]
  request.r(i1067[12], i1067[13], 0, i1066, 'm_Material')
  i1066.m_Color = new pc.Color(i1067[14], i1067[15], i1067[16], i1067[17])
  i1066.m_RaycastTarget = !!i1067[18]
  i1066.m_RaycastPadding = new pc.Vec4( i1067[19], i1067[20], i1067[21], i1067[22] )
  return i1066
}

Deserializers["FloatingJoystick"] = function (request, data, root) {
  var i1068 = root || request.c( 'FloatingJoystick' )
  var i1069 = data
  i1068.handleRange = i1069[0]
  i1068.deadZone = i1069[1]
  i1068.axisOptions = i1069[2]
  i1068.snapX = !!i1069[3]
  i1068.snapY = !!i1069[4]
  request.r(i1069[5], i1069[6], 0, i1068, 'background')
  request.r(i1069[7], i1069[8], 0, i1068, 'joystickHandle')
  return i1068
}

Deserializers["UnityEngine.UI.Text"] = function (request, data, root) {
  var i1070 = root || request.c( 'UnityEngine.UI.Text' )
  var i1071 = data
  i1070.m_FontData = request.d('UnityEngine.UI.FontData', i1071[0], i1070.m_FontData)
  i1070.m_Text = i1071[1]
  i1070.m_Maskable = !!i1071[2]
  request.r(i1071[3], i1071[4], 0, i1070, 'm_Material')
  i1070.m_Color = new pc.Color(i1071[5], i1071[6], i1071[7], i1071[8])
  i1070.m_RaycastTarget = !!i1071[9]
  i1070.m_RaycastPadding = new pc.Vec4( i1071[10], i1071[11], i1071[12], i1071[13] )
  return i1070
}

Deserializers["UnityEngine.UI.FontData"] = function (request, data, root) {
  var i1072 = root || request.c( 'UnityEngine.UI.FontData' )
  var i1073 = data
  request.r(i1073[0], i1073[1], 0, i1072, 'm_Font')
  i1072.m_FontSize = i1073[2]
  i1072.m_FontStyle = i1073[3]
  i1072.m_BestFit = !!i1073[4]
  i1072.m_MinSize = i1073[5]
  i1072.m_MaxSize = i1073[6]
  i1072.m_Alignment = i1073[7]
  i1072.m_AlignByGeometry = !!i1073[8]
  i1072.m_RichText = !!i1073[9]
  i1072.m_HorizontalOverflow = i1073[10]
  i1072.m_VerticalOverflow = i1073[11]
  i1072.m_LineSpacing = i1073[12]
  return i1072
}

Deserializers["FontSetterLuna"] = function (request, data, root) {
  var i1074 = root || request.c( 'FontSetterLuna' )
  var i1075 = data
  request.r(i1075[0], i1075[1], 0, i1074, 'textReference')
  return i1074
}

Deserializers["MovingMovement"] = function (request, data, root) {
  var i1076 = root || request.c( 'MovingMovement' )
  var i1077 = data
  request.r(i1077[0], i1077[1], 0, i1076, 'movingImage')
  return i1076
}

Deserializers["TutoCursor"] = function (request, data, root) {
  var i1078 = root || request.c( 'TutoCursor' )
  var i1079 = data
  request.r(i1079[0], i1079[1], 0, i1078, 'cursorImage')
  return i1078
}

Deserializers["UnityEngine.UI.VerticalLayoutGroup"] = function (request, data, root) {
  var i1080 = root || request.c( 'UnityEngine.UI.VerticalLayoutGroup' )
  var i1081 = data
  i1080.m_Spacing = i1081[0]
  i1080.m_ChildForceExpandWidth = !!i1081[1]
  i1080.m_ChildForceExpandHeight = !!i1081[2]
  i1080.m_ChildControlWidth = !!i1081[3]
  i1080.m_ChildControlHeight = !!i1081[4]
  i1080.m_ChildScaleWidth = !!i1081[5]
  i1080.m_ChildScaleHeight = !!i1081[6]
  i1080.m_ReverseArrangement = !!i1081[7]
  i1080.m_Padding = UnityEngine.RectOffset.FromPaddings(i1081[8], i1081[9], i1081[10], i1081[11])
  i1080.m_ChildAlignment = i1081[12]
  return i1080
}

Deserializers["TextureSetterLuna"] = function (request, data, root) {
  var i1082 = root || request.c( 'TextureSetterLuna' )
  var i1083 = data
  i1082.preserveAspectImage = !!i1083[0]
  request.r(i1083[1], i1083[2], 0, i1082, 'imageRef')
  i1082.textureField = i1083[3]
  return i1082
}

Deserializers["LandscapePaddingAnchor"] = function (request, data, root) {
  var i1084 = root || request.c( 'LandscapePaddingAnchor' )
  var i1085 = data
  request.r(i1085[0], i1085[1], 0, i1084, 'target')
  i1084.moveLeft = !!i1085[2]
  i1084.percent = i1085[3]
  return i1084
}

Deserializers["UnityEngine.UI.Mask"] = function (request, data, root) {
  var i1086 = root || request.c( 'UnityEngine.UI.Mask' )
  var i1087 = data
  i1086.m_ShowMaskGraphic = !!i1087[0]
  return i1086
}

Deserializers["UnityEngine.UI.ContentSizeFitter"] = function (request, data, root) {
  var i1088 = root || request.c( 'UnityEngine.UI.ContentSizeFitter' )
  var i1089 = data
  i1088.m_HorizontalFit = i1089[0]
  i1088.m_VerticalFit = i1089[1]
  return i1088
}

Deserializers["ObjectivesUISystem"] = function (request, data, root) {
  var i1090 = root || request.c( 'ObjectivesUISystem' )
  var i1091 = data
  var i1093 = i1091[0]
  var i1092 = []
  for(var i = 0; i < i1093.length; i += 2) {
  request.r(i1093[i + 0], i1093[i + 1], 2, i1092, '')
  }
  i1090.itemObjectivePool = i1092
  request.r(i1091[1], i1091[2], 0, i1090, 'backgroundRect')
  i1090.enablePickupFlight = !!i1091[3]
  request.r(i1091[4], i1091[5], 0, i1090, 'pickupIconPrefab')
  request.r(i1091[6], i1091[7], 0, i1090, 'pickupIconContainer')
  i1090.initialPickupIconPool = i1091[8]
  i1090.pickupFlightDuration = i1091[9]
  request.r(i1091[10], i1091[11], 0, i1090, 'worldCamera')
  return i1090
}

Deserializers["ItemObjective"] = function (request, data, root) {
  var i1096 = root || request.c( 'ItemObjective' )
  var i1097 = data
  request.r(i1097[0], i1097[1], 0, i1096, 'itemImage')
  request.r(i1097[2], i1097[3], 0, i1096, 'itemCountText')
  return i1096
}

Deserializers["ObjectivesTuto"] = function (request, data, root) {
  var i1098 = root || request.c( 'ObjectivesTuto' )
  var i1099 = data
  request.r(i1099[0], i1099[1], 0, i1098, 'objectivesSystem')
  request.r(i1099[2], i1099[3], 0, i1098, 'mover')
  request.r(i1099[4], i1099[5], 0, i1098, 'glowImage')
  request.r(i1099[6], i1099[7], 0, i1098, 'canvasGroup')
  i1098.boundsPadding = i1099[8]
  i1098.legDuration = i1099[9]
  i1098.endPause = i1099[10]
  i1098.motionCurve = new pc.AnimationCurve( { keys_flow: i1099[11] } )
  i1098.bobAmplitude = i1099[12]
  i1098.bobFrequency = i1099[13]
  i1098.scalePulse = i1099[14]
  i1098.scaleFrequency = i1099[15]
  i1098.glowCurve = new pc.AnimationCurve( { keys_flow: i1099[16] } )
  i1098.glowPeriod = i1099[17]
  i1098.glowBaseAlpha = i1099[18]
  i1098.glowMaxAlpha = i1099[19]
  i1098.fadeOutDuration = i1099[20]
  return i1098
}

Deserializers["UnityEngine.UI.Button"] = function (request, data, root) {
  var i1100 = root || request.c( 'UnityEngine.UI.Button' )
  var i1101 = data
  i1100.m_OnClick = request.d('UnityEngine.UI.Button+ButtonClickedEvent', i1101[0], i1100.m_OnClick)
  i1100.m_Navigation = request.d('UnityEngine.UI.Navigation', i1101[1], i1100.m_Navigation)
  i1100.m_Transition = i1101[2]
  i1100.m_Colors = request.d('UnityEngine.UI.ColorBlock', i1101[3], i1100.m_Colors)
  i1100.m_SpriteState = request.d('UnityEngine.UI.SpriteState', i1101[4], i1100.m_SpriteState)
  i1100.m_AnimationTriggers = request.d('UnityEngine.UI.AnimationTriggers', i1101[5], i1100.m_AnimationTriggers)
  i1100.m_Interactable = !!i1101[6]
  request.r(i1101[7], i1101[8], 0, i1100, 'm_TargetGraphic')
  return i1100
}

Deserializers["UnityEngine.UI.Button+ButtonClickedEvent"] = function (request, data, root) {
  var i1102 = root || request.c( 'UnityEngine.UI.Button+ButtonClickedEvent' )
  var i1103 = data
  i1102.m_PersistentCalls = request.d('UnityEngine.Events.PersistentCallGroup', i1103[0], i1102.m_PersistentCalls)
  return i1102
}

Deserializers["UnityEngine.Events.PersistentCallGroup"] = function (request, data, root) {
  var i1104 = root || request.c( 'UnityEngine.Events.PersistentCallGroup' )
  var i1105 = data
  var i1107 = i1105[0]
  var i1106 = new (System.Collections.Generic.List$1(Bridge.ns('UnityEngine.Events.PersistentCall')))
  for(var i = 0; i < i1107.length; i += 1) {
    i1106.add(request.d('UnityEngine.Events.PersistentCall', i1107[i + 0]));
  }
  i1104.m_Calls = i1106
  return i1104
}

Deserializers["UnityEngine.Events.PersistentCall"] = function (request, data, root) {
  var i1110 = root || request.c( 'UnityEngine.Events.PersistentCall' )
  var i1111 = data
  request.r(i1111[0], i1111[1], 0, i1110, 'm_Target')
  i1110.m_TargetAssemblyTypeName = i1111[2]
  i1110.m_MethodName = i1111[3]
  i1110.m_Mode = i1111[4]
  i1110.m_Arguments = request.d('UnityEngine.Events.ArgumentCache', i1111[5], i1110.m_Arguments)
  i1110.m_CallState = i1111[6]
  return i1110
}

Deserializers["UnityEngine.Events.ArgumentCache"] = function (request, data, root) {
  var i1112 = root || request.c( 'UnityEngine.Events.ArgumentCache' )
  var i1113 = data
  request.r(i1113[0], i1113[1], 0, i1112, 'm_ObjectArgument')
  i1112.m_ObjectArgumentAssemblyTypeName = i1113[2]
  i1112.m_IntArgument = i1113[3]
  i1112.m_FloatArgument = i1113[4]
  i1112.m_StringArgument = i1113[5]
  i1112.m_BoolArgument = !!i1113[6]
  return i1112
}

Deserializers["UnityEngine.UI.Navigation"] = function (request, data, root) {
  var i1114 = root || request.c( 'UnityEngine.UI.Navigation' )
  var i1115 = data
  i1114.m_Mode = i1115[0]
  i1114.m_WrapAround = !!i1115[1]
  request.r(i1115[2], i1115[3], 0, i1114, 'm_SelectOnUp')
  request.r(i1115[4], i1115[5], 0, i1114, 'm_SelectOnDown')
  request.r(i1115[6], i1115[7], 0, i1114, 'm_SelectOnLeft')
  request.r(i1115[8], i1115[9], 0, i1114, 'm_SelectOnRight')
  return i1114
}

Deserializers["UnityEngine.UI.ColorBlock"] = function (request, data, root) {
  var i1116 = root || request.c( 'UnityEngine.UI.ColorBlock' )
  var i1117 = data
  i1116.m_NormalColor = new pc.Color(i1117[0], i1117[1], i1117[2], i1117[3])
  i1116.m_HighlightedColor = new pc.Color(i1117[4], i1117[5], i1117[6], i1117[7])
  i1116.m_PressedColor = new pc.Color(i1117[8], i1117[9], i1117[10], i1117[11])
  i1116.m_SelectedColor = new pc.Color(i1117[12], i1117[13], i1117[14], i1117[15])
  i1116.m_DisabledColor = new pc.Color(i1117[16], i1117[17], i1117[18], i1117[19])
  i1116.m_ColorMultiplier = i1117[20]
  i1116.m_FadeDuration = i1117[21]
  return i1116
}

Deserializers["UnityEngine.UI.SpriteState"] = function (request, data, root) {
  var i1118 = root || request.c( 'UnityEngine.UI.SpriteState' )
  var i1119 = data
  request.r(i1119[0], i1119[1], 0, i1118, 'm_HighlightedSprite')
  request.r(i1119[2], i1119[3], 0, i1118, 'm_PressedSprite')
  request.r(i1119[4], i1119[5], 0, i1118, 'm_SelectedSprite')
  request.r(i1119[6], i1119[7], 0, i1118, 'm_DisabledSprite')
  return i1118
}

Deserializers["UnityEngine.UI.AnimationTriggers"] = function (request, data, root) {
  var i1120 = root || request.c( 'UnityEngine.UI.AnimationTriggers' )
  var i1121 = data
  i1120.m_NormalTrigger = i1121[0]
  i1120.m_HighlightedTrigger = i1121[1]
  i1120.m_PressedTrigger = i1121[2]
  i1120.m_SelectedTrigger = i1121[3]
  i1120.m_DisabledTrigger = i1121[4]
  return i1120
}

Deserializers["LandscapePadding"] = function (request, data, root) {
  var i1122 = root || request.c( 'LandscapePadding' )
  var i1123 = data
  request.r(i1123[0], i1123[1], 0, i1122, 'target')
  i1122.moveLeft = !!i1123[2]
  i1122.percent = i1123[3]
  return i1122
}

Deserializers["ObjectivePickupIcon"] = function (request, data, root) {
  var i1124 = root || request.c( 'ObjectivePickupIcon' )
  var i1125 = data
  request.r(i1125[0], i1125[1], 0, i1124, 'iconImage')
  request.r(i1125[2], i1125[3], 0, i1124, 'rectTransform')
  return i1124
}

Deserializers["PlayableSettings"] = function (request, data, root) {
  var i1126 = root || request.c( 'PlayableSettings' )
  var i1127 = data
  request.r(i1127[0], i1127[1], 0, i1126, 'playerCamera')
  var i1129 = i1127[2]
  var i1128 = []
  for(var i = 0; i < i1129.length; i += 1) {
    i1128.push( request.d('ColoredMaterial', i1129[i + 0]) );
  }
  i1126.coloredMaterials = i1128
  var i1131 = i1127[3]
  var i1130 = []
  for(var i = 0; i < i1131.length; i += 2) {
  request.r(i1131[i + 0], i1131[i + 1], 2, i1130, '')
  }
  i1126.cursors = i1130
  request.r(i1127[4], i1127[5], 0, i1126, 'sunlight')
  i1126.gameTimeInSeconds = i1127[6]
  i1126.startGameplayTimerOnTouch = !!i1127[7]
  i1126.gameOverScreenDelay = i1127[8]
  i1126.cameraAngle = new pc.Vec3( i1127[9], i1127[10], i1127[11] )
  i1126.enableHandCursor = !!i1127[12]
  i1126.cursorScale = i1127[13]
  i1126.handCursor = i1127[14]
  i1126.throwableObjectType = i1127[15]
  i1126.showFlower = !!i1127[16]
  i1126.levelUpSizeIncreaseMultiplier = i1127[17]
  i1126.swallowCountFirstLevel = i1127[18]
  i1126.swallowNeededMultiplier = i1127[19]
  i1126.holeSpeedIncreaseType = i1127[20]
  i1126.holeSpeedIncrease = i1127[21]
  i1126.objectiveAmount = i1127[22]
  i1126.enableWinOnSwallowTopItem = !!i1127[23]
  i1126.enableIntro = !!i1127[24]
  i1126.startCameraAngle = new pc.Vec3( i1127[25], i1127[26], i1127[27] )
  i1126.endCameraAngle = new pc.Vec3( i1127[28], i1127[29], i1127[30] )
  i1126.startCameraPosition = new pc.Vec3( i1127[31], i1127[32], i1127[33] )
  i1126.endCameraPosition = new pc.Vec3( i1127[34], i1127[35], i1127[36] )
  i1126.cameraTransitionDelay = i1127[37]
  i1126.cameraTransitionDuration = i1127[38]
  i1126.startFOV = i1127[39]
  i1126.endFOV = i1127[40]
  i1126.fovTransitionDelay = i1127[41]
  i1126.fovTransitionDuration = i1127[42]
  i1126.blockPlayerInput = !!i1127[43]
  i1126.blockInputDuration = i1127[44]
  i1126.showIntroText = !!i1127[45]
  i1126.introText = i1127[46]
  i1126.introTextDuration = i1127[47]
  i1126.hideIntroTextOnPlayerTouch = !!i1127[48]
  i1126.introTextHideAfterDuration = !!i1127[49]
  i1126.enableFakeControl = !!i1127[50]
  i1126.enableMovingVisual = !!i1127[51]
  i1126.enableMovingHand = !!i1127[52]
  i1126.enableFloatingAnimation = !!i1127[53]
  i1126.floatingHeight = i1127[54]
  i1126.floatingSpeed = i1127[55]
  i1126.enableSelfRotation = !!i1127[56]
  i1126.rotationSpeed = i1127[57]
  i1126.selectedTopItem = i1127[58]
  i1126.enableTopItemFloating = !!i1127[59]
  i1126.topItemFloatingHeight = i1127[60]
  i1126.topItemFloatingSpeed = i1127[61]
  i1126.enableTopItemRotation = !!i1127[62]
  i1126.topItemRotationSpeed = i1127[63]
  i1126.enableSparkleParticle = !!i1127[64]
  i1126.towerWidth = i1127[65]
  i1126.towerHeight = i1127[66]
  i1126.topItemSizeMultiplier = i1127[67]
  i1126.enableTowerShootingWin = !!i1127[68]
  i1126.enableTowerShootingLose = !!i1127[69]
  i1126.towerWinAutoRedirectDelay = i1127[70]
  i1126.towerMissCheckDelay = i1127[71]
  i1126.groundColor = new pc.Color(i1127[72], i1127[73], i1127[74], i1127[75])
  i1126.groundTexture = i1127[76]
  i1126.lightColor = new pc.Color(i1127[77], i1127[78], i1127[79], i1127[80])
  i1126.lightIntensity = i1127[81]
  i1126.lightRotation = new pc.Vec3( i1127[82], i1127[83], i1127[84] )
  i1126.enableJoystick = !!i1127[85]
  i1126.enableTutoJoystick = !!i1127[86]
  i1126.tutoJoystickShowAtStart = !!i1127[87]
  i1126.tutoJoystickDisplayDelay = i1127[88]
  i1126.enableTutoJoystickAfterTouch = !!i1127[89]
  i1126.tutoJoystickShowTimesAfterTouch = i1127[90]
  i1126.holeMoveSpeed = i1127[91]
  i1126.holeColor = new pc.Color(i1127[92], i1127[93], i1127[94], i1127[95])
  i1126.holeSkin = i1127[96]
  i1126.movementIndicatorColor = new pc.Color(i1127[97], i1127[98], i1127[99], i1127[100])
  i1126.enableMovementIndicator = !!i1127[101]
  i1126.hideMovementIndicatorWhenIdle = !!i1127[102]
  i1126.movementIndicatorType = i1127[103]
  i1126.aimArrowColor = new pc.Color(i1127[104], i1127[105], i1127[106], i1127[107])
  i1126.useHoleStartPosition = !!i1127[108]
  i1126.holeStartPosition = new pc.Vec3( i1127[109], i1127[110], i1127[111] )
  i1126.displayHoleCountFeedback = !!i1127[112]
  i1126.enableArrowDirection = !!i1127[113]
  i1126.arrowDirectionTargetType = i1127[114]
  i1126.arrowDirectionColor = new pc.Color(i1127[115], i1127[116], i1127[117], i1127[118])
  i1126.arrowDirectionOutlineColor = new pc.Color(i1127[119], i1127[120], i1127[121], i1127[122])
  i1126.arrowDirectionScale = i1127[123]
  i1126.arrowDirectionPosition = new pc.Vec3( i1127[124], i1127[125], i1127[126] )
  i1126.arrowDirectionModel = i1127[127]
  i1126.arrowDirectionYoyoSpeed = i1127[128]
  i1126.arrowDirectionYoyoDistance = i1127[129]
  i1126.showHoleGrowVFX = !!i1127[130]
  i1126.Level = i1127[131]
  i1126.corridorTheme = i1127[132]
  i1126.circularTheme = i1127[133]
  i1126.lvlCircular1Theme = i1127[134]
  i1126.lvlCircular2Theme = i1127[135]
  i1126.lvlCircular3Theme = i1127[136]
  i1126.lvlCircular4Theme = i1127[137]
  i1126.displayTopBanner = !!i1127[138]
  i1126.displayMidBanner = !!i1127[139]
  i1126.displayBotBanner = !!i1127[140]
  request.r(i1127[141], i1127[142], 0, i1126, 'winSound')
  request.r(i1127[143], i1127[144], 0, i1126, 'towerHitSound')
  request.r(i1127[145], i1127[146], 0, i1126, 'shootSound')
  request.r(i1127[147], i1127[148], 0, i1126, 'failSound')
  request.r(i1127[149], i1127[150], 0, i1126, 'introSound')
  request.r(i1127[151], i1127[152], 0, i1126, 'holeGrowSound')
  request.r(i1127[153], i1127[154], 0, i1126, 'collectItemSFX')
  i1126.enableClickRedirection = !!i1127[155]
  i1126.clicksToRedirect = i1127[156]
  i1126.enableTimeRedirection = !!i1127[157]
  i1126.timeToRedirect = i1127[158]
  i1126.redirectAfterThrow = !!i1127[159]
  i1126.redirectDelayAfterThrow = i1127[160]
  i1126.enableRedirectAfterFirst = !!i1127[161]
  i1126.enableObjectivesUI = !!i1127[162]
  i1126.objectivesOnlyTopItem = !!i1127[163]
  i1126.enableObjectivesTuto = !!i1127[164]
  i1126.objectivesTutoGlowSpeed = i1127[165]
  i1126.objectivesTutoTravelTime = i1127[166]
  i1126.objectivesTutoEndPause = i1127[167]
  i1126.enableObjectivePickupFlight = !!i1127[168]
  i1126.objectivePickupFlightDuration = i1127[169]
  return i1126
}

Deserializers["ColoredMaterial"] = function (request, data, root) {
  var i1134 = root || request.c( 'ColoredMaterial' )
  var i1135 = data
  i1134.MaterialHolder = i1135[0]
  request.r(i1135[1], i1135[2], 0, i1134, 'Material')
  var i1137 = i1135[3]
  var i1136 = []
  for(var i = 0; i < i1137.length; i += 2) {
  request.r(i1137[i + 0], i1137[i + 1], 2, i1136, '')
  }
  i1134.Textures = i1136
  i1134.ColorField = i1135[4]
  i1134.TextureField = i1135[5]
  i1134.DefaultColor = new pc.Color(i1135[6], i1135[7], i1135[8], i1135[9])
  return i1134
}

Deserializers["Luna.Unity.DTO.UnityEngine.Textures.Cubemap"] = function (request, data, root) {
  var i1140 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Textures.Cubemap' )
  var i1141 = data
  i1140.name = i1141[0]
  i1140.atlasId = i1141[1]
  i1140.mipmapCount = i1141[2]
  i1140.hdr = !!i1141[3]
  i1140.size = i1141[4]
  i1140.anisoLevel = i1141[5]
  i1140.filterMode = i1141[6]
  var i1143 = i1141[7]
  var i1142 = []
  for(var i = 0; i < i1143.length; i += 4) {
    i1142.push( UnityEngine.Rect.MinMaxRect(i1143[i + 0], i1143[i + 1], i1143[i + 2], i1143[i + 3]) );
  }
  i1140.rects = i1142
  i1140.wrapU = i1141[8]
  i1140.wrapV = i1141[9]
  return i1140
}

Deserializers["Luna.Unity.DTO.UnityEngine.Scene.Scene"] = function (request, data, root) {
  var i1146 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Scene.Scene' )
  var i1147 = data
  i1146.name = i1147[0]
  i1146.index = i1147[1]
  i1146.startup = !!i1147[2]
  return i1146
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.Camera"] = function (request, data, root) {
  var i1148 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.Camera' )
  var i1149 = data
  i1148.aspect = i1149[0]
  i1148.orthographic = !!i1149[1]
  i1148.orthographicSize = i1149[2]
  i1148.backgroundColor = new pc.Color(i1149[3], i1149[4], i1149[5], i1149[6])
  i1148.nearClipPlane = i1149[7]
  i1148.farClipPlane = i1149[8]
  i1148.fieldOfView = i1149[9]
  i1148.depth = i1149[10]
  i1148.clearFlags = i1149[11]
  i1148.cullingMask = i1149[12]
  i1148.rect = i1149[13]
  request.r(i1149[14], i1149[15], 0, i1148, 'targetTexture')
  i1148.usePhysicalProperties = !!i1149[16]
  i1148.focalLength = i1149[17]
  i1148.sensorSize = new pc.Vec2( i1149[18], i1149[19] )
  i1148.lensShift = new pc.Vec2( i1149[20], i1149[21] )
  i1148.gateFit = i1149[22]
  i1148.commandBufferCount = i1149[23]
  i1148.cameraType = i1149[24]
  i1148.enabled = !!i1149[25]
  return i1148
}

Deserializers["Cinemachine.CinemachineBrain"] = function (request, data, root) {
  var i1150 = root || request.c( 'Cinemachine.CinemachineBrain' )
  var i1151 = data
  i1150.m_ShowDebugText = !!i1151[0]
  i1150.m_ShowCameraFrustum = !!i1151[1]
  i1150.m_IgnoreTimeScale = !!i1151[2]
  request.r(i1151[3], i1151[4], 0, i1150, 'm_WorldUpOverride')
  i1150.m_UpdateMethod = i1151[5]
  i1150.m_BlendUpdateMethod = i1151[6]
  i1150.m_DefaultBlend = request.d('Cinemachine.CinemachineBlendDefinition', i1151[7], i1150.m_DefaultBlend)
  request.r(i1151[8], i1151[9], 0, i1150, 'm_CustomBlends')
  i1150.m_CameraCutEvent = request.d('Cinemachine.CinemachineBrain+BrainEvent', i1151[10], i1150.m_CameraCutEvent)
  i1150.m_CameraActivatedEvent = request.d('Cinemachine.CinemachineBrain+VcamActivatedEvent', i1151[11], i1150.m_CameraActivatedEvent)
  return i1150
}

Deserializers["Cinemachine.CinemachineBlendDefinition"] = function (request, data, root) {
  var i1152 = root || request.c( 'Cinemachine.CinemachineBlendDefinition' )
  var i1153 = data
  i1152.m_Style = i1153[0]
  i1152.m_Time = i1153[1]
  i1152.m_CustomCurve = new pc.AnimationCurve( { keys_flow: i1153[2] } )
  return i1152
}

Deserializers["Cinemachine.CinemachineBrain+BrainEvent"] = function (request, data, root) {
  var i1154 = root || request.c( 'Cinemachine.CinemachineBrain+BrainEvent' )
  var i1155 = data
  i1154.m_PersistentCalls = request.d('UnityEngine.Events.PersistentCallGroup', i1155[0], i1154.m_PersistentCalls)
  return i1154
}

Deserializers["Cinemachine.CinemachineBrain+VcamActivatedEvent"] = function (request, data, root) {
  var i1156 = root || request.c( 'Cinemachine.CinemachineBrain+VcamActivatedEvent' )
  var i1157 = data
  i1156.m_PersistentCalls = request.d('UnityEngine.Events.PersistentCallGroup', i1157[0], i1156.m_PersistentCalls)
  return i1156
}

Deserializers["CopyMainCameraFOV"] = function (request, data, root) {
  var i1158 = root || request.c( 'CopyMainCameraFOV' )
  var i1159 = data
  request.r(i1159[0], i1159[1], 0, i1158, 'mainCamera')
  return i1158
}

Deserializers["Cinemachine.CinemachineVirtualCamera"] = function (request, data, root) {
  var i1160 = root || request.c( 'Cinemachine.CinemachineVirtualCamera' )
  var i1161 = data
  request.r(i1161[0], i1161[1], 0, i1160, 'm_LookAt')
  request.r(i1161[2], i1161[3], 0, i1160, 'm_Follow')
  i1160.m_Lens = request.d('Cinemachine.LensSettings', i1161[4], i1160.m_Lens)
  i1160.m_Transitions = request.d('Cinemachine.CinemachineVirtualCameraBase+TransitionParams', i1161[5], i1160.m_Transitions)
  var i1163 = i1161[6]
  var i1162 = []
  for(var i = 0; i < i1163.length; i += 1) {
    i1162.push( i1163[i + 0] );
  }
  i1160.m_ExcludedPropertiesInInspector = i1162
  var i1165 = i1161[7]
  var i1164 = []
  for(var i = 0; i < i1165.length; i += 1) {
    i1164.push( i1165[i + 0] );
  }
  i1160.m_LockStageInInspector = i1164
  i1160.m_Priority = i1161[8]
  i1160.m_StandbyUpdate = i1161[9]
  i1160.m_LegacyBlendHint = i1161[10]
  request.r(i1161[11], i1161[12], 0, i1160, 'm_ComponentOwner')
  i1160.m_StreamingVersion = i1161[13]
  return i1160
}

Deserializers["Cinemachine.LensSettings"] = function (request, data, root) {
  var i1166 = root || request.c( 'Cinemachine.LensSettings' )
  var i1167 = data
  i1166.FieldOfView = i1167[0]
  i1166.OrthographicSize = i1167[1]
  i1166.NearClipPlane = i1167[2]
  i1166.FarClipPlane = i1167[3]
  i1166.Dutch = i1167[4]
  i1166.LensShift = new pc.Vec2( i1167[5], i1167[6] )
  return i1166
}

Deserializers["Cinemachine.CinemachineVirtualCameraBase+TransitionParams"] = function (request, data, root) {
  var i1168 = root || request.c( 'Cinemachine.CinemachineVirtualCameraBase+TransitionParams' )
  var i1169 = data
  i1168.m_BlendHint = i1169[0]
  i1168.m_InheritPosition = !!i1169[1]
  i1168.m_OnCameraLive = request.d('Cinemachine.CinemachineBrain+VcamActivatedEvent', i1169[2], i1168.m_OnCameraLive)
  return i1168
}

Deserializers["CinemachineCameraOffset"] = function (request, data, root) {
  var i1174 = root || request.c( 'CinemachineCameraOffset' )
  var i1175 = data
  i1174.m_Offset = new pc.Vec3( i1175[0], i1175[1], i1175[2] )
  i1174.m_ApplyAfter = i1175[3]
  i1174.m_PreserveComposition = !!i1175[4]
  return i1174
}

Deserializers["Cinemachine.CinemachinePipeline"] = function (request, data, root) {
  var i1176 = root || request.c( 'Cinemachine.CinemachinePipeline' )
  var i1177 = data
  return i1176
}

Deserializers["Cinemachine.CinemachineFramingTransposer"] = function (request, data, root) {
  var i1178 = root || request.c( 'Cinemachine.CinemachineFramingTransposer' )
  var i1179 = data
  i1178.m_LookaheadTime = i1179[0]
  i1178.m_LookaheadSmoothing = i1179[1]
  i1178.m_LookaheadIgnoreY = !!i1179[2]
  i1178.m_XDamping = i1179[3]
  i1178.m_YDamping = i1179[4]
  i1178.m_ZDamping = i1179[5]
  i1178.m_ScreenX = i1179[6]
  i1178.m_ScreenY = i1179[7]
  i1178.m_CameraDistance = i1179[8]
  i1178.m_DeadZoneWidth = i1179[9]
  i1178.m_DeadZoneHeight = i1179[10]
  i1178.m_DeadZoneDepth = i1179[11]
  i1178.m_UnlimitedSoftZone = !!i1179[12]
  i1178.m_SoftZoneWidth = i1179[13]
  i1178.m_SoftZoneHeight = i1179[14]
  i1178.m_BiasX = i1179[15]
  i1178.m_BiasY = i1179[16]
  i1178.m_CenterOnActivate = !!i1179[17]
  i1178.m_GroupFramingMode = i1179[18]
  i1178.m_AdjustmentMode = i1179[19]
  i1178.m_GroupFramingSize = i1179[20]
  i1178.m_MaxDollyIn = i1179[21]
  i1178.m_MaxDollyOut = i1179[22]
  i1178.m_MinimumDistance = i1179[23]
  i1178.m_MaximumDistance = i1179[24]
  i1178.m_MinimumFOV = i1179[25]
  i1178.m_MaximumFOV = i1179[26]
  i1178.m_MinimumOrthoSize = i1179[27]
  i1178.m_MaximumOrthoSize = i1179[28]
  return i1178
}

Deserializers["Luna.Unity.DTO.UnityEngine.Components.Light"] = function (request, data, root) {
  var i1180 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Components.Light' )
  var i1181 = data
  i1180.type = i1181[0]
  i1180.color = new pc.Color(i1181[1], i1181[2], i1181[3], i1181[4])
  i1180.cullingMask = i1181[5]
  i1180.intensity = i1181[6]
  i1180.range = i1181[7]
  i1180.spotAngle = i1181[8]
  i1180.shadows = i1181[9]
  i1180.shadowNormalBias = i1181[10]
  i1180.shadowBias = i1181[11]
  i1180.shadowStrength = i1181[12]
  i1180.shadowResolution = i1181[13]
  i1180.lightmapBakeType = i1181[14]
  i1180.renderMode = i1181[15]
  request.r(i1181[16], i1181[17], 0, i1180, 'cookie')
  i1180.cookieSize = i1181[18]
  i1180.enabled = !!i1181[19]
  return i1180
}

Deserializers["UnityEngine.Rendering.Universal.UniversalAdditionalLightData"] = function (request, data, root) {
  var i1182 = root || request.c( 'UnityEngine.Rendering.Universal.UniversalAdditionalLightData' )
  var i1183 = data
  i1182.m_Version = i1183[0]
  i1182.m_UsePipelineSettings = !!i1183[1]
  i1182.m_AdditionalLightsShadowResolutionTier = i1183[2]
  i1182.m_LightLayerMask = i1183[3]
  i1182.m_CustomShadowLayers = !!i1183[4]
  i1182.m_ShadowLayerMask = i1183[5]
  i1182.m_LightCookieSize = new pc.Vec2( i1183[6], i1183[7] )
  i1182.m_LightCookieOffset = new pc.Vec2( i1183[8], i1183[9] )
  return i1182
}

Deserializers["Sunlight"] = function (request, data, root) {
  var i1184 = root || request.c( 'Sunlight' )
  var i1185 = data
  request.r(i1185[0], i1185[1], 0, i1184, 'sunlightLight')
  return i1184
}

Deserializers["UnityEngine.EventSystems.EventSystem"] = function (request, data, root) {
  var i1186 = root || request.c( 'UnityEngine.EventSystems.EventSystem' )
  var i1187 = data
  request.r(i1187[0], i1187[1], 0, i1186, 'm_FirstSelected')
  i1186.m_sendNavigationEvents = !!i1187[2]
  i1186.m_DragThreshold = i1187[3]
  return i1186
}

Deserializers["UnityEngine.EventSystems.StandaloneInputModule"] = function (request, data, root) {
  var i1188 = root || request.c( 'UnityEngine.EventSystems.StandaloneInputModule' )
  var i1189 = data
  i1188.m_HorizontalAxis = i1189[0]
  i1188.m_VerticalAxis = i1189[1]
  i1188.m_SubmitButton = i1189[2]
  i1188.m_CancelButton = i1189[3]
  i1188.m_InputActionsPerSecond = i1189[4]
  i1188.m_RepeatDelay = i1189[5]
  i1188.m_ForceModuleActive = !!i1189[6]
  i1188.m_SendPointerHoverToParent = !!i1189[7]
  return i1188
}

Deserializers["StoreRedirectInitializer"] = function (request, data, root) {
  var i1190 = root || request.c( 'StoreRedirectInitializer' )
  var i1191 = data
  return i1190
}

Deserializers["StoreRedirectTracker"] = function (request, data, root) {
  var i1192 = root || request.c( 'StoreRedirectTracker' )
  var i1193 = data
  return i1192
}

Deserializers["AudioManager"] = function (request, data, root) {
  var i1194 = root || request.c( 'AudioManager' )
  var i1195 = data
  request.r(i1195[0], i1195[1], 0, i1194, 'musicSource')
  request.r(i1195[2], i1195[3], 0, i1194, 'sfxSource')
  request.r(i1195[4], i1195[5], 0, i1194, 'uiSource')
  i1194.musicVolume = i1195[6]
  i1194.sfxVolume = i1195[7]
  i1194.uiVolume = i1195[8]
  return i1194
}

Deserializers["IntroManager"] = function (request, data, root) {
  var i1196 = root || request.c( 'IntroManager' )
  var i1197 = data
  i1196.OnIntroStarted = request.d('System.Action', i1197[0], i1196.OnIntroStarted)
  i1196.OnIntroCompleted = request.d('System.Action', i1197[1], i1196.OnIntroCompleted)
  i1196.cameraTransitionCurve = new pc.AnimationCurve( { keys_flow: i1197[2] } )
  request.r(i1197[3], i1197[4], 0, i1196, 'playerCameraRef')
  request.r(i1197[5], i1197[6], 0, i1196, 'virtualCameraRef')
  request.r(i1197[7], i1197[8], 0, i1196, 'cameraOffsetRef')
  request.r(i1197[9], i1197[10], 0, i1196, 'holeController')
  request.r(i1197[11], i1197[12], 0, i1196, 'handCursorRef')
  return i1196
}

Deserializers["System.Action"] = function (request, data, root) {
  var i1198 = root || request.c( 'System.Action' )
  var i1199 = data
  return i1198
}

Deserializers["GameManager"] = function (request, data, root) {
  var i1200 = root || request.c( 'GameManager' )
  var i1201 = data
  i1200.currentTime = i1201[0]
  i1200.isGameOver = !!i1201[1]
  i1200.towerHit = !!i1201[2]
  i1200.towerMissed = !!i1201[3]
  i1200.hasShot = !!i1201[4]
  i1200.currentObjectiveAmount = i1201[5]
  i1200.gravity = i1201[6]
  request.r(i1201[7], i1201[8], 0, i1200, 'levelContainer')
  var i1203 = i1201[9]
  var i1202 = []
  for(var i = 0; i < i1203.length; i += 2) {
  request.r(i1203[i + 0], i1203[i + 1], 2, i1202, '')
  }
  i1200.levels = i1202
  i1200.useThrowableSystem = !!i1201[10]
  request.r(i1201[11], i1201[12], 0, i1200, 'pumpkinsParent')
  request.r(i1201[13], i1201[14], 0, i1200, 'watermelonsParent')
  request.r(i1201[15], i1201[16], 0, i1200, 'flower')
  return i1200
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.RenderSettings"] = function (request, data, root) {
  var i1206 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.RenderSettings' )
  var i1207 = data
  i1206.ambientIntensity = i1207[0]
  i1206.reflectionIntensity = i1207[1]
  i1206.ambientMode = i1207[2]
  i1206.ambientLight = new pc.Color(i1207[3], i1207[4], i1207[5], i1207[6])
  i1206.ambientSkyColor = new pc.Color(i1207[7], i1207[8], i1207[9], i1207[10])
  i1206.ambientGroundColor = new pc.Color(i1207[11], i1207[12], i1207[13], i1207[14])
  i1206.ambientEquatorColor = new pc.Color(i1207[15], i1207[16], i1207[17], i1207[18])
  i1206.fogColor = new pc.Color(i1207[19], i1207[20], i1207[21], i1207[22])
  i1206.fogEndDistance = i1207[23]
  i1206.fogStartDistance = i1207[24]
  i1206.fogDensity = i1207[25]
  i1206.fog = !!i1207[26]
  request.r(i1207[27], i1207[28], 0, i1206, 'skybox')
  i1206.fogMode = i1207[29]
  var i1209 = i1207[30]
  var i1208 = []
  for(var i = 0; i < i1209.length; i += 1) {
    i1208.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.RenderSettings+Lightmap', i1209[i + 0]) );
  }
  i1206.lightmaps = i1208
  i1206.lightProbes = request.d('Luna.Unity.DTO.UnityEngine.Assets.RenderSettings+LightProbes', i1207[31], i1206.lightProbes)
  i1206.lightmapsMode = i1207[32]
  i1206.mixedBakeMode = i1207[33]
  i1206.environmentLightingMode = i1207[34]
  i1206.ambientProbe = new pc.SphericalHarmonicsL2(i1207[35])
  i1206.referenceAmbientProbe = new pc.SphericalHarmonicsL2(i1207[36])
  i1206.useReferenceAmbientProbe = !!i1207[37]
  request.r(i1207[38], i1207[39], 0, i1206, 'customReflection')
  request.r(i1207[40], i1207[41], 0, i1206, 'defaultReflection')
  i1206.defaultReflectionMode = i1207[42]
  i1206.defaultReflectionResolution = i1207[43]
  i1206.sunLightObjectId = i1207[44]
  i1206.pixelLightCount = i1207[45]
  i1206.defaultReflectionHDR = !!i1207[46]
  i1206.hasLightDataAsset = !!i1207[47]
  i1206.hasManualGenerate = !!i1207[48]
  return i1206
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.RenderSettings+Lightmap"] = function (request, data, root) {
  var i1212 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.RenderSettings+Lightmap' )
  var i1213 = data
  request.r(i1213[0], i1213[1], 0, i1212, 'lightmapColor')
  request.r(i1213[2], i1213[3], 0, i1212, 'lightmapDirection')
  return i1212
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.RenderSettings+LightProbes"] = function (request, data, root) {
  var i1214 = root || new UnityEngine.LightProbes()
  var i1215 = data
  return i1214
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader"] = function (request, data, root) {
  var i1222 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader' )
  var i1223 = data
  var i1225 = i1223[0]
  var i1224 = new (System.Collections.Generic.List$1(Bridge.ns('Luna.Unity.DTO.UnityEngine.Assets.Shader+ShaderCompilationError')))
  for(var i = 0; i < i1225.length; i += 1) {
    i1224.add(request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+ShaderCompilationError', i1225[i + 0]));
  }
  i1222.ShaderCompilationErrors = i1224
  i1222.name = i1223[1]
  i1222.guid = i1223[2]
  var i1227 = i1223[3]
  var i1226 = []
  for(var i = 0; i < i1227.length; i += 1) {
    i1226.push( i1227[i + 0] );
  }
  i1222.shaderDefinedKeywords = i1226
  var i1229 = i1223[4]
  var i1228 = []
  for(var i = 0; i < i1229.length; i += 1) {
    i1228.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass', i1229[i + 0]) );
  }
  i1222.passes = i1228
  var i1231 = i1223[5]
  var i1230 = []
  for(var i = 0; i < i1231.length; i += 1) {
    i1230.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+UsePass', i1231[i + 0]) );
  }
  i1222.usePasses = i1230
  var i1233 = i1223[6]
  var i1232 = []
  for(var i = 0; i < i1233.length; i += 1) {
    i1232.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+DefaultParameterValue', i1233[i + 0]) );
  }
  i1222.defaultParameterValues = i1232
  request.r(i1223[7], i1223[8], 0, i1222, 'unityFallbackShader')
  i1222.readDepth = !!i1223[9]
  i1222.isCreatedByShaderGraph = !!i1223[10]
  i1222.disableBatching = !!i1223[11]
  i1222.compiled = !!i1223[12]
  return i1222
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+ShaderCompilationError"] = function (request, data, root) {
  var i1236 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+ShaderCompilationError' )
  var i1237 = data
  i1236.shaderName = i1237[0]
  i1236.errorMessage = i1237[1]
  return i1236
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass"] = function (request, data, root) {
  var i1240 = root || new pc.UnityShaderPass()
  var i1241 = data
  i1240.id = i1241[0]
  i1240.subShaderIndex = i1241[1]
  i1240.name = i1241[2]
  i1240.passType = i1241[3]
  i1240.grabPassTextureName = i1241[4]
  i1240.usePass = !!i1241[5]
  i1240.zTest = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[6], i1240.zTest)
  i1240.zWrite = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[7], i1240.zWrite)
  i1240.culling = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[8], i1240.culling)
  i1240.blending = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Blending', i1241[9], i1240.blending)
  i1240.alphaBlending = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Blending', i1241[10], i1240.alphaBlending)
  i1240.colorWriteMask = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[11], i1240.colorWriteMask)
  i1240.offsetUnits = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[12], i1240.offsetUnits)
  i1240.offsetFactor = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[13], i1240.offsetFactor)
  i1240.stencilRef = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[14], i1240.stencilRef)
  i1240.stencilReadMask = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[15], i1240.stencilReadMask)
  i1240.stencilWriteMask = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1241[16], i1240.stencilWriteMask)
  i1240.stencilOp = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+StencilOp', i1241[17], i1240.stencilOp)
  i1240.stencilOpFront = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+StencilOp', i1241[18], i1240.stencilOpFront)
  i1240.stencilOpBack = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+StencilOp', i1241[19], i1240.stencilOpBack)
  var i1243 = i1241[20]
  var i1242 = []
  for(var i = 0; i < i1243.length; i += 1) {
    i1242.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Tag', i1243[i + 0]) );
  }
  i1240.tags = i1242
  var i1245 = i1241[21]
  var i1244 = []
  for(var i = 0; i < i1245.length; i += 1) {
    i1244.push( i1245[i + 0] );
  }
  i1240.passDefinedKeywords = i1244
  var i1247 = i1241[22]
  var i1246 = []
  for(var i = 0; i < i1247.length; i += 1) {
    i1246.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+KeywordGroup', i1247[i + 0]) );
  }
  i1240.passDefinedKeywordGroups = i1246
  var i1249 = i1241[23]
  var i1248 = []
  for(var i = 0; i < i1249.length; i += 1) {
    i1248.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Variant', i1249[i + 0]) );
  }
  i1240.variants = i1248
  var i1251 = i1241[24]
  var i1250 = []
  for(var i = 0; i < i1251.length; i += 1) {
    i1250.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Variant', i1251[i + 0]) );
  }
  i1240.excludedVariants = i1250
  i1240.hasDepthReader = !!i1241[25]
  return i1240
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value"] = function (request, data, root) {
  var i1252 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value' )
  var i1253 = data
  i1252.val = i1253[0]
  i1252.name = i1253[1]
  return i1252
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Blending"] = function (request, data, root) {
  var i1254 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Blending' )
  var i1255 = data
  i1254.src = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1255[0], i1254.src)
  i1254.dst = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1255[1], i1254.dst)
  i1254.op = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1255[2], i1254.op)
  return i1254
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+StencilOp"] = function (request, data, root) {
  var i1256 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+StencilOp' )
  var i1257 = data
  i1256.pass = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1257[0], i1256.pass)
  i1256.fail = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1257[1], i1256.fail)
  i1256.zFail = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1257[2], i1256.zFail)
  i1256.comp = request.d('Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value', i1257[3], i1256.comp)
  return i1256
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Tag"] = function (request, data, root) {
  var i1260 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Tag' )
  var i1261 = data
  i1260.name = i1261[0]
  i1260.value = i1261[1]
  return i1260
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+KeywordGroup"] = function (request, data, root) {
  var i1264 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+KeywordGroup' )
  var i1265 = data
  var i1267 = i1265[0]
  var i1266 = []
  for(var i = 0; i < i1267.length; i += 1) {
    i1266.push( i1267[i + 0] );
  }
  i1264.keywords = i1266
  i1264.hasDiscard = !!i1265[1]
  return i1264
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Variant"] = function (request, data, root) {
  var i1270 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Variant' )
  var i1271 = data
  i1270.passId = i1271[0]
  i1270.subShaderIndex = i1271[1]
  var i1273 = i1271[2]
  var i1272 = []
  for(var i = 0; i < i1273.length; i += 1) {
    i1272.push( i1273[i + 0] );
  }
  i1270.keywords = i1272
  i1270.vertexProgram = i1271[3]
  i1270.fragmentProgram = i1271[4]
  i1270.exportedForWebGl2 = !!i1271[5]
  i1270.readDepth = !!i1271[6]
  return i1270
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+UsePass"] = function (request, data, root) {
  var i1276 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+UsePass' )
  var i1277 = data
  request.r(i1277[0], i1277[1], 0, i1276, 'shader')
  i1276.pass = i1277[2]
  return i1276
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Shader+DefaultParameterValue"] = function (request, data, root) {
  var i1280 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Shader+DefaultParameterValue' )
  var i1281 = data
  i1280.name = i1281[0]
  i1280.type = i1281[1]
  i1280.value = new pc.Vec4( i1281[2], i1281[3], i1281[4], i1281[5] )
  i1280.textureValue = i1281[6]
  i1280.shaderPropertyFlag = i1281[7]
  return i1280
}

Deserializers["Luna.Unity.DTO.UnityEngine.Textures.Sprite"] = function (request, data, root) {
  var i1282 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Textures.Sprite' )
  var i1283 = data
  i1282.name = i1283[0]
  request.r(i1283[1], i1283[2], 0, i1282, 'texture')
  i1282.aabb = i1283[3]
  i1282.vertices = i1283[4]
  i1282.triangles = i1283[5]
  i1282.textureRect = UnityEngine.Rect.MinMaxRect(i1283[6], i1283[7], i1283[8], i1283[9])
  i1282.packedRect = UnityEngine.Rect.MinMaxRect(i1283[10], i1283[11], i1283[12], i1283[13])
  i1282.border = new pc.Vec4( i1283[14], i1283[15], i1283[16], i1283[17] )
  i1282.transparency = i1283[18]
  i1282.bounds = i1283[19]
  i1282.pixelsPerUnit = i1283[20]
  i1282.textureWidth = i1283[21]
  i1282.textureHeight = i1283[22]
  i1282.nativeSize = new pc.Vec2( i1283[23], i1283[24] )
  i1282.pivot = new pc.Vec2( i1283[25], i1283[26] )
  i1282.textureRectOffset = new pc.Vec2( i1283[27], i1283[28] )
  return i1282
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.AudioClip"] = function (request, data, root) {
  var i1284 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.AudioClip' )
  var i1285 = data
  i1284.name = i1285[0]
  return i1284
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationClip"] = function (request, data, root) {
  var i1286 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationClip' )
  var i1287 = data
  i1286.name = i1287[0]
  i1286.wrapMode = i1287[1]
  i1286.isLooping = !!i1287[2]
  i1286.length = i1287[3]
  var i1289 = i1287[4]
  var i1288 = []
  for(var i = 0; i < i1289.length; i += 1) {
    i1288.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationCurve', i1289[i + 0]) );
  }
  i1286.curves = i1288
  var i1291 = i1287[5]
  var i1290 = []
  for(var i = 0; i < i1291.length; i += 1) {
    i1290.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationEvent', i1291[i + 0]) );
  }
  i1286.events = i1290
  i1286.halfPrecision = !!i1287[6]
  i1286._frameRate = i1287[7]
  i1286.localBounds = request.d('Luna.Unity.DTO.UnityEngine.Animation.Data.Bounds', i1287[8], i1286.localBounds)
  i1286.hasMuscleCurves = !!i1287[9]
  var i1293 = i1287[10]
  var i1292 = []
  for(var i = 0; i < i1293.length; i += 1) {
    i1292.push( i1293[i + 0] );
  }
  i1286.clipMuscleConstant = i1292
  i1286.clipBindingConstant = request.d('Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationClip+AnimationClipBindingConstant', i1287[11], i1286.clipBindingConstant)
  return i1286
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationCurve"] = function (request, data, root) {
  var i1296 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationCurve' )
  var i1297 = data
  i1296.path = i1297[0]
  i1296.hash = i1297[1]
  i1296.componentType = i1297[2]
  i1296.property = i1297[3]
  i1296.keys = i1297[4]
  var i1299 = i1297[5]
  var i1298 = []
  for(var i = 0; i < i1299.length; i += 1) {
    i1298.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationCurve+ObjectReferenceKey', i1299[i + 0]) );
  }
  i1296.objectReferenceKeys = i1298
  return i1296
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationCurve+ObjectReferenceKey"] = function (request, data, root) {
  var i1302 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationCurve+ObjectReferenceKey' )
  var i1303 = data
  i1302.time = i1303[0]
  request.r(i1303[1], i1303[2], 0, i1302, 'value')
  return i1302
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationEvent"] = function (request, data, root) {
  var i1306 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationEvent' )
  var i1307 = data
  i1306.functionName = i1307[0]
  i1306.floatParameter = i1307[1]
  i1306.intParameter = i1307[2]
  i1306.stringParameter = i1307[3]
  request.r(i1307[4], i1307[5], 0, i1306, 'objectReferenceParameter')
  i1306.time = i1307[6]
  return i1306
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Data.Bounds"] = function (request, data, root) {
  var i1308 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Data.Bounds' )
  var i1309 = data
  i1308.center = new pc.Vec3( i1309[0], i1309[1], i1309[2] )
  i1308.extends = new pc.Vec3( i1309[3], i1309[4], i1309[5] )
  return i1308
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationClip+AnimationClipBindingConstant"] = function (request, data, root) {
  var i1312 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationClip+AnimationClipBindingConstant' )
  var i1313 = data
  var i1315 = i1313[0]
  var i1314 = []
  for(var i = 0; i < i1315.length; i += 1) {
    i1314.push( i1315[i + 0] );
  }
  i1312.genericBindings = i1314
  var i1317 = i1313[1]
  var i1316 = []
  for(var i = 0; i < i1317.length; i += 1) {
    i1316.push( i1317[i + 0] );
  }
  i1312.pptrCurveMapping = i1316
  return i1312
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Font"] = function (request, data, root) {
  var i1318 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Font' )
  var i1319 = data
  i1318.name = i1319[0]
  i1318.ascent = i1319[1]
  i1318.originalLineHeight = i1319[2]
  i1318.fontSize = i1319[3]
  var i1321 = i1319[4]
  var i1320 = []
  for(var i = 0; i < i1321.length; i += 1) {
    i1320.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Font+CharacterInfo', i1321[i + 0]) );
  }
  i1318.characterInfo = i1320
  request.r(i1319[5], i1319[6], 0, i1318, 'texture')
  i1318.originalFontSize = i1319[7]
  return i1318
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Font+CharacterInfo"] = function (request, data, root) {
  var i1324 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Font+CharacterInfo' )
  var i1325 = data
  i1324.index = i1325[0]
  i1324.advance = i1325[1]
  i1324.bearing = i1325[2]
  i1324.glyphWidth = i1325[3]
  i1324.glyphHeight = i1325[4]
  i1324.minX = i1325[5]
  i1324.maxX = i1325[6]
  i1324.minY = i1325[7]
  i1324.maxY = i1325[8]
  i1324.uvBottomLeftX = i1325[9]
  i1324.uvBottomLeftY = i1325[10]
  i1324.uvBottomRightX = i1325[11]
  i1324.uvBottomRightY = i1325[12]
  i1324.uvTopLeftX = i1325[13]
  i1324.uvTopLeftY = i1325[14]
  i1324.uvTopRightX = i1325[15]
  i1324.uvTopRightY = i1325[16]
  return i1324
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorController"] = function (request, data, root) {
  var i1326 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorController' )
  var i1327 = data
  i1326.name = i1327[0]
  var i1329 = i1327[1]
  var i1328 = []
  for(var i = 0; i < i1329.length; i += 1) {
    i1328.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorControllerLayer', i1329[i + 0]) );
  }
  i1326.layers = i1328
  var i1331 = i1327[2]
  var i1330 = []
  for(var i = 0; i < i1331.length; i += 1) {
    i1330.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorControllerParameter', i1331[i + 0]) );
  }
  i1326.parameters = i1330
  i1326.animationClips = i1327[3]
  i1326.avatarUnsupported = i1327[4]
  return i1326
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorControllerLayer"] = function (request, data, root) {
  var i1334 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorControllerLayer' )
  var i1335 = data
  i1334.name = i1335[0]
  i1334.defaultWeight = i1335[1]
  i1334.blendingMode = i1335[2]
  i1334.avatarMask = i1335[3]
  i1334.syncedLayerIndex = i1335[4]
  i1334.syncedLayerAffectsTiming = !!i1335[5]
  i1334.syncedLayers = i1335[6]
  i1334.stateMachine = request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateMachine', i1335[7], i1334.stateMachine)
  return i1334
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateMachine"] = function (request, data, root) {
  var i1336 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateMachine' )
  var i1337 = data
  i1336.id = i1337[0]
  i1336.name = i1337[1]
  i1336.path = i1337[2]
  var i1339 = i1337[3]
  var i1338 = []
  for(var i = 0; i < i1339.length; i += 1) {
    i1338.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorState', i1339[i + 0]) );
  }
  i1336.states = i1338
  var i1341 = i1337[4]
  var i1340 = []
  for(var i = 0; i < i1341.length; i += 1) {
    i1340.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateMachine', i1341[i + 0]) );
  }
  i1336.machines = i1340
  var i1343 = i1337[5]
  var i1342 = []
  for(var i = 0; i < i1343.length; i += 1) {
    i1342.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorTransition', i1343[i + 0]) );
  }
  i1336.entryStateTransitions = i1342
  var i1345 = i1337[6]
  var i1344 = []
  for(var i = 0; i < i1345.length; i += 1) {
    i1344.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorTransition', i1345[i + 0]) );
  }
  i1336.exitStateTransitions = i1344
  var i1347 = i1337[7]
  var i1346 = []
  for(var i = 0; i < i1347.length; i += 1) {
    i1346.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateTransition', i1347[i + 0]) );
  }
  i1336.anyStateTransitions = i1346
  i1336.defaultStateId = i1337[8]
  return i1336
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorState"] = function (request, data, root) {
  var i1350 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorState' )
  var i1351 = data
  i1350.id = i1351[0]
  i1350.name = i1351[1]
  i1350.cycleOffset = i1351[2]
  i1350.cycleOffsetParameter = i1351[3]
  i1350.cycleOffsetParameterActive = !!i1351[4]
  i1350.mirror = !!i1351[5]
  i1350.mirrorParameter = i1351[6]
  i1350.mirrorParameterActive = !!i1351[7]
  i1350.motionId = i1351[8]
  i1350.nameHash = i1351[9]
  i1350.fullPathHash = i1351[10]
  i1350.speed = i1351[11]
  i1350.speedParameter = i1351[12]
  i1350.speedParameterActive = !!i1351[13]
  i1350.tag = i1351[14]
  i1350.tagHash = i1351[15]
  i1350.writeDefaultValues = !!i1351[16]
  var i1353 = i1351[17]
  var i1352 = []
  for(var i = 0; i < i1353.length; i += 2) {
  request.r(i1353[i + 0], i1353[i + 1], 2, i1352, '')
  }
  i1350.behaviours = i1352
  var i1355 = i1351[18]
  var i1354 = []
  for(var i = 0; i < i1355.length; i += 1) {
    i1354.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateTransition', i1355[i + 0]) );
  }
  i1350.transitions = i1354
  return i1350
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateTransition"] = function (request, data, root) {
  var i1360 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateTransition' )
  var i1361 = data
  i1360.fullPath = i1361[0]
  i1360.canTransitionToSelf = !!i1361[1]
  i1360.duration = i1361[2]
  i1360.exitTime = i1361[3]
  i1360.hasExitTime = !!i1361[4]
  i1360.hasFixedDuration = !!i1361[5]
  i1360.interruptionSource = i1361[6]
  i1360.offset = i1361[7]
  i1360.orderedInterruption = !!i1361[8]
  i1360.destinationStateId = i1361[9]
  i1360.isExit = !!i1361[10]
  i1360.mute = !!i1361[11]
  i1360.solo = !!i1361[12]
  var i1363 = i1361[13]
  var i1362 = []
  for(var i = 0; i < i1363.length; i += 1) {
    i1362.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorCondition', i1363[i + 0]) );
  }
  i1360.conditions = i1362
  return i1360
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorTransition"] = function (request, data, root) {
  var i1368 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorTransition' )
  var i1369 = data
  i1368.destinationStateId = i1369[0]
  i1368.isExit = !!i1369[1]
  i1368.mute = !!i1369[2]
  i1368.solo = !!i1369[3]
  var i1371 = i1369[4]
  var i1370 = []
  for(var i = 0; i < i1371.length; i += 1) {
    i1370.push( request.d('Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorCondition', i1371[i + 0]) );
  }
  i1368.conditions = i1370
  return i1368
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorControllerParameter"] = function (request, data, root) {
  var i1374 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorControllerParameter' )
  var i1375 = data
  i1374.defaultBool = !!i1375[0]
  i1374.defaultFloat = i1375[1]
  i1374.defaultInt = i1375[2]
  i1374.name = i1375[3]
  i1374.nameHash = i1375[4]
  i1374.type = i1375[5]
  return i1374
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.TextAsset"] = function (request, data, root) {
  var i1376 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.TextAsset' )
  var i1377 = data
  i1376.name = i1377[0]
  i1376.bytes64 = i1377[1]
  i1376.data = i1377[2]
  return i1376
}

Deserializers["TMPro.TMP_FontAsset"] = function (request, data, root) {
  var i1378 = root || request.c( 'TMPro.TMP_FontAsset' )
  var i1379 = data
  request.r(i1379[0], i1379[1], 0, i1378, 'atlas')
  i1378.normalStyle = i1379[2]
  i1378.normalSpacingOffset = i1379[3]
  i1378.boldStyle = i1379[4]
  i1378.boldSpacing = i1379[5]
  i1378.italicStyle = i1379[6]
  i1378.tabSize = i1379[7]
  i1378.hashCode = i1379[8]
  request.r(i1379[9], i1379[10], 0, i1378, 'material')
  i1378.materialHashCode = i1379[11]
  i1378.m_Version = i1379[12]
  i1378.m_SourceFontFileGUID = i1379[13]
  request.r(i1379[14], i1379[15], 0, i1378, 'm_SourceFontFile_EditorRef')
  request.r(i1379[16], i1379[17], 0, i1378, 'm_SourceFontFile')
  i1378.m_AtlasPopulationMode = i1379[18]
  i1378.m_FaceInfo = request.d('UnityEngine.TextCore.FaceInfo', i1379[19], i1378.m_FaceInfo)
  var i1381 = i1379[20]
  var i1380 = new (System.Collections.Generic.List$1(Bridge.ns('UnityEngine.TextCore.Glyph')))
  for(var i = 0; i < i1381.length; i += 1) {
    i1380.add(request.d('UnityEngine.TextCore.Glyph', i1381[i + 0]));
  }
  i1378.m_GlyphTable = i1380
  var i1383 = i1379[21]
  var i1382 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_Character')))
  for(var i = 0; i < i1383.length; i += 1) {
    i1382.add(request.d('TMPro.TMP_Character', i1383[i + 0]));
  }
  i1378.m_CharacterTable = i1382
  var i1385 = i1379[22]
  var i1384 = []
  for(var i = 0; i < i1385.length; i += 2) {
  request.r(i1385[i + 0], i1385[i + 1], 2, i1384, '')
  }
  i1378.m_AtlasTextures = i1384
  i1378.m_AtlasTextureIndex = i1379[23]
  i1378.m_IsMultiAtlasTexturesEnabled = !!i1379[24]
  i1378.m_ClearDynamicDataOnBuild = !!i1379[25]
  var i1387 = i1379[26]
  var i1386 = new (System.Collections.Generic.List$1(Bridge.ns('UnityEngine.TextCore.GlyphRect')))
  for(var i = 0; i < i1387.length; i += 1) {
    i1386.add(request.d('UnityEngine.TextCore.GlyphRect', i1387[i + 0]));
  }
  i1378.m_UsedGlyphRects = i1386
  var i1389 = i1379[27]
  var i1388 = new (System.Collections.Generic.List$1(Bridge.ns('UnityEngine.TextCore.GlyphRect')))
  for(var i = 0; i < i1389.length; i += 1) {
    i1388.add(request.d('UnityEngine.TextCore.GlyphRect', i1389[i + 0]));
  }
  i1378.m_FreeGlyphRects = i1388
  i1378.m_fontInfo = request.d('TMPro.FaceInfo_Legacy', i1379[28], i1378.m_fontInfo)
  i1378.m_AtlasWidth = i1379[29]
  i1378.m_AtlasHeight = i1379[30]
  i1378.m_AtlasPadding = i1379[31]
  i1378.m_AtlasRenderMode = i1379[32]
  var i1391 = i1379[33]
  var i1390 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_Glyph')))
  for(var i = 0; i < i1391.length; i += 1) {
    i1390.add(request.d('TMPro.TMP_Glyph', i1391[i + 0]));
  }
  i1378.m_glyphInfoList = i1390
  i1378.m_KerningTable = request.d('TMPro.KerningTable', i1379[34], i1378.m_KerningTable)
  i1378.m_FontFeatureTable = request.d('TMPro.TMP_FontFeatureTable', i1379[35], i1378.m_FontFeatureTable)
  var i1393 = i1379[36]
  var i1392 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_FontAsset')))
  for(var i = 0; i < i1393.length; i += 2) {
  request.r(i1393[i + 0], i1393[i + 1], 1, i1392, '')
  }
  i1378.fallbackFontAssets = i1392
  var i1395 = i1379[37]
  var i1394 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_FontAsset')))
  for(var i = 0; i < i1395.length; i += 2) {
  request.r(i1395[i + 0], i1395[i + 1], 1, i1394, '')
  }
  i1378.m_FallbackFontAssetTable = i1394
  i1378.m_CreationSettings = request.d('TMPro.FontAssetCreationSettings', i1379[38], i1378.m_CreationSettings)
  var i1397 = i1379[39]
  var i1396 = []
  for(var i = 0; i < i1397.length; i += 1) {
    i1396.push( request.d('TMPro.TMP_FontWeightPair', i1397[i + 0]) );
  }
  i1378.m_FontWeightTable = i1396
  var i1399 = i1379[40]
  var i1398 = []
  for(var i = 0; i < i1399.length; i += 1) {
    i1398.push( request.d('TMPro.TMP_FontWeightPair', i1399[i + 0]) );
  }
  i1378.fontWeights = i1398
  return i1378
}

Deserializers["UnityEngine.TextCore.FaceInfo"] = function (request, data, root) {
  var i1400 = root || request.c( 'UnityEngine.TextCore.FaceInfo' )
  var i1401 = data
  i1400.m_FaceIndex = i1401[0]
  i1400.m_FamilyName = i1401[1]
  i1400.m_StyleName = i1401[2]
  i1400.m_PointSize = i1401[3]
  i1400.m_Scale = i1401[4]
  i1400.m_UnitsPerEM = i1401[5]
  i1400.m_LineHeight = i1401[6]
  i1400.m_AscentLine = i1401[7]
  i1400.m_CapLine = i1401[8]
  i1400.m_MeanLine = i1401[9]
  i1400.m_Baseline = i1401[10]
  i1400.m_DescentLine = i1401[11]
  i1400.m_SuperscriptOffset = i1401[12]
  i1400.m_SuperscriptSize = i1401[13]
  i1400.m_SubscriptOffset = i1401[14]
  i1400.m_SubscriptSize = i1401[15]
  i1400.m_UnderlineOffset = i1401[16]
  i1400.m_UnderlineThickness = i1401[17]
  i1400.m_StrikethroughOffset = i1401[18]
  i1400.m_StrikethroughThickness = i1401[19]
  i1400.m_TabWidth = i1401[20]
  return i1400
}

Deserializers["UnityEngine.TextCore.Glyph"] = function (request, data, root) {
  var i1404 = root || request.c( 'UnityEngine.TextCore.Glyph' )
  var i1405 = data
  i1404.m_Index = i1405[0]
  i1404.m_Metrics = request.d('UnityEngine.TextCore.GlyphMetrics', i1405[1], i1404.m_Metrics)
  i1404.m_GlyphRect = request.d('UnityEngine.TextCore.GlyphRect', i1405[2], i1404.m_GlyphRect)
  i1404.m_Scale = i1405[3]
  i1404.m_AtlasIndex = i1405[4]
  i1404.m_ClassDefinitionType = i1405[5]
  return i1404
}

Deserializers["UnityEngine.TextCore.GlyphMetrics"] = function (request, data, root) {
  var i1406 = root || request.c( 'UnityEngine.TextCore.GlyphMetrics' )
  var i1407 = data
  i1406.m_Width = i1407[0]
  i1406.m_Height = i1407[1]
  i1406.m_HorizontalBearingX = i1407[2]
  i1406.m_HorizontalBearingY = i1407[3]
  i1406.m_HorizontalAdvance = i1407[4]
  return i1406
}

Deserializers["UnityEngine.TextCore.GlyphRect"] = function (request, data, root) {
  var i1408 = root || request.c( 'UnityEngine.TextCore.GlyphRect' )
  var i1409 = data
  i1408.m_X = i1409[0]
  i1408.m_Y = i1409[1]
  i1408.m_Width = i1409[2]
  i1408.m_Height = i1409[3]
  return i1408
}

Deserializers["TMPro.TMP_Character"] = function (request, data, root) {
  var i1412 = root || request.c( 'TMPro.TMP_Character' )
  var i1413 = data
  i1412.m_ElementType = i1413[0]
  i1412.m_Unicode = i1413[1]
  i1412.m_GlyphIndex = i1413[2]
  i1412.m_Scale = i1413[3]
  return i1412
}

Deserializers["TMPro.FaceInfo_Legacy"] = function (request, data, root) {
  var i1418 = root || request.c( 'TMPro.FaceInfo_Legacy' )
  var i1419 = data
  i1418.Name = i1419[0]
  i1418.PointSize = i1419[1]
  i1418.Scale = i1419[2]
  i1418.CharacterCount = i1419[3]
  i1418.LineHeight = i1419[4]
  i1418.Baseline = i1419[5]
  i1418.Ascender = i1419[6]
  i1418.CapHeight = i1419[7]
  i1418.Descender = i1419[8]
  i1418.CenterLine = i1419[9]
  i1418.SuperscriptOffset = i1419[10]
  i1418.SubscriptOffset = i1419[11]
  i1418.SubSize = i1419[12]
  i1418.Underline = i1419[13]
  i1418.UnderlineThickness = i1419[14]
  i1418.strikethrough = i1419[15]
  i1418.strikethroughThickness = i1419[16]
  i1418.TabWidth = i1419[17]
  i1418.Padding = i1419[18]
  i1418.AtlasWidth = i1419[19]
  i1418.AtlasHeight = i1419[20]
  return i1418
}

Deserializers["TMPro.TMP_Glyph"] = function (request, data, root) {
  var i1422 = root || request.c( 'TMPro.TMP_Glyph' )
  var i1423 = data
  i1422.id = i1423[0]
  i1422.x = i1423[1]
  i1422.y = i1423[2]
  i1422.width = i1423[3]
  i1422.height = i1423[4]
  i1422.xOffset = i1423[5]
  i1422.yOffset = i1423[6]
  i1422.xAdvance = i1423[7]
  i1422.scale = i1423[8]
  return i1422
}

Deserializers["TMPro.KerningTable"] = function (request, data, root) {
  var i1424 = root || request.c( 'TMPro.KerningTable' )
  var i1425 = data
  var i1427 = i1425[0]
  var i1426 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.KerningPair')))
  for(var i = 0; i < i1427.length; i += 1) {
    i1426.add(request.d('TMPro.KerningPair', i1427[i + 0]));
  }
  i1424.kerningPairs = i1426
  return i1424
}

Deserializers["TMPro.KerningPair"] = function (request, data, root) {
  var i1430 = root || request.c( 'TMPro.KerningPair' )
  var i1431 = data
  i1430.xOffset = i1431[0]
  i1430.m_FirstGlyph = i1431[1]
  i1430.m_FirstGlyphAdjustments = request.d('TMPro.GlyphValueRecord_Legacy', i1431[2], i1430.m_FirstGlyphAdjustments)
  i1430.m_SecondGlyph = i1431[3]
  i1430.m_SecondGlyphAdjustments = request.d('TMPro.GlyphValueRecord_Legacy', i1431[4], i1430.m_SecondGlyphAdjustments)
  i1430.m_IgnoreSpacingAdjustments = !!i1431[5]
  return i1430
}

Deserializers["TMPro.TMP_FontFeatureTable"] = function (request, data, root) {
  var i1432 = root || request.c( 'TMPro.TMP_FontFeatureTable' )
  var i1433 = data
  var i1435 = i1433[0]
  var i1434 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_GlyphPairAdjustmentRecord')))
  for(var i = 0; i < i1435.length; i += 1) {
    i1434.add(request.d('TMPro.TMP_GlyphPairAdjustmentRecord', i1435[i + 0]));
  }
  i1432.m_GlyphPairAdjustmentRecords = i1434
  return i1432
}

Deserializers["TMPro.TMP_GlyphPairAdjustmentRecord"] = function (request, data, root) {
  var i1438 = root || request.c( 'TMPro.TMP_GlyphPairAdjustmentRecord' )
  var i1439 = data
  i1438.m_FirstAdjustmentRecord = request.d('TMPro.TMP_GlyphAdjustmentRecord', i1439[0], i1438.m_FirstAdjustmentRecord)
  i1438.m_SecondAdjustmentRecord = request.d('TMPro.TMP_GlyphAdjustmentRecord', i1439[1], i1438.m_SecondAdjustmentRecord)
  i1438.m_FeatureLookupFlags = i1439[2]
  return i1438
}

Deserializers["TMPro.FontAssetCreationSettings"] = function (request, data, root) {
  var i1442 = root || request.c( 'TMPro.FontAssetCreationSettings' )
  var i1443 = data
  i1442.sourceFontFileName = i1443[0]
  i1442.sourceFontFileGUID = i1443[1]
  i1442.pointSizeSamplingMode = i1443[2]
  i1442.pointSize = i1443[3]
  i1442.padding = i1443[4]
  i1442.packingMode = i1443[5]
  i1442.atlasWidth = i1443[6]
  i1442.atlasHeight = i1443[7]
  i1442.characterSetSelectionMode = i1443[8]
  i1442.characterSequence = i1443[9]
  i1442.referencedFontAssetGUID = i1443[10]
  i1442.referencedTextAssetGUID = i1443[11]
  i1442.fontStyle = i1443[12]
  i1442.fontStyleModifier = i1443[13]
  i1442.renderMode = i1443[14]
  i1442.includeFontFeatures = !!i1443[15]
  return i1442
}

Deserializers["TMPro.TMP_FontWeightPair"] = function (request, data, root) {
  var i1446 = root || request.c( 'TMPro.TMP_FontWeightPair' )
  var i1447 = data
  request.r(i1447[0], i1447[1], 0, i1446, 'regularTypeface')
  request.r(i1447[2], i1447[3], 0, i1446, 'italicTypeface')
  return i1446
}

Deserializers["UnityEditor.Rendering.Universal.AssetVersion"] = function (request, data, root) {
  var i1448 = root || request.c( 'UnityEditor.Rendering.Universal.AssetVersion' )
  var i1449 = data
  i1448.version = i1449[0]
  return i1448
}

Deserializers["TMPro.TMP_Settings"] = function (request, data, root) {
  var i1450 = root || request.c( 'TMPro.TMP_Settings' )
  var i1451 = data
  i1450.m_enableWordWrapping = !!i1451[0]
  i1450.m_enableKerning = !!i1451[1]
  i1450.m_enableExtraPadding = !!i1451[2]
  i1450.m_enableTintAllSprites = !!i1451[3]
  i1450.m_enableParseEscapeCharacters = !!i1451[4]
  i1450.m_EnableRaycastTarget = !!i1451[5]
  i1450.m_GetFontFeaturesAtRuntime = !!i1451[6]
  i1450.m_missingGlyphCharacter = i1451[7]
  i1450.m_warningsDisabled = !!i1451[8]
  request.r(i1451[9], i1451[10], 0, i1450, 'm_defaultFontAsset')
  i1450.m_defaultFontAssetPath = i1451[11]
  i1450.m_defaultFontSize = i1451[12]
  i1450.m_defaultAutoSizeMinRatio = i1451[13]
  i1450.m_defaultAutoSizeMaxRatio = i1451[14]
  i1450.m_defaultTextMeshProTextContainerSize = new pc.Vec2( i1451[15], i1451[16] )
  i1450.m_defaultTextMeshProUITextContainerSize = new pc.Vec2( i1451[17], i1451[18] )
  i1450.m_autoSizeTextContainer = !!i1451[19]
  i1450.m_IsTextObjectScaleStatic = !!i1451[20]
  var i1453 = i1451[21]
  var i1452 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_FontAsset')))
  for(var i = 0; i < i1453.length; i += 2) {
  request.r(i1453[i + 0], i1453[i + 1], 1, i1452, '')
  }
  i1450.m_fallbackFontAssets = i1452
  i1450.m_matchMaterialPreset = !!i1451[22]
  request.r(i1451[23], i1451[24], 0, i1450, 'm_defaultSpriteAsset')
  i1450.m_defaultSpriteAssetPath = i1451[25]
  i1450.m_enableEmojiSupport = !!i1451[26]
  i1450.m_MissingCharacterSpriteUnicode = i1451[27]
  i1450.m_defaultColorGradientPresetsPath = i1451[28]
  request.r(i1451[29], i1451[30], 0, i1450, 'm_defaultStyleSheet')
  i1450.m_StyleSheetsResourcePath = i1451[31]
  request.r(i1451[32], i1451[33], 0, i1450, 'm_leadingCharacters')
  request.r(i1451[34], i1451[35], 0, i1450, 'm_followingCharacters')
  i1450.m_UseModernHangulLineBreakingRules = !!i1451[36]
  return i1450
}

Deserializers["TMPro.TMP_SpriteAsset"] = function (request, data, root) {
  var i1454 = root || request.c( 'TMPro.TMP_SpriteAsset' )
  var i1455 = data
  request.r(i1455[0], i1455[1], 0, i1454, 'spriteSheet')
  var i1457 = i1455[2]
  var i1456 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_Sprite')))
  for(var i = 0; i < i1457.length; i += 1) {
    i1456.add(request.d('TMPro.TMP_Sprite', i1457[i + 0]));
  }
  i1454.spriteInfoList = i1456
  var i1459 = i1455[3]
  var i1458 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_SpriteAsset')))
  for(var i = 0; i < i1459.length; i += 2) {
  request.r(i1459[i + 0], i1459[i + 1], 1, i1458, '')
  }
  i1454.fallbackSpriteAssets = i1458
  i1454.hashCode = i1455[4]
  request.r(i1455[5], i1455[6], 0, i1454, 'material')
  i1454.materialHashCode = i1455[7]
  i1454.m_Version = i1455[8]
  i1454.m_FaceInfo = request.d('UnityEngine.TextCore.FaceInfo', i1455[9], i1454.m_FaceInfo)
  var i1461 = i1455[10]
  var i1460 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_SpriteCharacter')))
  for(var i = 0; i < i1461.length; i += 1) {
    i1460.add(request.d('TMPro.TMP_SpriteCharacter', i1461[i + 0]));
  }
  i1454.m_SpriteCharacterTable = i1460
  var i1463 = i1455[11]
  var i1462 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_SpriteGlyph')))
  for(var i = 0; i < i1463.length; i += 1) {
    i1462.add(request.d('TMPro.TMP_SpriteGlyph', i1463[i + 0]));
  }
  i1454.m_SpriteGlyphTable = i1462
  return i1454
}

Deserializers["TMPro.TMP_Sprite"] = function (request, data, root) {
  var i1466 = root || request.c( 'TMPro.TMP_Sprite' )
  var i1467 = data
  i1466.name = i1467[0]
  i1466.hashCode = i1467[1]
  i1466.unicode = i1467[2]
  i1466.pivot = new pc.Vec2( i1467[3], i1467[4] )
  request.r(i1467[5], i1467[6], 0, i1466, 'sprite')
  i1466.id = i1467[7]
  i1466.x = i1467[8]
  i1466.y = i1467[9]
  i1466.width = i1467[10]
  i1466.height = i1467[11]
  i1466.xOffset = i1467[12]
  i1466.yOffset = i1467[13]
  i1466.xAdvance = i1467[14]
  i1466.scale = i1467[15]
  return i1466
}

Deserializers["TMPro.TMP_SpriteCharacter"] = function (request, data, root) {
  var i1472 = root || request.c( 'TMPro.TMP_SpriteCharacter' )
  var i1473 = data
  i1472.m_Name = i1473[0]
  i1472.m_HashCode = i1473[1]
  i1472.m_ElementType = i1473[2]
  i1472.m_Unicode = i1473[3]
  i1472.m_GlyphIndex = i1473[4]
  i1472.m_Scale = i1473[5]
  return i1472
}

Deserializers["TMPro.TMP_SpriteGlyph"] = function (request, data, root) {
  var i1476 = root || request.c( 'TMPro.TMP_SpriteGlyph' )
  var i1477 = data
  request.r(i1477[0], i1477[1], 0, i1476, 'sprite')
  i1476.m_Index = i1477[2]
  i1476.m_Metrics = request.d('UnityEngine.TextCore.GlyphMetrics', i1477[3], i1476.m_Metrics)
  i1476.m_GlyphRect = request.d('UnityEngine.TextCore.GlyphRect', i1477[4], i1476.m_GlyphRect)
  i1476.m_Scale = i1477[5]
  i1476.m_AtlasIndex = i1477[6]
  i1476.m_ClassDefinitionType = i1477[7]
  return i1476
}

Deserializers["TMPro.TMP_StyleSheet"] = function (request, data, root) {
  var i1478 = root || request.c( 'TMPro.TMP_StyleSheet' )
  var i1479 = data
  var i1481 = i1479[0]
  var i1480 = new (System.Collections.Generic.List$1(Bridge.ns('TMPro.TMP_Style')))
  for(var i = 0; i < i1481.length; i += 1) {
    i1480.add(request.d('TMPro.TMP_Style', i1481[i + 0]));
  }
  i1478.m_StyleList = i1480
  return i1478
}

Deserializers["TMPro.TMP_Style"] = function (request, data, root) {
  var i1484 = root || request.c( 'TMPro.TMP_Style' )
  var i1485 = data
  i1484.m_Name = i1485[0]
  i1484.m_HashCode = i1485[1]
  i1484.m_OpeningDefinition = i1485[2]
  i1484.m_ClosingDefinition = i1485[3]
  i1484.m_OpeningTagArray = i1485[4]
  i1484.m_ClosingTagArray = i1485[5]
  i1484.m_OpeningTagUnicodeArray = i1485[6]
  i1484.m_ClosingTagUnicodeArray = i1485[7]
  return i1484
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Resources"] = function (request, data, root) {
  var i1486 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Resources' )
  var i1487 = data
  var i1489 = i1487[0]
  var i1488 = []
  for(var i = 0; i < i1489.length; i += 1) {
    i1488.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.Resources+File', i1489[i + 0]) );
  }
  i1486.files = i1488
  i1486.componentToPrefabIds = i1487[1]
  return i1486
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Resources+File"] = function (request, data, root) {
  var i1492 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Resources+File' )
  var i1493 = data
  i1492.path = i1493[0]
  request.r(i1493[1], i1493[2], 0, i1492, 'unityObject')
  return i1492
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings"] = function (request, data, root) {
  var i1494 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings' )
  var i1495 = data
  var i1497 = i1495[0]
  var i1496 = []
  for(var i = 0; i < i1497.length; i += 1) {
    i1496.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+ScriptsExecutionOrder', i1497[i + 0]) );
  }
  i1494.scriptsExecutionOrder = i1496
  var i1499 = i1495[1]
  var i1498 = []
  for(var i = 0; i < i1499.length; i += 1) {
    i1498.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+SortingLayer', i1499[i + 0]) );
  }
  i1494.sortingLayers = i1498
  var i1501 = i1495[2]
  var i1500 = []
  for(var i = 0; i < i1501.length; i += 1) {
    i1500.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+CullingLayer', i1501[i + 0]) );
  }
  i1494.cullingLayers = i1500
  i1494.timeSettings = request.d('Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+TimeSettings', i1495[3], i1494.timeSettings)
  i1494.physicsSettings = request.d('Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+PhysicsSettings', i1495[4], i1494.physicsSettings)
  i1494.physics2DSettings = request.d('Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+Physics2DSettings', i1495[5], i1494.physics2DSettings)
  i1494.qualitySettings = request.d('Luna.Unity.DTO.UnityEngine.Assets.QualitySettings', i1495[6], i1494.qualitySettings)
  i1494.enableRealtimeShadows = !!i1495[7]
  i1494.enableAutoInstancing = !!i1495[8]
  i1494.enableStaticBatching = !!i1495[9]
  i1494.enableDynamicBatching = !!i1495[10]
  i1494.lightmapEncodingQuality = i1495[11]
  i1494.desiredColorSpace = i1495[12]
  var i1503 = i1495[13]
  var i1502 = []
  for(var i = 0; i < i1503.length; i += 1) {
    i1502.push( i1503[i + 0] );
  }
  i1494.allTags = i1502
  return i1494
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+ScriptsExecutionOrder"] = function (request, data, root) {
  var i1506 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+ScriptsExecutionOrder' )
  var i1507 = data
  i1506.name = i1507[0]
  i1506.value = i1507[1]
  return i1506
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+SortingLayer"] = function (request, data, root) {
  var i1510 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+SortingLayer' )
  var i1511 = data
  i1510.id = i1511[0]
  i1510.name = i1511[1]
  i1510.value = i1511[2]
  return i1510
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+CullingLayer"] = function (request, data, root) {
  var i1514 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+CullingLayer' )
  var i1515 = data
  i1514.id = i1515[0]
  i1514.name = i1515[1]
  return i1514
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+TimeSettings"] = function (request, data, root) {
  var i1516 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+TimeSettings' )
  var i1517 = data
  i1516.fixedDeltaTime = i1517[0]
  i1516.maximumDeltaTime = i1517[1]
  i1516.timeScale = i1517[2]
  i1516.maximumParticleTimestep = i1517[3]
  return i1516
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+PhysicsSettings"] = function (request, data, root) {
  var i1518 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+PhysicsSettings' )
  var i1519 = data
  i1518.gravity = new pc.Vec3( i1519[0], i1519[1], i1519[2] )
  i1518.defaultSolverIterations = i1519[3]
  i1518.bounceThreshold = i1519[4]
  i1518.autoSyncTransforms = !!i1519[5]
  i1518.autoSimulation = !!i1519[6]
  var i1521 = i1519[7]
  var i1520 = []
  for(var i = 0; i < i1521.length; i += 1) {
    i1520.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+PhysicsSettings+CollisionMask', i1521[i + 0]) );
  }
  i1518.collisionMatrix = i1520
  return i1518
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+PhysicsSettings+CollisionMask"] = function (request, data, root) {
  var i1524 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+PhysicsSettings+CollisionMask' )
  var i1525 = data
  i1524.enabled = !!i1525[0]
  i1524.layerId = i1525[1]
  i1524.otherLayerId = i1525[2]
  return i1524
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+Physics2DSettings"] = function (request, data, root) {
  var i1526 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+Physics2DSettings' )
  var i1527 = data
  request.r(i1527[0], i1527[1], 0, i1526, 'material')
  i1526.gravity = new pc.Vec2( i1527[2], i1527[3] )
  i1526.positionIterations = i1527[4]
  i1526.velocityIterations = i1527[5]
  i1526.velocityThreshold = i1527[6]
  i1526.maxLinearCorrection = i1527[7]
  i1526.maxAngularCorrection = i1527[8]
  i1526.maxTranslationSpeed = i1527[9]
  i1526.maxRotationSpeed = i1527[10]
  i1526.baumgarteScale = i1527[11]
  i1526.baumgarteTOIScale = i1527[12]
  i1526.timeToSleep = i1527[13]
  i1526.linearSleepTolerance = i1527[14]
  i1526.angularSleepTolerance = i1527[15]
  i1526.defaultContactOffset = i1527[16]
  i1526.autoSimulation = !!i1527[17]
  i1526.queriesHitTriggers = !!i1527[18]
  i1526.queriesStartInColliders = !!i1527[19]
  i1526.callbacksOnDisable = !!i1527[20]
  i1526.reuseCollisionCallbacks = !!i1527[21]
  i1526.autoSyncTransforms = !!i1527[22]
  var i1529 = i1527[23]
  var i1528 = []
  for(var i = 0; i < i1529.length; i += 1) {
    i1528.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+Physics2DSettings+CollisionMask', i1529[i + 0]) );
  }
  i1526.collisionMatrix = i1528
  return i1526
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+Physics2DSettings+CollisionMask"] = function (request, data, root) {
  var i1532 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+Physics2DSettings+CollisionMask' )
  var i1533 = data
  i1532.enabled = !!i1533[0]
  i1532.layerId = i1533[1]
  i1532.otherLayerId = i1533[2]
  return i1532
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.QualitySettings"] = function (request, data, root) {
  var i1534 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.QualitySettings' )
  var i1535 = data
  var i1537 = i1535[0]
  var i1536 = []
  for(var i = 0; i < i1537.length; i += 1) {
    i1536.push( request.d('Luna.Unity.DTO.UnityEngine.Assets.QualitySettings', i1537[i + 0]) );
  }
  i1534.qualityLevels = i1536
  var i1539 = i1535[1]
  var i1538 = []
  for(var i = 0; i < i1539.length; i += 1) {
    i1538.push( i1539[i + 0] );
  }
  i1534.names = i1538
  i1534.shadows = i1535[2]
  i1534.anisotropicFiltering = i1535[3]
  i1534.antiAliasing = i1535[4]
  i1534.lodBias = i1535[5]
  i1534.shadowCascades = i1535[6]
  i1534.shadowDistance = i1535[7]
  i1534.shadowmaskMode = i1535[8]
  i1534.shadowProjection = i1535[9]
  i1534.shadowResolution = i1535[10]
  i1534.softParticles = !!i1535[11]
  i1534.softVegetation = !!i1535[12]
  i1534.activeColorSpace = i1535[13]
  i1534.desiredColorSpace = i1535[14]
  i1534.masterTextureLimit = i1535[15]
  i1534.maxQueuedFrames = i1535[16]
  i1534.particleRaycastBudget = i1535[17]
  i1534.pixelLightCount = i1535[18]
  i1534.realtimeReflectionProbes = !!i1535[19]
  i1534.shadowCascade2Split = i1535[20]
  i1534.shadowCascade4Split = new pc.Vec3( i1535[21], i1535[22], i1535[23] )
  i1534.streamingMipmapsActive = !!i1535[24]
  i1534.vSyncCount = i1535[25]
  i1534.asyncUploadBufferSize = i1535[26]
  i1534.asyncUploadTimeSlice = i1535[27]
  i1534.billboardsFaceCameraPosition = !!i1535[28]
  i1534.shadowNearPlaneOffset = i1535[29]
  i1534.streamingMipmapsMemoryBudget = i1535[30]
  i1534.maximumLODLevel = i1535[31]
  i1534.streamingMipmapsAddAllCameras = !!i1535[32]
  i1534.streamingMipmapsMaxLevelReduction = i1535[33]
  i1534.streamingMipmapsRenderersPerFrame = i1535[34]
  i1534.resolutionScalingFixedDPIFactor = i1535[35]
  i1534.streamingMipmapsMaxFileIORequests = i1535[36]
  i1534.currentQualityLevel = i1535[37]
  return i1534
}

Deserializers["Luna.Unity.DTO.UnityEngine.Assets.Mesh+BlendShapeFrame"] = function (request, data, root) {
  var i1544 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Assets.Mesh+BlendShapeFrame' )
  var i1545 = data
  i1544.weight = i1545[0]
  i1544.vertices = i1545[1]
  i1544.normals = i1545[2]
  i1544.tangents = i1545[3]
  return i1544
}

Deserializers["Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorCondition"] = function (request, data, root) {
  var i1548 = root || request.c( 'Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorCondition' )
  var i1549 = data
  i1548.mode = i1549[0]
  i1548.parameter = i1549[1]
  i1548.threshold = i1549[2]
  return i1548
}

Deserializers["TMPro.GlyphValueRecord_Legacy"] = function (request, data, root) {
  var i1550 = root || request.c( 'TMPro.GlyphValueRecord_Legacy' )
  var i1551 = data
  i1550.xPlacement = i1551[0]
  i1550.yPlacement = i1551[1]
  i1550.xAdvance = i1551[2]
  i1550.yAdvance = i1551[3]
  return i1550
}

Deserializers["TMPro.TMP_GlyphAdjustmentRecord"] = function (request, data, root) {
  var i1552 = root || request.c( 'TMPro.TMP_GlyphAdjustmentRecord' )
  var i1553 = data
  i1552.m_GlyphIndex = i1553[0]
  i1552.m_GlyphValueRecord = request.d('TMPro.TMP_GlyphValueRecord', i1553[1], i1552.m_GlyphValueRecord)
  return i1552
}

Deserializers["TMPro.TMP_GlyphValueRecord"] = function (request, data, root) {
  var i1554 = root || request.c( 'TMPro.TMP_GlyphValueRecord' )
  var i1555 = data
  i1554.m_XPlacement = i1555[0]
  i1554.m_YPlacement = i1555[1]
  i1554.m_XAdvance = i1555[2]
  i1554.m_YAdvance = i1555[3]
  return i1554
}

Deserializers.fields = {"Luna.Unity.DTO.UnityEngine.Components.Transform":{"position":0,"scale":3,"rotation":6},"Luna.Unity.DTO.UnityEngine.Components.SphereCollider":{"center":0,"radius":3,"enabled":4,"isTrigger":5,"material":6},"Luna.Unity.DTO.UnityEngine.Components.AudioSource":{"clip":0,"outputAudioMixerGroup":2,"playOnAwake":4,"loop":5,"time":6,"volume":7,"pitch":8,"enabled":9},"Luna.Unity.DTO.UnityEngine.Components.MeshFilter":{"sharedMesh":0},"Luna.Unity.DTO.UnityEngine.Components.MeshRenderer":{"additionalVertexStreams":0,"enabled":2,"sharedMaterial":3,"sharedMaterials":5,"receiveShadows":6,"shadowCastingMode":7,"sortingLayerID":8,"sortingOrder":9,"lightmapIndex":10,"lightmapSceneIndex":11,"lightmapScaleOffset":12,"lightProbeUsage":16,"reflectionProbeUsage":17},"Luna.Unity.DTO.UnityEngine.Scene.GameObject":{"name":0,"tagId":1,"enabled":2,"isStatic":3,"layer":4},"Luna.Unity.DTO.UnityEngine.Components.BoxCollider":{"center":0,"size":3,"enabled":6,"isTrigger":7,"material":8},"Luna.Unity.DTO.UnityEngine.Components.SpriteRenderer":{"color":0,"sprite":4,"flipX":6,"flipY":7,"drawMode":8,"size":9,"tileMode":11,"adaptiveModeThreshold":12,"maskInteraction":13,"spriteSortPoint":14,"enabled":15,"sharedMaterial":16,"sharedMaterials":18,"receiveShadows":19,"shadowCastingMode":20,"sortingLayerID":21,"sortingOrder":22,"lightmapIndex":23,"lightmapSceneIndex":24,"lightmapScaleOffset":25,"lightProbeUsage":29,"reflectionProbeUsage":30},"Luna.Unity.DTO.UnityEngine.Components.RectTransform":{"pivot":0,"anchorMin":2,"anchorMax":4,"sizeDelta":6,"anchoredPosition3D":8,"rotation":11,"scale":15},"Luna.Unity.DTO.UnityEngine.Components.Canvas":{"planeDistance":0,"referencePixelsPerUnit":1,"isFallbackOverlay":2,"renderMode":3,"renderOrder":4,"sortingLayerName":5,"sortingOrder":6,"scaleFactor":7,"worldCamera":8,"overrideSorting":10,"pixelPerfect":11,"targetDisplay":12,"overridePixelPerfect":13,"enabled":14},"Luna.Unity.DTO.UnityEngine.Components.CanvasGroup":{"m_Alpha":0,"m_Interactable":1,"m_BlocksRaycasts":2,"m_IgnoreParentGroups":3,"enabled":4},"Luna.Unity.DTO.UnityEngine.Components.CanvasRenderer":{"cullTransparentMesh":0},"Luna.Unity.DTO.UnityEngine.Components.ParticleSystem":{"main":0,"colorBySpeed":1,"colorOverLifetime":2,"emission":3,"rotationBySpeed":4,"rotationOverLifetime":5,"shape":6,"sizeBySpeed":7,"sizeOverLifetime":8,"textureSheetAnimation":9,"velocityOverLifetime":10,"noise":11,"inheritVelocity":12,"forceOverLifetime":13,"limitVelocityOverLifetime":14,"useAutoRandomSeed":15,"randomSeed":16},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.MainModule":{"duration":0,"loop":1,"prewarm":2,"startDelay":3,"startLifetime":4,"startSpeed":5,"startSize3D":6,"startSizeX":7,"startSizeY":8,"startSizeZ":9,"startRotation3D":10,"startRotationX":11,"startRotationY":12,"startRotationZ":13,"startColor":14,"gravityModifier":15,"simulationSpace":16,"customSimulationSpace":17,"simulationSpeed":19,"useUnscaledTime":20,"scalingMode":21,"playOnAwake":22,"maxParticles":23,"emitterVelocityMode":24,"stopAction":25},"Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxCurve":{"mode":0,"curveMin":1,"curveMax":2,"curveMultiplier":3,"constantMin":4,"constantMax":5},"Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.MinMaxGradient":{"mode":0,"gradientMin":1,"gradientMax":2,"colorMin":3,"colorMax":7},"Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Gradient":{"mode":0,"colorKeys":1,"alphaKeys":2},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ColorBySpeedModule":{"enabled":0,"color":1,"range":2},"Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Data.GradientColorKey":{"color":0,"time":4},"Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Data.GradientAlphaKey":{"alpha":0,"time":1},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ColorOverLifetimeModule":{"enabled":0,"color":1},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.EmissionModule":{"enabled":0,"rateOverTime":1,"rateOverDistance":2,"bursts":3},"Luna.Unity.DTO.UnityEngine.ParticleSystemTypes.Burst":{"count":0,"cycleCount":1,"minCount":2,"maxCount":3,"repeatInterval":4,"time":5},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.RotationBySpeedModule":{"enabled":0,"x":1,"y":2,"z":3,"separateAxes":4,"range":5},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.RotationOverLifetimeModule":{"enabled":0,"x":1,"y":2,"z":3,"separateAxes":4},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ShapeModule":{"enabled":0,"shapeType":1,"randomDirectionAmount":2,"sphericalDirectionAmount":3,"randomPositionAmount":4,"alignToDirection":5,"radius":6,"radiusMode":7,"radiusSpread":8,"radiusSpeed":9,"radiusThickness":10,"angle":11,"length":12,"boxThickness":13,"meshShapeType":16,"mesh":17,"meshRenderer":19,"skinnedMeshRenderer":21,"useMeshMaterialIndex":23,"meshMaterialIndex":24,"useMeshColors":25,"normalOffset":26,"arc":27,"arcMode":28,"arcSpread":29,"arcSpeed":30,"donutRadius":31,"position":32,"rotation":35,"scale":38},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.SizeBySpeedModule":{"enabled":0,"x":1,"y":2,"z":3,"separateAxes":4,"range":5},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.SizeOverLifetimeModule":{"enabled":0,"x":1,"y":2,"z":3,"separateAxes":4},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.TextureSheetAnimationModule":{"enabled":0,"mode":1,"animation":2,"numTilesX":3,"numTilesY":4,"useRandomRow":5,"frameOverTime":6,"startFrame":7,"cycleCount":8,"rowIndex":9,"flipU":10,"flipV":11,"spriteCount":12,"sprites":13},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.VelocityOverLifetimeModule":{"enabled":0,"x":1,"y":2,"z":3,"radial":4,"speedModifier":5,"space":6,"orbitalX":7,"orbitalY":8,"orbitalZ":9,"orbitalOffsetX":10,"orbitalOffsetY":11,"orbitalOffsetZ":12},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.NoiseModule":{"enabled":0,"separateAxes":1,"strengthX":2,"strengthY":3,"strengthZ":4,"frequency":5,"damping":6,"octaveCount":7,"octaveMultiplier":8,"octaveScale":9,"quality":10,"scrollSpeed":11,"scrollSpeedMultiplier":12,"remapEnabled":13,"remapX":14,"remapY":15,"remapZ":16,"positionAmount":17,"rotationAmount":18,"sizeAmount":19},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.InheritVelocityModule":{"enabled":0,"mode":1,"curve":2},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.ForceOverLifetimeModule":{"enabled":0,"x":1,"y":2,"z":3,"space":4,"randomized":5},"Luna.Unity.DTO.UnityEngine.ParticleSystemModules.LimitVelocityOverLifetimeModule":{"enabled":0,"limit":1,"limitX":2,"limitY":3,"limitZ":4,"dampen":5,"separateAxes":6,"space":7,"drag":8,"multiplyDragByParticleSize":9,"multiplyDragByParticleVelocity":10},"Luna.Unity.DTO.UnityEngine.Components.ParticleSystemRenderer":{"mesh":0,"meshCount":2,"activeVertexStreamsCount":3,"alignment":4,"renderMode":5,"sortMode":6,"lengthScale":7,"velocityScale":8,"cameraVelocityScale":9,"normalDirection":10,"sortingFudge":11,"minParticleSize":12,"maxParticleSize":13,"pivot":14,"trailMaterial":17,"applyActiveColorSpace":19,"enabled":20,"sharedMaterial":21,"sharedMaterials":23,"receiveShadows":24,"shadowCastingMode":25,"sortingLayerID":26,"sortingOrder":27,"lightmapIndex":28,"lightmapSceneIndex":29,"lightmapScaleOffset":30,"lightProbeUsage":34,"reflectionProbeUsage":35},"Luna.Unity.DTO.UnityEngine.Assets.Mesh":{"name":0,"halfPrecision":1,"useUInt32IndexFormat":2,"vertexCount":3,"aabb":4,"streams":5,"vertices":6,"subMeshes":7,"bindposes":8,"blendShapes":9},"Luna.Unity.DTO.UnityEngine.Assets.Mesh+SubMesh":{"triangles":0},"Luna.Unity.DTO.UnityEngine.Assets.Mesh+BlendShape":{"name":0,"frames":1},"Luna.Unity.DTO.UnityEngine.Assets.Material":{"name":0,"shader":1,"renderQueue":3,"enableInstancing":4,"floatParameters":5,"colorParameters":6,"vectorParameters":7,"textureParameters":8,"materialFlags":9},"Luna.Unity.DTO.UnityEngine.Assets.Material+FloatParameter":{"name":0,"value":1},"Luna.Unity.DTO.UnityEngine.Assets.Material+ColorParameter":{"name":0,"value":1},"Luna.Unity.DTO.UnityEngine.Assets.Material+VectorParameter":{"name":0,"value":1},"Luna.Unity.DTO.UnityEngine.Assets.Material+TextureParameter":{"name":0,"value":1},"Luna.Unity.DTO.UnityEngine.Assets.Material+MaterialFlag":{"name":0,"enabled":1},"Luna.Unity.DTO.UnityEngine.Textures.Texture2D":{"name":0,"width":1,"height":2,"mipmapCount":3,"anisoLevel":4,"filterMode":5,"hdr":6,"format":7,"wrapMode":8,"alphaIsTransparency":9,"alphaSource":10,"graphicsFormat":11,"sRGBTexture":12,"desiredColorSpace":13,"wrapU":14,"wrapV":15},"Luna.Unity.DTO.UnityEngine.Components.Rigidbody":{"mass":0,"drag":1,"angularDrag":2,"useGravity":3,"isKinematic":4,"constraints":5,"maxAngularVelocity":6,"collisionDetectionMode":7,"interpolation":8},"Luna.Unity.DTO.UnityEngine.Components.MeshCollider":{"sharedMesh":0,"convex":2,"enabled":3,"isTrigger":4,"material":5},"Luna.Unity.DTO.UnityEngine.Components.CapsuleCollider":{"center":0,"radius":3,"height":4,"direction":5,"enabled":6,"isTrigger":7,"material":8},"Luna.Unity.DTO.UnityEngine.Components.Animator":{"animatorController":0,"avatar":2,"updateMode":4,"hasTransformHierarchy":5,"applyRootMotion":6,"humanBones":7,"enabled":8},"Luna.Unity.DTO.UnityEngine.Textures.Cubemap":{"name":0,"atlasId":1,"mipmapCount":2,"hdr":3,"size":4,"anisoLevel":5,"filterMode":6,"rects":7,"wrapU":8,"wrapV":9},"Luna.Unity.DTO.UnityEngine.Scene.Scene":{"name":0,"index":1,"startup":2},"Luna.Unity.DTO.UnityEngine.Components.Camera":{"aspect":0,"orthographic":1,"orthographicSize":2,"backgroundColor":3,"nearClipPlane":7,"farClipPlane":8,"fieldOfView":9,"depth":10,"clearFlags":11,"cullingMask":12,"rect":13,"targetTexture":14,"usePhysicalProperties":16,"focalLength":17,"sensorSize":18,"lensShift":20,"gateFit":22,"commandBufferCount":23,"cameraType":24,"enabled":25},"Luna.Unity.DTO.UnityEngine.Components.Light":{"type":0,"color":1,"cullingMask":5,"intensity":6,"range":7,"spotAngle":8,"shadows":9,"shadowNormalBias":10,"shadowBias":11,"shadowStrength":12,"shadowResolution":13,"lightmapBakeType":14,"renderMode":15,"cookie":16,"cookieSize":18,"enabled":19},"Luna.Unity.DTO.UnityEngine.Assets.RenderSettings":{"ambientIntensity":0,"reflectionIntensity":1,"ambientMode":2,"ambientLight":3,"ambientSkyColor":7,"ambientGroundColor":11,"ambientEquatorColor":15,"fogColor":19,"fogEndDistance":23,"fogStartDistance":24,"fogDensity":25,"fog":26,"skybox":27,"fogMode":29,"lightmaps":30,"lightProbes":31,"lightmapsMode":32,"mixedBakeMode":33,"environmentLightingMode":34,"ambientProbe":35,"referenceAmbientProbe":36,"useReferenceAmbientProbe":37,"customReflection":38,"defaultReflection":40,"defaultReflectionMode":42,"defaultReflectionResolution":43,"sunLightObjectId":44,"pixelLightCount":45,"defaultReflectionHDR":46,"hasLightDataAsset":47,"hasManualGenerate":48},"Luna.Unity.DTO.UnityEngine.Assets.RenderSettings+Lightmap":{"lightmapColor":0,"lightmapDirection":2},"Luna.Unity.DTO.UnityEngine.Assets.RenderSettings+LightProbes":{"bakedProbes":0,"positions":1,"hullRays":2,"tetrahedra":3,"neighbours":4,"matrices":5},"Luna.Unity.DTO.UnityEngine.Assets.Shader":{"ShaderCompilationErrors":0,"name":1,"guid":2,"shaderDefinedKeywords":3,"passes":4,"usePasses":5,"defaultParameterValues":6,"unityFallbackShader":7,"readDepth":9,"isCreatedByShaderGraph":10,"disableBatching":11,"compiled":12},"Luna.Unity.DTO.UnityEngine.Assets.Shader+ShaderCompilationError":{"shaderName":0,"errorMessage":1},"Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass":{"id":0,"subShaderIndex":1,"name":2,"passType":3,"grabPassTextureName":4,"usePass":5,"zTest":6,"zWrite":7,"culling":8,"blending":9,"alphaBlending":10,"colorWriteMask":11,"offsetUnits":12,"offsetFactor":13,"stencilRef":14,"stencilReadMask":15,"stencilWriteMask":16,"stencilOp":17,"stencilOpFront":18,"stencilOpBack":19,"tags":20,"passDefinedKeywords":21,"passDefinedKeywordGroups":22,"variants":23,"excludedVariants":24,"hasDepthReader":25},"Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Value":{"val":0,"name":1},"Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Blending":{"src":0,"dst":1,"op":2},"Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+StencilOp":{"pass":0,"fail":1,"zFail":2,"comp":3},"Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Tag":{"name":0,"value":1},"Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+KeywordGroup":{"keywords":0,"hasDiscard":1},"Luna.Unity.DTO.UnityEngine.Assets.Shader+Pass+Variant":{"passId":0,"subShaderIndex":1,"keywords":2,"vertexProgram":3,"fragmentProgram":4,"exportedForWebGl2":5,"readDepth":6},"Luna.Unity.DTO.UnityEngine.Assets.Shader+UsePass":{"shader":0,"pass":2},"Luna.Unity.DTO.UnityEngine.Assets.Shader+DefaultParameterValue":{"name":0,"type":1,"value":2,"textureValue":6,"shaderPropertyFlag":7},"Luna.Unity.DTO.UnityEngine.Textures.Sprite":{"name":0,"texture":1,"aabb":3,"vertices":4,"triangles":5,"textureRect":6,"packedRect":10,"border":14,"transparency":18,"bounds":19,"pixelsPerUnit":20,"textureWidth":21,"textureHeight":22,"nativeSize":23,"pivot":25,"textureRectOffset":27},"Luna.Unity.DTO.UnityEngine.Assets.AudioClip":{"name":0},"Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationClip":{"name":0,"wrapMode":1,"isLooping":2,"length":3,"curves":4,"events":5,"halfPrecision":6,"_frameRate":7,"localBounds":8,"hasMuscleCurves":9,"clipMuscleConstant":10,"clipBindingConstant":11},"Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationCurve":{"path":0,"hash":1,"componentType":2,"property":3,"keys":4,"objectReferenceKeys":5},"Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationCurve+ObjectReferenceKey":{"time":0,"value":1},"Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationEvent":{"functionName":0,"floatParameter":1,"intParameter":2,"stringParameter":3,"objectReferenceParameter":4,"time":6},"Luna.Unity.DTO.UnityEngine.Animation.Data.Bounds":{"center":0,"extends":3},"Luna.Unity.DTO.UnityEngine.Animation.Data.AnimationClip+AnimationClipBindingConstant":{"genericBindings":0,"pptrCurveMapping":1},"Luna.Unity.DTO.UnityEngine.Assets.Font":{"name":0,"ascent":1,"originalLineHeight":2,"fontSize":3,"characterInfo":4,"texture":5,"originalFontSize":7},"Luna.Unity.DTO.UnityEngine.Assets.Font+CharacterInfo":{"index":0,"advance":1,"bearing":2,"glyphWidth":3,"glyphHeight":4,"minX":5,"maxX":6,"minY":7,"maxY":8,"uvBottomLeftX":9,"uvBottomLeftY":10,"uvBottomRightX":11,"uvBottomRightY":12,"uvTopLeftX":13,"uvTopLeftY":14,"uvTopRightX":15,"uvTopRightY":16},"Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorController":{"name":0,"layers":1,"parameters":2,"animationClips":3,"avatarUnsupported":4},"Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorControllerLayer":{"name":0,"defaultWeight":1,"blendingMode":2,"avatarMask":3,"syncedLayerIndex":4,"syncedLayerAffectsTiming":5,"syncedLayers":6,"stateMachine":7},"Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateMachine":{"id":0,"name":1,"path":2,"states":3,"machines":4,"entryStateTransitions":5,"exitStateTransitions":6,"anyStateTransitions":7,"defaultStateId":8},"Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorState":{"id":0,"name":1,"cycleOffset":2,"cycleOffsetParameter":3,"cycleOffsetParameterActive":4,"mirror":5,"mirrorParameter":6,"mirrorParameterActive":7,"motionId":8,"nameHash":9,"fullPathHash":10,"speed":11,"speedParameter":12,"speedParameterActive":13,"tag":14,"tagHash":15,"writeDefaultValues":16,"behaviours":17,"transitions":18},"Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorStateTransition":{"fullPath":0,"canTransitionToSelf":1,"duration":2,"exitTime":3,"hasExitTime":4,"hasFixedDuration":5,"interruptionSource":6,"offset":7,"orderedInterruption":8,"destinationStateId":9,"isExit":10,"mute":11,"solo":12,"conditions":13},"Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorTransition":{"destinationStateId":0,"isExit":1,"mute":2,"solo":3,"conditions":4},"Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorControllerParameter":{"defaultBool":0,"defaultFloat":1,"defaultInt":2,"name":3,"nameHash":4,"type":5},"Luna.Unity.DTO.UnityEngine.Assets.TextAsset":{"name":0,"bytes64":1,"data":2},"Luna.Unity.DTO.UnityEngine.Assets.Resources":{"files":0,"componentToPrefabIds":1},"Luna.Unity.DTO.UnityEngine.Assets.Resources+File":{"path":0,"unityObject":1},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings":{"scriptsExecutionOrder":0,"sortingLayers":1,"cullingLayers":2,"timeSettings":3,"physicsSettings":4,"physics2DSettings":5,"qualitySettings":6,"enableRealtimeShadows":7,"enableAutoInstancing":8,"enableStaticBatching":9,"enableDynamicBatching":10,"lightmapEncodingQuality":11,"desiredColorSpace":12,"allTags":13},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+ScriptsExecutionOrder":{"name":0,"value":1},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+SortingLayer":{"id":0,"name":1,"value":2},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+CullingLayer":{"id":0,"name":1},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+TimeSettings":{"fixedDeltaTime":0,"maximumDeltaTime":1,"timeScale":2,"maximumParticleTimestep":3},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+PhysicsSettings":{"gravity":0,"defaultSolverIterations":3,"bounceThreshold":4,"autoSyncTransforms":5,"autoSimulation":6,"collisionMatrix":7},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+PhysicsSettings+CollisionMask":{"enabled":0,"layerId":1,"otherLayerId":2},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+Physics2DSettings":{"material":0,"gravity":2,"positionIterations":4,"velocityIterations":5,"velocityThreshold":6,"maxLinearCorrection":7,"maxAngularCorrection":8,"maxTranslationSpeed":9,"maxRotationSpeed":10,"baumgarteScale":11,"baumgarteTOIScale":12,"timeToSleep":13,"linearSleepTolerance":14,"angularSleepTolerance":15,"defaultContactOffset":16,"autoSimulation":17,"queriesHitTriggers":18,"queriesStartInColliders":19,"callbacksOnDisable":20,"reuseCollisionCallbacks":21,"autoSyncTransforms":22,"collisionMatrix":23},"Luna.Unity.DTO.UnityEngine.Assets.ProjectSettings+Physics2DSettings+CollisionMask":{"enabled":0,"layerId":1,"otherLayerId":2},"Luna.Unity.DTO.UnityEngine.Assets.QualitySettings":{"qualityLevels":0,"names":1,"shadows":2,"anisotropicFiltering":3,"antiAliasing":4,"lodBias":5,"shadowCascades":6,"shadowDistance":7,"shadowmaskMode":8,"shadowProjection":9,"shadowResolution":10,"softParticles":11,"softVegetation":12,"activeColorSpace":13,"desiredColorSpace":14,"masterTextureLimit":15,"maxQueuedFrames":16,"particleRaycastBudget":17,"pixelLightCount":18,"realtimeReflectionProbes":19,"shadowCascade2Split":20,"shadowCascade4Split":21,"streamingMipmapsActive":24,"vSyncCount":25,"asyncUploadBufferSize":26,"asyncUploadTimeSlice":27,"billboardsFaceCameraPosition":28,"shadowNearPlaneOffset":29,"streamingMipmapsMemoryBudget":30,"maximumLODLevel":31,"streamingMipmapsAddAllCameras":32,"streamingMipmapsMaxLevelReduction":33,"streamingMipmapsRenderersPerFrame":34,"resolutionScalingFixedDPIFactor":35,"streamingMipmapsMaxFileIORequests":36,"currentQualityLevel":37},"Luna.Unity.DTO.UnityEngine.Assets.Mesh+BlendShapeFrame":{"weight":0,"vertices":1,"normals":2,"tangents":3},"Luna.Unity.DTO.UnityEngine.Animation.Mecanim.AnimatorCondition":{"mode":0,"parameter":1,"threshold":2}}

Deserializers.requiredComponents = {"94":[95],"96":[95],"97":[95],"98":[95],"99":[95],"100":[95],"101":[102],"103":[69],"104":[37],"105":[37],"106":[37],"107":[37],"108":[37],"109":[37],"110":[37],"111":[112],"113":[112],"114":[112],"115":[112],"116":[112],"117":[112],"118":[112],"119":[112],"120":[112],"121":[112],"122":[112],"123":[112],"124":[112],"125":[69],"126":[13],"127":[128],"129":[128],"20":[19],"130":[37],"65":[19,49],"131":[69],"132":[69],"80":[79],"133":[19],"134":[13,19],"24":[19,27],"135":[19],"136":[27,19],"137":[13],"138":[27,19],"139":[19],"140":[19],"141":[19],"142":[19],"53":[20],"49":[27,19],"143":[19],"22":[20],"63":[19],"144":[19],"26":[19],"145":[19],"146":[19],"147":[19],"59":[19],"62":[19],"148":[19],"149":[27,19],"150":[19],"151":[19],"152":[19],"153":[19],"48":[27,19],"154":[19],"155":[81],"156":[81],"82":[81],"157":[81],"158":[69],"159":[69],"160":[69],"161":[69]}

Deserializers.types = ["UnityEngine.Transform","UnityEngine.MonoBehaviour","HoleController","UnityEngine.SpriteRenderer","UnityEngine.GameObject","UnityEngine.SphereCollider","UnityEngine.AudioSource","UnityEngine.ParticleSystem","AimArrow","FloatingFeedback","IntroHoleAnimation","UnityEngine.MeshFilter","UnityEngine.Mesh","UnityEngine.MeshRenderer","UnityEngine.Material","UnityEngine.BoxCollider","UnityEngine.Sprite","HoleSkin","FloatingText","UnityEngine.RectTransform","UnityEngine.Canvas","UnityEngine.EventSystems.UIBehaviour","UnityEngine.UI.CanvasScaler","UnityEngine.CanvasGroup","TMPro.TextMeshProUGUI","MyBox.Billboard","UnityEngine.UI.HorizontalLayoutGroup","UnityEngine.CanvasRenderer","TMPro.TMP_FontAsset","UnityEngine.ParticleSystemRenderer","ArrowDirection","UnityEngine.AudioClip","UnityEngine.Shader","UnityEngine.Texture2D","ResourceLoader","Level","WoodTower","UnityEngine.Rigidbody","SupportActivator","ResourceSetter","UnityEngine.MeshCollider","UnityEngine.CapsuleCollider","HG.Playables.Tools.TowerGenerator","ThemeDisplayGroup","ResourcePlaceholder","TowerRuntimeIndex","SwallowElements","UIManager","UnityEngine.UI.Text","UnityEngine.UI.Image","UnityEngine.Animator","ObjectivesUISystem","UnityEditor.Animations.AnimatorController","UnityEngine.UI.GraphicRaycaster","FloatingJoystick","UnityEngine.Font","FontSetterLuna","MovingMovement","TutoCursor","UnityEngine.UI.VerticalLayoutGroup","TextureSetterLuna","LandscapePaddingAnchor","UnityEngine.UI.Mask","UnityEngine.UI.ContentSizeFitter","ItemObjective","ObjectivePickupIcon","ObjectivesTuto","UnityEngine.UI.Button","LandscapePadding","UnityEngine.Camera","PlayableSettings","Sunlight","UnityEngine.AudioListener","Cinemachine.CinemachineBrain","CopyMainCameraFOV","Cinemachine.CinemachineVirtualCamera","CinemachineCameraOffset","Cinemachine.CinemachinePipeline","Cinemachine.CinemachineFramingTransposer","UnityEngine.Light","UnityEngine.Rendering.Universal.UniversalAdditionalLightData","UnityEngine.EventSystems.EventSystem","UnityEngine.EventSystems.StandaloneInputModule","StoreRedirectInitializer","StoreRedirectTracker","AudioManager","IntroManager","GameManager","UnityEngine.Cubemap","UnityEditor.Rendering.Universal.AssetVersion","TMPro.TMP_Settings","TMPro.TMP_SpriteAsset","TMPro.TMP_StyleSheet","UnityEngine.TextAsset","UnityEngine.AudioLowPassFilter","UnityEngine.AudioBehaviour","UnityEngine.AudioHighPassFilter","UnityEngine.AudioReverbFilter","UnityEngine.AudioDistortionFilter","UnityEngine.AudioEchoFilter","UnityEngine.AudioChorusFilter","UnityEngine.Cloth","UnityEngine.SkinnedMeshRenderer","UnityEngine.FlareLayer","UnityEngine.ConstantForce","UnityEngine.Joint","UnityEngine.HingeJoint","UnityEngine.SpringJoint","UnityEngine.FixedJoint","UnityEngine.CharacterJoint","UnityEngine.ConfigurableJoint","UnityEngine.CompositeCollider2D","UnityEngine.Rigidbody2D","UnityEngine.Joint2D","UnityEngine.AnchoredJoint2D","UnityEngine.SpringJoint2D","UnityEngine.DistanceJoint2D","UnityEngine.FrictionJoint2D","UnityEngine.HingeJoint2D","UnityEngine.RelativeJoint2D","UnityEngine.SliderJoint2D","UnityEngine.TargetJoint2D","UnityEngine.FixedJoint2D","UnityEngine.WheelJoint2D","UnityEngine.ConstantForce2D","UnityEngine.StreamingController","UnityEngine.TextMesh","UnityEngine.Tilemaps.TilemapRenderer","UnityEngine.Tilemaps.Tilemap","UnityEngine.Tilemaps.TilemapCollider2D","ThrowablePusher","UnityEngine.Experimental.Rendering.Universal.PixelPerfectCamera","UnityEngine.Rendering.Universal.UniversalAdditionalCameraData","TMPro.TextContainer","TMPro.TextMeshPro","TMPro.TMP_Dropdown","TMPro.TMP_SelectionCaret","TMPro.TMP_SubMesh","TMPro.TMP_SubMeshUI","TMPro.TMP_Text","UnityEngine.Rendering.UI.UIFoldout","UnityEngine.UI.Dropdown","UnityEngine.UI.Graphic","UnityEngine.UI.AspectRatioFitter","UnityEngine.UI.GridLayoutGroup","UnityEngine.UI.HorizontalOrVerticalLayoutGroup","UnityEngine.UI.LayoutElement","UnityEngine.UI.LayoutGroup","UnityEngine.UI.MaskableGraphic","UnityEngine.UI.RawImage","UnityEngine.UI.RectMask2D","UnityEngine.UI.Scrollbar","UnityEngine.UI.ScrollRect","UnityEngine.UI.Slider","UnityEngine.UI.Toggle","UnityEngine.EventSystems.BaseInputModule","UnityEngine.EventSystems.PointerInputModule","UnityEngine.EventSystems.TouchInputModule","UnityEngine.EventSystems.Physics2DRaycaster","UnityEngine.EventSystems.PhysicsRaycaster","Cinemachine.CinemachineExternalCamera","ToonyColorsPro.Runtime.TCP2_CameraDepth"]

Deserializers.unityVersion = "2021.3.45f2";

Deserializers.productName = "ALL";

Deserializers.lunaInitializationTime = "";

Deserializers.lunaDaysRunning = "21.2";

Deserializers.lunaVersion = "6.4.0";

Deserializers.lunaSHA = "6639120529aa36186c6141b5c3fb20246c28bff0";

Deserializers.creativeName = "HugoTest3";

Deserializers.lunaAppID = "25131";

Deserializers.projectId = "ed058134-8853-3141-ab46-238cdcfbccc0";

Deserializers.packagesInfo = "com.unity.cinemachine: 2.4.0\ncom.unity.render-pipelines.universal: 12.1.15\ncom.unity.textmeshpro: 3.0.6\ncom.unity.ugui: 1.0.0";

Deserializers.externalJsLibraries = "";

Deserializers.androidLink = ( typeof window !== "undefined")&&window.$environment.packageConfig.androidLink?window.$environment.packageConfig.androidLink:'Empty';

Deserializers.iosLink = ( typeof window !== "undefined")&&window.$environment.packageConfig.iosLink?window.$environment.packageConfig.iosLink:'Empty';

Deserializers.base64Enabled = "True";

Deserializers.minifyEnabled = "True";

Deserializers.isForceUncompressed = "False";

Deserializers.isAntiAliasingEnabled = "True";

Deserializers.isRuntimeAnalysisEnabledForCode = "True";

Deserializers.runtimeAnalysisExcludedClassesCount = "1658";

Deserializers.runtimeAnalysisExcludedMethodsCount = "4292";

Deserializers.runtimeAnalysisExcludedModules = "physics2d, reflection";

Deserializers.isRuntimeAnalysisEnabledForShaders = "True";

Deserializers.isRealtimeShadowsEnabled = "True";

Deserializers.isReferenceAmbientProbeBaked = "False";

Deserializers.isLunaCompilerV2Used = "True";

Deserializers.companyName = "Homa";

Deserializers.buildPlatform = "StandaloneWindows64";

Deserializers.applicationIdentifier = "com.Homa.ALL";

Deserializers.disableAntiAliasing = false;

Deserializers.graphicsConstraint = 28;

Deserializers.linearColorSpace = false;

Deserializers.buildID = "3d4403f6-3182-4e0e-ae50-cba84280e85b";

Deserializers.runtimeInitializeOnLoadInfos = [[["Cinemachine","CinemachineStoryboard","InitializeModule"],["Cinemachine","CinemachineCore","InitializeModule"],["Cinemachine","UpdateTracker","InitializeModule"],["Cinemachine","PostFX","CinemachineVolumeSettings","InitializeModule"],["UnityEngine","Rendering","DebugUpdater","RuntimeInit"],["Unity","Collections","NativeLeakDetection","Initialize"],["UnityEngine","Experimental","Rendering","ScriptableRuntimeReflectionSystemSettings","ScriptingDirtyReflectionSystemInstance"]],[],[],[],[]];

Deserializers.typeNameToIdMap = function(){ var i = 0; return Deserializers.types.reduce( function( res, item ) { res[ item ] = i++; return res; }, {} ) }()

