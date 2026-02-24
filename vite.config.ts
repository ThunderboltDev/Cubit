import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
  ],
  worker: {
    format: "es",
  },
  optimizeDeps: {
    exclude: ["cubing"],
  },
  build: {
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 0,
        entryFileNames: (chunk) => {
          if (chunk.name.includes("search-worker-entry")) {
            return "assets/search-worker-entry.js";
          }
          return "assets/[name]-[hash].js";
        },
      },
    },
  },
});

export default config;
