import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueRouter from "vue-router/vite";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueRouter({ dts: "src/route-map.d.ts" })],
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
  build: {
    rolldownOptions: {
      input: {
        primary: "./index.html",
        secondary: "./secondary.html",
      },
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",

        assetFileNames: ({ names }) => {
          if (/\.(css|ttf)$/.test(names[0])) {
            return "css/[name]-[hash][extname]";
          }

          // default value
          // ref: https://rolldown.rs/reference/OutputOptions.assetFileNames
          return "assets/[name][extname]";
        },
      },
    },
  },
});
