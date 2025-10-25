import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ModuleData } from "@/types/module";
import { getAllModules, getModuleById } from "@/services/module-service";
import { handleError } from "@/lib/error-handler";

// 从mock-data.ts导入完整的24个模块数据
import { mockModules } from "@/services/mock-data";

interface ModuleState {
  modules: ModuleData[];
  activeModule: string | null;
  loading: boolean;
  error: Error | null;

  // 操作
  fetchModules: () => Promise<void>;
  fetchModule: (id: string) => Promise<ModuleData | null>;
  setActiveModule: (id: string | null) => void;
  toggleFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  rateModule: (id: string, rating: number) => Promise<void>;
}

export const useModuleStore = create<ModuleState>()(
  persist(
    (set, get) => ({
      modules: [],
      activeModule: null,
      loading: false,
      error: null,

      fetchModules: async () => {
        set({ loading: true, error: null });

        try {
          const data = await getAllModules();
          set({ modules: data, loading: false });
        } catch (error) {
          handleError(error, {
            tags: ["module-store", "fetch-modules"],
            showToUser: true,
          });

          set({
            error:
              error instanceof Error ? error : new Error("获取模块列表失败"),
            loading: false,
            modules: mockModules, // 使用模拟数据作为回退
          });
        }
      },

      fetchModule: async (id) => {
        try {
          // 先检查本地状态中是否已有该模块
          const existingModule = get().modules.find((m) => m.id === id);
          if (existingModule) return existingModule;

          // 否则从API获取
          const module = await getModuleById(id);

          // 如果获取成功，更新本地状态
          if (module) {
            set((state) => ({
              modules: state.modules.some((m) => m.id === id)
                ? state.modules.map((m) => (m.id === id ? module : m))
                : [...state.modules, module],
            }));
          }

          return module;
        } catch (error) {
          handleError(error, {
            tags: ["module-store", "fetch-module"],
            metadata: { moduleId: id },
            showToUser: true,
          });

          return null;
        }
      },

      setActiveModule: (id) => set({ activeModule: id }),

      toggleFavorite: async (id, isFavorite) => {
        // 乐观更新
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === id ? { ...m, isFavorite } : m,
          ),
        }));

        try {
          // 调用API
          await import("@/services/module-service").then(
            ({ toggleFavoriteModule }) => toggleFavoriteModule(id, isFavorite),
          );
        } catch (error) {
          // 如果失败，回滚状态
          handleError(error, {
            tags: ["module-store", "toggle-favorite"],
            metadata: { moduleId: id, isFavorite },
            showToUser: true,
          });

          set((state) => ({
            modules: state.modules.map((m) =>
              m.id === id ? { ...m, isFavorite: !isFavorite } : m,
            ),
          }));
        }
      },

      rateModule: async (id, rating) => {
        // 记录更新前的评分以便失败时回滚
        const prevRating = get().modules.find((m) => m.id === id)?.userRating ?? 0;

        // 乐观更新
        set((state) => ({
          modules: state.modules.map((m) =>
            m.id === id ? { ...m, userRating: rating } : m,
          ),
        }));

        try {
          // 调用API
          await import("@/services/module-service").then(({ rateModule }) =>
            rateModule(id, rating),
          );
        } catch (error) {
          // 如果失败，回滚状态
          handleError(error, {
            tags: ["module-store", "rate-module"],
            metadata: { moduleId: id, rating },
            showToUser: true,
          });

          set((state) => ({
            modules: state.modules.map((m) =>
              m.id === id ? { ...m, userRating: prevRating } : m,
            ),
          }));
        }
      },
    }),
    {
      name: "nexus-module-storage",
      partialize: (state) => ({
        modules: state.modules,
        activeModule: state.activeModule,
      }),
    },
  ),
);
