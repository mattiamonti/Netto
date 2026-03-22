import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card } from "@/components/ui/card"

interface StockChartProps {
  chartData: { timestamp: number; closingPrice: number }[]
}

const RED_COLOR = "#b91c1c"

export default function StockChart({ chartData }: StockChartProps) {
  // 1. Filtriamo i dati
  const filteredData = chartData.filter(
    (item) => item && item.timestamp != null && item.closingPrice != null
  )

  const chartConfig = {
    desktop: {
      label: "Quotazioni",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  if (filteredData.at(0)?.closingPrice > filteredData.at(-1)?.closingPrice) {
    chartConfig.desktop.color = RED_COLOR
  }

  return (
    <Card className="flex h-fit gap-4 p-4">
      <span className="text-xs font-medium text-muted-foreground">
        Quotazioni ultimo mese
      </span>
      <div className="w-full rounded-xl bg-muted/40 p-2">
        <ChartContainer config={chartConfig}>
          <LineChart
            data={filteredData}
            margin={{ left: 0, right: 0, top: 10 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              opacity={0.3}
            />

            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tickLine={false}
              tickMargin={4}
              minTickGap={4}
              // Formattazione asse X (moltiplichiamo per 1000)
              tickFormatter={(value) =>
                new Date(value * 1000).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                })
              }
            />

            <YAxis
              dataKey="closingPrice"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tick
              domain={["dataMin - 5%", "dataMax + 5%"]}
              tickFormatter={(value) => `€${value.toLocaleString()}`}
            />

            <ChartTooltip content={<ChartTooltipContent hideLabel={false} />} />

            <Line
              dataKey="closingPrice"
              dot={false}
              stroke="var(--color-desktop)"
              strokeWidth={2.5}
              type="monotone"
            />
          </LineChart>
        </ChartContainer>
      </div>
    </Card>
  )
}
