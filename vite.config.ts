import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import path from "path";
import { gitDescribeSync } from "git-describe";

const buildTimestamp = new Date().toISOString();
const gitCommitHash = gitDescribeSync().hash;

export default defineConfig({
  define: {
    BUILD_TIME: JSON.stringify(buildTimestamp),
    GIT_HASH: JSON.stringify(gitCommitHash),
  },
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    warmup: {
      clientFiles: ["./src/**/*.vue"],
    },
  },
});
