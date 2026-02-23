import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FloatingNav } from "@/components/timer/floating-nav";
import { useTimerStateStore } from "@/stores/timer-state";

export const Route = createFileRoute("/_timer")({
  component: TimerLayout,
});

function TimerLayout() {
  const timerState = useTimerStateStore((s) => s.timerState);
  const navHidden =
    timerState === "running" ||
    timerState === "holding" ||
    timerState === "inspection";

  return (
    <>
      <div className="relative isolate min-h-dvh w-full md:min-h-svh">
        <Outlet />
      </div>
      <FloatingNav hidden={navHidden} />
    </>
  );
}
