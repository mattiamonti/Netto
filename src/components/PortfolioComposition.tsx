import { useState, useRef } from "react"
import { PieChart, Pie, Cell, LabelList } from "recharts"
import { motion } from "motion/react"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import type { Investment, InvestmentType } from "@/types/investment"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { ScrollArea } from "./ui/scroll-area"
import { getCachedPrice } from "@/hooks/useStockPrice"
import { AnimatedList } from "./ui/animated-list"

interface PortfolioCompositionProps {
  investments: Investment[]
}

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

interface SwipeableChartProps {
  holdings: {
    id: string
    ticker: string
    value: number
    currentValue: number
    type: InvestmentType
  }[]
}

function SwipeableChart({ holdings }: SwipeableChartProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const startX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return
    const currentX = e.touches[0].clientX
    const diff = startX.current - currentX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentPage((prev) => Math.min(prev + 1, 1))
      } else {
        setCurrentPage((prev) => Math.max(prev - 1, 0))
      }
      startX.current = null
    }
  }

  const handleTouchEnd = () => {
    startX.current = null
  }

  const currentTotalValue = holdings.reduce((sum, h) => sum + h.currentValue, 0)
  const currentValueData = holdings.map((holding) => ({
    name: holding.ticker,
    value: holding.currentValue,
    percentage:
      currentTotalValue > 0
        ? (holding.currentValue / currentTotalValue) * 100
        : 0,
  }))

  const investedTotalValue = holdings.reduce((sum, h) => sum + h.value, 0)
  const investedValueData = holdings.map((holding) => ({
    name: holding.ticker,
    value: holding.value,
    percentage:
      investedTotalValue > 0 ? (holding.value / investedTotalValue) * 100 : 0,
  }))

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex"
          animate={{ x: -currentPage * 100 + "%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="min-w-full">
            <p className="text-center text-muted-foreground">Valore corrente</p>
            <CompositionChart chartData={currentValueData} />
          </div>
          <div className="min-w-full">
            <p className="text-center text-muted-foreground">
              Valore investito
            </p>
            <CompositionChart chartData={investedValueData} />
          </div>
        </motion.div>
      </div>

      {/* Indicatori di pagina (puntini) */}
      <div className="absolute right-0 bottom-0 left-0 flex justify-center gap-2">
        {[0, 1].map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
              currentPage === page ? "w-6 bg-primary" : "bg-muted-foreground/30"
            }`}
            aria-label={`Vai alla pagina ${page + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

interface HoldingsListProps {
  holdings: {
    id: string
    ticker: string
    value: number
    currentValue: number
    type: InvestmentType
  }[]
  totalValue: number
}

function HoldingsList({ holdings, totalValue }: HoldingsListProps) {
  return (
    <div className="flex flex-col gap-1">
      <ScrollArea className="h-[50svh]">
        <AnimatedList delay={100}>
          {holdings
            .sort((a, b) => b.value - a.value)
            .reverse()
            .map((holding, index) => {
              const percentage =
                totalValue > 0 ? (holding.value / totalValue) * 100 : 0
              return (
                <div key={holding.id}>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{holding.ticker}</p>
                        <p className="text-xs text-muted-foreground">
                          {holding.type.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(holding.currentValue)}
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
        </AnimatedList>
      </ScrollArea>
    </div>
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
  const totalInvested = holdings.reduce((sum, h) => sum + h.value, 0)

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
      {/* Card con grafico a torta */}
      <Card>
        <CardContent className="mx-auto w-full">
          <SwipeableChart holdings={holdings} />
        </CardContent>
      </Card>

      {/* Card con totali e drawer */}
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-col gap-4">
            {/* Valore Corrente */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valore corrente</p>
              </div>
              <div className="text-right">
                <p className="text-md font-semibold">
                  {formatCurrency(totalValue)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Valore Investito */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Valore investito
                </p>
              </div>
              <div className="text-right">
                <p className="text-md font-semibold">
                  {formatCurrency(totalInvested)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Drawer trigger */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button className="group w-full">
            Vedi composizione
            <ArrowUpRight className="ml-2 h-4 w-4 transition-all group-active:hidden" />
            <ArrowRight className="ml-2 hidden h-4 w-4 transition-all group-active:block" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="sm:mx-auto sm:max-w-2xl!">
          <DrawerHeader>
            <DrawerTitle className="text-muted-foreground">
              Composizione del Portafoglio
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-4">
            <HoldingsList holdings={holdings} totalValue={totalValue} />

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <span className="font-medium text-muted-foreground">
                Totale Portafoglio
              </span>
              <span className="font-semibold">
                {formatCurrency(totalValue)}
              </span>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
