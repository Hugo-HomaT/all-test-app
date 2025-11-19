using UnityEngine;

public class LandscapePaddingAnchor : MonoBehaviour
{
    public RectTransform target;
    public bool moveLeft = true; // left = +percent, right = -percent
    public float percent = 0.04f;

    private bool lastLandscape;
    private float originalMinX;
    private float originalMaxX;
    private bool originalStored;

    private int lastW, lastH;

    void Start()
    {
        StoreOriginalAnchors();
        lastW = Screen.width;
        lastH = Screen.height;
        Apply(true); // force first apply
    }

    void Update()
    {
        // Detect real screen change
        if (Screen.width != lastW || Screen.height != lastH)
        {
            lastW = Screen.width;
            lastH = Screen.height;
            Apply(false);
        }
    }

    private void StoreOriginalAnchors()
    {
        if (originalStored) return;
        originalStored = true;

        originalMinX = target.anchorMin.x;
        originalMaxX = target.anchorMax.x;
    }

    private void Apply(bool force)
    {
        bool landscape = Screen.width > Screen.height;
        if (!force && landscape == lastLandscape) return;

        lastLandscape = landscape;

        if (!landscape)
        {
            // Reset portrait
            target.anchorMin = new Vector2(originalMinX, target.anchorMin.y);
            target.anchorMax = new Vector2(originalMaxX, target.anchorMax.y);
            return;
        }

        float delta = moveLeft ? percent : -percent;

        target.anchorMin = new Vector2(originalMinX + delta, target.anchorMin.y);
        target.anchorMax = new Vector2(originalMaxX + delta, target.anchorMax.y);
    }
}