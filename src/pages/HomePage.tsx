import { useState, useMemo } from "react"
import { useInvestments } from "@/hooks/useInvestments"
import TotalValueCard from "@/components/TotalValueCard"
import TotalPanicSellSection from "@/components/TotalPanicSellSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StockItem from "@/components/StockItem"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatedList } from "@/components/ui/animated-list"
import { PageTransition } from "@/components/PageTransition"
import { useStockPrices } from "@/hooks/useStockPrices"

export default function HomePage() {
  const { investments, getInvestmentsByType, isLoaded } = useInvestments()
  const [activeTab, setActiveTab] = useState<"etfs" | "stocks">("etfs")

  const allTickers = useMemo(
    () => investments.map((inv) => inv.ticker),
    [investments]
  )
  const stockPrices = useStockPrices(allTickers)

  const etfs = getInvestmentsByType("etf")
  const stocks = getInvestmentsByType("stock")

  return (
    <PageTransition>
      <TotalValueCard investments={investments} stockPrices={stockPrices} />
      <TotalPanicSellSection investments={investments} stockPrices={stockPrices} />

      <Tabs
        defaultValue="etfs"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "etfs" | "stocks")}
        className="mb-16 min-w-full"
      >
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="etfs">ETFs ({etfs.length})</TabsTrigger>
          <TabsTrigger value="stocks">Stocks ({stocks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="etfs" className="max-h-[40svh]">
          <ScrollArea className="h-[40svh]">
            {!isLoaded ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Caricamento...
              </p>
            ) : etfs.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nessun ETF salvato. Aggiungi un investimento dalle impostazioni.
              </p>
            ) : (
              <AnimatedList delay={100} className="min-w-full">
                <div className="flex flex-col gap-2">
                  {etfs.map((investment) => {
                    const stockData = stockPrices[investment.ticker]
                    return (
                      <StockItem
                        key={investment.id}
                        ticker={investment.ticker}
                        boughtPrice={investment.priceBought}
                        quantity={investment.quantity}
                        price={stockData?.price ?? null}
                        name={stockData?.name ?? null}
                        loading={stockData?.loading ?? true}
                        historicalMonthData={stockData?.historicalMonthData ?? []}
                      />
                    )
                  })}
                </div>
              </AnimatedList>
            )}
          </ScrollArea>
        </TabsContent>
        <TabsContent value="stocks" className="max-h-[40svh]">
          <ScrollArea className="h-[40svh]">
            {!isLoaded ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Caricamento...
              </p>
            ) : stocks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nessuno Stock salvato. Aggiungi un investimento dalle
                impostazioni.
              </p>
            ) : (
              <AnimatedList delay={100} className="min-w-full">
                <div className="flex flex-col gap-2">
                  {stocks.map((investment) => {
                    const stockData = stockPrices[investment.ticker]
                    return (
                      <StockItem
                        key={investment.id}
                        ticker={investment.ticker}
                        boughtPrice={investment.priceBought}
                        quantity={investment.quantity}
                        price={stockData?.price ?? null}
                        name={stockData?.name ?? null}
                        loading={stockData?.loading ?? true}
                        historicalMonthData={stockData?.historicalMonthData ?? []}
                      />
                    )
                  })}
                </div>
              </AnimatedList>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </PageTransition>
  )
}
