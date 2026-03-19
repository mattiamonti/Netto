import { Plus } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GainAndLossBadge from "@/components/GainAndLossBadge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function TotalPanicSellSection() {
  const grossProfit = 2038 - 2000
  let netProfit = 0
  if (grossProfit > 0) {
    netProfit = grossProfit - grossProfit * 0.26
  } else {
    netProfit = grossProfit
  }
  const capital = 2000 + netProfit
  const percentage = (netProfit / capital) * 100

  return (
    <Collapsible className="w-full space-y-2">
      <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium hover:underline">
        <Plus className="h-4 w-4" />
        Simulazione vendita totale
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <Card className="w-full max-w-2xl shadow-none">
          <CardHeader className="px-8">
            <CardDescription className="text-md max-w-lg text-left text-muted-foreground md:text-lg">
              Guadagno dalla vendita immediata
            </CardDescription>
          </CardHeader>
          <CardContent className="mx-auto -mt-4 flex flex-col px-8">
            <CardTitle className="text-3xl font-medium tracking-tight md:text-4xl">
              <span className="text-lg text-muted-foreground md:text-xl">
                €{" "}
              </span>
              {capital.toFixed(2)}
            </CardTitle>
            <CardDescription className="mx-auto mt-2 max-w-lg text-xl text-muted-foreground">
              <GainAndLossBadge profit={netProfit} percentage={percentage} />
            </CardDescription>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}
