import { defineConfig } from "vite";

import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  publicDir: "../Data",
  server: {
    proxy: {
      "/api": "http://localhost:6969/"
    }
  }
})
