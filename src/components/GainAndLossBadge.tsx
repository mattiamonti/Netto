import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import NumberFlow, { NumberFlowGroup } from "@number-flow/react"
import { useEffect, useState } from "react"

interface GainAndLossBadgeProps {
  profit: number | null
  percentage: number
}
export default function GainAndLossBadge({
  profit,
  percentage,
}: GainAndLossBadgeProps) {
  const [value, setValue] = useState<number>(0)
  const [percent, setPercent] = useState<number>(0)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(profit ? profit : 0)
    setPercent(percentage / 100)
  }, [profit, percentage])
  if (percentage >= 0) {
    return (
      <Badge className="gap-1.5 border-emerald-600/40 bg-emerald-600/10 text-sm text-emerald-500 shadow-none hover:bg-emerald-600/10 dark:bg-emerald-600/20">
        <TrendingUp size={20} />
        <NumberFlowGroup>
          {profit && (
            <NumberFlow
              value={value}
              locales="it-IT"
              format={{ style: "currency", currency: "EUR" }}
            />
          )}
          <NumberFlow
            value={percent}
            locales="it-IT"
            format={{
              style: "percent",
              maximumFractionDigits: 2,
              signDisplay: "always",
            }}
          />
        </NumberFlowGroup>
      </Badge>
    )
  } else {
    return (
      <Badge className="gap-1.5 border-red-600/40 bg-red-600/10 text-sm text-red-500 shadow-none hover:bg-red-600/10 dark:bg-red-600/20">
        <TrendingDown size={20} />
        <NumberFlowGroup>
          {profit && (
            <NumberFlow
              value={value}
              locales="it-IT"
              format={{ style: "currency", currency: "EUR" }}
            />
          )}
          <NumberFlow
            value={percent}
            locales="it-IT"
            format={{
              style: "percent",
              maximumFractionDigits: 2,
              signDisplay: "always",
            }}
          />
        </NumberFlowGroup>
      </Badge>
    )
  }
}
