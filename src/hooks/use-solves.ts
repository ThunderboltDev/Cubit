import { useLiveQuery } from "dexie-react-hooks";
import { useCallback } from "react";
import { db } from "@/lib/db";
import type { Penalty, Solve, SolveInput } from "@/types/puzzles";

interface UseSolvesOptions {
  puzzleId?: string;
  limit?: number;
  offset?: number;
}

export function useSolves(options: UseSolvesOptions = {}) {
  const { puzzleId, limit, offset = 0 } = options;

  const solves = useLiveQuery(
    async () => {
      if (!puzzleId || typeof window === "undefined" || !db.solves) return [];

      let query = db.solves.where("puzzleId").equals(puzzleId).reverse();

      if (limit) {
        query = query.offset(offset).limit(limit);
      }

      return await query.sortBy("createdAt");
    },
    [puzzleId, limit, offset],
    [],
  );

  const addSolve = useCallback(async (solveData: SolveInput) => {
    const newSolve: Solve = {
      ...solveData,
      id: crypto.randomUUID() as string,
      createdAt: Date.now(),
    };

    await db.solves.add(newSolve);

    return newSolve;
  }, []);

  const updatePenalty = useCallback(async (id: string, penalty: Penalty) => {
    await db.solves.update(id, { penalty });
  }, []);

  const deleteSolve = useCallback(async (id: string) => {
    await db.solves.delete(id);
  }, []);

  const getTotalCount = useCallback(async (puzzleId: string) => {
    return await db.solves.where("puzzleId").equals(puzzleId).count();
  }, []);

  return {
    solves,
    addSolve,
    updatePenalty,
    deleteSolve,
    getTotalCount,
  };
}
