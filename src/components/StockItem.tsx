import { useUserSettings } from "@/hooks/useUserSettings"
import StockDetails from "@/components/StockDetails"
import StockPreview from "@/components/StockPreview"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

interface StockNewItemProps {
  ticker: string
  boughtPrice: number
  quantity: number
  price: number | null
  name: string | null
  loading: boolean
  historicalMonthData: { timestamp: number; closingPrice: number }[]
}

export default function StockItem({
  ticker,
  boughtPrice,
  quantity,
  price,
  name,
  loading,
  historicalMonthData,
}: StockNewItemProps) {
  const { settings } = useUserSettings()
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
      <DrawerTrigger className="min-w-full">
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
      </DrawerContent>
    </Drawer>
  )
}
