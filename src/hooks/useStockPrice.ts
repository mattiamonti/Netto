import { useState, useEffect } from "react"

const CACHE_SECONDS = 600
const CACHE_BASE_KEY = "yahoo_finance_cache_"
const PROXY = "https://corsproxy.io?"
const BASE_URL = "https://query2.finance.yahoo.com/v8/finance/chart/"

interface YahooFinanceData {
  price: number | null
  name: string | null
  loading: boolean
}

export function useStockPrice(ticker: string): YahooFinanceData {
  const [price, setPrice] = useState<number | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchData = async () => {
      const CACHE_KEY = CACHE_BASE_KEY + ticker
      const cached = localStorage.getItem(CACHE_KEY)
      const now = Date.now()

      if (cached) {
        const { value, name: cachedName, expiry } = JSON.parse(cached)
        if (now < expiry) {
          setPrice(value)
          setName(cachedName)
          setLoading(false)
          return
        }
      }

      try {
        const target = BASE_URL + ticker
        const response = await fetch(PROXY + encodeURIComponent(target))
        const json = await response.json()

        const fetchedPrice = json.chart.result[0].meta.regularMarketPrice
        const longName = json.chart.result[0].meta.longName

        const cacheData = {
          value: fetchedPrice,
          name: longName,
          expiry: now + CACHE_SECONDS * 1000,
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

        setPrice(fetchedPrice)
        setName(longName)
      } catch (error) {
        console.error("Errore fetch:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ticker])

  return { price, name, loading }
}

export function fetchStockPrice(ticker: string): Promise<{ price: number; name: string }> {
  return new Promise((resolve, reject) => {
    const CACHE_KEY = CACHE_BASE_KEY + ticker
    const cached = localStorage.getItem(CACHE_KEY)
    const now = Date.now()

    if (cached) {
      const { value, name: cachedName, expiry } = JSON.parse(cached)
      if (now < expiry) {
        resolve({ price: value, name: cachedName })
        return
      }
    }

    const target = BASE_URL + ticker
    fetch(PROXY + encodeURIComponent(target))
      .then((response) => response.json())
      .then((json) => {
        const fetchedPrice = json.chart.result[0].meta.regularMarketPrice
        const longName = json.chart.result[0].meta.longName

        const cacheData = {
          value: fetchedPrice,
          name: longName,
          expiry: now + CACHE_SECONDS * 1000,
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

        resolve({ price: fetchedPrice, name: longName })
      })
      .catch((error) => {
        console.error("Errore fetch:", error)
        reject(error)
      })
  })
}

export function getCachedPrice(ticker: string): number | null {
  const CACHE_KEY = CACHE_BASE_KEY + ticker
  const cached = localStorage.getItem(CACHE_KEY)
  if (cached) {
    const { value } = JSON.parse(cached)
    return value
  }
  return null
}
