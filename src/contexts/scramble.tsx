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

function useMount(fn: () => void) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: hook
  useEffect(() => {
    fn();
  }, []);
}

interface ScrambleContextType {
  scramble: string;
  scrambleRef: RefObject<string>;
  generateNewScramble: () => void;
}

const ScrambleContext = createContext<ScrambleContextType | null>(null);

export function ScrambleProvider({ children }: { children: ReactNode }) {
  const { currentPuzzle } = usePuzzles();

  const [scramble, setScramble] = useState<string>("Generating scramble...");

  const isMounted = useRef(false);
  const scrambleRef = useRef(scramble);

  useMount(() => {
    isMounted.current = true;

    if (currentPuzzle) {
      generateScramble(currentPuzzle.type).then((newScramble) => {
        if (isMounted.current) {
          setScramble(newScramble);
          scrambleRef.current = newScramble;
        }
      });
    }
  });

  // useEffect(() => {
  //   scrambleRef.current = scramble;
  // }, [scramble]);

  useEffect(() => {
    if (currentPuzzle) {
      generateScramble(currentPuzzle.type).then((newScramble) => {
        setScramble(newScramble);
        scrambleRef.current = newScramble;
      });
    }
  }, [currentPuzzle]);

  const generateNewScramble = useCallback(() => {
    if (currentPuzzle) {
      generateScramble(currentPuzzle.type).then((newScramble) => {
        setScramble(newScramble);
        scrambleRef.current = newScramble;
      });
    }
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

  if (!context) {
    throw new Error("useScramble must be used within ScrambleProvider");
  }

  return context;
}
