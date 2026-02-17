import {
  type PuzzleID,
  TwistyPlayer,
  type VisualizationFormat,
} from "cubing/twisty";
import { useEffect, useRef } from "react";
import type { PuzzleType } from "@/types/puzzles";

interface ScramblePreviewProps {
  scramble: string;
  puzzleType: PuzzleType;
  visualization: VisualizationFormat;
  className?: string;
}

const puzzleTypeMap: Record<PuzzleType, PuzzleID> = {
  "222": "2x2x2",
  "333": "3x3x3",
  "333oh": "3x3x3",
  "333ft": "3x3x3",
  "333fm": "3x3x3",
  "333bf": "3x3x3",
  "333mbf": "3x3x3",
  "444": "4x4x4",
  "444bf": "4x4x4",
  "555": "5x5x5",
  "555bf": "5x5x5",
  "666": "6x6x6",
  "777": "7x7x7",
  "clock": "clock",
  "minx": "megaminx",
  "pyram": "pyraminx",
  "skewb": "skewb",
  "sq1": "square1",
  "fto": "fto",
  "kilominx": "kilominx",
  "master_tetraminx": "master_tetraminx",
  "redi_cube": "redi_cube",
  "baby_fto": "baby_fto",
} as const;

export function ScramblePreview({
  scramble,
  puzzleType,
  visualization,
}: ScramblePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const player = new TwistyPlayer({
      puzzle: puzzleTypeMap[puzzleType] || "3x3x3",
      alg: scramble,
      visualization: visualization,
      hintFacelets: "none",
      controlPanel: "none",
      background: "none",
    });

    playerRef.current = player;
    containerRef.current.appendChild(player);

    return () => {
      player.remove();
      playerRef.current = null;
    };
  }, [puzzleType, visualization, scramble]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center h-32 w-48 **:h-32 **:w-48"
    />
  );
}
