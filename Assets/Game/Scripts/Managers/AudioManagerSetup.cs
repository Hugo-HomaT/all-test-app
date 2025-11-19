using UnityEngine;

[System.Serializable]
public class AudioManagerSetup : MonoBehaviour
{
    [Header("Audio Manager Setup")]
    [SerializeField] private bool createAudioManagerOnStart = true;
    
    private void Start()
    {
        if (createAudioManagerOnStart && AudioManager.instance == null)
        {
            CreateAudioManager();
        }
    }
    
    private void CreateAudioManager()
    {
        GameObject audioManagerObject = new GameObject("AudioManager");
        audioManagerObject.AddComponent<AudioManager>();
        
        // Set as child of this object or make it persistent
        audioManagerObject.transform.SetParent(transform);
    }
    
    [ContextMenu("Create Audio Manager")]
    public void CreateAudioManagerManually()
    {
        if (AudioManager.instance == null)
        {
            CreateAudioManager();
        }
    }
}
