import { useState, useEffect, useCallback } from "react"

const CACHE_SECONDS = 600
const CACHE_BASE_KEY = "yahoo_finance_cache_"
const PROXY = "https://corsproxy.io?"
const BASE_URL = "https://query2.finance.yahoo.com/v8/finance/chart/"
const QUERY = "?interval=1d&range=1y"

export interface StockPriceData {
  price: number | null
  name: string | null
  loading: boolean
  historicalMonthData: {
    timestamp: number
    closingPrice: number
  }[]
}

export interface StockPriceMap {
  [ticker: string]: StockPriceData
}

function fetchStockPriceFromAPI(ticker: string): Promise<{
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

export function useStockPrices(tickers: string[]): StockPriceMap {
  const [stockPrices, setStockPrices] = useState<StockPriceMap>({})

  const fetchAllPrices = useCallback(async () => {
    // Initialize all tickers with loading state
    const initialData: StockPriceMap = {}
    tickers.forEach((ticker) => {
      initialData[ticker] = {
        price: null,
        name: null,
        loading: true,
        historicalMonthData: [],
      }
    })
    setStockPrices(initialData)

    // Fetch all prices in parallel
    const promises = tickers.map(async (ticker) => {
      try {
        const { price, name, historicalData } = await fetchStockPriceFromAPI(ticker)
        setStockPrices((prev) => ({
          ...prev,
          [ticker]: {
            price,
            name,
            loading: false,
            historicalMonthData: historicalData,
          },
        }))
      } catch (error) {
        console.error(`Error fetching ${ticker}:`, error)
        setStockPrices((prev) => ({
          ...prev,
          [ticker]: {
            ...prev[ticker],
            loading: false,
          },
        }))
      }
    })

    await Promise.all(promises)
  }, [tickers])

  useEffect(() => {
    if (tickers.length > 0) {
      fetchAllPrices()
    }
  }, [tickers, fetchAllPrices])

  return stockPrices
}

export function fetchStockPrice(ticker: string): Promise<{
  price: number
  name: string
  historicalData: { timestamp: number; closingPrice: number }[]
}> {
  return fetchStockPriceFromAPI(ticker)
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

export function getCachedPrices(tickers: string[]): { [ticker: string]: number | null } {
  const result: { [ticker: string]: number | null } = {}
  tickers.forEach((ticker) => {
    result[ticker] = getCachedPrice(ticker)
  })
  return result
}
