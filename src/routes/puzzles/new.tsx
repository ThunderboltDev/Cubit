import { Add01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PuzzleIcon } from "@/components/puzzle/icon";
import { SettingsItem, SettingsSection } from "@/components/timer/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  PUZZLE_LABELS,
  PUZZLE_TYPES,
  WCA_PRESETS,
} from "@/lib/constants";
import type { InputMethod, Puzzle, PuzzleType } from "@/types/puzzles";

export const Route = createFileRoute("/puzzles/new")({
  component: NewPuzzlePage,
});

function NewPuzzlePage() {
  const navigate = useNavigate();
  const { createPuzzle } = usePuzzles();
  const [mode, setMode] = useState<"presets" | "custom">("presets");

  const handleCreate = (puzzleData: Omit<Puzzle, "id">) => {
    createPuzzle(puzzleData);
    navigate({ to: "/" });
  };

  return (
    <Page showNavHeader>
      <PageHeader>
        <PageTitle>New Puzzle</PageTitle>
      </PageHeader>

      <PageBody>
        {mode === "presets" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {WCA_PRESETS.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
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
                    } as Puzzle)
                  }
                  className="group h-auto relative flex flex-col items-center rounded-xl p-6 text-center shadow-md hover:shadow-lg active:scale-98 origin-bottom"
                >
                  <div className="relative flex items-center justify-center group-hover:scale-110 duration-200 transition-transform delay-75">
                    <PuzzleIcon puzzleType={preset.type ?? "333"} size={72} />
                  </div>
                  <span className="font-medium text-base md:text-lg text-foreground">
                    {preset.name}
                  </span>
                </Button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button variant="accent" onClick={() => setMode("custom")}>
                <HugeiconsIcon icon={Add01Icon} />
                Create Custom Puzzle
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-lg space-y-6">
            <CustomPuzzleForm
              onSubmit={handleCreate}
              onCancel={() => setMode("presets")}
            />
          </div>
        )}
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <SettingsSection title="General Settings">
        <SettingsItem label="Name" description="A unique name for this puzzle.">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={PUZZLE_LABELS[type]}
            className="w-full sm:w-64"
          />
        </SettingsItem>

        <SettingsItem
          label="Puzzle Type"
          description="Select the puzzle type for logic and scrambles."
        >
          <Select value={type} onValueChange={(v) => setType(v as PuzzleType)}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PUZZLE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {PUZZLE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsItem>

        <SettingsItem
          label="Input Method"
          description="How you would like to enter your times."
        >
          <Select
            value={inputMethod}
            onValueChange={(v) => setInputMethod(v as InputMethod)}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timer">Timer (Spacebar / Touch)</SelectItem>
              <SelectItem value="typing">Manual Entry</SelectItem>
              <SelectItem value="stackmat">Stackmat (Microphone)</SelectItem>
            </SelectContent>
          </Select>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Timer & Inspection">
        <SettingsItem
          label="Inspection"
          description="Enable standard WCA-style inspection."
        >
          <Switch
            checked={inspectionEnabled}
            onCheckedChange={setInspectionEnabled}
          />
        </SettingsItem>

        <SettingsItem
          label="Inspection Duration"
          description={`${inspectionDuration} seconds`}
          orientation="vertical"
          disabled={!inspectionEnabled}
        >
          <Slider
            value={[inspectionDuration]}
            onValueChange={(v) =>
              setInspectionDuration(typeof v === "number" ? v : v[0])
            }
            min={0}
            max={60}
            step={1}
          />
        </SettingsItem>

        <SettingsItem
          label="Multiphase"
          description="Split your solve into multiple steps."
        >
          <Switch
            checked={multiphaseEnabled}
            onCheckedChange={setMultiphaseEnabled}
          />
        </SettingsItem>

        {multiphaseEnabled && (
          <SettingsItem
            label="Number of Phases"
            description={`${multiphaseCount} phases`}
            orientation="vertical"
          >
            <Slider
              value={[multiphaseCount]}
              onValueChange={(v) =>
                setMultiphaseCount(typeof v === "number" ? v : v[0])
              }
              min={2}
              max={10}
              step={1}
            />
          </SettingsItem>
        )}
      </SettingsSection>

      <SettingsSection title="Statistics & Averages">
        <SettingsItem
          label="Trim Percentage"
          description="Percentage of best/worst solves to exclude from AoN."
          orientation="vertical"
        >
          <div className="flex flex-col gap-3">
            <span className="text-xs font-mono text-muted-foreground self-end">
              {trimPercentage}%
            </span>
            <Slider
              value={[trimPercentage]}
              onValueChange={(v) =>
                setTrimPercentage(typeof v === "number" ? v : v[0])
              }
              min={0}
              max={20}
              step={1}
            />
          </div>
        </SettingsItem>
      </SettingsSection>

      <SettingsSection title="Visuals">
        <SettingsItem
          label="Scramble Preview"
          description="Show a 2D or 3D visualization of the scramble."
        >
          <Switch
            checked={scramblePreview}
            onCheckedChange={setScramblePreview}
          />
        </SettingsItem>
      </SettingsSection>

      <div className="flex gap-3 pt-4">
        <Button type="button" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="accent" type="submit" className="flex-1">
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
          Create Puzzle
        </Button>
      </div>
    </form>
  );
}
