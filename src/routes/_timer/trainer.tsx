import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_timer/trainer")({
  component: TrainerPage,
});

function TrainerPage() {
  return <div></div>;
}
