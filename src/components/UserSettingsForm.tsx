import { useState, useRef } from "react"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useAppConfig } from "@/hooks/useAppConfig"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemGroup,
} from "@/components/ui/item"
import { Check, Download, Upload, Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import type { AppConfigData } from "@/hooks/useAppConfig"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface SettingSwitchProps {
  label: string
  description: string
  id: string
  checked: boolean
  onSwitch: (val: boolean) => void
}
function SettingSwitch({
  label,
  description,
  id,
  checked,
  onSwitch,
}: SettingSwitchProps) {
  return (
    <div className="flex min-w-full items-center justify-between gap-4">
      <div className="flex flex-col gap-1">
        <Label htmlFor="notifications">{label}</Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onSwitch} />
    </div>
  )
}

export default function UserSettingsForm() {
  const { settings, updateSettings } = useUserSettings()
  const { exportConfig, importConfig } = useAppConfig()
  const [name, setName] = useState(settings.name)
  const [anonymousData, setAnonymousData] = useState(settings.anonymousData)
  const [taxPercentage, setTaxPercentage] = useState(
    settings.taxPercentage.toString()
  )
  const [isSaved, setIsSaved] = useState(false)
  const [importStatus, setImportStatus] = useState<
    "idle" | "success" | "error"
  >("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tax = parseFloat(taxPercentage)
    if (isNaN(tax) || tax < 0 || tax > 100) {
      return
    }

    updateSettings({
      name: name.trim(),
      taxPercentage: tax,
      anonymousData: anonymousData,
    })

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleExport = () => {
    const config = exportConfig()
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `portafoglio-config-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const config = JSON.parse(
          event.target?.result as string
        ) as AppConfigData
        const success = importConfig(config)
        setImportStatus(success ? "success" : "error")
        setTimeout(() => setImportStatus("idle"), 2000)
        if (success) {
          window.location.reload()
        }
      } catch {
        setImportStatus("error")
        setTimeout(() => setImportStatus("idle"), 2000)
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const handleReset = () => {
    if (
      confirm(
        "Sei sicuro di voler eliminare tutti i dati? Questa azione non può essere annullata."
      )
    ) {
      localStorage.removeItem("investments_data")
      localStorage.removeItem("user_settings")
      window.location.reload()
    }
  }

  //TODO mettere gli input testuali in modo che venga visualizzato il valore,
  // quando premo l'impostazione es. nome viene aperto un alert dove posso inserire / modificare il nome
  // e salvare la scelta (quindi lìinput sta nell'alert)
  // quando salvo la scelta l'alert si chiude e viene passato al campo il nuovo valore tramite setName per esempio
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold">Impostazioni</h2>
        <p className="text-sm text-muted-foreground">Configura la tua app.</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">
            Profilo
          </h3>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <ItemTitle>Nome</ItemTitle>
                  <ItemDescription className="hidden sm:block">
                    Il tuo nome da visualizzare
                  </ItemDescription>
                </div>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Il tuo nome"
                  className="h-auto w-fit text-right shadow-none focus-visible:ring-0"
                />
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">
            Tasse
          </h3>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <ItemTitle>Percentuale Tasse sui Profitti</ItemTitle>
                  <ItemDescription className="hidden sm:block">
                    La percentuale di tasse applicata sui guadagni
                  </ItemDescription>
                </div>
                <Input
                  id="taxPercentage"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  min="0"
                  max="100"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(e.target.value)}
                  placeholder="26"
                  className="h-fit w-fit text-right shadow-none focus-visible:ring-0"
                />
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">
            Dati
          </h3>
          <ItemGroup>
            <Item variant="muted">
              <ItemContent className="flex flex-row items-center justify-between">
                <SettingSwitch
                  id="anonymousData"
                  label="Dati anonimi"
                  description="Attiva l'anonimizzazione dei dati, così non vengono mostrate le tue cifre."
                  checked={anonymousData}
                  onSwitch={(val) => setAnonymousData(val)}
                />
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>

        <Button type="submit">
          {isSaved ? (
            <>
              <Check className="h-4 w-4" />
              Salvato!
            </>
          ) : (
            "Salva impostazioni"
          )}
        </Button>
      </form>

      <div className="my-16 flex flex-col gap-2">
        <h3 className="px-1 text-sm font-medium text-muted-foreground">Dati</h3>
        <ItemGroup>
          <Item variant="muted" asChild>
            <button onClick={handleExport} type="button">
              <ItemContent className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <ItemTitle>Esporta configurazione</ItemTitle>
                  <ItemDescription>
                    Scarica tutti i dati in formato JSON
                  </ItemDescription>
                </div>
                <Download className="h-5 w-5 text-muted-foreground" />
              </ItemContent>
            </button>
          </Item>

          <Item variant="muted" asChild>
            <button onClick={handleImportClick} type="button">
              <ItemContent className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <ItemTitle>Importa configurazione</ItemTitle>
                  <ItemDescription>
                    Carica un file di configurazione
                  </ItemDescription>
                </div>
                <Upload className="h-5 w-5 text-muted-foreground" />
              </ItemContent>
            </button>
          </Item>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          <Item variant="muted" asChild>
            <button onClick={handleReset} type="button">
              <ItemContent className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <ItemTitle className="text-destructive">
                    Elimina tutti i dati
                  </ItemTitle>
                  <ItemDescription>
                    Resetta l'app ai valori predefiniti
                  </ItemDescription>
                </div>
                <Trash2 className="h-5 w-5 text-destructive" />
              </ItemContent>
            </button>
          </Item>
        </ItemGroup>

        {importStatus === "success" && (
          <p className="px-1 text-sm text-green-600">
            Configurazione importata con successo!
          </p>
        )}
        {importStatus === "error" && (
          <p className="px-1 text-sm text-destructive">
            Errore durante l'importazione del file
          </p>
        )}
      </div>
    </div>
  )
}
