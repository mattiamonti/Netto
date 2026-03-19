import { Button } from "@/components/ui/button"
import TotalValueCard from "@/components/customized/card/card-04"
import RoundedCornersTableDemo from "./components/customized/table/table-04"
import ProfileBar from "@/components/profile-bar"
import Stock from "@/components/stock"

export function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <ProfileBar profileName="Mattia" />

      <TotalValueCard tickers={["SWDA.MI", "SMEA.MI"]} />

      <div className="flex flex-col gap-2">
        <Stock ticker="SWDA.MI" priceBougth={100} quantityInput={10} />
        <Stock ticker="SMEA.MI" priceBougth={90} quantityInput={10} />
      </div>

      <div className="flex hidden max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>We&apos;ve already added the button component for you.</p>
          <Button className="mt-2">Button</Button>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}

export default App
