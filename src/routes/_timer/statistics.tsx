import {
  Add01Icon,
  Delete02Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldDescription, FieldItem, FieldLabel } from "@/components/ui/field";
import { Page, PageBody, PageHeader, PageTitle } from "@/components/ui/page";
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
import { Slider } from "@/components/ui/slider";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSettings } from "@/hooks/use-settings";
import { useStatistics } from "@/hooks/use-statistics";
import type { ChartConfig, ChartType } from "@/lib/constants";
import { formatTime } from "@/lib/format-time";
import { useStatisticsViewStore } from "@/stores/statistics-view";

export const Route = createFileRoute("/_timer/statistics")({
  component: StatisticsPage,
});

function StatisticsPage() {
  const { currentPuzzle } = usePuzzles();
  const { stats, computeChartData, solveCount } = useStatistics();
  const { settings } = useSettings();
  const { getCharts, addChart, removeChart, updateChart } =
    useStatisticsViewStore();

  const charts = getCharts(currentPuzzle.id);
  const [editingChart, setEditingChart] = useState<ChartConfig | "new">("new");

  const fmt = (ms: number | null) =>
    formatTime(ms, settings.timerPrecision, settings.timeFormat);

  if (solveCount === 0) {
    return (
      <div className="flex h-dvh items-center justify-center text-muted-foreground md:h-svh">
        No solves yet.
      </div>
    );
  }

  return (
    <Page>
      <PageHeader className="flex items-center justify-between">
        <div>
          <PageTitle>Statistics</PageTitle>
          <p className="text-sm text-muted-foreground">
            {solveCount} solve{solveCount !== 1 && "s"} recorded
          </p>
        </div>
        <Button onClick={() => setEditingChart("new")}>
          <HugeiconsIcon icon={Add01Icon} />
          Add Chart
        </Button>
      </PageHeader>

      <PageBody>
        {/* Charts Section */}
        <div className="space-y-6">
          {charts.map((config) => {
            const data = computeChartData(config);
            const hasData =
              data.length > 1 && data.some((d) => d.value !== null);

            return (
              <Card key={config.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    {getChartTitle(config)}
                  </CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingChart(config)}
                    >
                      <HugeiconsIcon icon={Settings01Icon} className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      theme="danger"
                      onClick={() => removeChart(currentPuzzle.id, config.id)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  {hasData ?
                    <div className="h-[280px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border)"
                          />
                          <XAxis
                            dataKey="index"
                            tick={{
                              fontSize: 11,
                              fill: "var(--color-muted-foreground)",
                            }}
                            stroke="var(--color-border)"
                          />
                          <YAxis
                            tickFormatter={(v: number) => (v / 1000).toFixed(1)}
                            tick={{
                              fontSize: 11,
                              fill: "var(--color-muted-foreground)",
                            }}
                            stroke="var(--color-border)"
                            width={45}
                            domain={["auto", "auto"]}
                          />
                          <Tooltip
                            contentStyle={{
                              background: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                              borderRadius: 8,
                              fontSize: 13,
                            }}
                            labelFormatter={(v) => `Solve #${v}`}
                            formatter={(value: number | undefined) => [
                              formatTime(value ?? null, 2),
                            ]}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="var(--color-accent)"
                            strokeWidth={2}
                            dot={false}
                            connectNulls
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  : <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
                      Not enough data to display this chart.
                    </div>
                  }
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Stats Cards Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Overall Statistics</h3>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatItem label="Best Single" value={fmt(stats.bestSingle)} />
            <StatItem label="Worst Single" value={fmt(stats.worstSingle)} />
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Average of N
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatItem label="Current Ao5" value={fmt(stats.currentAo5)} />
              <StatItem label="Current Ao12" value={fmt(stats.currentAo12)} />
              <StatItem label="Current Ao100" value={fmt(stats.currentAo100)} />
              <StatItem label="Best Ao5" value={fmt(stats.bestAo5)} />
              <StatItem label="Best Ao12" value={fmt(stats.bestAo12)} />
              <StatItem label="Best Ao100" value={fmt(stats.bestAo100)} />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Mean of N
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatItem label="Current Mo5" value={fmt(stats.currentMo5)} />
              <StatItem label="Current Mo12" value={fmt(stats.currentMo12)} />
              <StatItem label="Current Mo100" value={fmt(stats.currentMo100)} />
              <StatItem label="Best Mo5" value={fmt(stats.bestMo5)} />
              <StatItem label="Best Mo12" value={fmt(stats.bestMo12)} />
              <StatItem label="Best Mo100" value={fmt(stats.bestMo100)} />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Consistency (SD)
            </h4>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatItem label="Current Co5" value={fmt(stats.currentCo5)} />
              <StatItem label="Current Co12" value={fmt(stats.currentCo12)} />
              <StatItem label="Current Co100" value={fmt(stats.currentCo100)} />
              <StatItem label="Best Co5" value={fmt(stats.bestCo5)} />
              <StatItem label="Best Co12" value={fmt(stats.bestCo12)} />
              <StatItem label="Best Co100" value={fmt(stats.bestCo100)} />
            </div>
          </div>
        </div>
      </PageBody>

      {/* Chart Editor Sheet */}
      <Sheet
        open={!!editingChart}
        onOpenChange={(open) => !open && setEditingChart("new")}
      >
        <SheetContent side="bottom" className="max-h-[90dvh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingChart === "new" ? "Add Chart" : "Edit Chart"}
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-6 pt-4">
            <ChartEditor
              initialConfig={
                editingChart === "new" ?
                  {
                    id: crypto.randomUUID(),
                    type: "solves",
                    n: 50,
                  }
                : editingChart
              }
              isNew={editingChart === "new"}
              onSave={(config) => {
                if (editingChart === "new") {
                  addChart(currentPuzzle.id, config);
                } else if (editingChart) {
                  updateChart(currentPuzzle.id, editingChart.id, config);
                }
                setEditingChart("new");
              }}
              onCancel={() => setEditingChart("new")}
              puzzleFeatures={{
                inspection: currentPuzzle.inspectionEnabled,
                multiphase: currentPuzzle.multiphaseEnabled,
                phaseCount: currentPuzzle.multiphaseCount,
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Page>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardBody className="flex flex-col gap-0.5 p-3">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-lg font-semibold">{value}</span>
      </CardBody>
    </Card>
  );
}

function getChartTitle(config: ChartConfig): string {
  switch (config.type) {
    case "solves":
      return `Last ${config.n} Solves`;
    case "aon":
      return `Start of Ao${config.n}`;
    case "mean":
      return `Mean of ${config.n}`;
    case "consistency":
      return `Consistency (SD) of ${config.n}`;
    case "inspection":
      return `Inspection Time (Last ${config.n})`;
    case "multiphase":
      return `Phase ${config.phase} (Last ${config.n})`;
    default:
      return "Unknown Chart";
  }
}

function ChartEditor({
  initialConfig,
  isNew,
  onSave,
  onCancel,
  puzzleFeatures,
}: {
  initialConfig: ChartConfig;
  isNew: boolean;
  onSave: (config: ChartConfig) => void;
  onCancel: () => void;
  puzzleFeatures: {
    inspection: boolean;
    multiphase: boolean;
    phaseCount: number;
  };
}) {
  const [config, setConfig] = useState<ChartConfig>(initialConfig);

  const showNLimit = ["solves", "inspection", "multiphase"].includes(
    config.type,
  );

  return (
    <div className="space-y-6">
      <FieldItem>
        <FieldLabel>Chart Type</FieldLabel>
        <Select
          value={config.type}
          onValueChange={(v) =>
            setConfig((prev) => ({ ...prev, type: v as ChartType }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solves">Solves</SelectItem>
            <SelectItem value="aon">Average of N (AoN)</SelectItem>
            <SelectItem value="mean">Mean of N (MoN)</SelectItem>
            <SelectItem value="consistency">Consistency (SD)</SelectItem>
            {puzzleFeatures.inspection && (
              <SelectItem value="inspection">Inspection Time</SelectItem>
            )}
            {puzzleFeatures.multiphase && (
              <SelectItem value="multiphase">Phase Time</SelectItem>
            )}
          </SelectContent>
        </Select>
      </FieldItem>

      <FieldItem>
        <FieldLabel>Number of Solves to Show</FieldLabel>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              {config.n}
            </span>
          </div>
          <Slider
            min={2}
            max={showNLimit ? 200 : 100}
            step={1}
            value={config.n}
            onValueChange={(val) => {
              setConfig((prev) => ({
                ...prev,
                n: typeof val === "number" ? val : val[0],
              }));
            }}
          />
        </div>
        <FieldDescription>
          How many recent solves to display on the chart.
        </FieldDescription>
      </FieldItem>

      {config.type === "multiphase" && (
        <FieldItem>
          <FieldLabel>Phase Number</FieldLabel>
          <Select
            value={String(config.phase ?? 1)}
            onValueChange={(v) =>
              setConfig((prev) => ({ ...prev, phase: Number(v) }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: puzzleFeatures.phaseCount }).map((_, i) => (
                <SelectItem key={crypto.randomUUID()} value={String(i + 1)}>
                  Phase {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldItem>
      )}

      <div className="flex gap-3 pt-4">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={() => onSave(config)}>
          {isNew ? "Add Chart" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
