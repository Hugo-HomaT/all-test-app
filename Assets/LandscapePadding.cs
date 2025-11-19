using UnityEngine;

public class LandscapePadding : MonoBehaviour
{
    public RectTransform target;
    public bool moveLeft = true;   // left = 0 + percent, right = 1 - percent
    public float percent = 0.04f;

    private bool lastLandscape;
    private int lastW, lastH;

    void Start()
    {
        lastW = Screen.width;
        lastH = Screen.height;
        Apply();
    }

    void Update()
    {
        // Detect real screen change
        if (Screen.width != lastW || Screen.height != lastH)
        {
            lastW = Screen.width;
            lastH = Screen.height;
            Apply();
        }
    }

    private void Apply()
    {
        bool landscape = Screen.width > Screen.height;
        lastLandscape = landscape;

        if (!landscape)
        {
            // Portrait: stretch full
            target.anchorMin = new Vector2(0, target.anchorMin.y);
            target.anchorMax = new Vector2(1, target.anchorMax.y);
            return;
        }

        // Landscape positions
        float x = moveLeft ? percent : 1f - percent;
        target.anchorMin = new Vector2(x, target.anchorMin.y);
        target.anchorMax = new Vector2(x, target.anchorMax.y);
    }
}