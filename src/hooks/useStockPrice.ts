import { useState, useEffect } from "react"

const CACHE_SECONDS = 600
const CACHE_BASE_KEY = "yahoo_finance_cache_"
const PROXY = "https://corsproxy.io?"
const BASE_URL = "https://query2.finance.yahoo.com/v8/finance/chart/"
const QUERY = "?interval=1d&range=1y"

interface YahooFinanceData {
  price: number | null
  name: string | null
  loading: boolean
  historicalMonthData: {
    timestamp: number
    closingPrice: number
  }[]
}

export function useStockPrice(ticker: string): YahooFinanceData {
  const [price, setPrice] = useState<number | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [historicalMonthData, setHistoricalMonthData] = useState<
    {
      timestamp: number
      closingPrice: number
    }[]
  >([])

  useEffect(() => {
    const fetchData = async () => {
      const CACHE_KEY = CACHE_BASE_KEY + ticker
      const cached = localStorage.getItem(CACHE_KEY)
      const now = Date.now()

      if (cached) {
        const {
          value,
          name: cachedName,
          expiry,
          historicalData,
        } = JSON.parse(cached)
        if (now < expiry) {
          setPrice(value)
          setName(cachedName)
          setLoading(false)
          setHistoricalMonthData(historicalData)
          return
        }
      }

      try {
        const target = BASE_URL + ticker + QUERY
        const response = await fetch(PROXY + encodeURIComponent(target))
        const json = await response.json()

        const fetchedPrice = json.chart.result[0].meta.regularMarketPrice
        const longName = json.chart.result[0].meta.longName
        const timestamps = json.chart.result[0].timestamp
        const closingPrices = json.chart.result[0].indicators.quote[0].close
        const combinedHistoricalData = timestamps.map(
          (timestamp: number, index: number) => ({
            timestamp,
            closingPrice: closingPrices[index],
          })
        )

        const cacheData = {
          value: fetchedPrice,
          name: longName,
          historicalData: combinedHistoricalData,
          expiry: now + CACHE_SECONDS * 1000,
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

        setPrice(fetchedPrice)
        setName(longName)
        setHistoricalMonthData(combinedHistoricalData)
      } catch (error) {
        console.error("Errore fetch:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [ticker])

  return { price, name, loading, historicalMonthData }
}

export function fetchStockPrice(ticker: string): Promise<{
  price: number
  name: string
  historicalData: { timestamp: number; closingPrice: number }[]
}> {
  return new Promise((resolve, reject) => {
    const CACHE_KEY = CACHE_BASE_KEY + ticker
    const cached = localStorage.getItem(CACHE_KEY)
    const now = Date.now()

    if (cached) {
      const {
        value,
        name: cachedName,
        expiry,
        historicalData,
      } = JSON.parse(cached)
      if (now < expiry) {
        resolve({ price: value, name: cachedName, historicalData })
        return
      }
    }

    const target = BASE_URL + ticker + QUERY
    fetch(PROXY + encodeURIComponent(target))
      .then((response) => response.json())
      .then((json) => {
        const fetchedPrice = json.chart.result[0].meta.regularMarketPrice
        const longName = json.chart.result[0].meta.longName
        const timestamps = json.chart.result[0].timestamp
        const closingPrices = json.chart.result[0].indicators.quote[0].close
        const combinedHistoricalData = timestamps.map(
          (timestamp: number, index: number) => ({
            timestamp,
            closingPrice: closingPrices[index],
          })
        )

        const cacheData = {
          value: fetchedPrice,
          name: longName,
          historicalData: combinedHistoricalData,
          expiry: now + CACHE_SECONDS * 1000,
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

        resolve({
          price: fetchedPrice,
          name: longName,
          historicalData: combinedHistoricalData,
        })
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
