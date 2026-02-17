import { formatTime } from "@/lib/format-time";
import type { Stat, StatStyle } from "@/types/stats";

interface StatCardProps {
  stat: Stat;
  style: StatStyle;
}

export function StatCard({ stat, style }: StatCardProps) {
  if (style === "lines") {
    return (
      <div className="flex flex-row items-center justify-between py-2">
        <span className="text-sm font-medium text-foreground">
          {stat.label}:
        </span>
        <span className="font-mono font-semibold text-foreground">
          {formatTime(stat.value)}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl min-w-[80px] flex-1 bg-secondary p-3">
      <span className="uppercase tracking-wide text-muted-foreground text-xs mb-1">
        {stat.label}
      </span>
      <span className="font-mono font-semibold truncate text-sm">
        {formatTime(stat.value)}
      </span>
    </div>
  );
}
