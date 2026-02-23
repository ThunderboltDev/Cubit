import type { Puzzle } from "@/types/puzzles";

export type StatType = {
  type: "average" | "best" | "mean" | "consistency";
  n: number;
};

export type StatStyle = "cards" | "lines";
export type StatOrientation = "horizontal" | "vertical";

export type DisplayStatsConfig = {
  style: StatStyle;
  orientation: StatOrientation;
  stats: StatType[];
};

export interface Stat extends StatType {
  value: number | null;
  isNewRecord?: boolean;
}

export type DisplayStats = Omit<Puzzle["displayStats"], "stats"> & {
  stats: Stat[];
};
