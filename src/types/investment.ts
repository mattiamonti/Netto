export type InvestmentType = "etf" | "stock"

export interface Investment {
  id: string
  ticker: string
  quantity: number
  priceBought: number
  type: InvestmentType
  createdAt: number
}

export interface InvestmentFormData {
  ticker: string
  quantity: number
  priceBought: number
  type: InvestmentType
}

export interface InvestmentWithPrice extends Investment {
  currentPrice: number | null
  name: string | null
  loading: boolean
}
