import { Wallet, ArrowRight, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import { useUserSettings } from "@/hooks/useUserSettings"
import StockChart from "@/components/StockChart"
import { ScrollArea } from "@/components/ui/scroll-area"
import NumberFlow from "@number-flow/react"
import { useEffect, useState } from "react"

interface InvestmentValueProps {
  currentCapital: number
  investedCapital: number
}

function InvestmentValue({
  currentCapital,
  investedCapital,
}: InvestmentValueProps) {
  const [value, setValue] = useState<number>(investedCapital)
  const profit = currentCapital - investedCapital
  const percentage = (currentCapital / investedCapital - 1) * 100
  useEffect(() => {
    setValue(currentCapital)
  }, [currentCapital])
  return (
    <div className="mx-4 flex flex-col items-center gap-4 text-3xl font-semibold md:flex-row">
      <div className="flex flex-row items-baseline-last gap-2">
        <NumberFlow
          value={value}
          locales="it-IT"
          format={{ style: "currency", currency: "EUR" }}
        />
      </div>
      <GainAndLossBadge
        profit={profit}
        percentage={percentage ? percentage : 0.0}
      />
    </div>
  )
}

interface InvestmentDetailsProps {
  currentCapital: number
  quantity: number
  boughtPrice: number
  currentPrice: number
}
function InvestmentDetails({
  currentCapital: investedCapital,
  quantity,
  boughtPrice,
  currentPrice,
}: InvestmentDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Card className="flex h-fit gap-4 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Wallet className="h-4 w-4" />
          <span className="text-xs font-medium">Investito</span>
        </div>
        <p className="text-lg font-semibold">
          <NumberFlow
            value={investedCapital}
            locales="it-IT"
            format={{ style: "currency", currency: "EUR" }}
          />
        </p>
        <p className="text-xs text-muted-foreground">{quantity} quote</p>
      </Card>
      <Card className="flex h-fit gap-4 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span className="text-xs font-medium">Prezzo/unità</span>
        </div>
        <p className="text-lg font-semibold">
          <NumberFlow
            value={boughtPrice}
            locales="it-IT"
            format={{ style: "currency", currency: "EUR" }}
          />
        </p>
        <p className="text-xs text-muted-foreground">
          Attuale: {currentPrice.toFixed(2)} €
        </p>
      </Card>
    </div>
  )
}

interface SellingInvestmentSimulationProps {
  grossProfit: number
  taxPercentage: number
  netProfit: number
  investedCapital: number
}
function SellingInvestmentSimulation({
  grossProfit,
  taxPercentage,
  netProfit,
  investedCapital,
}: SellingInvestmentSimulationProps) {
  const grossProfitItem = (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">Profitto lordo</span>
      <span className="font-medium">
        <NumberFlow
          value={grossProfit}
          locales="it-IT"
          format={{ style: "currency", currency: "EUR" }}
        />
      </span>
    </div>
  )
  const taxItem = (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Tasse ({taxPercentage}%)
      </span>
      <span className="font-medium text-yellow-600">
        <NumberFlow
          value={netProfit - grossProfit}
          locales="it-IT"
          format={{ style: "currency", currency: "EUR" }}
        />
      </span>
    </div>
  )
  const netProfitItem = (
    <div className="mt-4 flex items-start justify-between">
      <span className="text-sm font-medium">Profitto netto</span>
      <div className="text-right">
        <p className="text-lg font-semibold">
          <NumberFlow
            value={investedCapital + netProfit}
            locales="it-IT"
            format={{ style: "currency", currency: "EUR" }}
          />
        </p>
        <p
          className={`mt-1 text-xs ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
        >
          <NumberFlow
            value={netProfit}
            locales="it-IT"
            format={{ style: "currency", currency: "EUR" }}
            suffix={` (${investedCapital ? ((netProfit / investedCapital) * 100).toFixed(2) : 0}%)`}
          />
        </p>
      </div>
    </div>
  )
  return (
    <Card className="flex h-fit gap-4 p-4">
      <div className="flex items-center gap-2 border-b p-2">
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Simulazione Vendita</span>
      </div>
      <div className="px-4">
        <div className="space-y-2">
          {grossProfitItem}
          {taxItem}
          {netProfitItem}
        </div>
      </div>
    </Card>
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
  chartData: { timestamp: number; closingPrice: number }[]
}

export default function StockDetails({
  currentPrice,
  quantity,
  boughtPrice,
  investedCapital,
  currentCapital,
  grossProfit,
  netProfit,
  chartData,
}: StockDetailsProps) {
  const { settings } = useUserSettings()
  return (
    <div>
      <div className="flex min-w-full flex-col gap-4">
        <InvestmentValue
          currentCapital={!settings.anonymousData ? currentCapital : 0}
          investedCapital={!settings.anonymousData ? investedCapital : 0}
        />
        <ScrollArea className="mx-4 h-[50vh] sm:h-[54vh]">
          <div className="space-y-4">
            <StockChart chartData={chartData} />
            <InvestmentDetails
              currentCapital={!settings.anonymousData ? investedCapital : 0}
              boughtPrice={!settings.anonymousData ? boughtPrice : 0}
              currentPrice={currentPrice}
              quantity={!settings.anonymousData ? quantity : 0}
            />
            <SellingInvestmentSimulation
              taxPercentage={settings.taxPercentage}
              grossProfit={!settings.anonymousData ? grossProfit : 0}
              netProfit={!settings.anonymousData ? netProfit : 0}
              investedCapital={!settings.anonymousData ? investedCapital : 0}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
