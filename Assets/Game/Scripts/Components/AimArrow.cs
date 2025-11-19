using UnityEngine;

public class AimArrow : MonoBehaviour
{
    public SpriteRenderer[] arrowSprites;
    public float minAngle = -30f;
    public float maxAngle = 30f;
    public float speed = 120f; // degrees per second
    public bool visible;

    private float _angle;
    private int _dir = 1;

    private void OnEnable()
    {
        _angle = 0f;
        _dir = 1;
        SetVisible(false);
    }

    private void Update()
    {
        if (!visible) return;
        _angle += _dir * speed * Time.deltaTime;
        if (_angle >= maxAngle)
        {
            _angle = maxAngle;
            _dir = -1;
        }
        else if (_angle <= minAngle)
        {
            _angle = minAngle;
            _dir = 1;
        }
        transform.localRotation = Quaternion.Euler(0, _angle, 0f);
    }

    public Vector3 GetForward(Transform reference)
    {
        return Quaternion.Euler(0f, _angle, 0f) * reference.forward;
    }

    public void SetVisible(bool isVisible)
    {
        visible = isVisible;

        foreach (var rr in arrowSprites) rr.enabled = isVisible;
    }
    
    public void SetArrowColor(Color color)
    {
        if (arrowSprites != null)
        {
            foreach (var spriteRenderer in arrowSprites)
            {
                if (spriteRenderer != null)
                {
                    spriteRenderer.color = color;
                }
            }
        }
    }
}


