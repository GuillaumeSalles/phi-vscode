export function set<TKey, TValue>(
  map: Map<TKey, TValue>,
  key: TKey,
  value: TValue
) {
  const newMap = new Map(map);
  newMap.set(key, value);
  return newMap;
}

export function del<TKey, TValue>(map: Map<TKey, TValue>, key: TKey) {
  const newMap = new Map(map);
  newMap.delete(key);
  return newMap;
}

export function firstEntry<TKey, TValue>(
  map: Map<TKey, TValue>
): [TKey, TValue] {
  return map.entries().next().value;
}

export function firstKey<TKey, TValue>(map: Map<TKey, TValue>): TKey {
  return map.keys().next().value;
}
