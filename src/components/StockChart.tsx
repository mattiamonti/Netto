import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface StockChartProps {
  chartData: { timestamp: number; closingPrice: number }[]
}

export default function StockChart({ chartData }: StockChartProps) {
  return (
    <div className="w-full rounded-2xl bg-card p-4">
      <ChartContainer config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            dataKey="timestamp"
            tickFormatter={(value) => value}
            tickLine={false}
            tickMargin={2}
          />
          <ChartTooltip
            content={<ChartTooltipContent hideLabel />}
            cursor={false}
          />
          <Line
            dataKey="closingPrice"
            dot={false}
            stroke="var(--color-desktop)"
            strokeWidth={2}
            type="linear"
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
