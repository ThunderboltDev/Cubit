import { useCallback } from "react";
import { useSettingsStore } from "@/stores/settings";
import type { Settings } from "@/types/settings";

export function useSettings() {
  const store = useSettingsStore();

  const updateSettings = useCallback(
    (updates: Partial<Settings>) => {
      const {
        theme,
        soundEnabled,
        soundVolume,
        hapticEnabled,
        holdThreshold,
        timerPrecision,
        timeFormat,
      } = updates;

      if (theme !== undefined) store.setTheme(theme);
      if (soundEnabled !== undefined && store.soundEnabled !== soundEnabled) {
        store.toggleSound();
      }
      if (soundVolume !== undefined) store.setSoundVolume(soundVolume);
      if (
        hapticEnabled !== undefined &&
        store.hapticEnabled !== hapticEnabled
      ) {
        store.toggleHaptic();
      }
      if (holdThreshold !== undefined) store.setHoldThreshold(holdThreshold);
      if (timerPrecision !== undefined) store.setTimerPrecision(timerPrecision);
      if (timeFormat !== undefined) store.setTimeFormat(timeFormat);
    },
    [store],
  );

  const settings: Settings = {
    theme: store.theme,
    soundEnabled: store.soundEnabled,
    soundVolume: store.soundVolume,
    hapticEnabled: store.hapticEnabled,
    holdThreshold: store.holdThreshold,
    timerPrecision: store.timerPrecision,
    timeFormat: store.timeFormat,
  };

  return {
    settings,
    updateSettings,
  };
}
