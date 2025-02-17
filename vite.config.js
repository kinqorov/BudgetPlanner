import { defineConfig } from "vite";

export default defineConfig(({ command, mode, ssrBuild }) => ({
  build: {
    cssMinify: false, // Deactivate esbuild and use cssnano for CSS only
    minify: false,
    assetsDir: ".",
    base: "/"
  },
}));
