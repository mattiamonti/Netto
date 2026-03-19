import React, { useState, useEffect } from "react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Badge } from "@/components/ui/badge"
import StockDetails from "@/components/StockDetails"
import { TrendingUp } from "lucide-react"
import SpinnerCircle from "./customized/spinner/spinner-02"
import GainAndLossBadge from "@/components/GainAndLossBadge"

interface StockProps {
  ticker: string
  priceBougth: number
  quantityInput: number
}

const CACHE_SECONDS = 600 // Durata della cache in secondi
const CACHE_BASE_KEY = "yahoo_finance_cache_"
const PROXY = "https://corsproxy.io?"
const BASE_URL = "https://query2.finance.yahoo.com/v8/finance/chart/"

export default function Stock({
  ticker,
  priceBougth,
  quantityInput,
}: StockProps) {
  const [price, setPrice] = useState<number | string | null>(null)
  const [quantity, setQuantity] = useState<number | string | null>(null)
  const [name, setName] = useState<number | string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const target = BASE_URL + ticker
  const CACHE_KEY = CACHE_BASE_KEY + ticker
  useEffect(() => {
    const fetchData = async () => {
      const cached = localStorage.getItem(CACHE_KEY)
      const now = Date.now()

      if (cached) {
        const { value, name, cachedQuantity, expiry } = JSON.parse(cached)
        // Se la cache è ancora valida, usala e interrompi la fetch
        if (now < expiry && quantityInput === cachedQuantity) {
          setPrice(value)
          setName(name)
          setQuantity(quantityInput)
          setLoading(false)
          return
        }
      }

      // Se non c'è cache o è scaduta, procedi con la chiamata
      try {
        const response = await fetch(PROXY + encodeURIComponent(target))
        const json = await response.json()

        // Estraiamo il campo (Yahoo Chart ha una struttura annidata)
        const price = json.chart.result[0].meta.regularMarketPrice
        const longName = json.chart.result[0].meta.longName

        // Salviamo in localStorage con timestamp di scadenza
        const cacheData = {
          value: price,
          name: longName,
          cachedQuantity: quantityInput,
          expiry: now + CACHE_SECONDS * 1000,
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
        console.log("Cache setted")

        setPrice(price)
        setName(longName)
        setQuantity(quantityInput)
      } catch (error) {
        console.error("Errore fetch:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="flex h-auto w-full flex-col gap-6 md:gap-24">
      <Item variant="outline">
        <ItemContent className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div>
            <ItemTitle>{name}</ItemTitle>
            <ItemDescription>{ticker}</ItemDescription>
          </div>
          <div className="flex flex-row items-center gap-2">
            {loading ? (
              <SpinnerCircle />
            ) : (
              <div className="text-lg">{(price * quantity).toFixed(2)} €</div>
            )}
            <GainAndLossBadge
              profit={null}
              percentage={(price / priceBougth - 1) * 100}
            />
          </div>
        </ItemContent>
        <ItemActions>
          <StockDetails
            ticker={ticker}
            name={name}
            value={price}
            priceBougth={priceBougth}
            quantity={quantity}
          />
        </ItemActions>
      </Item>
    </div>
  )
}
