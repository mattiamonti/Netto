import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const products = [
  {
    ticker: "SWDA.MI",
    name: "IShares Core MSCI World",
    category: "ETF",
    pmc: 59.99,
    value: 100,
    pl: 10,
  },
  {
    ticker: "VGEA.MI",
    name: "Vanguard Eurozone Bonds",
    category: "ETF",
    pmc: 100.99,
    value: 100,
    pl: -0.99,
  },
]

export default function RoundedCornersTableDemo() {
  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Ticker</TableHead>
            <TableHead>Strumento</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Prezzo di carico</TableHead>
            <TableHead>Valore attuale</TableHead>
            <TableHead>Guadagno / Perdita</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow className="odd:bg-muted/50" key={product.ticker}>
              <TableCell className="pl-4">{product.ticker}</TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.pmc}</TableCell>
              <TableCell>{product.value}</TableCell>
              <TableCell>{product.pl}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
