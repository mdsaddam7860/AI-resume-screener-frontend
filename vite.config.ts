import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Proxies /api requests to the backend server during development,
// so the frontend can call relative paths like axios.get("/api/jobs").
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Required for ngrok
    allowedHosts: [
      'noncustodial-araneose-staci.ngrok-free.dev',
      '.ngrok-free.dev', // Allows all ngrok subdomains
      '.ngrok.app' // Also allows .ngrok.app domains
    ],
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});