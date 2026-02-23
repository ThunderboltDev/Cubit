import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Settings,
  Theme,
  TimerFormat,
  TimerPrecision,
} from "@/types/settings";

interface SettingsState extends Settings {
  setTheme: (theme: Theme) => void;
  toggleSound: () => void;
  setSoundVolume: (volume: number) => void;
  toggleHaptic: () => void;
  setHoldThreshold: (ms: number) => void;
  setTimerPrecision: (precision: TimerPrecision) => void;
  setTimeFormat: (format: TimerFormat) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "system",
      soundEnabled: true,
      soundVolume: 0.5,
      hapticEnabled: true,
      holdThreshold: 300,
      timerPrecision: 3,
      timeFormat: "decimal",

      setTheme: (theme) => set({ theme }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      setSoundVolume: (volume) =>
        set({ soundVolume: Math.max(0, Math.min(1, volume)) }),
      toggleHaptic: () => set((s) => ({ hapticEnabled: !s.hapticEnabled })),
      setHoldThreshold: (ms) => set({ holdThreshold: Math.max(0, ms) }),
      setTimerPrecision: (precision) => set({ timerPrecision: precision }),
      setTimeFormat: (format) => set({ timeFormat: format }),
    }),
    {
      name: "cubit-settings",
    },
  ),
);
