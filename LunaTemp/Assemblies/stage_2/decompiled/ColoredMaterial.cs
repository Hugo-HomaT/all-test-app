using System;
using UnityEngine;

[Serializable]
public class ColoredMaterial
{
	public MaterialHolder MaterialHolder;

	public Material Material;

	public Texture[] Textures;

	public string ColorField;

	public string TextureField;

	public Color DefaultColor;
}
