import { Info, TrendingUp } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface AlertDialogInfoProps {
  ticker: string
  name: string
  value: number
  quantity: number
  priceBougth: number
}

export default function AlertDialogInfo({
  ticker,
  name,
  value,
  quantity,
  priceBougth,
}: AlertDialogInfoProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Info />
          Info
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg!">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-semibold tracking-[-0.015em]">
            {name}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            {ticker}
          </AlertDialogDescription>
          <div className="mt-4 flex flex-col gap-4 text-left">
            <div className="flex flex-row items-center gap-4 text-3xl font-semibold">
              {value * quantity} €
              <Badge className="gap-1.5 border-emerald-600/40 bg-emerald-600/10 text-sm text-emerald-500 shadow-none hover:bg-emerald-600/10 dark:bg-emerald-600/20">
                <TrendingUp size={20} />{" "}
                {(value * quantity - priceBougth * quantity).toFixed(2)} € |{" "}
                {((value / priceBougth - 1) * 100).toFixed(2)}%
              </Badge>
            </div>
            <div>
              <div className="text-md">Valore attuale quota {value} €</div>
              <div className="text-md">
                Prezzo di carico quota {priceBougth} €
              </div>
              <div className="text-md">Quote acquistate {quantity} €</div>
            </div>
            <div className="text-md">
              Controvalore investito {priceBougth * quantity} €
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Chiudi</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
