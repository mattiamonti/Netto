import { Plus } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { Investment } from "@/types/investment"
import { getCachedPrice } from "@/hooks/useStockPrice"

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

interface TotalValueCardProps {
  investments: Investment[]
}

export default function TotalPanicSellSection({
  investments,
}: TotalValueCardProps) {
  const { total: totalPrice, invested: totalInvested } =
    calculateTotalValue(investments)

  const grossProfit =
    totalInvested && totalPrice ? totalPrice - totalInvested : null
  let netProfit = 0
  if (grossProfit && grossProfit > 0) {
    netProfit = grossProfit - grossProfit * 0.26
  } else {
    netProfit = grossProfit
  }
  const capital = totalInvested + netProfit
  const percentage =
    totalInvested && netProfit ? (netProfit / totalInvested) * 100 : null

  return (
    <Collapsible className="w-full space-y-2">
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:underline">
        <Plus className="h-4 w-4" />
        Simulazione vendita totale
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <Card className="w-full max-w-2xl shadow-none">
          <CardHeader className="px-8">
            <CardDescription className="text-md max-w-lg text-left text-muted-foreground md:text-lg">
              Guadagno dalla vendita immediata
            </CardDescription>
          </CardHeader>
          <CardContent className="mx-auto -mt-4 flex flex-col px-8">
            <CardTitle className="text-3xl font-medium tracking-tight md:text-4xl">
              <span className="text-lg text-muted-foreground md:text-xl">
                €{" "}
              </span>
              {capital !== null ? capital.toFixed(2) : "0.00"}
            </CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-lg text-xl text-muted-foreground">
              <GainAndLossBadge profit={netProfit} percentage={percentage} />
            </CardDescription>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
