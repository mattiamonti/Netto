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
import { useUserSettings } from "@/hooks/useUserSettings"
import { useStockPrice } from "@/hooks/useStockPrice"
import StockDetails from "@/components/StockDetails"
import StockPreview from "@/components/StockPreview"

interface StockNewItemProps {
  ticker: string
  boughtPrice: number
  quantity: number
}

export default function StockItem({
  ticker,
  boughtPrice,
  quantity,
}: StockNewItemProps) {
  const { settings } = useUserSettings()
  const { price, name, loading } = useStockPrice(ticker)
  if (!price && !loading) {
    return null
  }
  const investedCapital = boughtPrice * quantity
  const currentCapital = price ? price * quantity : 0

  const grossProfit = currentCapital - investedCapital
  let netProfit = 0
  if (grossProfit > 0) {
    netProfit = grossProfit - grossProfit * (settings.taxPercentage / 100)
  } else {
    netProfit = grossProfit
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <StockPreview
          ticker={ticker}
          name={name ? name : "..."}
          price={price ? price : 0}
          priceBougth={boughtPrice}
          quantityInput={quantity}
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
          currentPrice={price ? price : 0}
          boughtPrice={boughtPrice}
          quantity={quantity}
          investedCapital={investedCapital}
          currentCapital={currentCapital}
          grossProfit={grossProfit}
          netProfit={netProfit}
        />

        <AlertDialogFooter>
          <AlertDialogCancel>Chiudi</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
