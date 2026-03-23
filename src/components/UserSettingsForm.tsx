import { useState, useRef, type ChangeEvent } from "react"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useAppConfig } from "@/hooks/useAppConfig"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemGroup,
  ItemActions,
} from "@/components/ui/item"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import {
  Check,
  Download,
  Upload,
  Trash2,
  Edit2,
  Edit,
  MoveLeft,
  ArrowBigRightDash,
  ChevronRight,
} from "lucide-react"
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

interface TextDataFieldProps {
  value: string
  title: string
  description: string
  onChange: (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void
  inputType: string
  inputId: string
  inputMin: string
  inputMax: string
  inputPlaceholder: string
  inputStep: string
  inputMode:
    | "search"
    | "text"
    | "none"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | undefined
}
function TextDataField({
  value,
  title,
  description,
  onChange,
  inputId,
  inputType,
  inputMin,
  inputMax,
  inputStep,
  inputMode,
  inputPlaceholder,
}: TextDataFieldProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Item variant="muted" className="group cursor-pointer">
          <ItemContent className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <ItemTitle>{title}</ItemTitle>
              <ItemDescription className="hidden sm:block">
                {description}
              </ItemDescription>
            </div>
            <span>{value}</span>
          </ItemContent>
          <ItemActions className="ml-4">
            <ChevronRight className="text-muted-foreground transition-all group-hover:-mr-2 group-hover:ml-2 group-hover:text-foreground group-active:-mr-2 group-active:ml-2 group-active:text-foreground" />
          </ItemActions>
        </Item>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-fit">
        <AlertDialogHeader>
          <div className="flex w-full flex-row items-center justify-center gap-2">
            <Edit className="size-4 text-muted-foreground" />
            <AlertDialogTitle className="text-nowrap">
              Modifica {title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <Input
          id={inputId}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={inputPlaceholder}
          className="h-auto w-full shadow-none focus-visible:ring-0"
          inputMode={inputMode}
          min={inputMin}
          max={inputMax}
          step={inputStep}
        />
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Chiudi</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
            <TextDataField
              inputId="name"
              inputType="text"
              value={name}
              title="Nome"
              description="Il tuo nome da visualizzare"
              onChange={(e) => setName(e.target.value)}
              inputPlaceholder="Il tuo nome"
              inputMin=""
              inputMax=""
              inputMode={undefined}
              inputStep=""
            />
          </ItemGroup>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">
            Tasse
          </h3>
          <ItemGroup>
            <TextDataField
              inputId="taxPercentage"
              inputType="number"
              inputMode="decimal"
              inputStep="any"
              inputMin="0"
              inputMax="100"
              inputPlaceholder="26"
              value={taxPercentage}
              title="Percentuale tasse"
              description="La percentuale di tasse applicata ai profitti"
              onChange={(e) => setTaxPercentage(e.target.value)}
            />
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
