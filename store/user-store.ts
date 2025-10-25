import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserPreferences {
  theme: "light" | "dark" | "system";
  language: "zh" | "en";
  soundEnabled: boolean;
  soundVolume: number;
}

interface UserState {
  preferences: UserPreferences;

  // 操作
  setTheme: (theme: UserPreferences["theme"]) => void;
  setLanguage: (language: UserPreferences["language"]) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      preferences: {
        theme: "dark",
        language: "zh",
        soundEnabled: true,
        soundVolume: 0.5,
      },

      setTheme: (theme) =>
        set((state) => ({
          preferences: { ...state.preferences, theme },
        })),

      setLanguage: (language) =>
        set((state) => ({
          preferences: { ...state.preferences, language },
        })),

      setSoundEnabled: (soundEnabled) =>
        set((state) => ({
          preferences: { ...state.preferences, soundEnabled },
        })),

      setSoundVolume: (soundVolume) =>
        set((state) => ({
          preferences: { ...state.preferences, soundVolume },
        })),
    }),
    {
      name: "nexus-user-storage",
    },
  ),
);
