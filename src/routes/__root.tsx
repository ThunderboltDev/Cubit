/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import appCss from "@/app.css?url";
import { DefaultCatchBoundary } from "@/components/app/catch-boundary";
import { NotFound } from "@/components/app/not-found";
import { Providers } from "@/components/app/providers";
import { seo } from "@/lib/seo";

import "@fontsource-variable/nunito/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no",
      },
      {
        name: "color-scheme",
        content: "dark light",
      },
      ...seo({
        title: "Cubit | Speedcubing Timer",
        description:
          "A fast, beautiful speedcubing timer. Track solves, view statistics, and improve your times.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#0076cc" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
  ssr: false,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>{children}</Providers>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
