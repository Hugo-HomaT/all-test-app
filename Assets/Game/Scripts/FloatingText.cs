using UnityEngine;
using TMPro;

public class FloatingText : MonoBehaviour
{
    [SerializeField] TextMeshProUGUI text;
    [SerializeField] CanvasGroup cg;
    [SerializeField] float duration = 0.8f;
    [SerializeField] float moveSpeed = 1.6f;
    [SerializeField] AnimationCurve fadeCurve = AnimationCurve.EaseInOut(0f, 1f, 1f, 0f);
    [SerializeField] AnimationCurve moveCurve = AnimationCurve.EaseInOut(0f, 1f, 1f, 0.2f);

    float timer;
    bool active;

    void Awake()
    {
        moveSpeed = Random.Range(1.6f, 2.6f);
        if (!cg) cg = GetComponent<CanvasGroup>();
        if (!text) text = GetComponentInChildren<TextMeshProUGUI>();
    }

    public void Show(Vector3 worldPos)
    {
        transform.position = worldPos;
        text.text = "1";
        cg.alpha = 1f;
        timer = 0f;
        active = true;
        gameObject.SetActive(true);
    }

    void Update()
    {
        if (!active) return;

        timer += Time.deltaTime;
        float t = Mathf.Clamp01(timer / duration);

        float speedFactor = moveCurve.Evaluate(t);
        transform.position += Vector3.up * moveSpeed * speedFactor * Time.deltaTime;

        cg.alpha = fadeCurve.Evaluate(t);

        if (timer >= duration)
        {
            active = false;
            gameObject.SetActive(false);
        }
    }
}