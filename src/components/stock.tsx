import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import StockDetails from "@/components/StockDetails"
import SpinnerCircle from "./customized/spinner/spinner-02"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import { useStockPrice } from "@/hooks/useStockPrice"

interface StockProps {
  ticker: string
  priceBougth: number
  quantityInput: number
}

export default function Stock({
  ticker,
  priceBougth,
  quantityInput,
}: StockProps) {
  const { price, name, loading } = useStockPrice(ticker)

  if (!price && !loading) {
    return null
  }

  return (
    <div className="flex h-auto w-full flex-col gap-6 md:gap-4">
      <Item variant="outline">
        <ItemContent className="flex flex-col gap-2 md:flex-row md:justify-between">
          <div>
            <ItemTitle>{name}</ItemTitle>
            <ItemDescription>{ticker}</ItemDescription>
          </div>
          <div className="flex flex-row items-center gap-2">
            {loading ? (
              <SpinnerCircle />
            ) : (
              <div className="text-lg text-nowrap">
                {price && (price * quantityInput).toFixed(2) + " €"}
              </div>
            )}
            <GainAndLossBadge
              profit={null}
              percentage={
                price && priceBougth ? (price / priceBougth - 1) * 100 : 0
              }
            />
          </div>
        </ItemContent>
        <ItemActions>
          <StockDetails
            ticker={ticker}
            name={name ?? ticker}
            value={price ?? 0}
            priceBougth={priceBougth}
            quantity={quantityInput}
          />
        </ItemActions>
      </Item>
    </div>
  )
}
