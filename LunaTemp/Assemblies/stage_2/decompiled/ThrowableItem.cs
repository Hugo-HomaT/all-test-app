using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[DisallowMultipleComponent]
public class ThrowableItem : MonoBehaviour
{
	public float snapOffsetY = 0.2f;

	public float throwForce = 14f;

	public float throwUpward = 2.5f;

	public float spinTorque = 8f;

	public float detachDelay = 0.05f;

	public bool pickedUp;

	public bool smoothSnap = true;

	public float snapDuration = 0.12f;

	public float throwProtectDuration = 0.6f;

	public bool hasHitTower = false;

	private float _throwTime = 0f;

	private Rigidbody _rb;

	private Transform _originalParent;

	private Collider[] _colliders;

	private readonly List<GameObject> _savedLayerObjects = new List<GameObject>(8);

	private readonly List<int> _savedLayers = new List<int>(8);

	private Vector3 _originalPosition;

	private float _floatingOffset;

	private Vector3 _savedPosition;

	private Quaternion _savedRotation;

	private bool _visualEffectsActive = true;

	private Vector3 _floatingBasePosition;

	[Header("Visual Effects")]
	public Transform visualChild;

	private void Awake()
	{
		_rb = GetComponent<Rigidbody>();
		if (_rb == null)
		{
			_rb = GetComponentInChildren<Rigidbody>();
		}
		_colliders = GetComponentsInChildren<Collider>(true);
		if (GetComponent<ThrowablePusher>() == null)
		{
			base.gameObject.AddComponent<ThrowablePusher>();
		}
	}

	private void Start()
	{
		_originalPosition = base.transform.position;
		_floatingOffset = UnityEngine.Random.Range(0f, 3.14159265f * 2f);
		CalculateFloatingBasePosition();
		if (visualChild == null)
		{
			Debug.LogWarning("Visual child not assigned on " + base.gameObject.name + ". Please assign a child object for visual effects.");
		}
		else
		{
			HideMainRenderer();
		}
	}

	private void CalculateFloatingBasePosition()
	{
		Bounds bounds = GetComponent<Renderer>()?.bounds ?? GetComponentInChildren<Renderer>()?.bounds ?? default(Bounds);
		if (bounds.size != Vector3.zero)
		{
			_floatingBasePosition = new Vector3(_originalPosition.x, bounds.min.y, _originalPosition.z);
		}
		else
		{
			_floatingBasePosition = _originalPosition;
		}
	}

	private void Update()
	{
		if (!pickedUp && _visualEffectsActive && PlayableSettings.instance != null)
		{
			UpdateVisualEffects();
		}
	}

	private void UpdateVisualEffects()
	{
		PlayableSettings settings = PlayableSettings.instance;
		if (settings.enableFloatingAnimation)
		{
			float parentScale = base.transform.lossyScale.y;
			float adjustedHeight = settings.floatingHeight / parentScale;
			float sinValue = Mathf.Sin((Time.time + _floatingOffset) * settings.floatingSpeed);
			float floatingY = (sinValue + 1f) * 0.5f * adjustedHeight;
			if (visualChild != null)
			{
				visualChild.localPosition = Vector3.up * floatingY;
			}
			else
			{
				base.transform.position = _floatingBasePosition + Vector3.up * floatingY;
			}
		}
		if (settings.enableSelfRotation)
		{
			if (visualChild != null)
			{
				visualChild.Rotate(Vector3.up, settings.rotationSpeed * Time.deltaTime);
			}
			else
			{
				base.transform.Rotate(Vector3.up, settings.rotationSpeed * Time.deltaTime);
			}
		}
	}

	private void StopVisualEffects()
	{
		_savedPosition = base.transform.position;
		_savedRotation = base.transform.rotation;
		_visualEffectsActive = false;
		if (visualChild != null)
		{
			visualChild.gameObject.SetActive(false);
		}
		ShowMainRenderer();
		base.transform.position = _savedPosition;
		base.transform.rotation = _savedRotation;
	}

