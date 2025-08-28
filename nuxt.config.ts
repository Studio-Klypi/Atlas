// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

export default defineNuxtConfig({
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxtjs/i18n",
    "shadcn-nuxt",
    "@nuxtjs/google-fonts",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "nuxt-cron",
  ],
  devtools: { enabled: true },
  css: ["./tailwind.css"],
  colorMode: {
    classPrefix: "",
    classSuffix: "",
    preference: "system",
    fallback: "light",
    storageKey: "preferred-color-scheme",
  },
  compatibilityDate: "2025-07-15",
  vite: {
    plugins: [
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "app"),
        "@back": resolve(__dirname, "server"),
        "@components": resolve(__dirname, "app", "components"),
        "@lib": resolve(__dirname, "app", "lib"),
      },
    },
  },
  eslint: {
    checker: true,
    config: {
      stylistic: {
        indent: 2,
        semi: true,
        quotes: "double",
      },
    },
  },
  googleFonts: {
    families: {
      Rubik: "300..900",
    },
  },
  i18n: {
    defaultLocale: "fr",
    locales: [
      {
        code: "fr",
        iso: "fr-FR",
        name: "Français",
        file: "fr.json",
      },
    ],
    strategy: "prefix_except_default",
  },
  pinia: {
    storesDirs: ["./app/stores/**"],
  },
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
});
