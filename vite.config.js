import { defineConfig } from "vite";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [],
  server: { host: "0.0.0.0", port: 8000 },
  clearScreen: false,
  build: {
    minify: "terser", // Utiliser Terser au lieu d'esbuild
    terserOptions: {
      format: {
        comments: false, // Supprime tous les commentaires
      },
      compress: {
        drop_console: true, // Optionnel : Supprime les console.log
        drop_debugger: true, // Supprime les debugger;
      },
    },
  },
});
