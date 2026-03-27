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
import { toast } from "sonner"
import { AnimatedList } from "@/components/ui/animated-list"

const INVESTMENT_TYPES: { value: InvestmentType; label: string }[] = [
  { value: "etf", label: "ETF" },
  { value: "stock", label: "Stock" },
]

const EMPTY_STATE_MESSAGES: Record<InvestmentType, string> = {
  etf: "Nessun ETF salvato",
  stock: "Nessuno Stock salvato",
}

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

  const validateForm = (): boolean => {
    if (!ticker.trim()) {
      setError("Il ticker è obbligatorio")
      return false
    }

    const qty = parseFloat(quantity)
    const price = parseFloat(priceBought)

    if (isNaN(qty) || qty <= 0) {
      setError("La quantità deve essere un numero positivo")
      return false
    }

    if (isNaN(price) || price <= 0) {
      setError("Il prezzo deve essere un numero positivo")
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onSubmit({
      ticker: ticker.toUpperCase().trim(),
      quantity: parseFloat(quantity),
      priceBought: parseFloat(priceBought),
      type,
    })
    toast.success(`Added ${type}`, { position: "top-center" })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <FormField
        id="ticker"
        label="Ticker"
        value={ticker}
        onChange={setTicker}
        placeholder="Es. SWDA.MI"
        disabled={!!initialData}
      />

      <FormField
        id="type"
        label="Tipo"
        value={type}
        onChange={(v) => setType(v)}
        renderInput={(value, onChange) => (
          <Tabs
            value={value}
            onValueChange={(v) => onChange(v as InvestmentType)}
            className="w-full"
          >
            <TabsList className="w-full">
              {INVESTMENT_TYPES.map((t) => (
                <TabsTrigger key={t.value} value={t.value} className="flex-1">
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      />

      <NumericFormField
        id="quantity"
        label="Quantità"
        value={quantity}
        onChange={setQuantity}
        placeholder="Es. 10"
      />

      <NumericFormField
        id="priceBought"
        label="Prezzo di acquisto (per quota)"
        value={priceBought}
        onChange={setPriceBought}
        placeholder="Es. 59.99"
      />

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

interface FormFieldProps<T extends string> {
  id: string
  label: string
  value: T
  onChange: (value: T) => void
  placeholder?: string
  disabled?: boolean
  renderInput?: (value: string, onChange: (value: string) => void) => React.ReactNode
}

function FormField<T extends string>({
  id,
  label,
  value,
  onChange,
  placeholder,
  disabled,
  renderInput,
}: FormFieldProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {renderInput ? (
        renderInput(value, onChange as (value: string) => void)
      ) : (
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  )
}

interface NumericFormFieldProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}

function NumericFormField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: NumericFormFieldProps) {
  return (
    <FormField
      id={id}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      renderInput={(val, handleChange) => (
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          value={val}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          pattern="[0-9]*"
        />
      )}
    />
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

interface DeleteInvestmentDialogProps {
  investment: Investment
  onConfirm: (id: string) => void
}

function DeleteInvestmentDialog({
  investment,
  onConfirm,
}: DeleteInvestmentDialogProps) {
  return (
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
            <AlertDialogTitle>Elimina investimento</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            Questo eliminerà l'investimento e tutti i dati collegati ad esso.
            L'azione non può essere annullata.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => onConfirm(investment.id)}
          >
            Elimina investimento
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

interface InvestmentItemProps {
  investment: Investment
  onUpdate: (
    id: string,
    data: { quantity: number; priceBought: number }
  ) => void
  onRemove: (id: string) => void
}

function InvestmentItem({
  investment,
  onUpdate,
  onRemove,
}: InvestmentItemProps) {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>{investment.ticker}</ItemTitle>
        <ItemDescription>
          {investment.quantity} quote @ {investment.priceBought.toFixed(2)} €
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <EditInvestmentDialog investment={investment} onUpdate={onUpdate} />
        <DeleteInvestmentDialog investment={investment} onConfirm={onRemove} />
      </ItemActions>
    </Item>
  )
}

interface InvestmentListProps {
  investments: Investment[]
  type: InvestmentType
  onUpdate: (
    id: string,
    data: { quantity: number; priceBought: number }
  ) => void
  onRemove: (id: string) => void
}

function InvestmentList({
  investments,
  type,
  onUpdate,
  onRemove,
}: InvestmentListProps) {
  const isEmpty = investments.length === 0

  return (
    <TabsContent value={`${type}s`} className="space-y-2">
      <AnimatedList delay={100}>
        <div className="space-y-2">
          {isEmpty ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              {EMPTY_STATE_MESSAGES[type]}
            </p>
          ) : (
            investments.map((investment) => (
              <InvestmentItem
                key={investment.id}
                investment={investment}
                onUpdate={onUpdate}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
      </AnimatedList>
    </TabsContent>
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

  const hasNoInvestments = investments.length === 0

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

      {hasNoInvestments ? (
        <p className="text-center text-muted-foreground">
          Nessun investimento salvato. Aggiungi un ETF o Stock per iniziare.
        </p>
      ) : (
        <Tabs defaultValue="etfs" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="etfs">ETFs ({etfs.length})</TabsTrigger>
            <TabsTrigger value="stocks">
              Stocks ({stocks.length})
            </TabsTrigger>
          </TabsList>

          <InvestmentList
            investments={etfs}
            type="etf"
            onUpdate={handleUpdateInvestment}
            onRemove={handleRemoveInvestment}
          />

          <InvestmentList
            investments={stocks}
            type="stock"
            onUpdate={handleUpdateInvestment}
            onRemove={handleRemoveInvestment}
          />
        </Tabs>
      )}
    </div>
  )
}
