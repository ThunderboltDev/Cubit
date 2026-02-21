import { createRouter } from "@tanstack/react-router";
import { DefaultCatchBoundary } from "@/components/app/catch-boundary";
import { NotFound } from "@/components/app/not-found";
import { routeTree } from "@/routeTree.gen";

export function getRouter() {
	const router = createRouter({
		routeTree,
		defaultPreload: "intent",
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => <NotFound />,
		scrollRestoration: true,
	});
	return router;
}
