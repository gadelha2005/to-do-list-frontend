import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/auth": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        "/tasks": {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
