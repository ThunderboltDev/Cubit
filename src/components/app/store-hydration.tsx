import { useEffect } from "react";
import { usePreferencesStore } from "@/stores/preferences";
import { usePuzzlesStore } from "@/stores/puzzles";
import { useSettingsStore } from "@/stores/settings";
import { useStatisticsViewStore } from "@/stores/statistics-view";

export function StoreHydration() {
  useEffect(() => {
    usePuzzlesStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();
    useStatisticsViewStore.persist.rehydrate();
    usePreferencesStore.persist.rehydrate();
  }, []);

  return null;
}
