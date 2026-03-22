import { Wallet, ArrowRight, DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import { useUserSettings } from "@/hooks/useUserSettings"
import StockChart from "@/components/StockChart"

interface InvestmentValueProps {
  value: number
  quantity: number
  pricebought: number
}

function InvestmentValue({
  value,
  quantity,
  pricebought,
}: InvestmentValueProps) {
  const profit = value * quantity - pricebought * quantity
  const total = value * quantity
  const percentage = (value / pricebought - 1) * 100
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

interface InvestmentDetailsProps {
  currentCapital: number
  quantity: number
  boughtPrice: number
  currentPrice: number
}
function InvestmentDetails({
  currentCapital,
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
        <p className="text-lg font-semibold">{currentCapital.toFixed(2)} €</p>
        <p className="text-xs text-muted-foreground">{quantity} quote</p>
      </Card>
      <Card className="flex h-fit gap-4 p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="h-4 w-4" />
          <span className="text-xs font-medium">Prezzo/unità</span>
        </div>
        <p className="text-lg font-semibold">{boughtPrice.toFixed(2)} €</p>
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
        {grossProfit >= 0 ? "+" : ""}
        {grossProfit.toFixed(2)} €
      </span>
    </div>
  )
  const taxItem = (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Tasse ({taxPercentage}%)
      </span>
      <span className="font-medium text-yellow-600">
        {grossProfit > 0
          ? `-${(grossProfit - netProfit).toFixed(2)} €`
          : "0.00 €"}
      </span>
    </div>
  )
  const netProfitItem = (
    <div className="mt-4 flex items-start justify-between">
      <span className="text-sm font-medium">Profitto netto</span>
      <div className="text-right">
        <p className="text-lg font-semibold">
          {(investedCapital + netProfit).toFixed(2)} €
        </p>
        <p
          className={`mt-1 text-xs ${netProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
        >
          {netProfit >= 0 ? "+" : ""}
          {netProfit.toFixed(2)} € (
          {((netProfit / investedCapital) * 100).toFixed(2)}%)
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
          value={currentPrice}
          quantity={quantity}
          pricebought={boughtPrice}
        />
        <div className="mx-4 max-h-[45vh] space-y-4 overflow-y-scroll sm:max-h-[49vh]">
          <InvestmentDetails
            currentCapital={currentCapital}
            boughtPrice={boughtPrice}
            currentPrice={currentPrice}
            quantity={quantity}
          />
          <SellingInvestmentSimulation
            taxPercentage={settings.taxPercentage}
            grossProfit={grossProfit}
            netProfit={netProfit}
            investedCapital={investedCapital}
          />
          <StockChart chartData={chartData} />
        </div>
      </div>
    </div>
  )
}
