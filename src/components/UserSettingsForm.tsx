import { useState } from "react"
import { useUserSettings } from "@/hooks/useUserSettings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

export default function UserSettingsForm() {
  const { settings, updateSettings } = useUserSettings()
  const [name, setName] = useState(settings.name)
  const [taxPercentage, setTaxPercentage] = useState(
    settings.taxPercentage.toString()
  )
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tax = parseFloat(taxPercentage)
    if (isNaN(tax) || tax < 0 || tax > 100) {
      return
    }

    updateSettings({
      name: name.trim(),
      taxPercentage: tax,
    })

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Il tuo nome"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="taxPercentage">
          Percentuale Tasse sui Profitti (%)
        </Label>
        <Input
          id="taxPercentage"
          type="number"
          inputMode="decimal"
          step="any"
          min="0"
          max="100"
          value={taxPercentage}
          onChange={(e) => setTaxPercentage(e.target.value)}
          placeholder="Es. 26"
          pattern="[0-9]*"
        />
      </div>

      <Button type="submit" className="mt-2">
        {isSaved ? (
          <>
            <Check className="mr-2 h-4 w-4" />
            Salvato!
          </>
        ) : (
          "Salva impostazioni"
        )}
      </Button>
    </form>
  )
}
