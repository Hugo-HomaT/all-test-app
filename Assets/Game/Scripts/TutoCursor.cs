using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class TutoCursor : MonoBehaviour
{
    public Image cursorImage;

    void Start()
    {
        cursorImage.enabled = PlayableSettings.instance.enableMovingHand;
        cursorImage.sprite = PlayableSettings.instance.cursors[(int)PlayableSettings.instance.handCursor];
        cursorImage.transform.localScale = Vector3.one * PlayableSettings.instance.cursorScale;
    }
}
