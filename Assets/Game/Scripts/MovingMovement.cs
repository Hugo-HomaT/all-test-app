using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MovingMovement : MonoBehaviour
{
    public Image movingImage;

    void Start()
    {
        movingImage.enabled = PlayableSettings.instance.enableMovingVisual;

    }
}
