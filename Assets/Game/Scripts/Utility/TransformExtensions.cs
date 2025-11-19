using System.Collections;
using UnityEngine;

public static class TransformExtensions
{
    public static Coroutine SmoothLerpLocal(this Transform transform, MonoBehaviour runner, Vector3 targetLocalPos, Quaternion targetLocalRot, float duration)
    {
        if (runner == null) return null;
        return runner.StartCoroutine(SmoothLerpLocalCoroutine(transform, targetLocalPos, targetLocalRot, duration));
    }

    private static IEnumerator SmoothLerpLocalCoroutine(Transform t, Vector3 targetPos, Quaternion targetRot, float duration)
    {
        if (t == null) yield break;
        if (duration <= 0f)
        {
            t.localPosition = targetPos;
            t.localRotation = targetRot;
            yield break;
        }

        Vector3 startPos = t.localPosition;
        Quaternion startRot = t.localRotation;
        float time = 0f;
        while (time < duration)
        {
            float t01 = time / duration;
            t.localPosition = Vector3.Lerp(startPos, targetPos, t01);
            t.localRotation = Quaternion.Slerp(startRot, targetRot, t01);
            time += Time.deltaTime;
            yield return null;
        }
        t.localPosition = targetPos;
        t.localRotation = targetRot;
    }
}


