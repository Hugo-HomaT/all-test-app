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
		imageRef.preserveAspect = preserveAspectImage;
	}

	private Sprite ConvertTextureToSprite(Texture2D texture)
	{
		return Sprite.Create(texture, new Rect(0f, 0f, texture.width, texture.height), new Vector2(0.5f, 0.5f), 100f);
	}
}
