export function deleteUndefinedProperties<T>(input: T): T {
  const value = { ...input };
  for (const key in value) {
    if (value[key] === undefined) {
      delete value[key];
    }
  }
  return value;
}
