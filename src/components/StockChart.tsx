import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GainAndLossBadge from "@/components/GainAndLossBadge"

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
  const dynamicPercentage =
    ((chartData.at(-1)?.closingPrice ?? 0) /
      (chartData.at(0)?.closingPrice ?? 1) -
      1) *
    100
  const prices = chartData.map((d) => d.closingPrice)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const bottomDomain = minPrice * 0.98
  const topDomain = maxPrice * 1.02
  return (
    <Card className="-px-4 min-w-full bg-muted p-1 ring-0">
      <CardHeader className="p-0 pl-2">
        <CardTitle className="flex flex-row gap-2 text-xl">
          € {chartData && chartData.at(-1)?.closingPrice.toFixed(2)}
          <div className="scale-90">
            <GainAndLossBadge percentage={dynamicPercentage} profit={null} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
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
              hide={false}
              tickMargin={2}
              tick
              domain={[bottomDomain, topDomain]}
              tickFormatter={(value) => `€${value.toFixed(0).toLocaleString()}`}
              allowDataOverflow={true}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient
                id="gradient-rounded-chart-desktop"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="gradient-rounded-chart-mobile"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="closingPrice"
              type="natural"
              fill="url(#gradient-rounded-chart-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
              strokeWidth={0.8}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
