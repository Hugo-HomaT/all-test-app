using System.Collections.Generic;
using UnityEngine;

public static class TowerRegistry
{
	private static readonly Dictionary<Transform, List<SupportActivator>> _map = new Dictionary<Transform, List<SupportActivator>>();

	private static readonly List<SupportActivator> _empty = new List<SupportActivator>(0);

	public static void Register(Transform tower, SupportActivator activator)
	{
		if (!(tower == null) && !(activator == null))
		{
			if (!_map.TryGetValue(tower, out var list))
			{
				list = new List<SupportActivator>(64);
				_map[tower] = list;
			}
			if (!list.Contains(activator))
			{
				list.Add(activator);
			}
		}
	}

	public static void Unregister(Transform tower, SupportActivator activator)
	{
		if (!(tower == null) && !(activator == null) && _map.TryGetValue(tower, out var list))
		{
			list.Remove(activator);
			if (list.Count == 0)
			{
				_map.Remove(tower);
			}
		}
	}

	public static List<SupportActivator> GetAll(Transform tower)
	{
		if (tower == null)
		{
			return _empty;
		}
		List<SupportActivator> list;
		return _map.TryGetValue(tower, out list) ? list : _empty;
	}
}
