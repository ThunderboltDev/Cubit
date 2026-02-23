import { cn } from "@/lib/utils";
import type { PuzzleType } from "@/types/puzzles";

interface PuzzleIconProps {
  puzzleType: PuzzleType;
  size?: number;
  className?: string;
}

const puzzleTypeToIcon: Record<PuzzleType, string> = {
  "222": "event-222",
  "333": "event-333",
  "333oh": "event-333oh",
  "333ft": "event-333ft",
  "333fm": "event-333fm",
  "333bf": "event-333bf",
  "333mbf": "event-333mbf",
  "444": "event-444",
  "444bf": "event-444bf",
  "555": "event-555",
  "555bf": "event-555bf",
  "666": "event-666",
  "777": "event-777",
  clock: "event-clock",
  minx: "event-minx",
  pyram: "event-pyram",
  skewb: "event-skewb",
  sq1: "event-sq1",
  fto: "unofficial-fto",
  kilominx: "unofficial-kilominx",
  master_tetraminx: "unofficial-mtetram",
  redi_cube: "unofficial-redi",
  baby_fto: "unofficial-baby_fto",
};

export function PuzzleIcon({
  puzzleType,
  size = 16,
  className,
}: PuzzleIconProps) {
  const iconClass = puzzleTypeToIcon[puzzleType] || "event-333";

  return (
    <div
      className={cn("cubing-icon", iconClass, className)}
      style={{
        fontSize: size,
      }}
    />
  );
}
