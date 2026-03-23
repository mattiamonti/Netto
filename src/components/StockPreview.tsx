import { Info } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import SpinnerCircle from "@/components/customized/spinner/spinner-02"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUserSettings } from "@/hooks/useUserSettings"

interface StockPreviewProps {
  name: string
  ticker: string
  price: number
  priceBougth: number
  quantityInput: number
  loading: boolean
}

function OpenDetails() {
  return (
    <Tooltip>
      <TooltipTrigger asChild className="cursor-pointer">
        <Info className="h-4 w-4" />
      </TooltipTrigger>
      <TooltipContent>
        <p>Dettagli strumento</p>
      </TooltipContent>
    </Tooltip>
  )
}

export default function StockPreview({
  name,
  ticker,
  price,
  priceBougth,
  quantityInput,
  loading,
}: StockPreviewProps) {
  const { settings } = useUserSettings()
  return (
    <Item variant="outline" className="transition-all active:scale-[0.98]">
      <ItemContent className="flex flex-col gap-2 md:flex-row md:justify-between">
        <div>
          <ItemTitle className="text-left">{name}</ItemTitle>
          <ItemDescription>{ticker}</ItemDescription>
        </div>
        <div className="flex flex-row items-center gap-2">
          {loading ? (
            <SpinnerCircle />
          ) : (
            <div className="text-lg text-nowrap">
              {!settings.anonymousData &&
                price &&
                (price * quantityInput).toFixed(2) + " €"}
              {settings.anonymousData && "0.00"}
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
      <ItemActions className="">
        <OpenDetails />
      </ItemActions>
    </Item>
  )
}
