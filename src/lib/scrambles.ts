import type { PuzzleType } from "@/types/puzzles";

export async function generateScramble(
  puzzleType: PuzzleType,
): Promise<string> {
  if (typeof window === "undefined") {
    return "Generating scramble...";
  }

  const cubingModule = await import("cubing/scramble");
  const scramble = await cubingModule.randomScrambleForEvent(puzzleType);
  return scramble.toString();
}
