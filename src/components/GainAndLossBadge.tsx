import { TrendingUp, TrendingDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface GainAndLossBadgeProps {
  profit: number | null
  percentage: number
}
export default function GainAndLossBadge({
  profit,
  percentage,
}: GainAndLossBadgeProps) {
  if (percentage >= 0) {
    return (
      <Badge className="gap-1.5 border-emerald-600/40 bg-emerald-600/10 text-sm text-emerald-500 shadow-none hover:bg-emerald-600/10 dark:bg-emerald-600/20">
        <TrendingUp size={20} /> {profit && profit.toFixed(2)} {profit && "€ |"}{" "}
        {percentage.toFixed(2)}%
      </Badge>
    )
  } else {
    return (
      <Badge className="gap-1.5 border-red-600/40 bg-red-600/10 text-sm text-red-500 shadow-none hover:bg-red-600/10 dark:bg-red-600/20">
        <TrendingDown size={20} /> {profit && profit.toFixed(2)}{" "}
        {profit && "€ |"} {percentage.toFixed(2)}%
      </Badge>
    )
  }
}
