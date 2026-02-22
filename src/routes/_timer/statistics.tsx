import {
	Add01Icon,
	Delete02Icon,
	Edit02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import {
	FieldDescription,
	FieldGroup,
	FieldItem,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
	SheetAction,
	SheetBody,
	SheetCancel,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { usePuzzles } from "@/hooks/use-puzzles";
import { useSettings } from "@/hooks/use-settings";
import { useStatistics } from "@/hooks/use-statistics";
import type { ChartConfig, ChartType } from "@/lib/constants";
import { formatTime } from "@/lib/format-time";
import { useStatisticsViewStore } from "@/stores/statistics-view";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

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
	const [editingChart, setEditingChart] = useState<ChartConfig | "new" | null>(
		null
	);

	const format = (ms: number | null) =>
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
				<PageTitle>Statistics</PageTitle>
				<p className="text-sm text-muted-foreground">
					{solveCount} solve{solveCount !== 1 && "s"} recorded
				</p>
				<Button onClick={() => setEditingChart("new")}>
					<HugeiconsIcon icon={Add01Icon} />
					Add Chart
				</Button>
			</PageHeader>

			<PageBody className="pb-12">
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="space-y-8"
				>
					<div className="space-y-6">
						<AnimatePresence mode="popLayout">
							{charts.map((config) => {
								const rawData = computeChartData(config);
								const firstValidIndex = rawData.findIndex(
									(d) => d.value !== null
								);
								const data =
									firstValidIndex >= 0 ? rawData.slice(firstValidIndex) : [];
								const hasData = data.length > 1;

								return (
									<motion.div
										key={config.id}
										variants={item}
										layout
										exit={{ opacity: 0, scale: 0.95 }}
									>
										<Card className="overflow-hidden transition-colors">
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
														<HugeiconsIcon
															icon={Edit02Icon}
															className="size-4"
														/>
													</Button>
												</div>
											</CardHeader>
											<CardBody>
												{hasData ? (
													<div className="h-[280px] w-full">
														<ResponsiveContainer width="100%" height="100%">
															<LineChart data={data}>
																<CartesianGrid
																	vertical={false}
																	strokeDasharray="4 4"
																	stroke="var(--color-border)"
																	opacity={0.5}
																/>
																<XAxis
																	dataKey="index"
																	tick={{
																		fontSize: 11,
																		fill: "var(--color-muted-foreground)",
																	}}
																	stroke="transparent"
																/>
																<YAxis
																	tickFormatter={(v: number) =>
																		(v / 1000).toFixed(1)
																	}
																	tick={{
																		fontSize: 11,
																		fill: "var(--color-muted-foreground)",
																	}}
																	stroke="transparent"
																	width={45}
																	domain={["auto", "auto"]}
																/>
																<Tooltip
																	cursor={{
																		stroke: "var(--color-accent)",
																		strokeWidth: 2,
																	}}
																	content={({ active, payload, label }) => {
																		if (active && payload && payload.length) {
																			const val = payload[0].value;
																			let valueLabel = "Value";
																			if (config.type === "solves")
																				valueLabel = "Time";
																			else if (config.type === "aon")
																				valueLabel = `Ao${config.n}`;
																			else if (config.type === "mean")
																				valueLabel = `Mo${config.n}`;
																			else if (config.type === "consistency")
																				valueLabel = "SD";
																			else if (config.type === "inspection")
																				valueLabel = "Inspection";
																			else if (config.type === "multiphase")
																				valueLabel = `Phase ${config.phase}`;

																			return (
																				<div className="rounded-xl border border-border bg-muted p-3 shadow-md text-sm min-w-[124px]">
																					<div className="font-semibold mb-2 text-foreground">
																						Solve #{label}
																					</div>
																					<div className="flex justify-between items-center gap-6">
																						<span className="text-muted-foreground">
																							{valueLabel}
																						</span>
																						<span className="font-mono font-bold text-foreground">
																							{val === null
																								? "DNF"
																								: formatTime(val, 2)}
																						</span>
																					</div>
																				</div>
																			);
																		}
																		return null;
																	}}
																/>
																<Line
																	type="monotone"
																	dataKey="value"
																	stroke="var(--color-accent)"
																	strokeWidth={3}
																	dot={false}
																	activeDot={{
																		r: 6,
																		strokeWidth: 0,
																		fill: "var(--color-accent)",
																	}}
																	connectNulls
																	animationDuration={1500}
																/>
															</LineChart>
														</ResponsiveContainer>
													</div>
												) : (
													<div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
														Not enough data to display this chart.
													</div>
												)}
											</CardBody>
										</Card>
									</motion.div>
								);
							})}
						</AnimatePresence>
					</div>

					<div className="space-y-8">
						<motion.h3
							variants={item}
							className="text-xl font-bold tracking-tight"
						>
							Overall Statistics
						</motion.h3>

						<motion.div
							variants={item}
							className="grid grid-cols-2 gap-3 sm:grid-cols-4"
						>
							<StatItem label="Best Single" value={format(stats.bestSingle)} />
							<StatItem
								label="Worst Single"
								value={format(stats.worstSingle)}
							/>
						</motion.div>

						<div className="space-y-4">
							<motion.h4
								variants={item}
								className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
							>
								Average of N
							</motion.h4>
							<motion.div
								variants={item}
								className="grid grid-cols-2 gap-4 sm:grid-cols-3"
							>
								<StatItem
									label="Current Ao5"
									value={format(stats.currentAo5)}
								/>
								<StatItem
									label="Current Ao12"
									value={format(stats.currentAo12)}
								/>
								<StatItem
									label="Current Ao100"
									value={format(stats.currentAo100)}
								/>
								<StatItem label="Best Ao5" value={format(stats.bestAo5)} />
								<StatItem label="Best Ao12" value={format(stats.bestAo12)} />
								<StatItem label="Best Ao100" value={format(stats.bestAo100)} />
							</motion.div>
						</div>

						<div className="space-y-4">
							<motion.h4
								variants={item}
								className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
							>
								Mean of N
							</motion.h4>
							<motion.div
								variants={item}
								className="grid grid-cols-2 gap-4 sm:grid-cols-3"
							>
								<StatItem
									label="Current Mo5"
									value={format(stats.currentMo5)}
								/>
								<StatItem
									label="Current Mo12"
									value={format(stats.currentMo12)}
								/>
								<StatItem
									label="Current Mo100"
									value={format(stats.currentMo100)}
								/>
								<StatItem label="Best Mo5" value={format(stats.bestMo5)} />
								<StatItem label="Best Mo12" value={format(stats.bestMo12)} />
								<StatItem label="Best Mo100" value={format(stats.bestMo100)} />
							</motion.div>
						</div>

						<div className="space-y-4">
							<motion.h4
								variants={item}
								className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
							>
								Consistency (SD)
							</motion.h4>
							<motion.div
								variants={item}
								className="grid grid-cols-2 gap-4 sm:grid-cols-3"
							>
								<StatItem
									label="Current Co5"
									value={format(stats.currentCo5)}
								/>
								<StatItem
									label="Current Co12"
									value={format(stats.currentCo12)}
								/>
								<StatItem
									label="Current Co100"
									value={format(stats.currentCo100)}
								/>
								<StatItem label="Best Co5" value={format(stats.bestCo5)} />
								<StatItem label="Best Co12" value={format(stats.bestCo12)} />
								<StatItem label="Best Co100" value={format(stats.bestCo100)} />
							</motion.div>
						</div>
					</div>
				</motion.div>
			</PageBody>

			<Sheet
				open={!!editingChart}
				onOpenChange={(open) => !open && setEditingChart(null)}
			>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>
							{editingChart === "new" ? "Add Chart" : "Edit Chart"}
						</SheetTitle>
					</SheetHeader>
					<ChartEditor
						initialConfig={
							!editingChart || editingChart === "new"
								? {
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

							setEditingChart(null);
						}}
						onCancel={() => setEditingChart(null)}
						onDelete={() => {
							if (editingChart && editingChart !== "new") {
								removeChart(currentPuzzle.id, editingChart.id);
								setEditingChart(null);
							}
						}}
						puzzleFeatures={{
							inspection: currentPuzzle.inspectionEnabled,
							multiphase: currentPuzzle.multiphaseEnabled,
							phaseCount: currentPuzzle.multiphaseCount,
						}}
					/>
				</SheetContent>
			</Sheet>
		</Page>
	);
}

