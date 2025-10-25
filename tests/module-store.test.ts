import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockModules } from "@/services/mock-data";

// Mock service module before importing the store
vi.mock("@/services/module-service", () => ({
  getAllModules: async () => { throw new Error("network error"); },
  getModuleById: async () => null,
  toggleFavoriteModule: async () => { throw new Error("fail"); },
  rateModule: async () => { throw new Error("fail"); },
}));

import { useModuleStore } from "@/store/module-store";

// Reset store state between tests
beforeEach(() => {
  useModuleStore.setState({ modules: [], activeModule: null, loading: false, error: null });
});

describe("module-store", () => {
  it("fetchModules falls back to mock data on failure", async () => {
    await useModuleStore.getState().fetchModules();
    const state = useModuleStore.getState();
    expect(state.modules.length).toBeGreaterThan(0);
    expect(state.modules[0].id).toBe(mockModules[0].id);
    expect(state.loading).toBe(false);
  });

  it("setActiveModule updates state", () => {
    useModuleStore.getState().setActiveModule("mod-1");
    expect(useModuleStore.getState().activeModule).toBe("mod-1");
  });

  it("toggleFavorite optimistic update and rollback on error", async () => {
    useModuleStore.setState({ modules: [{ ...mockModules[0], isFavorite: false }] as any });
    const id = mockModules[0].id;

    await useModuleStore.getState().toggleFavorite(id, true);
    const updated = useModuleStore.getState().modules.find(m => m.id === id)!;
    expect(updated.isFavorite).toBe(false);
  });

  it("rateModule optimistic update and rollback on error", async () => {
    useModuleStore.setState({ modules: [{ ...mockModules[0], userRating: 0 }] as any });
    const id = mockModules[0].id;

    await useModuleStore.getState().rateModule(id, 4);
    const updated = useModuleStore.getState().modules.find(m => m.id === id)!;
    expect(updated.userRating).toBe(0);
  });
});
