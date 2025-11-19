using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TextureSetterLuna : MonoBehaviour
{
    public enum TextureLunaFieldType
    {
        TopBanner,
        MidBanner,
        BottomBanner,
        WinImage,
        FailImage
    }

    public bool preserveAspectImage = true;
    public Image imageRef;
    public TextureLunaFieldType textureField;
    private void Start()
    {
        // switch (textureField)
        // {
        //     case TextureLunaFieldType.TopBanner:
        //         imageRef.sprite = ConvertTextureToSprite(PlayableSettings.instance.topBannerLuna);
        //         break;
        //     case TextureLunaFieldType.MidBanner:
        //         imageRef.sprite = ConvertTextureToSprite(PlayableSettings.instance.midBannerLuna);
        //         break;
        //     case TextureLunaFieldType.BottomBanner:
        //         imageRef.sprite = ConvertTextureToSprite(PlayableSettings.instance.bottomBannerLuna);
        //         break;
        //     case TextureLunaFieldType.WinImage:
        //         imageRef.sprite = ConvertTextureToSprite(PlayableSettings.instance.winImageLuna);
        //         break;
        //     case TextureLunaFieldType.FailImage:
        //         imageRef.sprite = ConvertTextureToSprite(PlayableSettings.instance.failImageLuna);
        //         break;
        // }
        
        imageRef.preserveAspect = preserveAspectImage;
    }
    
    private Sprite ConvertTextureToSprite(Texture2D texture)
    {
        // Create a new Sprite using the Texture2D
        return Sprite.Create(texture, new Rect(0.0f, 0.0f, texture.width, texture.height), new Vector2(0.5f, 0.5f), 100.0f);
    }
}
