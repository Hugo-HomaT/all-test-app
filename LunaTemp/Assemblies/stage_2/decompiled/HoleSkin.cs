using UnityEngine;

public class HoleSkin : MonoBehaviour
{
	public SpriteRenderer glowSprite;

	public Transform glowTransform;

	public Transform GetSkinHoleTransform => base.transform;
}
