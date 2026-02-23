import {
  createContext,
  type ReactNode,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePuzzles } from "@/hooks/use-puzzles";
import { generateScramble } from "@/lib/scrambles";

interface ScrambleContextType {
  scramble: string;
  scrambleRef: RefObject<string>;
  generateNewScramble: () => void;
}

const ScrambleContext = createContext<ScrambleContextType | null>(null);

export function ScrambleProvider({ children }: { children: ReactNode }) {
  const { currentPuzzle } = usePuzzles();
  const [scramble, setScramble] = useState<string>("Generating scramble...");
  const scrambleRef = useRef(scramble);

  useEffect(() => {
    if (!currentPuzzle) return;
    generateScramble(currentPuzzle.type).then((newScramble) => {
      setScramble(newScramble);
      scrambleRef.current = newScramble;
    });
  }, [currentPuzzle]);

  const generateNewScramble = useCallback(() => {
    if (!currentPuzzle) return;
    generateScramble(currentPuzzle.type).then((newScramble) => {
      setScramble(newScramble);
      scrambleRef.current = newScramble;
    });
  }, [currentPuzzle]);

  return (
    <ScrambleContext.Provider
      value={{ scramble, scrambleRef, generateNewScramble }}
    >
      {children}
    </ScrambleContext.Provider>
  );
}

export function useScramble() {
  const context = useContext(ScrambleContext);
  if (!context)
    throw new Error("useScramble must be used within ScrambleProvider");
  return context;
}
