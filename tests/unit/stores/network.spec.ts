import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { ref } from "vue";
import { useNetworkStore } from "@/stores/network";

// Mock the useNetwork composable
vi.mock("@/utils/useNetwork", () => ({
  useNetwork: vi.fn(() => ({
    isConnectedDebounced: ref(true),
  })),
}));

// Mock the showMessage function
vi.mock("@/utils/notifications", () => ({
  showMessage: vi.fn(),
}));

// Mock Vue's watch
vi.mock("vue", async () => {
  const actual = await vi.importActual("vue");
  return {
    ...actual,
    watch: vi.fn(),
  };
});

describe("stores/network", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("initializes with network status from useNetwork", () => {
    const store = useNetworkStore();

    expect(store.isConnectedDebounced).toBe(true);
  });

  it("returns the debounced connection status", () => {
    const store = useNetworkStore();

    // The store just returns the isConnectedDebounced from useNetwork
    expect(store.isConnectedDebounced).toBe(true);
  });
});
