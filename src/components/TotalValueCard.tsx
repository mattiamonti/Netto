import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import type { Investment } from "@/types/investment"
import { getCachedPrice } from "@/hooks/useStockPrice"
import { useUserSettings } from "@/hooks/useUserSettings"

interface TotalValueCardProps {
  investments: Investment[]
}

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

export default function TotalValueCard({ investments }: TotalValueCardProps) {
  const { settings } = useUserSettings()
  const { total: totalPrice, invested: totalInvested } =
    calculateTotalValue(investments)

  const grossProfit =
    totalInvested && totalPrice ? totalPrice - totalInvested : null
  const percentage =
    totalInvested && grossProfit ? (grossProfit / totalInvested) * 100 : null

  return (
    <Card className="w-full max-w-2xl shadow-none">
      <CardHeader className="px-8">
        <CardDescription className="hidden max-w-lg text-left text-lg text-muted-foreground">
          Buongiorno, Mattia
        </CardDescription>
      </CardHeader>
      <CardContent className="mx-auto flex flex-col px-8">
        <CardTitle className="relative text-5xl font-medium tracking-tight md:text-6xl">
          <span className="text-2xl text-muted-foreground md:text-3xl">€ </span>
          {!settings.anonymousData && totalPrice !== null
            ? totalPrice.toFixed(2)
            : "0.00"}
        </CardTitle>
        {grossProfit !== null && percentage !== null && (
          <div className="mt-2 flex justify-center">
            {!settings.anonymousData && (
              <GainAndLossBadge profit={grossProfit} percentage={percentage} />
            )}
            {settings.anonymousData && (
              <GainAndLossBadge profit={0} percentage={0} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