function StatItem({ label, value }: { label: string; value: string }) {
	return (
		<Card className="group relative overflow-hidden border border-border transition-all">
			<div className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
			<CardBody className="flex flex-col gap-1 p-4">
				<span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
					{label}
				</span>
				<span className="font-mono text-2xl font-bold tracking-tight">
					{value}
				</span>
			</CardBody>
		</Card>
	);
}

function getChartTitle(config: ChartConfig): string {
	switch (config.type) {
		case "solves":
			return `Last ${config.n} Solves`;
		case "aon":
			return `Average of ${config.n}`;
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
	onDelete,
	puzzleFeatures,
}: {
	initialConfig: ChartConfig;
	isNew: boolean;
	onSave: (config: ChartConfig) => void;
	onCancel: () => void;
	onDelete?: () => void;
	puzzleFeatures: {
		inspection: boolean;
		multiphase: boolean;
		phaseCount: number;
	};
}) {
	const [config, setConfig] = useState<ChartConfig>(initialConfig);

	return (
		<>
			<SheetBody>
				<FieldGroup>
					<FieldItem orientation="horizontal">
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
							<SelectContent align="end">
								<SelectItem value="solves">Solves</SelectItem>
								<SelectItem value="aon">Average</SelectItem>
								<SelectItem value="mean">Mean</SelectItem>
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

					<FieldItem orientation="horizontal">
						<div>
							<FieldLabel>Number of Solves to Show</FieldLabel>
							<FieldDescription>
								How many recent solves to display on the chart.
							</FieldDescription>
						</div>
						<Input
							type="number"
							className="ml-auto w-20"
							min={10}
							max={1000}
							value={config.n}
							onChange={(e) => {
								const val = parseInt(e.target.value, 10);
								setConfig((prev) => ({
									...prev,
									n: Number.isNaN(val) ? 0 : val,
								}));
							}}
							onBlur={() => {
								if (!config.n || Number(config.n) < 10) {
									setConfig((prev) => ({ ...prev, n: 10 }));
								}
							}}
						/>
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
									{Array.from({ length: puzzleFeatures.phaseCount }).map(
										(_, i) => (
											<SelectItem
												key={crypto.randomUUID()}
												value={String(i + 1)}
											>
												Phase {i + 1}
											</SelectItem>
										)
									)}
								</SelectContent>
							</Select>
						</FieldItem>
					)}
				</FieldGroup>
			</SheetBody>

			<SheetFooter className="justify-between items-center w-full flex-row">
				{!isNew ? (
					<AlertDialog>
						<AlertDialogTrigger theme="danger">
							<HugeiconsIcon icon={Delete02Icon} /> Delete
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete Chart</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to delete this chart? This cannot be
									undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel />
								<AlertDialogAction onClick={onDelete} theme="danger">
									<HugeiconsIcon icon={Delete02Icon} /> Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				) : (
					<div />
				)}
				<div className="flex gap-2">
					<SheetCancel onClick={onCancel} />
					<SheetAction onClick={() => onSave(config)}>
						{isNew ? "Add Chart" : "Save Changes"}
					</SheetAction>
				</div>
			</SheetFooter>
		</>
	);
}
