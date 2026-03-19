# Portafoglio Investimenti

Applicazione web per tracciare investimenti in ETF e Stock. PWA (Progressive Web App) installabile su dispositivi mobile.

## Caratteristiche

- 📊 Tracciamento investimenti in tempo reale
- 💰 Calcolo automatico di guadagni/perdite
- 📱 PWA installabile su iOS e Android
- 💾 Dati salvati in localStorage
- 🔄 Cache delle quotazioni Yahoo Finance
- 🌙 UI moderna stile banking/crypto app

## Sviluppo

```bash
npm install
npm run dev
```

## Comandi disponibili

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Compila per la produzione |
| `npm run preview` | Anteprima build produzione |
| `npm run lint` | Esegue ESLint |
| `npm run format` | Formatta il codice con Prettier |
| `npm run typecheck` | Controlla i tipi TypeScript |
| `npm run deploy` | Build e deploy su GitHub Pages |

## Deploy su GitHub Pages

### Configurazione iniziale

1. **Modifica `package.json`**:
   ```json
   {
     "homepage": "https://<tuo-username>.github.io/<nome-repository>"
   }
   ```

2. **Crea la repository su GitHub** (se non esiste)

3. **Abilita GitHub Pages**:
   - Vai su Settings → Pages
   - In "Source", seleziona "GitHub Actions"

### Deploy manuale

```bash
# Aggiorna il base path in vite.config.ts o usa variabile d'ambiente
VITE_BASE_PATH=/<nome-repository>/ npm run deploy
```

### Deploy automatico (CI/CD)

Il progetto include un workflow GitHub Actions che deploya automaticamente ad ogni push su `main`.

1. Assicurati che la repository abbia i permessi per GitHub Pages
2. Fai push su `main`
3. GitHub Actions buildherà e deployherà automaticamente

L'URL sarà: `https://<tuo-username>.github.io/<nome-repository>/`

## Struttura del progetto

```
src/
├── components/          # Componenti React
│   ├── ui/             # Componenti shadcn/ui
│   └── customized/     # Componenti personalizzati
├── hooks/              # Custom React hooks
│   ├── useInvestments.ts
│   └── useStockPrice.ts
├── types/              # Tipi TypeScript
│   └── investment.ts
├── lib/                # Utility e funzioni helper
└── App.tsx             # Componente principale
```

## Tecnologie

- **React 19** - Framework UI
- **TypeScript** - Tipizzazione statica
- **Vite** - Build tool
- **shadcn/ui** - Componenti UI
- **Tailwind CSS 4** - Styling
- **Radix UI** - Primitive accessibili
- **Yahoo Finance API** - Quotazioni in tempo reale
- **vite-plugin-pwa** - Supporto PWA

## Licenza

MIT
