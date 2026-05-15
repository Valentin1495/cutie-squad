import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "cutie-squad",
  brand: {
    displayName: "귀요미 응원단",
    primaryColor: "#9575CD",
    icon: "",
  },
  web: {
    host: "192.168.0.225",
    port: 5173,
    commands: {
      dev: "vite dev --host 0.0.0.0",
      build: "vite build",
    },
  },
  permissions: [],
  outdir: "dist",
});
