import { AlertCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  type PuzzleID,
  TwistyPlayer,
  type VisualizationFormat,
} from "cubing/twisty";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
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
  className,
}: ScramblePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<TwistyPlayer | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    if (!containerRef.current) {
      return;
    }

    const container = containerRef.current;
    let errorUnsubscribe: (() => void) | null = null;

    try {
      const player = new TwistyPlayer({
        puzzle: puzzleTypeMap[puzzleType] || "3x3x3",
        alg: scramble,
        visualization: visualization,
        hintFacelets: "none",
        controlPanel: "none",
        background: "none",
      });

      playerRef.current = player;
      container.appendChild(player);

      const errorTracker = player.experimentalModel.userVisibleErrorTracker;

      const handleError = (errorData: { errors: string[] }) => {
        if (errorData.errors.length > 0) {
          const errorMsg = errorData.errors.join(", ");
          setError(errorMsg);
          console.error("TwistyPlayer Error:", errorMsg);
        }
      };

      errorTracker.addFreshListener(handleError);
      errorUnsubscribe = () => errorTracker.removeFreshListener(handleError);

      errorTracker.get().then(handleError);

      return () => {
        errorUnsubscribe?.();
        player.remove();
        playerRef.current = null;
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid configuration";
      setError(msg);
      console.error("ScramblePreview constructor error:", err);
    }
  }, [puzzleType, visualization, scramble]);

  if (error) {
    return (
      <div
        key="error"
        className={cn(
          "flex flex-col items-center justify-center h-32 w-48 text-danger gap-2 p-2 text-center",
          className,
        )}
      >
        <HugeiconsIcon icon={AlertCircleIcon} className="size-12" />
        <span className="text-xs font-medium leading-tight">{error}</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center justify-center h-32 w-48 **:h-32 **:w-48",
        className,
      )}
    />
  );
}
