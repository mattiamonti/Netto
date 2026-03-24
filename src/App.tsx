import { useState } from "react"
import TotalValueCard from "@/components/TotalValueCard"
import ProfileBar from "@/components/ProfileBar"
import NavigationMenuApp from "@/components/NavigationMenuApp"
import SettingsContent from "@/components/SettingsContent"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TotalPanicSellSection from "@/components/TotalPanicSellSection"
import { useInvestments } from "@/hooks/useInvestments"
import { useUserSettings } from "@/hooks/useUserSettings"
import UserSettingsForm from "@/components/UserSettingsForm"
import StockItem from "@/components/StockItem"
import { ScrollArea } from "@/components/ui/scroll-area"
import PortfolioComposition from "@/components/PortfolioComposition"
import { AnimatedList } from "@/components/ui/animated-list"

export function App() {
  const [activeTab, setActiveTab] = useState<
    "home" | "settings" | "strumenti" | "composizione"
  >("home")
  const { investments, getInvestmentsByType, isLoaded } = useInvestments()
  const { settings } = useUserSettings()

  const etfs = getInvestmentsByType("etf")
  const stocks = getInvestmentsByType("stock")
  const profileName = settings.name || "..."

  if (activeTab === "composizione") {
    return (
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
        <ProfileBar profileName={profileName} onNavigate={setActiveTab} />
        <PortfolioComposition investments={investments} />
        <NavigationMenuApp activeTab={activeTab} onNavigate={setActiveTab} />
      </div>
    )
  }

  if (activeTab === "strumenti") {
    return (
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
        <ProfileBar profileName={profileName} onNavigate={setActiveTab} />
        <SettingsContent />
        <NavigationMenuApp activeTab={activeTab} onNavigate={setActiveTab} />
      </div>
    )
  }

  if (activeTab === "settings") {
    return (
      <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
        <ProfileBar profileName={profileName} onNavigate={setActiveTab} />
        <UserSettingsForm />
        <NavigationMenuApp activeTab={activeTab} onNavigate={setActiveTab} />
      </div>
    )
  }

  return (
    <div className="mx-auto flex h-full max-w-2xl flex-col gap-6 overflow-y-hidden p-6">
      <ProfileBar profileName={profileName} onNavigate={setActiveTab} />

      <PWAInstallPrompt />

      <TotalValueCard investments={investments} />
      <TotalPanicSellSection investments={investments} />

      <Tabs defaultValue="etfs" className="mb-16 min-w-full">
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

      <NavigationMenuApp activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  )
}

export default App
