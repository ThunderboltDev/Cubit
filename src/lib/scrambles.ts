import { randomScrambleForEvent } from "cubing/scramble";
import type { PuzzleType } from "@/types/puzzles";

export async function generateScramble(
  puzzleType: PuzzleType,
): Promise<string> {
  if (typeof document === "undefined") {
    return "Generating scramble";
  }

  return randomScrambleForEvent(puzzleType).then((scramble) => {
    return scramble.toString();
  });
}
