interface TypeWithId {
  id: string;
}

export function extractId<T extends TypeWithId>(
  input: T
): { id: string; value: Omit<T, "id"> } {
  const value: Omit<T, "id"> & Partial<TypeWithId> = { ...input };
  delete value.id;
  return { id: input.id, value: value };
}

export function deleteUndefinedProperties<T>(input: T): T {
  const value = { ...input };
  for (const key in value) {
    if (value[key] === undefined) {
      delete value[key];
    }
  }
  return value;
}
