import React, { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import GainAndLossBadge from "@/components/GainAndLossBadge"

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
          <GainAndLossBadge profit={234} percentage={10} />
        </CardDescription>
      </CardContent>
    </Card>
  )
}
