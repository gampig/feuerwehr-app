import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { gitDescribeSync } from "git-describe";

const buildTimestamp = new Date().toISOString();
const gitCommitHash = gitDescribeSync().hash;

export default defineConfig({
  define: {
    BUILD_TIME: JSON.stringify(buildTimestamp),
    GIT_HASH: JSON.stringify(gitCommitHash),
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    vueDevTools(),
    VitePWA({
      filename: "service-worker.js",
      registerType: "prompt",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },

      manifest: {
        name: "FeuerwehrApp",
        short_name: "FeuerwehrApp",
        description: "FeuerwehrApp",
        theme_color: "#ba000d",
        lang: "de",

        icons: [
          {
            src: "./img/icons/192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./img/icons/512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "./img/icons/maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "./img/icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    }),
  ],
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
