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
