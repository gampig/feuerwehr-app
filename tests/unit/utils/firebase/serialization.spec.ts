import { describe, expect, it } from "vitest";
import { deleteUndefinedProperties } from "@/utils/firebase/serialization";

describe("src/utils/firebase/serialization", () => {
  it("removes undefined properties from object", () => {
    const input = {
      name: "test",
      age: undefined,
      active: true,
      description: undefined,
    };

    const result = deleteUndefinedProperties(input);

    expect(result).toEqual({
      name: "test",
      active: true,
    });
  });

  it("returns empty object when all properties are undefined", () => {
    const input = {
      a: undefined,
      b: undefined,
    };

    const result = deleteUndefinedProperties(input);

    expect(result).toEqual({});
  });

  it("returns same object when no undefined properties", () => {
    const input = {
      name: "test",
      age: 25,
      active: true,
    };

    const result = deleteUndefinedProperties(input);

    expect(result).toEqual(input);
  });

  it("handles nested objects (shallow copy)", () => {
    const input = {
      user: { name: "test" },
      deleted: undefined,
    };

    const result = deleteUndefinedProperties(input);

    expect(result).toEqual({
      user: { name: "test" },
    });
  });

  it("does not modify the original object", () => {
    const input = {
      name: "test",
      age: undefined,
    };

    const result = deleteUndefinedProperties(input);

    expect(input).toEqual({
      name: "test",
      age: undefined,
    });
    expect(result).toEqual({
      name: "test",
    });
  });
});
