using System.Collections.Generic;
using UnityEngine;

/// <summary>
/// Object pool for physics arrays to reduce memory allocations
/// </summary>
public static class PhysicsObjectPool
{
    private static readonly Dictionary<int, Queue<RaycastHit[]>> _raycastHitPools = new Dictionary<int, Queue<RaycastHit[]>>();
    private static readonly Dictionary<int, Queue<Collider[]>> _colliderPools = new Dictionary<int, Queue<Collider[]>>();
    
    private const int MAX_POOL_SIZE = 10; // Prevent unlimited growth
    
    public static RaycastHit[] GetRaycastHits(int size)
    {
        if (!_raycastHitPools.ContainsKey(size))
            _raycastHitPools[size] = new Queue<RaycastHit[]>();
            
        var pool = _raycastHitPools[size];
        if (pool.Count > 0)
        {
            return pool.Dequeue();
        }
        
        return new RaycastHit[size];
    }
    
    public static void ReturnRaycastHits(RaycastHit[] array)
    {
        if (array == null) return;
        
        int size = array.Length;
        if (!_raycastHitPools.ContainsKey(size))
            _raycastHitPools[size] = new Queue<RaycastHit[]>();
            
        var pool = _raycastHitPools[size];
        if (pool.Count < MAX_POOL_SIZE)
        {
            // Clear the array before returning
            for (int i = 0; i < array.Length; i++)
            {
                array[i] = default(RaycastHit);
            }
            pool.Enqueue(array);
        }
    }
    
    public static Collider[] GetColliders(int size)
    {
        if (!_colliderPools.ContainsKey(size))
            _colliderPools[size] = new Queue<Collider[]>();
            
        var pool = _colliderPools[size];
        if (pool.Count > 0)
        {
            return pool.Dequeue();
        }
        
        return new Collider[size];
    }
    
    public static void ReturnColliders(Collider[] array)
    {
        if (array == null) return;
        
        int size = array.Length;
        if (!_colliderPools.ContainsKey(size))
            _colliderPools[size] = new Queue<Collider[]>();
            
        var pool = _colliderPools[size];
        if (pool.Count < MAX_POOL_SIZE)
        {
            // Clear the array before returning
            for (int i = 0; i < array.Length; i++)
            {
                array[i] = null;
            }
            pool.Enqueue(array);
        }
    }
    
    public static void ClearPools()
    {
        _raycastHitPools.Clear();
        _colliderPools.Clear();
    }
}
