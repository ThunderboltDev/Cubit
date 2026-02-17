import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FloatingNav } from "@/components/timer/floating-nav";

export const Route = createFileRoute("/_timer")({
  component: TimerLayout,
});

function TimerLayout() {
  return (
    <>
      <div className="relative isolate min-h-dvh w-full md:min-h-svh">
        <Outlet />
      </div>
      <FloatingNav />
    </>
  );
}
