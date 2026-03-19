import { useState } from "react"
import { useInvestments } from "@/hooks/useInvestments"
import type { Investment, InvestmentType } from "@/types/investment"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Edit, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface InvestmentFormProps {
  initialData?: Investment
  onSubmit: (data: {
    ticker: string
    quantity: number
    priceBought: number
    type: InvestmentType
  }) => void
  onCancel: () => void
}

function InvestmentForm({
  initialData,
  onSubmit,
  onCancel,
}: InvestmentFormProps) {
  const [ticker, setTicker] = useState(initialData?.ticker ?? "")
  const [quantity, setQuantity] = useState(
    initialData?.quantity.toString() ?? ""
  )
  const [priceBought, setPriceBought] = useState(
    initialData?.priceBought.toString() ?? ""
  )
  const [type, setType] = useState<InvestmentType>(initialData?.type ?? "etf")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!ticker.trim()) {
      setError("Il ticker è obbligatorio")
      return
    }

    const qty = parseFloat(quantity)
    const price = parseFloat(priceBought)

    if (isNaN(qty) || qty <= 0) {
      setError("La quantità deve essere un numero positivo")
      return
    }

    if (isNaN(price) || price <= 0) {
      setError("Il prezzo deve essere un numero positivo")
      return
    }

    onSubmit({
      ticker: ticker.toUpperCase().trim(),
      quantity: qty,
      priceBought: price,
      type,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="ticker">Ticker</Label>
        <Input
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="Es. SWDA.MI"
          disabled={!!initialData}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Tipo</Label>
        <Tabs
          value={type}
          onValueChange={(v) => setType(v as InvestmentType)}
          className="w-full"
        >
          <TabsList className="w-full">
            <TabsTrigger value="etf" className="flex-1">
              ETF
            </TabsTrigger>
            <TabsTrigger value="stock" className="flex-1">
              Stock
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="quantity">Quantità</Label>
        <Input
          id="quantity"
          type="number"
          inputMode="decimal"
          step="any"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Es. 10"
          pattern="[0-9]*"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="priceBought">Prezzo di acquisto (per quota)</Label>
        <Input
          id="priceBought"
          type="number"
          inputMode="decimal"
          step="any"
          value={priceBought}
          onChange={(e) => setPriceBought(e.target.value)}
          placeholder="Es. 59.99"
          pattern="[0-9]*"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>
            Annulla
          </Button>
        </DialogClose>
        <Button type="submit">
          {initialData ? "Salva modifiche" : "Aggiungi"}
        </Button>
      </DialogFooter>
    </form>
  )
}

interface EditInvestmentDialogProps {
  investment: Investment
  onUpdate: (
    id: string,
    data: { quantity: number; priceBought: number }
  ) => void
}

function EditInvestmentDialog({
  investment,
  onUpdate,
}: EditInvestmentDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifica {investment.ticker}</DialogTitle>
        </DialogHeader>
        <InvestmentForm
          initialData={investment}
          onSubmit={(data) => {
            onUpdate(investment.id, {
              quantity: data.quantity,
              priceBought: data.priceBought,
            })
            setOpen(false)
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}

export default function SettingsContent() {
  const {
    investments,
    addInvestment,
    updateInvestment,
    removeInvestment,
    getInvestmentsByType,
  } = useInvestments()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const etfs = getInvestmentsByType("etf")
  const stocks = getInvestmentsByType("stock")

  const handleAddInvestment = (data: {
    ticker: string
    quantity: number
    priceBought: number
    type: InvestmentType
  }) => {
    addInvestment(data)
    setIsAddDialogOpen(false)
  }

  const handleUpdateInvestment = (
    id: string,
    data: { quantity: number; priceBought: number }
  ) => {
    updateInvestment(id, data)
  }

  const handleRemoveInvestment = (id: string) => {
    removeInvestment(id)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">I tuoi investimenti</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="icon">
              <Plus />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Aggiungi nuovo investimento</DialogTitle>
            </DialogHeader>
            <InvestmentForm
              onSubmit={handleAddInvestment}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {investments.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Nessun investimento salvato. Aggiungi un ETF o Stock per iniziare.
        </p>
      ) : (
        <Tabs defaultValue="etfs" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="etfs">ETFs ({etfs.length})</TabsTrigger>
            <TabsTrigger value="stocks">Stocks ({stocks.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="etfs" className="space-y-2">
            {etfs.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nessun ETF salvato
              </p>
            ) : (
              etfs.map((investment) => (
                <Item key={investment.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{investment.ticker}</ItemTitle>
                    <ItemDescription>
                      {investment.quantity} quote @{" "}
                      {investment.priceBought.toFixed(2)} €
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <EditInvestmentDialog
                      investment={investment}
                      onUpdate={handleUpdateInvestment}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <div className="flex items-center gap-2">
                            <Trash2 className="size-5 text-destructive" />
                            <AlertDialogTitle>
                              Elimina investimento
                            </AlertDialogTitle>
                          </div>
                          <AlertDialogDescription>
                            Questo eliminerà l'investimento e tutti i dati
                            collegati ad esso. L'azione non può essere
                            annullata.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() =>
                              handleRemoveInvestment(investment.id)
                            }
                          >
                            Elimina investimento
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </ItemActions>
                </Item>
              ))
            )}
          </TabsContent>

          <TabsContent value="stocks" className="space-y-2">
            {stocks.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Nessuno Stock salvato
              </p>
            ) : (
              stocks.map((investment) => (
                <Item key={investment.id} variant="outline">
                  <ItemContent>
                    <ItemTitle>{investment.ticker}</ItemTitle>
                    <ItemDescription>
                      {investment.quantity} quote @{" "}
                      {investment.priceBought.toFixed(2)} €
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <EditInvestmentDialog
                      investment={investment}
                      onUpdate={handleUpdateInvestment}
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <div className="flex items-center gap-2">
                            <Trash2 className="size-5 text-destructive" />
                            <AlertDialogTitle>
                              Elimina investimento
                            </AlertDialogTitle>
                          </div>
                          <AlertDialogDescription>
                            Questo eliminerà l'investimento e tutti i dati
                            collegati ad esso. L'azione non può essere
                            annullata.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() =>
                              handleRemoveInvestment(investment.id)
                            }
                          >
                            Elimina investimento
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </ItemActions>
                </Item>
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
