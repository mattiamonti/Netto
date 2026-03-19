import React, { useState, useEffect } from "react"
import { ArrowUpRight, CirclePlay } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

interface TotalValueCardProps {
  tickers: string[]
}

export default function TotalValueCard({ tickers }: TotalValueCardProps) {
  const [totalPrice, setTotalPrice] = useState<number | string | null>(null)
  useEffect(() => {
    let total = 0
    tickers.forEach((ticker) => {
      const CACHE_KEY = "yahoo_finance_cache_" + ticker
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { value, cachedQuantity } = JSON.parse(cached)
        total += value * cachedQuantity
        return
      }
    })
    setTotalPrice(total)
  }, [])

  return (
    <Card className="w-full max-w-2xl shadow-none">
      <CardHeader className="px-8">
        <CardDescription className="hidden max-w-lg text-left text-lg text-muted-foreground">
          Buongiorno, Mattia
        </CardDescription>
      </CardHeader>
      <CardContent className="mx-auto flex flex-col px-8">
        <CardTitle className="text-5xl font-medium tracking-tight md:text-6xl">
          <span className="text-2xl text-muted-foreground md:text-3xl">€ </span>
          {totalPrice}
        </CardTitle>
        <CardDescription className="mx-auto mt-4 max-w-lg text-xl text-muted-foreground">
          <Badge className="gap-1.5 border-emerald-600/40 bg-emerald-600/10 text-sm text-emerald-500 shadow-none hover:bg-emerald-600/10 dark:bg-emerald-600/20">
            <TrendingUp size={20} /> 234 € | 10%
          </Badge>
        </CardDescription>
      </CardContent>
    </Card>
  )
}
