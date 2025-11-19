using TMPro;
using UnityEngine;

public class FloatingText : MonoBehaviour
{
	[SerializeField]
	private TextMeshProUGUI text;

	[SerializeField]
	private CanvasGroup cg;

	[SerializeField]
	private float duration = 0.8f;

	[SerializeField]
	private float moveSpeed = 1.6f;

	[SerializeField]
	private AnimationCurve fadeCurve = AnimationCurve.EaseInOut(0f, 1f, 1f, 0f);

	[SerializeField]
	private AnimationCurve moveCurve = AnimationCurve.EaseInOut(0f, 1f, 1f, 0.2f);

	private float timer;

	private bool active;

	private void Awake()
	{
		moveSpeed = Random.Range(1.6f, 2.6f);
		if (!cg)
		{
			cg = GetComponent<CanvasGroup>();
		}
		if (!text)
		{
			text = GetComponentInChildren<TextMeshProUGUI>();
		}
	}

	public void Show(Vector3 worldPos)
	{
		base.transform.position = worldPos;
		text.text = "1";
		cg.alpha = 1f;
		timer = 0f;
		active = true;
		base.gameObject.SetActive(true);
	}

	private void Update()
	{
		if (active)
		{
			timer += Time.deltaTime;
			float t = Mathf.Clamp01(timer / duration);
			float speedFactor = moveCurve.Evaluate(t);
			base.transform.position += Vector3.up * moveSpeed * speedFactor * Time.deltaTime;
			cg.alpha = fadeCurve.Evaluate(t);
			if (timer >= duration)
			{
				active = false;
				base.gameObject.SetActive(false);
			}
		}
	}
}
