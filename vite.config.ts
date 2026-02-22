import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    port: 3000,
  },
  worker: {
    format: "es",
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
  plugins: [
    nitro(),
    tailwindcss(),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
        onSuccess: ({ page }) => {
          console.log(`[PRERENDER INFO] Rendered : ${page.path}`);
        },
      },
      srcDirectory: "src",
    }),
    viteReact(),
  ],
  ssr: {
    noExternal: ["cubing", "cubing/scramble", "cubing/twisty"],
  },
});
