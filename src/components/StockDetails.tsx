import { Info } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import { Separator } from "@/components/ui/separator"

interface DisplayDataProps {
  label: string
  value: number
  symbol: string
}
function DisplayData({ label, value, symbol = " €" }: DisplayDataProps) {
  return (
    <div className="text-md flex flex-row items-baseline-last gap-2 md:flex-col md:gap-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-lg">
        {value}
        {symbol}
      </span>
    </div>
  )
}

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
    <div className="flex flex-col items-center gap-4 text-3xl font-semibold md:flex-row">
      <div className="flex flex-row items-baseline-last gap-2">
        <span className="text-xl font-normal text-muted-foreground">€</span>
        {total.toFixed(2)}
      </div>
      <GainAndLossBadge profit={profit} percentage={percentage} />
    </div>
  )
}

interface PanicSellProps {
  totalValue: number
  taxRate: number
  totalInvested: number
}
function PanicSell({ totalValue, taxRate, totalInvested }: PanicSellProps) {
  const grossProfit = totalValue - totalInvested
  let netProfit = 0
  if (grossProfit > 0) {
    netProfit = grossProfit - grossProfit * taxRate
  } else {
    netProfit = grossProfit
  }
  const capital = totalInvested + netProfit
  const percentage = (netProfit / capital) * 100

  return (
    <div className="mt-4">
      <h3 className="texttext-lg font-medium">Simulazione vendita</h3>
      <div className="mt-2 flex flex-col gap-2 md:flex-row md:justify-between">
        <DisplayData label="Totale" value={capital.toFixed(2)} />
        <DisplayData label="Guadagno Netto" value={netProfit.toFixed(2)} />
        <DisplayData
          label="Percentuale"
          value={percentage.toFixed(2)}
          symbol="%"
        />
      </div>
    </div>
  )
}

interface StockDetailsProps {
  ticker: string
  name: string
  value: number
  quantity: number
  priceBougth: number
}

export default function StockDetails({
  ticker,
  name,
  value,
  quantity,
  priceBougth,
}: StockDetailsProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Info />
          Info
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-h-[80vh] sm:max-w-lg!">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold tracking-[-0.015em]">
            {name}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md">
            {ticker}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4 flex max-h-[50vh] flex-col gap-4 overflow-x-hidden overflow-y-scroll text-left">
          <InvestmentValue
            value={value}
            quantity={quantity}
            priceBougth={priceBougth}
          />
          <div className="mt-4 flex flex-col gap-6">
            <Separator />
            <div className="flex flex-col md:flex-row md:items-baseline-last md:justify-between">
              <DisplayData label="Valore attuale" value={value} />
              <span className="text-md hidden text-muted-foreground md:block">
                x
              </span>
              <DisplayData
                label="Quote acquistate"
                value={quantity}
                symbol=""
              />
            </div>
            <Separator />
            <div className="flex flex-col md:flex-row md:items-baseline-last md:justify-between">
              <DisplayData label="Prezzo di carico" value={priceBougth} />
              <span className="text-md hidden text-muted-foreground md:block">
                x
              </span>
              <DisplayData
                label="Quote acquistate"
                value={quantity}
                symbol=""
              />
              <span className="text-md hidden text-muted-foreground md:block">
                =
              </span>
              <DisplayData
                label="Controvalore investito"
                value={priceBougth * quantity}
              />
            </div>
          </div>
          <Separator />
          <PanicSell
            totalValue={value * quantity}
            totalInvested={priceBougth * quantity}
            taxRate={0.26}
          />
        </div>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Chiudi</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
