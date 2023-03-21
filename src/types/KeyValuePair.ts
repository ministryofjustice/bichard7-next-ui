export type KeyValuePair<TKey extends string | number, TValue> = {
  [name in TKey]: TValue
}
