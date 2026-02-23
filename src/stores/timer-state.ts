import { create } from "zustand";
import type { TimerState } from "@/hooks/use-timer";

interface TimerStateStore {
  timerState: TimerState;
  setTimerState: (state: TimerState) => void;
}

export const useTimerStateStore = create<TimerStateStore>((set) => ({
  timerState: "idle",
  setTimerState: (timerState) => set({ timerState }),
}));
