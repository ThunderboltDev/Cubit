import {
  Add01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  ViewIcon,
  ViewOffIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PuzzleIcon } from "@/components/puzzle/icon";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { FieldItem } from "@/components/ui/field";
import { Page, PageBody, PageHeader, PageTitle } from "@/components/ui/page";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { usePuzzles } from "@/hooks/use-puzzles";
import {
  DEFAULT_DISPLAY_STATS,
  PUZZLE_TYPES,
  WCA_PRESETS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { InputMethod, Puzzle, PuzzleType } from "@/types/puzzles";

export const Route = createFileRoute("/puzzles/new")({
  component: NewPuzzlePage,
});

function NewPuzzlePage() {
  const navigate = useNavigate();
  const { createPuzzle, switchPuzzle } = usePuzzles();
  const [mode, setMode] = useState<"presets" | "custom">("presets");

  const handleCreate = (puzzleData: Omit<Puzzle, "id">) => {
    createPuzzle(puzzleData);
    navigate({ to: "/" });
  };

  return (
    <Page>
      <PageHeader className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/" })}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} />
        </Button>
        <PageTitle>New Puzzle</PageTitle>
      </PageHeader>

      <PageBody>
        {mode === "presets" ?
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {WCA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    handleCreate({
                      ...preset,
                      name: preset.name ?? "New Puzzle",
                      type: preset.type ?? "333",
                      inspectionEnabled: preset.inspectionEnabled ?? true,
                      inspectionDuration: preset.inspectionDuration ?? 15,
                      multiphaseEnabled: false,
                      multiphaseCount: 0,
                      inputMethod: "timer",
                      scramblePreview: true,
                      scramblePreviewVisualization: "3D",
                      displayStats: DEFAULT_DISPLAY_STATS,
                      trimPercentage: preset.trimPercentage ?? 5,
                    })
                  }
                  className="group relative flex flex-col items-center gap-3 rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:border-primary hover:shadow-md"
                >
                  <PuzzleIcon puzzleType={"222"} />
                  <span className="font-semibold">{preset.name}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                className="gap-2"
                onClick={() => setMode("custom")}
              >
                <HugeiconsIcon icon={Add01Icon} />
                Create Custom Puzzle
              </Button>
            </div>
          </div>
        : <div className="mx-auto max-w-lg space-y-6">
            <CustomPuzzleForm
              onSubmit={handleCreate}
              onCancel={() => setMode("presets")}
            />
          </div>
        }
      </PageBody>
    </Page>
  );
}

function CustomPuzzleForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: Omit<Puzzle, "id">) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<PuzzleType>("333");
  const [inspectionEnabled, setInspectionEnabled] = useState(true);
  const [inspectionDuration, setInspectionDuration] = useState(15);
  const [blindfoldMode, setBlindfoldMode] = useState(false);
  const [multiphaseEnabled, setMultiphaseEnabled] = useState(false);
  const [multiphaseCount, setMultiphaseCount] = useState(2);
  const [trimPercentage, setTrimPercentage] = useState(5);
  const [scramblePreview, setScramblePreview] = useState(true);
  const [inputMethod, setInputMethod] = useState<InputMethod>("timer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: name.trim() || type,
      type,
      inspectionEnabled,
      inspectionDuration,
      multiphaseEnabled,
      multiphaseCount: multiphaseEnabled ? multiphaseCount : 0,
      trimPercentage,
      inputMethod,
      scramblePreview,
      scramblePreviewVisualization: "3D",
      displayStats: DEFAULT_DISPLAY_STATS,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardBody className="space-y-6 p-6">
          <FieldItem>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Puzzle"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </FieldItem>

          <FieldItem>
            <Select
              value={type}
              onValueChange={(v) => setType(v as PuzzleType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PUZZLE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldItem>

          {!blindfoldMode && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Inspection</label>
                  <p className="text-xs text-muted-foreground">
                    Standard WCA inspection is 15s
                  </p>
                </div>
                <Switch
                  checked={inspectionEnabled}
                  onCheckedChange={setInspectionEnabled}
                />
              </div>

              {inspectionEnabled && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Duration
                    </span>
                    <span className="text-xs font-mono">
                      {inspectionDuration}s
                    </span>
                  </div>
                  <Slider
                    value={[inspectionDuration]}
                    onValueChange={([v]) => setInspectionDuration(v)}
                    min={0}
                    max={60}
                    step={1}
                  />
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium">Multiphase</label>
                <p className="text-xs text-muted-foreground">
                  Track splits for different phases
                </p>
              </div>
              <Switch
                checked={multiphaseEnabled}
                onCheckedChange={setMultiphaseEnabled}
              />
            </div>

            {multiphaseEnabled && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">
                    Number of Phases
                  </span>
                  <span className="text-xs font-mono">{multiphaseCount}</span>
                </div>
                <Slider
                  value={[multiphaseCount]}
                  onValueChange={([v]) => setMultiphaseCount(v)}
                  min={2}
                  max={10}
                  step={1}
                />
              </div>
            )}
          </div>

          <FieldItem
          // label="Trim Percentage"
          // description="Percentage of best/worst solves to exclude from averages (default 5%)"
          >
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-xs font-mono">{trimPercentage}%</span>
              </div>
              <Slider
                value={[trimPercentage]}
                onValueChange={([v]) => setTrimPercentage(v)}
                min={0}
                max={20}
                step={1}
              />
            </div>
          </FieldItem>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Scramble Preview</label>
            </div>
            <Switch
              checked={scramblePreview}
              onCheckedChange={setScramblePreview}
            />
          </div>

          <FieldItem>
            <Select
              value={inputMethod}
              onValueChange={(v) => setInputMethod(v as InputMethod)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timer">Timer (Spacebar / Touch)</SelectItem>
                <SelectItem value="typing">Manual Entry</SelectItem>
                <SelectItem value="stackmat">Stackmat (Microphone)</SelectItem>
              </SelectContent>
            </Select>
          </FieldItem>
        </CardBody>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" className="flex-1">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} />
          Create Puzzle
        </Button>
      </div>
    </form>
  );
}
