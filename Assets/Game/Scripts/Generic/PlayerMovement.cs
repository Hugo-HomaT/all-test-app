using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerMovement
{
    private Vector3 movementDirection;
    private Vector3 initialMousePosition;
    private Vector3 currentMousePosition;
    private bool isTouching = false;
    
    private const float dragDeadzoneRatio = 0.01f;      // % of min screen side before movement
    private const float maxDragDistanceRatio = 0.11f;    // % of min screen side for full speed
    private const float accelerationSmoothTime = 0.06f;  // seconds to reach desired speed

    private Vector3 _currentVelocity;
    private Vector3 _velocitySmoothRef;

    // Call this from Update() to read inputs
    public void UpdateInputs(Transform target)
    {
        if (Input.GetMouseButtonDown(0))
        {
            initialMousePosition = Input.mousePosition;
            currentMousePosition = Input.mousePosition;
            isTouching = true;
            
            // Notify UIManager about player touch
            if (UIManager.instance != null)
            {
                UIManager.instance.OnPlayerTouch();
            }
            
            // Check if fake control is enabled and start fake movement
            if (PlayableSettings.instance.enableFakeControl)
            {
                var holeController = target.GetComponent<HoleController>();
                if (holeController != null && !holeController.IsFakeMoving)
                {
                    holeController.StartFakeMovement();
                    isTouching = false;
                    return; // Don't process normal movement
                }
            }
        }

        if (Input.GetMouseButtonUp(0))
        {
            movementDirection = Vector3.zero;
            isTouching = false;
            
            // Notify UIManager about player touch release
            if (UIManager.instance != null)
            {
                UIManager.instance.OnPlayerTouchRelease();
            }
        }
        
        if (Input.GetMouseButton(0) && isTouching)
        {
            // Update mouse position for movement calculation
            currentMousePosition = Input.mousePosition;
        }
    }

    // Call this from FixedUpdate() to apply movement
    public Vector3 GetMovementDelta(float moveSpeed)
    {
        Vector3 desiredVelocity = Vector3.zero;

        if (isTouching)
        {
            Vector3 mouseDelta = currentMousePosition - initialMousePosition;
            Vector3 planarDelta = new Vector3(mouseDelta.x, 0f, mouseDelta.y);
            float dragDistance = planarDelta.magnitude;

            float reference = Mathf.Max(1f, Mathf.Min(Screen.width, Screen.height));
            float dragDeadzone = Mathf.Max(2f, reference * dragDeadzoneRatio);
            float maxDragDistance = Mathf.Max(dragDeadzone + 5f, reference * maxDragDistanceRatio);

            if (dragDistance > dragDeadzone)
            {
                // Calculate movement direction from delta (where you're pointing)
                movementDirection = planarDelta.normalized;

                // Convert drag distance into eased speed factor [0,1]
                float normalizedDrag = Mathf.InverseLerp(dragDeadzone, maxDragDistance, dragDistance);
                float easedSpeed = Mathf.SmoothStep(0f, 1f, normalizedDrag);

                desiredVelocity = movementDirection * moveSpeed * easedSpeed;
            }
        }

        _currentVelocity = Vector3.SmoothDamp(_currentVelocity, desiredVelocity, ref _velocitySmoothRef, accelerationSmoothTime);

        if (_currentVelocity.sqrMagnitude > 0.0001f)
        {
            return _currentVelocity * Time.fixedDeltaTime;
        }

        return Vector3.zero;
    }

    // Backward compatibility helper
    public void ApplyMovement(Transform transform, float moveSpeed)
    {
        Vector3 delta = GetMovementDelta(moveSpeed);
        if (delta.sqrMagnitude > 0.000001f)
        {
            transform.Translate(delta, Space.World);
        }
    }
}
