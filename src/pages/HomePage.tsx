import { useState } from "react"
import { useInvestments } from "@/hooks/useInvestments"
import TotalValueCard from "@/components/TotalValueCard"
import TotalPanicSellSection from "@/components/TotalPanicSellSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StockItem from "@/components/StockItem"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AnimatedList } from "@/components/ui/animated-list"
import { PageTransition } from "@/components/PageTransition"

export default function HomePage() {
  const { investments, getInvestmentsByType, isLoaded } = useInvestments()
  const [activeTab, setActiveTab] = useState<"etfs" | "stocks">("etfs")

  const etfs = getInvestmentsByType("etf")
  const stocks = getInvestmentsByType("stock")

  return (
    <PageTransition>
      <TotalValueCard investments={investments} />
      <TotalPanicSellSection investments={investments} />

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
                  {etfs.map((investment) => (
                    <StockItem
                      key={investment.id}
                      ticker={investment.ticker}
                      boughtPrice={investment.priceBought}
                      quantity={investment.quantity}
                    />
                  ))}
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
                  {stocks.map((investment) => (
                    <StockItem
                      key={investment.id}
                      ticker={investment.ticker}
                      boughtPrice={investment.priceBought}
                      quantity={investment.quantity}
                    />
                  ))}
                </div>
              </AnimatedList>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </PageTransition>
  )
}
