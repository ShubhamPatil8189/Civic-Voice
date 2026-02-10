import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // '@' points to src folder
    },
  },
  server: {
    host: true, // allows access from LAN/mobile devices
    port: 8080, // default port
    strictPort: false, // if 8080 is busy, Vite will try next available port
    hmr: {
      overlay: true, // show errors in overlay
    },
  },
});
