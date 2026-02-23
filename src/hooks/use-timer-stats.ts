import { useMemo } from "react";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSolves } from "@/hooks/use-solves";
import {
  calculateAverageOfN,
  calculateBestOfN,
  calculateConsistencyOfN,
  calculateMeanOfN,
} from "@/lib/stats";
import type { DisplayStats, Stat } from "@/types/stats";

export function useTimerStats(): DisplayStats | null {
  const { currentPuzzle } = usePuzzles();
  const { solves } = useSolves({ puzzleId: currentPuzzle?.id });

  return useMemo(() => {
    if (!currentPuzzle || !solves.length) {
      return null;
    }

    const { displayStats, trimPercentage } = currentPuzzle;
    const statsWithValues: Stat[] = [];

    for (const stat of displayStats.stats) {
      let value: number | null = null;
      let isNewRecord = false;

      const n = !stat.n ? Infinity : stat.n;

      switch (stat.type) {
        case "average": {
          value = calculateAverageOfN(solves, n, trimPercentage);

          if (value === null) break;

          const historicalBest = calculateAverageOfN(
            solves.slice(0, n === Infinity ? -1 : solves.length - n),
            n,
            trimPercentage,
          );

          isNewRecord = historicalBest === null || value <= historicalBest;

          break;
        }
        case "best": {
          value = calculateBestOfN(solves, n);

          if (value === null) break;

          const historicalBest = calculateBestOfN(
            solves.slice(0, n === Infinity ? -1 : solves.length - n),
            n,
          );

          isNewRecord = historicalBest === null || value <= historicalBest;

          break;
        }
        case "mean": {
          value = calculateMeanOfN(solves, n);

          if (value === null) break;

          const historicalBest = calculateMeanOfN(
            solves.slice(0, n === Infinity ? -1 : solves.length - n),
            n,
          );

          isNewRecord = historicalBest === null || value <= historicalBest;

          break;
        }
        case "consistency": {
          value = calculateConsistencyOfN(solves, n);

          if (value === null) break;

          const historicalBest = calculateConsistencyOfN(
            solves.slice(0, n === Infinity ? -1 : solves.length - n),
            n,
          );

          isNewRecord = historicalBest === null || value <= historicalBest;

          break;
        }
      }

      statsWithValues.push({
        value,
        type: stat.type,
        n,
        isNewRecord,
      });
    }

    return {
      style: displayStats.style,
      orientation: displayStats.orientation,
      stats: statsWithValues,
    };
  }, [currentPuzzle, solves]);
}
