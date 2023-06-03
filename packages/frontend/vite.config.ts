import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import pluginRewriteAll from "vite-plugin-rewrite-all";

const pwaConfig = VitePWA({
  registerType: "autoUpdate",
  base: "/",
  srcDir: "src",
  filename: "sw.ts",
  outDir: "dist",
  strategies: "injectManifest",
  manifest: {
    name: "chat-app",
    short_name: "chat",
    description: "Chat app maid with Vue.js 3 and Typescript",
    start_url: "/",
    display: "standalone",
    theme_color: "white",
    icons: [
      {
        src: "icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "icons/manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), pluginRewriteAll(), pwaConfig],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
