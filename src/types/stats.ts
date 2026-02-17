import type { Puzzle } from "@/types/puzzles";

export type StatType =
  | { type: "aoN"; n: number }
  | { type: "boN"; n: number }
  | { type: "mean"; n: number }
  | { type: "consistency"; n: number };

export type StatStyle = "cards" | "lines";
export type StatOrientation = "horizontal" | "vertical";

export type DisplayStatsConfig = {
  style: StatStyle;
  orientation: StatOrientation;
  stats: StatType[];
};

export type Stat = {
  label: string;
  value: number | null;
  isNewRecord?: boolean;
};

export type DisplayStats = Omit<Puzzle["displayStats"], "stats"> & {
  stats: Stat[];
};
