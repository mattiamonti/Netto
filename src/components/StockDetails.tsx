import { Wallet, ArrowRight, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import { useUserSettings } from "@/hooks/useUserSettings"

interface InvestmentValueProps {
  value: number
  quantity: number
  priceBougth: number
}

function InvestmentValue({
  value,
  quantity,
  priceBougth,
}: InvestmentValueProps) {
  const profit = value * quantity - priceBougth * quantity
  const total = value * quantity
  const percentage = (value / priceBougth - 1) * 100
  return (
    <div className="mx-4 flex flex-col items-center gap-4 text-3xl font-semibold md:flex-row">
      <div className="flex flex-row items-baseline-last gap-2">
        <span className="text-xl font-normal text-muted-foreground">€</span>
        {total.toFixed(2)}
      </div>
      <GainAndLossBadge profit={profit} percentage={percentage} />
    </div>
  )
}

interface StockDetailsProps {
  currentPrice: number
  quantity: number
  boughtPrice: number
  investedCapital: number
  currentCapital: number
  grossProfit: number
  netProfit: number
}

export default function StockDetails({
  currentPrice: value,
  quantity,
  boughtPrice: priceBougth,
  investedCapital,
  currentCapital: actualCapital,
  grossProfit,
  netProfit,
}: StockDetailsProps) {
  const { settings } = useUserSettings()
  return (
    <div>
      <div className="-mx-4 flex min-w-full flex-col gap-4">
        <InvestmentValue
          value={value}
          quantity={quantity}
          priceBougth={priceBougth}
        />

        {/* Dettagli Investimento */}
        <div className="max-h-[40vh] space-y-4 overflow-y-scroll">
          <div className="grid grid-cols-2 gap-3">
            <Card className="flex h-fit gap-4 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span className="text-xs font-medium">Investito</span>
              </div>
              <p className="text-lg font-semibold">
                {actualCapital.toFixed(2)} €
              </p>
              <p className="text-xs text-muted-foreground">{quantity} quote</p>
            </Card>
            <Card className="flex h-fit gap-4 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="text-xs font-medium">Prezzo/unità</span>
              </div>
              <p className="text-lg font-semibold">
                {priceBougth.toFixed(2)} €
              </p>
              <p className="text-xs text-muted-foreground">
                Attuale: {value.toFixed(2)} €
              </p>
            </Card>
          </div>

          {/* Simulazione Vendita */}
          <Card className="flex h-fit gap-4 p-4">
            <div className="flex items-center gap-2 border-b p-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Simulazione Vendita</span>
            </div>
            <div className="px-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Valore lordo
                  </span>
                  <span className="font-medium">
                    {grossProfit >= 0 ? "+" : ""}
                    {grossProfit.toFixed(2)} €
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tasse ({settings.taxPercentage}%)
                  </span>
                  <span className="font-medium text-yellow-600">
                    {grossProfit > 0
                      ? `-${(grossProfit - netProfit).toFixed(2)} €`
                      : "0.00 €"}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Netto in tasca</span>
                  <div className="text-right">
                    <p className="text-lg font-semibold">
                      {(investedCapital + netProfit).toFixed(2)} €
                    </p>
                    <p
                      className={`text-xs ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {netProfit >= 0 ? "+" : ""}
                      {netProfit.toFixed(2)} € (
                      {((netProfit / investedCapital) * 100).toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
