import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StockChartProps {
  chartData: { timestamp: number; closingPrice: number }[]
}

const RED_COLOR = "#b91c1c"

export default function StockChart({ chartData }: StockChartProps) {
  // 1. Filtriamo i dati
  const filteredData = chartData.filter(
    (item) => item && item.timestamp != null && item.closingPrice != null
  )

  return (
    <Card className="flex gap-4 p-4">
      <Tabs defaultValue="last-month" className="min-w-full">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Ultime quotazioni
          </span>
          <TabsList variant="default" className="w-fit rounded-2xl">
            <TabsTrigger value="last-year" className="rounded-xl">
              Last Year
            </TabsTrigger>
            <TabsTrigger value="last-month" className="rounded-xl">
              Last Month
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="last-month">
          {DisplayChart(filteredData.slice(-30))}
        </TabsContent>
        <TabsContent value="last-year">
          {DisplayChart(filteredData)}
        </TabsContent>
      </Tabs>
    </Card>
  )
}

function DisplayChart(
  chartData: { timestamp: number; closingPrice: number }[]
) {
  const chartConfig = {
    desktop: {
      label: "Quotazioni",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  if (
    (chartData.at(0)?.closingPrice ?? 0) > (chartData.at(-1)?.closingPrice ?? 0)
  ) {
    chartConfig.desktop.color = RED_COLOR
  }
  return (
    <div className="w-full rounded-xl bg-muted/40 p-2">
      <ChartContainer config={chartConfig}>
        <LineChart data={chartData} margin={{ left: 0, right: 0, top: 10 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />

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
  )
}
