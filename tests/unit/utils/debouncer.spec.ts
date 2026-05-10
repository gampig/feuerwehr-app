import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Debouncer } from "@/utils/debouncer";

describe("src/utils/debouncer", () => {
  let debouncer: Debouncer;
  let mockCallback: () => void;

  beforeEach(() => {
    vi.useFakeTimers();
    debouncer = new Debouncer(100);
    mockCallback = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls the callback after the specified wait time", () => {
    debouncer.debounce(mockCallback);

    expect(mockCallback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("resets the timer when debounce is called again before timeout", () => {
    debouncer.debounce(mockCallback);
    vi.advanceTimersByTime(50);

    debouncer.debounce(mockCallback);
    vi.advanceTimersByTime(50);

    expect(mockCallback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("clears the timeout when clear is called", () => {
    debouncer.debounce(mockCallback);
    vi.advanceTimersByTime(50);

    debouncer.clear();
    vi.advanceTimersByTime(50);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it("handles multiple debounces correctly", () => {
    debouncer.debounce(mockCallback);
    vi.advanceTimersByTime(50);

    debouncer.debounce(mockCallback);
    vi.advanceTimersByTime(50);

    debouncer.debounce(mockCallback);
    vi.advanceTimersByTime(100);

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
