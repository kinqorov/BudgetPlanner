import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode, ssrBuild }) => ({
  build: {
    cssMinify: false, // Deactivate esbuild and use cssnano for CSS only
    minify: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        signin: resolve(__dirname, "signin.html"),
      },
    },
    target: "esnext",
  },
  base: "/BudgetPlanner/",
}));
