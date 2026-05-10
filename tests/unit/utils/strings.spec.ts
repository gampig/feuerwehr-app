import { describe, expect, it } from "vitest";
import { capitalizeFirstLetter } from "@/utils/strings";

describe("src/utils/strings", () => {
  it("capitalizes the first letter and lowercases the rest", () => {
    expect(capitalizeFirstLetter("hello")).toBe("Hello");
    expect(capitalizeFirstLetter("HELLO")).toBe("Hello");
    expect(capitalizeFirstLetter("hELLO")).toBe("Hello");
  });

  it("handles empty strings", () => {
    expect(capitalizeFirstLetter("")).toBe("");
  });

  it("handles single character strings", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
    expect(capitalizeFirstLetter("A")).toBe("A");
  });

  it("handles strings with special characters", () => {
    expect(capitalizeFirstLetter("überschrift")).toBe("Überschrift");
    expect(capitalizeFirstLetter("123test")).toBe("123test");
  });
});
