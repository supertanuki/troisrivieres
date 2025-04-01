import { defineConfig } from "vite";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [],
  server: {
    host: "0.0.0.0",
    port: 8000,
    fs: {
      strict: false,
    },
  },
  clearScreen: false,
  build: {
    target: "esnext",
    minify: "terser",
    sourcemap: false,
    terserOptions: {
      format: {
        comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
