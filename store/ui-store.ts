import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  activeTab: string;

  // 操作
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setActiveTab: (tab: string) => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      mobileMenuOpen: false,
      activeTab: "overview",

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      toggleMobileMenu: () =>
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      closeMobileMenu: () => set({ mobileMenuOpen: false }),
    }),
    {
      name: "nexus-ui-storage",
    },
  ),
);
