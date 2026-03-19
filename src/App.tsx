import { useState } from "react"
import TotalValueCard from "@/components/TotalValueCard"
import ProfileBar from "@/components/ProfileBar"
import Stock from "@/components/Stock"
import NavigationMenuApp from "@/components/NavigationMenuApp"
import SettingsContent from "@/components/SettingsContent"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TotalPanicSellSection from "./components/TotalPanicSellSection"
import { useInvestments } from "@/hooks/useInvestments"

export function App() {
  const [activeTab, setActiveTab] = useState<"home" | "settings">("home")
  const { investments, getInvestmentsByType, isLoaded } = useInvestments()

  const etfs = getInvestmentsByType("etf")
  const stocks = getInvestmentsByType("stock")

  if (activeTab === "settings") {
    return (
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
        <ProfileBar profileName="Mattia" />
        <SettingsContent />
        <NavigationMenuApp activeTab={activeTab} onNavigate={setActiveTab} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <ProfileBar profileName="Mattia" />

      <PWAInstallPrompt />

      <TotalValueCard investments={investments} />
      <TotalPanicSellSection investments={investments} />

      <Tabs defaultValue="etfs" className="mb-16 min-w-full">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="etfs">ETFs ({etfs.length})</TabsTrigger>
          <TabsTrigger value="stocks">Stocks ({stocks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="etfs">
          {!isLoaded ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Caricamento...
            </p>
          ) : etfs.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nessun ETF salvato. Aggiungi un investimento dalle impostazioni.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {etfs.map((investment) => (
                <Stock
                  key={investment.id}
                  ticker={investment.ticker}
                  priceBougth={investment.priceBought}
                  quantityInput={investment.quantity}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="stocks">
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
            <div className="flex flex-col gap-2">
              {stocks.map((investment) => (
                <Stock
                  key={investment.id}
                  ticker={investment.ticker}
                  priceBougth={investment.priceBought}
                  quantityInput={investment.quantity}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <NavigationMenuApp activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}

export default App
