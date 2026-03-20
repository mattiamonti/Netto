import { useState } from "react"
import { useUserSettings } from "@/hooks/useUserSettings"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemGroup,
} from "@/components/ui/item"
import { Check } from "lucide-react"
import { Button } from "./ui/button"

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
    </div>
  )
}
