import type { Puzzle } from "@/types/puzzles";
import type { DisplayStatsConfig } from "@/types/stats";

export const PUZZLE_TYPES = [
  "222",
  "333",
  "333oh",
  "333ft",
  "333fm",
  "333bf",
  "333mbf",
  "444",
  "444bf",
  "555",
  "555bf",
  "666",
  "777",
  "clock",
  "minx",
  "pyram",
  "skewb",
  "sq1",
  "fto",
  "kilominx",
  "master_tetraminx",
  "redi_cube",
  "baby_fto",
] as const;

export const DEFAULT_DISPLAY_STATS: DisplayStatsConfig = {
  style: "cards",
  orientation: "horizontal",
  stats: [
    { type: "boN", n: Infinity },
    { type: "aoN", n: 5 },
    { type: "aoN", n: 12 },
    { type: "aoN", n: 100 },
    { type: "mean", n: Infinity },
  ],
};

export const DEFAULT_PUZZLE: Puzzle = {
  id: "default-puzzle",
  name: "3x3",
  type: "333",
  trimPercentage: 5,
  inspectionEnabled: true,
  inspectionDuration: 15,
  multiphaseEnabled: false,
  multiphaseCount: 0,
  inputMethod: "timer",
  scramblePreview: true,
  scramblePreviewVisualization: "3D",
  displayStats: DEFAULT_DISPLAY_STATS,
};

export type ChartType =
  | "solves"
  | "aon"
  | "mean"
  | "consistency"
  | "inspection"
  | "multiphase";

export type ChartConfig = {
  id: string;
  type: ChartType;
  n: number;
  phase?: number;
};

export const DEFAULT_CHART_CONFIG: ChartConfig[] = [
  { id: "default-solves", type: "solves", n: 100 },
  { id: "default-aon", type: "aon", n: 5 },
];

export const WCA_PRESETS: Partial<Puzzle>[] = [
  {
    id: "333",
    name: "3x3x3",
    type: "333",
  },
  {
    id: "222",
    name: "2x2x2",
    type: "222",
  },
  {
    id: "444",
    name: "4x4x4",
    type: "444",
  },
  {
    id: "555",
    name: "5x5x5",
    type: "555",
  },
  {
    id: "666",
    name: "6x6x6",
    type: "666",
  },
  {
    id: "777",
    name: "7x7x7",
    type: "777",
  },
  {
    id: "333bf",
    name: "3x3x3 BLD",
    type: "333bf",
    inspectionEnabled: false,
    trimPercentage: 0,
  },
  {
    id: "333oh",
    name: "3x3x3 OH",
    type: "333oh",
  },
  {
    id: "333fm",
    name: "3x3x3 FMC",
    type: "333fm",
    inspectionEnabled: false,
    trimPercentage: 0,
  },
  {
    id: "444bf",
    name: "4x4x4 BLD",
    type: "444bf",
    inspectionEnabled: false,
  },
  {
    id: "555bf",
    name: "5x5x5 BLD",
    type: "555bf",
    inspectionEnabled: false,
  },
  {
    id: "minx",
    name: "Megaminx",
    type: "minx",
  },
  {
    id: "pyram",
    name: "Pyraminx",
    type: "pyram",
  },
  {
    id: "skewb",
    name: "Skewb",
    type: "skewb",
  },
  {
    id: "sq1",
    name: "Square-1",
    type: "sq1",
  },
  {
    id: "clock",
    name: "Clock",
    type: "clock",
  },
] as const;
