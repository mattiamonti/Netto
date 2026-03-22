import {
  defineConfig,
  minimal2023Preset as preset,
} from "@vite-pwa/assets-generator/config"

export default defineConfig({
  head: true, // Importante: genera i tag <link> da copiare in index.html
  preset,
  images: [
    "public/icon.svg", // Il tuo file sorgente ad alta risoluzione
  ],
  assetName: (type, size) => {
    // Opzionale: personalizza il nome dei file generati
    return `pwa-${size.width}x${size.height}.png`
  },
  // Configurazione specifica per le Splash Screen
  appleSplashScreens: {
    padding: 0.3, // Spazio intorno al logo (0.3 = 30%)
    resizeOptions: { background: "#ffffff", fit: "contain" },
    // Colore di sfondo per iOS (deve essere lo stesso del tuo CSS)
    darkResizeOptions: { background: "#1a1a1a", fit: "contain" },
  },
})
