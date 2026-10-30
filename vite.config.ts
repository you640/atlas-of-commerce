import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api/proxy-search": {
        target: "http://2.29.52.59:3010",
        changeOrigin: true,
        timeout: 12_000,
        proxyTimeout: 12_000,
        rewrite: (path) => path.replace(/^\/api\/proxy-search/, "/api/company/proxy-search"),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
