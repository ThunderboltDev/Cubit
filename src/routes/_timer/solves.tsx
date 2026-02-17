import {
  Copy01Icon,
  Delete02Icon,
  Flag02Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useCopyToClipboard } from "react-use";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSettings } from "@/hooks/use-settings";
import { useSolves } from "@/hooks/use-solves";
import { formatTime } from "@/lib/format-time";
import { getEffectiveTime } from "@/lib/stats";
import type { Penalty, Solve } from "@/types/puzzles";

export const Route = createFileRoute("/_timer/solves")({
  component: SolvesPage,
});

type PenaltyFilter = "all" | "OK" | "+2" | "DNF";
type SortOption = "newest" | "oldest" | "best" | "worst";

function SolvesPage() {
  const { currentPuzzle } = usePuzzles();
  const { settings } = useSettings();
  const { solves, updatePenalty, deleteSolve } = useSolves({
    puzzleId: currentPuzzle.id,
  });

  const [penaltyFilter, setPenaltyFilter] = useState<PenaltyFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [selectedSolve, setSelectedSolve] = useState<Solve | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Solve | null>(null);
  const [, copyToClipboard] = useCopyToClipboard();
  const [copyFeedback, setCopyFeedback] = useState(false);

  const filteredSolves = useMemo(() => {
    let result = [...solves];

    if (penaltyFilter !== "all") {
      result = result.filter((s) => s.penalty === penaltyFilter);
    }

    switch (sortOption) {
      case "newest":
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "oldest":
        result.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case "best": {
        result.sort((a, b) => {
          const aTime = getEffectiveTime(a);
          const bTime = getEffectiveTime(b);
          if (aTime === null && bTime === null) return 0;
          if (aTime === null) return 1;
          if (bTime === null) return -1;
          return aTime - bTime;
        });
        break;
      }
      case "worst": {
        result.sort((a, b) => {
          const aTime = getEffectiveTime(a);
          const bTime = getEffectiveTime(b);
          if (aTime === null && bTime === null) return 0;
          if (aTime === null) return -1;
          if (bTime === null) return 1;
          return bTime - aTime;
        });
        break;
      }
    }

    return result;
  }, [solves, penaltyFilter, sortOption]);

  const handleCopyScramble = (scramble: string) => {
    copyToClipboard(scramble);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1500);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteSolve(deleteTarget.id);
    setDeleteTarget(null);
    if (selectedSolve?.id === deleteTarget.id) {
      setSelectedSolve(null);
    }
  };

  const formatSolveTime = (solve: Solve) => {
    if (solve.penalty === "DNF") return "DNF";
    const time = getEffectiveTime(solve);
    const display = formatTime(
      time,
      settings.timerPrecision,
      settings.timeFormat,
    );
    return solve.penalty === "+2" ? `${display}+` : display;
  };

  const formatDate = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="flex h-dvh flex-col md:h-svh">
      <div className="space-y-4 p-6 pb-0">
        <h1 className="text-2xl font-bold">Solves</h1>
        <div className="flex flex-wrap gap-3">
          <Select
            value={penaltyFilter}
            onValueChange={(v) => setPenaltyFilter(v as PenaltyFilter)}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="OK">OK</SelectItem>
              <SelectItem value="+2">+2</SelectItem>
              <SelectItem value="DNF">DNF</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={sortOption}
            onValueChange={(v) => setSortOption(v as SortOption)}
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="best">Best</SelectItem>
              <SelectItem value="worst">Worst</SelectItem>
            </SelectContent>
          </Select>

          <span className="ml-auto self-center text-sm text-muted-foreground">
            {filteredSolves.length} solve{filteredSolves.length !== 1 && "s"}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-mobile-nav md:pb-6">
        {filteredSolves.length === 0 ?
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            {solves.length === 0 ?
              "No solves yet. Start timing!"
            : "No solves match this filter."}
          </div>
        : <div className="space-y-1">
            {filteredSolves.map((solve) => (
              <button
                key={solve.id}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary"
                onClick={() => setSelectedSolve(solve)}
              >
                <span className="min-w-20 font-mono text-base font-semibold">
                  {formatSolveTime(solve)}
                </span>
                {solve.penalty !== "OK" && (
                  <Badge
                    theme={solve.penalty === "DNF" ? "danger" : "warning"}
                    className="text-xs"
                  >
                    {solve.penalty}
                  </Badge>
                )}
                <span className="flex-1 truncate text-xs text-muted-foreground font-mono">
                  {solve.scramble}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(solve.createdAt)}
                </span>
              </button>
            ))}
          </div>
        }
      </div>

      <Sheet
        open={!!selectedSolve}
        onOpenChange={(open) => !open && setSelectedSolve(null)}
      >
        <SheetContent side="bottom" className="max-h-[70dvh]">
          {selectedSolve && (
            <>
              <SheetHeader>
                <SheetTitle>Solve Detail</SheetTitle>
              </SheetHeader>
              <div className="space-y-5 p-4 pt-0">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-4xl font-bold">
                    {formatSolveTime(selectedSolve)}
                  </span>
                  {selectedSolve.penalty !== "OK" && (
                    <Badge
                      theme={
                        selectedSolve.penalty === "DNF" ? "danger" : "warning"
                      }
                    >
                      {selectedSolve.penalty}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  {new Date(selectedSolve.createdAt).toLocaleString()}
                </div>

                {(selectedSolve.kind === "inspection" ||
                  selectedSolve.kind === "full") && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Inspection:</span>
                    <span className="font-mono">
                      {formatTime(selectedSolve.inspectionTime, 1)}s
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Scramble</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyScramble(selectedSolve.scramble)}
                    >
                      <HugeiconsIcon icon={Copy01Icon} />
                      {copyFeedback ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                  <p className="rounded-lg bg-secondary p-3 font-mono text-sm leading-relaxed">
                    {selectedSolve.scramble}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground">
                    Penalty:
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={
                        selectedSolve.penalty === "+2" ? "default" : "outline"
                      }
                      onClick={() => {
                        const newPenalty: Penalty =
                          selectedSolve.penalty === "+2" ? "OK" : "+2";
                        updatePenalty(selectedSolve.id, newPenalty);
                        setSelectedSolve({
                          ...selectedSolve,
                          penalty: newPenalty,
                        });
                      }}
                    >
                      <HugeiconsIcon icon={Flag02Icon} />
                      +2
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedSolve.penalty === "DNF" ? "default" : "outline"
                      }
                      theme={
                        selectedSolve.penalty === "DNF" ? "danger" : "default"
                      }
                      onClick={() => {
                        const newPenalty: Penalty =
                          selectedSolve.penalty === "DNF" ? "OK" : "DNF";
                        updatePenalty(selectedSolve.id, newPenalty);
                        setSelectedSolve({
                          ...selectedSolve,
                          penalty: newPenalty,
                        });
                      }}
                    >
                      <HugeiconsIcon icon={UnavailableIcon} />
                      DNF
                    </Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  theme="danger"
                  className="w-full"
                  onClick={() => setDeleteTarget(selectedSolve)}
                >
                  <HugeiconsIcon icon={Delete02Icon} />
                  Delete Solve
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} theme="danger">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
