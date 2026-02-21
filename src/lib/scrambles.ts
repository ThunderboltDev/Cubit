import type { PuzzleType } from "@/types/puzzles";

const isBrowser = typeof document !== "undefined";

let cubingModule: typeof import("cubing/scramble") | null = null;

export async function generateScramble(
  puzzleType: PuzzleType,
): Promise<string> {
  if (!isBrowser) {
    return "Generating scramble...";
  }

  if (!cubingModule) {
    cubingModule = await import("cubing/scramble");
  }

  const scramble = await cubingModule.randomScrambleForEvent(puzzleType);
  return scramble.toString();
}