	public void AttachTo(Transform hole)
	{
		if (pickedUp)
		{
			return;
		}
		pickedUp = true;
		StopVisualEffects();
		_originalParent = base.transform.parent;
		if (_rb != null)
		{
			_rb.isKinematic = true;
			_rb.velocity = Vector3.zero;
			_rb.angularVelocity = Vector3.zero;
			_rb.useGravity = false;
			_rb.detectCollisions = false;
		}
		if (_colliders != null)
		{
			for (int i = 0; i < _colliders.Length; i++)
			{
				if (_colliders[i] != null)
				{
					_colliders[i].enabled = false;
				}
			}
		}
		base.transform.SetParent(hole);
		Vector3 targetPos = new Vector3(0f, snapOffsetY, 0f);
		Quaternion targetRot = Quaternion.identity;
		if (smoothSnap)
		{
			base.transform.SmoothLerpLocal(this, targetPos, targetRot, snapDuration);
			return;
		}
		base.transform.localPosition = targetPos;
		base.transform.localRotation = targetRot;
	}

	public void ThrowForward(Vector3 forward)
	{
		if (!pickedUp)
		{
			return;
		}
		pickedUp = false;
		base.transform.SetParent(_originalParent);
		if (_rb != null)
		{
			SaveAndSetLayerRecursively(base.transform, LayerMask.NameToLayer("Default"));
			if (_colliders != null)
			{
				for (int i = 0; i < _colliders.Length; i++)
				{
					if (_colliders[i] != null)
					{
						_colliders[i].enabled = true;
					}
				}
			}
			_rb.detectCollisions = true;
			_rb.useGravity = true;
			_rb.isKinematic = false;
			_rb.velocity = Vector3.zero;
			_rb.angularVelocity = Vector3.zero;
			Vector3 impulse = forward.normalized * throwForce + Vector3.up * throwUpward;
			_rb.AddForce(impulse, ForceMode.VelocityChange);
			_rb.AddTorque(UnityEngine.Random.onUnitSphere * spinTorque, ForceMode.VelocityChange);
			_throwTime = Time.time;
		}
		if (StoreRedirectTracker.instance != null)
		{
			StoreRedirectTracker.instance.OnThrow();
		}
		StartCoroutine(RestoreLayersAndCleanupAfterDelay(throwProtectDuration));
	}

	private void SaveAndSetLayerRecursively(Transform root, int newLayer)
	{
		_savedLayerObjects.Clear();
		_savedLayers.Clear();
		Transform[] componentsInChildren = root.GetComponentsInChildren<Transform>(true);
		foreach (Transform t in componentsInChildren)
		{
			GameObject go = t.gameObject;
			_savedLayerObjects.Add(go);
			_savedLayers.Add(go.layer);
			go.layer = newLayer;
		}
	}

	private void RestoreSavedLayers()
	{
		int count = Mathf.Min(_savedLayerObjects.Count, _savedLayers.Count);
		for (int i = 0; i < count; i++)
		{
			GameObject go = _savedLayerObjects[i];
			if (go != null)
			{
				go.layer = _savedLayers[i];
			}
		}
		_savedLayerObjects.Clear();
		_savedLayers.Clear();
	}

	private IEnumerator RestoreLayersAndCleanupAfterDelay(float delay)
	{
		if (delay > 0f)
		{
			yield return new WaitForSeconds(delay);
		}
		RestoreSavedLayers();
		UnityEngine.Object.Destroy(this);
	}

	private void OnCollisionEnter(Collision collision)
	{
		if (!hasHitTower && !(_rb == null) && !(collision.collider.GetComponent<SupportActivator>()?.tower == null) && IsPlayerThrown())
		{
			hasHitTower = true;
			GameManager.instance?.OnTowerHit();
		}
	}

	private void OnTriggerEnter(Collider other)
	{
		if (!hasHitTower && !(_rb == null) && !(other.GetComponent<SupportActivator>()?.tower == null) && IsPlayerThrown())
		{
			hasHitTower = true;
			GameManager.instance?.OnTowerHit();
		}
	}

	private bool IsPlayerThrown()
	{
		if (_rb == null)
		{
			return false;
		}
		float timeSinceThrow = Time.time - _throwTime;
		if (timeSinceThrow > throwProtectDuration)
		{
			return false;
		}
		return _rb.velocity.sqrMagnitude > 0.01f;
	}

	private void HideMainRenderer()
	{
		MeshRenderer originalMeshRenderer = GetComponent<MeshRenderer>();
		if (originalMeshRenderer != null)
		{
			originalMeshRenderer.enabled = false;
		}
	}

	private void ShowMainRenderer()
	{
		MeshRenderer originalMeshRenderer = GetComponent<MeshRenderer>();
		if (originalMeshRenderer != null)
		{
			originalMeshRenderer.enabled = true;
		}
	}
}
