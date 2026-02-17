export type Theme = "light" | "dark" | "system";

export type Settings = {
  theme: Theme;
  soundEnabled: boolean;
  soundVolume: number;
  hapticEnabled: boolean;
  holdThreshold: number;
  timerPrecision: TimerPrecision;
  timeFormat: TimerFormat;
};

export type TimerPrecision = 0 | 1 | 2 | 3;
export type TimerFormat = "decimal" | "colon";
