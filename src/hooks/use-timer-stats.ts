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

    for (const statType of displayStats.stats) {
      let value: number | null = null;
      let label = "";
      let isNewRecord = false;

      switch (statType.type) {
        case "aoN": {
          const n = statType.n === -1 ? Infinity : statType.n;
          label = n === Infinity ? "AoAll" : `Ao${statType.n}`;
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
        case "boN": {
          const n = statType.n === -1 ? Infinity : statType.n;
          label = n === Infinity ? "Best" : `Bo${statType.n}`;
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
          const n = statType.n === -1 ? Infinity : statType.n;
          label = n === Infinity ? "Mean" : `Mo${statType.n}`;
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
          const n = statType.n === -1 ? Infinity : statType.n;
          label = n === Infinity ? "Consistency" : `Co${statType.n}`;
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

      statsWithValues.push({ label, value, isNewRecord });
    }

    return {
      style: displayStats.style,
      orientation: displayStats.orientation,
      stats: statsWithValues,
    };
  }, [currentPuzzle, solves]);
}
