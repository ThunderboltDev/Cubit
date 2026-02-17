import {
  Delete02Icon,
  Flag02Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScramblePreview } from "@/components/timer/scramble-preview";
import { StatCard } from "@/components/timer/stat-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useScramble } from "@/contexts/scramble";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSettings } from "@/hooks/use-settings";
import { useSolves } from "@/hooks/use-solves";
import { useTimerStats } from "@/hooks/use-timer-stats";
import { formatTime } from "@/lib/format-time";
import { cn } from "@/lib/utils";
import type { Penalty, Solve, SolveInput } from "@/types/puzzles";

type TimerState = "idle" | "holding" | "inspection" | "running" | "stopped";

export const Route = createFileRoute("/_timer/")({
  component: TimerPage,
});

function TimerPage() {
  const { currentPuzzle } = usePuzzles();
  const { settings } = useSettings();

  const { scramble, scrambleRef, generateNewScramble } = useScramble();

  const { solves, addSolve, deleteSolve, updatePenalty } = useSolves({
    puzzleId: currentPuzzle.id,
  });

  const stats = useTimerStats();

  const [displayTime, setDisplayTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [currentSolveId, setCurrentSolveId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isScrambleDialogOpen, setIsScrambleDialogOpen] = useState(false);
  const [inspectionTime, setInspectionTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const holdStartTimeRef = useRef<number>(0);
  const readyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalTimeRef = useRef<number>(0);
  const inspectionStartRef = useRef<number>(0);
  const phaseTimesRef = useRef<number[]>([]);
  const phaseStartRef = useRef<number>(0);
  const inspectionPenaltyRef = useRef<Penalty>("OK");
  const lastInspectionColorRef = useRef<"normal" | "warning" | "danger">(
    "normal",
  );

  const currentSolve = solves.find((s: Solve) => s.id === currentSolveId);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
    };
  }, []);

  const applyInspectionPenalty = useCallback((penalty: Penalty) => {
    inspectionPenaltyRef.current = penalty;
  }, []);

  const startInspection = useCallback(() => {
    inspectionStartRef.current = Date.now();
    inspectionPenaltyRef.current = "OK";
    setTimerState("inspection");
    setInspectionTime((currentPuzzle.inspectionDuration || 15) * 1000);
    setCurrentSolveId(null);
    setControlsVisible(false);
  }, [currentPuzzle]);

  const startSolve = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const now = Date.now();
    startTimeRef.current = now;
    phaseStartRef.current = now;
    phaseTimesRef.current = [];
    setTimerState("running");
    setDisplayTime(0);
    setCurrentSolveId(null);
    setCurrentPhase(currentPuzzle.multiphaseEnabled ? 1 : 0);
    lastInspectionColorRef.current = "normal";
  }, [currentPuzzle]);

  const endSolve = useCallback(
    async (finalTime: number) => {
      if (!currentPuzzle) return;

      const now = Date.now();
      const hasInspection =
        currentPuzzle.inspectionEnabled && inspectionStartRef.current > 0;
      const hasMultiphase =
        currentPuzzle.multiphaseEnabled && phaseTimesRef.current.length > 0;

      let solve: SolveInput;

      const baseSolve = {
        puzzleId: currentPuzzle.id,
        scramble: scrambleRef.current,
        time: finalTime,
        penalty: inspectionPenaltyRef.current,
      };

      if (hasInspection && hasMultiphase) {
        solve = {
          ...baseSolve,
          kind: "full",
          inspectionTime: now - inspectionStartRef.current,
          phases: phaseTimesRef.current,
        };
      } else if (hasInspection) {
        solve = {
          ...baseSolve,
          kind: "inspection",
          inspectionTime: now - inspectionStartRef.current,
        };
      } else if (hasMultiphase) {
        solve = {
          ...baseSolve,
          kind: "multiphase",
          phases: phaseTimesRef.current,
        };
      } else {
        solve = {
          ...baseSolve,
          kind: "base",
        };
      }

      try {
        const savedSolve = await addSolve(solve);
        if (savedSolve) {
          setCurrentSolveId(savedSolve.id);
          generateNewScramble();
        }
      } catch (error) {
        console.error("Failed to save solve:", error);
      }

      inspectionPenaltyRef.current = "OK";
      inspectionStartRef.current = 0;
      phaseTimesRef.current = [];
      setCurrentPhase(0);
      setControlsVisible(true);
    },
    [currentPuzzle, addSolve, generateNewScramble, scrambleRef.current],
  );

  const handlePhaseComplete = useCallback(() => {
    const now = Date.now();
    const phaseDuration = now - phaseStartRef.current;
    phaseTimesRef.current.push(phaseDuration);
    phaseStartRef.current = now;

    const totalPhases =
      currentPuzzle.multiphaseEnabled ? currentPuzzle.multiphaseCount : 1;

    if (phaseTimesRef.current.length >= totalPhases) {
      const totalTime = phaseTimesRef.current.reduce(
        (sum, time) => sum + time,
        0,
      );
      finalTimeRef.current = totalTime;
      setDisplayTime(totalTime);
      setTimerState("stopped");
      endSolve(totalTime);
    } else {
      setCurrentPhase(phaseTimesRef.current.length + 1);
    }
  }, [currentPuzzle, endSolve]);

  const stopTimer = useCallback(() => {
    if (currentPuzzle.multiphaseEnabled) {
      handlePhaseComplete();
    } else {
      const finalTime = Date.now() - startTimeRef.current;
      finalTimeRef.current = finalTime;
      setDisplayTime(finalTime);
      setTimerState("stopped");
      endSolve(finalTime);
    }
  }, [currentPuzzle, handlePhaseComplete, endSolve]);

  useEffect(() => {
    if (currentPuzzle) {
      setDisplayTime(0);
      setTimerState("idle");
      setCurrentSolveId(null);
      finalTimeRef.current = 0;
    }
  }, [currentPuzzle]);

  useEffect(() => {
    if (timerState !== "running" && timerState !== "inspection") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    if (timerState === "inspection") {
      const maxInspection = (currentPuzzle.inspectionDuration || 15) * 1000;

      const tick = () => {
        const elapsed = Date.now() - inspectionStartRef.current;
        const remaining = Math.max(0, maxInspection - elapsed);
        setInspectionTime(remaining);

        const remainingSec = Math.ceil(remaining / 1000);
        let currentColor: "normal" | "warning" | "danger" = "normal";

        if (remainingSec <= 3) currentColor = "danger";
        else if (remainingSec <= 7) currentColor = "warning";

        if (currentColor !== lastInspectionColorRef.current) {
          lastInspectionColorRef.current = currentColor;
        }

        if (elapsed >= maxInspection + 2000) {
          applyInspectionPenalty("DNF");
          startSolve();
          return;
        }

        if (elapsed >= maxInspection && inspectionPenaltyRef.current === "OK") {
          applyInspectionPenalty("+2");
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    if (timerState === "running") {
      const tick = () => {
        const elapsed = Date.now() - startTimeRef.current;
        setDisplayTime(elapsed);
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [timerState, currentPuzzle, startSolve, applyInspectionPenalty]);

  const handlePressIn = useCallback(() => {
    if (timerState === "running") {
      stopTimer();
    } else if (timerState === "inspection") {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      holdStartTimeRef.current = Date.now();
      setTimerState("holding");
      setIsReady(false);

      if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);

      readyTimeoutRef.current = setTimeout(() => {
        setIsReady(true);
      }, settings.holdThreshold);
    } else if (timerState === "idle" || timerState === "stopped") {
      if (currentPuzzle.inspectionEnabled) {
        startInspection();
      } else {
        setDisplayTime(0);
        holdStartTimeRef.current = Date.now();
        setTimerState("holding");
        setIsReady(false);
        setControlsVisible(false);

        if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);
        readyTimeoutRef.current = setTimeout(() => {
          setIsReady(true);
        }, settings.holdThreshold);
      }
    }
  }, [
    timerState,
    stopTimer,
    currentPuzzle,
    startInspection,
    settings.holdThreshold,
  ]);

  const handlePressOut = useCallback(() => {
    if (timerState === "running") return;

    if (timerState === "holding") {
      const holdDuration = Date.now() - (holdStartTimeRef.current || 0);

      if (holdDuration >= settings.holdThreshold && isReady) {
        const now = Date.now();
        const elapsed = now - inspectionStartRef.current;
        const maxInspection = (currentPuzzle.inspectionDuration || 15) * 1000;

        if (inspectionStartRef.current > 0 && elapsed >= maxInspection + 2000) {
          applyInspectionPenalty("DNF");
        } else if (inspectionStartRef.current > 0 && elapsed >= maxInspection) {
          applyInspectionPenalty("+2");
        }

        startSolve();
      } else {
        if (readyTimeoutRef.current) clearTimeout(readyTimeoutRef.current);

        if (inspectionStartRef.current > 0) {
          setTimerState("inspection");
          setIsReady(false);
        } else {
          setTimerState("idle");
          setIsReady(false);
          setControlsVisible(true);
        }
      }

      holdStartTimeRef.current = 0;
    }
  }, [
    timerState,
    isReady,
    settings.holdThreshold,
    currentPuzzle,
    startSolve,
    applyInspectionPenalty,
  ]);

  const getTimerColor = () => {
    if (timerState === "inspection") {
      const remainingSec = Math.ceil(inspectionTime / 1000);
      if (remainingSec <= 3) return "text-destructive";
      if (remainingSec <= 7) return "text-yellow-500";
      return "text-foreground";
    }
    if (timerState === "running") return "text-foreground";
    if (timerState === "holding")
      return isReady ? "text-green-500" : "text-destructive";
    return "text-foreground";
  };

  const getDisplayText = () => {
    if (timerState === "holding") {
      return formatTime(0, settings.timerPrecision);
    }

    if (timerState === "idle" && currentPuzzle.inspectionEnabled) {
      return (currentPuzzle.inspectionDuration || 15).toString();
    }

    if (timerState === "inspection") {
      return Math.ceil(inspectionTime / 1000).toString();
    }

    if (currentSolve?.penalty === "+2") {
      return `${formatTime(finalTimeRef.current + 2000, settings.timerPrecision)}+`;
    }

    if (currentSolve?.penalty === "DNF") {
      return "DNF";
    }

    return formatTime(
      timerState === "stopped" ? finalTimeRef.current : displayTime,
      settings.timerPrecision,
    );
  };

  const getHintText = () => {
    if (timerState === "inspection") {
      return "hold to start";
    }

    if (timerState === "running" && currentPuzzle.multiphaseEnabled) {
      const totalPhases = currentPuzzle.multiphaseCount;
      return `Phase ${currentPhase}/${totalPhases}`;
    }

    if (timerState === "idle" && !currentPuzzle.inspectionEnabled) {
      return `hold to start`;
    }

    return "click to start";
  };

  const handleDeleteSolve = () => {
    setIsDeleteDialogOpen(false);
    setDisplayTime(0);
    setTimerState("idle");
    setCurrentSolveId(null);
    if (currentSolve) deleteSolve(currentSolve.id);
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden select-none touch-none md:h-svh">
      <button
        type="button"
        className="absolute inset-0 z-0 flex items-center justify-center bg-background"
        onMouseDown={handlePressIn}
        onMouseUp={handlePressOut}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
        aria-label="Timer area. Press and hold to start, release to stop."
      >
        <div className="flex flex-col items-center">
          <span
            className={cn(
              "font-mono text-7xl font-bold leading-[90px]",
              getTimerColor(),
            )}
          >
            {getDisplayText()}
          </span>
          <span
            className={cn(
              "mt-3 h-7 text-xs uppercase tracking-widest transition-opacity",
              (
                timerState === "idle" ||
                  timerState === "inspection" ||
                  (timerState === "running" && currentPuzzle.multiphaseEnabled)
              ) ?
                "opacity-50"
              : "opacity-0",
            )}
          >
            {getHintText()}
          </span>
        </div>
      </button>

      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 flex flex-col transition-opacity duration-200",
          controlsVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="pointer-events-auto flex flex-col gap-3 p-4 pb-0 pt-20 md:pt-4">
          <Button
            variant="transparent"
            className="h-auto min-h-[52px] w-full whitespace-normal max-w-xl mx-auto"
            onClick={() => setIsScrambleDialogOpen(true)}
          >
            <span className="line-clamp-2 text-lg md:text-3xl text-center text-balance font-bold leading-tight">
              {scramble}
            </span>
          </Button>
          <div
            className={cn(
              "max-h-[80px] md:max-h-[120px] items-center justify-center transition-opacity",
              currentPuzzle.scramblePreview ? "flex" : "hidden",
            )}
          >
            <ScramblePreview
              scramble={scramble}
              puzzleType={currentPuzzle.type}
              visualization={currentPuzzle.scramblePreviewVisualization}
            />
          </div>
        </div>

        <div className="flex-1" />

        <div className="pointer-events-auto flex items-center justify-center gap-4 py-4">
          {timerState === "stopped" && currentSolve && (
            <>
              <Button
                className="rounded-full"
                variant={currentSolve?.penalty === "+2" ? "default" : "outline"}
                onClick={() =>
                  updatePenalty(
                    currentSolve.id,
                    currentSolve.penalty === "+2" ? "OK" : "+2",
                  )
                }
              >
                <HugeiconsIcon icon={Flag02Icon} />
              </Button>
              <Button
                className="rounded-full"
                theme={currentSolve?.penalty === "DNF" ? "danger" : "default"}
                onClick={() =>
                  updatePenalty(
                    currentSolve.id,
                    currentSolve.penalty === "DNF" ? "OK" : "DNF",
                  )
                }
              >
                <HugeiconsIcon icon={UnavailableIcon} />
              </Button>
              <Button
                theme="danger"
                className="rounded-full"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <HugeiconsIcon icon={Delete02Icon} />
              </Button>
            </>
          )}
        </div>

        <div className="pointer-events-auto flex flex-col w-full p-4 pb-24">
          <div className="flex flex-row justify-center gap-6">
            {stats?.stats.map((stat) => (
              <StatCard
                key={stat.label}
                stat={stat}
                style={currentPuzzle.displayStats.style}
              />
            ))}
          </div>
        </div>
      </div>

      <Dialog
        open={isScrambleDialogOpen}
        onOpenChange={setIsScrambleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scramble</DialogTitle>
            <DialogDescription className="text-secondary-foreground text-lg">
              {scramble}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Solve</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this solve? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDeleteSolve} theme="danger">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
