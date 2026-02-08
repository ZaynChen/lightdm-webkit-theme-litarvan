import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vueRouter from "unplugin-vue-router/vite";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vueRouter(), vue()],
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
        primary: fileURLToPath(new URL("./index.html", import.meta.url)),
        secondary: fileURLToPath(new URL("./secondary.html", import.meta.url)),
      },
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",

        // images to assets dir
        // js to js dir
        // css, ttf to css dir
        // default to assets dir
        assetFileNames: ({ name }) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? "")) {
            return "assets/[name]-[hash][extname]";
          }

          if (/\.(css|ttf)$/.test(name ?? "")) {
            return "css/[name]-[hash][extname]";
          }

          // default value
          // ref: https://rolldown.rs/reference/OutputOptions.assetFileNames
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
