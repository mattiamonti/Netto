import { PieChart, Pie, Cell, LabelList } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Investment } from "@/types/investment"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { ScrollArea } from "./ui/scroll-area"
import { getCachedPrice } from "@/hooks/useStockPrice"

interface PortfolioCompositionProps {
  investments: Investment[]
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
]

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

interface CompositionChartProps {
  chartData: { name: string; value: number; percentage: number }[]
}

function CompositionChart({ chartData }: CompositionChartProps) {
  // 1. Generiamo dinamicamente la configurazione dei colori basandoci sui dati ricevuti
  const chartConfig = chartData.reduce((acc, entry, index) => {
    acc[entry.name] = {
      label: entry.name,
      // Usiamo le variabili CSS standard di shadcn (da --chart-1 a --chart-5)
      // Se hai più di 5 entry, il modulo farà ricominciare i colori da 1
      color: `var(--chart-${(index % 5) + 1})`,
    }
    return acc
  }, {} as ChartConfig)

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[35svh] [&_.recharts-text]:fill-background"
    >
      <PieChart>
        <ChartTooltip
          content={<ChartTooltipContent hideLabel nameKey="name" />}
        />
        <Pie
          data={chartData}
          innerRadius={40}
          dataKey="value"
          nameKey="name" // Fondamentale per mappare i colori del config
          stroke="none"
          cornerRadius={8}
          paddingAngle={4}
        >
          {/* 2. Mappiamo ogni cella per assegnare il colore corretto dal config */}
          {chartData.map((entry) => (
            <Cell
              key={`cell-${entry.name}`}
              fill={chartConfig[entry.name]?.color}
            />
          ))}

          <LabelList
            dataKey="percentage"
            stroke="none"
            fontSize={10}
            fontWeight={700}
            fill="currentColor"
            formatter={(value: unknown) => {
              const numValue = typeof value === "number" ? value : Number(value)
              if (isNaN(numValue)) return ""
              return `${numValue.toFixed(0)}%`
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

export default function PortfolioComposition({
  investments,
}: PortfolioCompositionProps) {
  const holdings = investments.map((inv) => {
    const value = inv.priceBought * inv.quantity
    const price = getCachedPrice(inv.ticker)
    let currentValue = 0
    if (price) {
      currentValue = price * inv.quantity
    }
    return {
      id: inv.id,
      ticker: inv.ticker,
      value,
      currentValue,
      type: inv.type,
    }
  })

  const totalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)

  const data = holdings.map((holding) => ({
    name: holding.ticker,
    value: holding.currentValue,
    percentage: totalValue > 0 ? (holding.currentValue / totalValue) * 100 : 0,
  }))

  if (investments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-center text-sm text-muted-foreground">
            Nessun investimento nel portafoglio.
            <br />
            Aggiungi investimenti dalle impostazioni per vedere la composizione.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="mx-auto w-full">
          <CompositionChart chartData={data} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Composizione del Portafoglio
          </h3>
          <div className="flex flex-col gap-1">
            <ScrollArea className="h-[35svh]">
              {holdings
                .sort((a, b) => b.value - a.value)
                .map((holding, index) => {
                  const percentage =
                    totalValue > 0 ? (holding.value / totalValue) * 100 : 0
                  return (
                    <div key={holding.id}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-3 w-3 shrink-0 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <div>
                            <p className="font-medium">{holding.ticker}</p>
                            <p className="text-xs text-muted-foreground">
                              {holding.type.toUpperCase()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(holding.value)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {percentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      {index < holdings.length - 1 && (
                        <Separator className="my-1" />
                      )}
                    </div>
                  )
                })}
            </ScrollArea>
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <span className="font-medium">Totale Portafoglio</span>
            <span className="font-semibold">{formatCurrency(totalValue)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
