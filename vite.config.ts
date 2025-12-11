import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import preload from "vite-plugin-preload";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), preload()],
  // Allow overriding base path for static hosting (e.g., GitHub Pages)
  base: process.env.BASE_URL || "/",
  assetsInclude: ["**/*.sql"],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
