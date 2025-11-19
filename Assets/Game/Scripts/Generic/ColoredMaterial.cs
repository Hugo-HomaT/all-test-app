using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[System.Serializable]
public class ColoredMaterial
{
    public MaterialHolder MaterialHolder;
    public Material Material;
    public Texture[] Textures;
    public string ColorField;
    public string TextureField;
    public Color DefaultColor;
}

public enum MaterialHolder
{
    Hole,
    Ground
}
