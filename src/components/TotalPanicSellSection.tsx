import { Minus, Plus, TriangleAlert } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { Investment } from "@/types/investment"
import { getCachedPrice } from "@/hooks/useStockPrice"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { useUserSettings } from "@/hooks/useUserSettings"
import { AnimatedList } from "@/components/ui/animated-list"

function calculateTotalValue(investments: Investment[]) {
  let total = 0
  let invested = 0

  investments.forEach((investment) => {
    const cachedPrice = getCachedPrice(investment.ticker)
    if (cachedPrice) {
      total += cachedPrice * investment.quantity
      invested += investment.priceBought * investment.quantity
    }
  })

  return { total, invested }
}
interface StatItemProps {
  label: string
  value: string
}
function StatItem({ label, value }: StatItemProps) {
  return (
    <span className="flex flex-row justify-between">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </span>
  )
}

interface TotalValueCardProps {
  investments: Investment[]
}

export default function TotalPanicSellSection({
  investments,
}: TotalValueCardProps) {
  const [sectionOpen, setSectionOpen] = useState<boolean>(false)
  const { total: totalPrice, invested: totalInvested } =
    calculateTotalValue(investments)
  const { settings } = useUserSettings()

  const grossProfit = totalPrice - totalInvested
  let netProfit = 0
  if (grossProfit > 0) {
    netProfit = grossProfit - grossProfit * (settings.taxPercentage / 100)
  } else {
    netProfit = grossProfit
  }
  const capital = totalInvested + netProfit
  const percentage = totalInvested ? (netProfit / totalInvested) * 100 : 0

  return (
    <Collapsible className="w-full space-y-2">
      <CollapsibleTrigger>
        <div
          className="flex items-center gap-2 text-sm font-medium hover:underline"
          onClick={() => setSectionOpen(!sectionOpen)}
        >
          {sectionOpen ? (
            <Minus className="h-4 w-4" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Simulazione vendita immediata
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <AnimatedList delay={200}>
          <Alert className="text-warning w-full border-yellow-200/60 bg-yellow-200/10">
            <AlertTitle className="flex flex-row items-center gap-2 font-semibold text-yellow-200/80">
              <TriangleAlert size={16} />
              Simulazione vendita immediata
            </AlertTitle>
            <AlertDescription className="flex flex-col gap-2 text-muted-foreground">
              <span>Di tutti gli strumenti, al netto delle tasse.</span>
              <Separator />
              <StatItem
                label={`Tasse (${settings.taxPercentage}%)`}
                value={`-${(grossProfit - netProfit).toFixed(2)} €`}
              />
              <StatItem
                label="Guadagno netto"
                value={`${netProfit.toFixed(2)} €`}
              />
              <Separator />
              <span className="text-lg">
                <StatItem
                  label="Totale"
                  value={`${capital !== null ? capital.toFixed(2) : "0.00"} € ( ${percentage.toFixed(2)}%)`}
                />
              </span>
            </AlertDescription>
          </Alert>
        </AnimatedList>
      </CollapsibleContent>
    </Collapsible>
  )
}
