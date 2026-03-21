import { Info, Wallet, ArrowRight, DollarSign } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import { useUserSettings } from "@/hooks/useUserSettings"
import { useStockPrice } from "@/hooks/useStockPrice"
import SpinnerCircle from "./customized/spinner/spinner-02"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import StockDetails from "@/components/StockDetails"
import StockPreview from "@/components/StockPreview"

interface StockNewItemProps {
  ticker: string
  priceBougth: number
  quantityInput: number
}

export default function StockNewItem({
  ticker,
  priceBougth,
  quantityInput,
}: StockNewItemProps) {
  const { settings } = useUserSettings()
  const { price, name, loading } = useStockPrice(ticker)
  if (!price && !loading) {
    return null
  }
  const capital = priceBougth * quantityInput
  const currentValue = price * quantityInput

  const grossProfit = currentValue - capital
  let netProfit = 0
  if (grossProfit > 0) {
    netProfit = grossProfit - grossProfit * (settings.taxPercentage / 100)
  } else {
    netProfit = grossProfit
  }
  const netCapital = capital + netProfit
  const netPercentage = capital ? (netProfit / capital) * 100 : 0

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <StockPreview
          ticker={ticker}
          name={name}
          price={price}
          priceBougth={priceBougth}
          quantityInput={quantityInput}
          loading={loading}
        />
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg!">
        <AlertDialogHeader>
          <AlertDialogTitle className="w-full truncate text-2xl font-semibold tracking-[-0.015em]">
            {name}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-md">
            {ticker}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <StockDetails
          ticker={ticker}
          name={name}
          value={price}
          priceBougth={priceBougth}
          quantity={quantityInput}
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Chiudi</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
