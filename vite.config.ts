import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  base: "/Netto/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "masked-icon.svg",
        "apple-touch-icon-180x180.png",
        "maskable-icon-512x512.png",
        "icon.svg",
        "pwa-64x64.png",
        "pwa-192x192.png",
        "pwa-512x512.png",
        "splash-screen.png",
        "logotype.svg",
      ],
      manifest: {
        name: "Netto - effective ETFs & Stock tracker",
        short_name: "Netto",
        description: "Traccia i tuoi investimenti in ETF e Stock",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/Netto",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "splash-screen.png",
            sizes: "390x844",
            type: "image/png",
          },
          {
            src: "logotype.svg",
            sizes: "390x844",
            type: "image/svg",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/query2\.finance\.yahoo\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "yahoo-finance-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 600,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
