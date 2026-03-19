import TotalValueCard from "@/components/TotalValueCard"
import ProfileBar from "@/components/ProfileBar"
import Stock from "@/components/Stock"
import NavigationMenuApp from "@/components/NavigationMenuApp"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TotalPanicSellSection from "./components/TotalPanicSellSection"

export function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <ProfileBar profileName="Mattia" />

      <TotalValueCard tickers={["SWDA.MI", "SMEA.MI"]} />
      <TotalPanicSellSection />

      <Tabs defaultValue="etfs" className="min-w-full">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="etfs">ETFs</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
        </TabsList>
        <TabsContent value="etfs">
          <div className="flex flex-col gap-2">
            <Stock ticker="SWDA.MI" priceBougth={100} quantityInput={10} />
            <Stock ticker="SMEA.MI" priceBougth={100} quantityInput={10} />
          </div>
        </TabsContent>
        <TabsContent value="stocks">Non ci sono Stocks salvate</TabsContent>
      </Tabs>
    </div>
  )
}

export default App
