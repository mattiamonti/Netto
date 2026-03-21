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

interface StockPreviewProps {
  name: string
  ticker: string
  price: number
  priceBougth: number
  quantityInput: number
  loading: boolean
}

export default function StockPreview({
  name,
  ticker,
  price,
  priceBougth,
  quantityInput,
  loading,
}: StockPreviewProps) {
  return (
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
      <ItemActions className="">
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <Info className="h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Dettagli strumento</p>
          </TooltipContent>
        </Tooltip>
      </ItemActions>
    </Item>
  )
}
