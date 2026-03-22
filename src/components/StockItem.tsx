import { useUserSettings } from "@/hooks/useUserSettings"
import { useStockPrice } from "@/hooks/useStockPrice"
import StockDetails from "@/components/StockDetails"
import StockPreview from "@/components/StockPreview"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

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
  const { price, name, loading, historicalMonthData } = useStockPrice(ticker)
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
    <Drawer>
      <DrawerTrigger>
        <StockPreview
          ticker={ticker}
          name={name ? name : "..."}
          price={price ? price : 0}
          priceBougth={boughtPrice}
          quantityInput={quantity}
          loading={loading}
        />
      </DrawerTrigger>
      <DrawerContent className="h-5/6 sm:mx-auto sm:max-w-2xl!">
        <DrawerHeader>
          <DrawerTitle className="w-full truncate text-2xl font-semibold tracking-[-0.015em]">
            {name}
          </DrawerTitle>
          <DrawerDescription className="text-md">{ticker}</DrawerDescription>
        </DrawerHeader>
        <StockDetails
          currentPrice={price ? price : 0}
          boughtPrice={boughtPrice}
          quantity={quantity}
          investedCapital={investedCapital}
          currentCapital={currentCapital}
          grossProfit={grossProfit}
          netProfit={netProfit}
          chartData={historicalMonthData}
        />

        <DrawerFooter>
          <DrawerClose className="rounded-full bg-muted px-4 py-2">
            Chiudi
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
