import { useState, useCallback, useEffect } from "react"
import type { Investment, InvestmentFormData, InvestmentType } from "@/types/investment"

const STORAGE_KEY = "investments_data"

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

function loadInvestmentsFromStorage(): Investment[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Errore nel parsing degli investimenti:", e)
    }
  }
  return []
}

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>(loadInvestmentsFromStorage)
  const [isLoaded, setIsLoaded] = useState(false)

  // Marcatore per indicare che il caricamento iniziale è completato
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Salva gli investimenti nel localStorage ogni volta che cambiano
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(investments))
    }
  }, [investments, isLoaded])

  const addInvestment = useCallback((data: InvestmentFormData) => {
    const newInvestment: Investment = {
      ...data,
      id: generateId(),
      createdAt: Date.now(),
    }
    setInvestments((prev) => [...prev, newInvestment])
  }, [])

  const updateInvestment = useCallback((id: string, data: Partial<InvestmentFormData>) => {
    setInvestments((prev) =>
      prev.map((inv) =>
        inv.id === id ? { ...inv, ...data } : inv
      )
    )
  }, [])

  const removeInvestment = useCallback((id: string) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== id))
  }, [])

  const getInvestmentsByType = useCallback(
    (type: InvestmentType) => {
      return investments.filter((inv) => inv.type === type)
    },
    [investments]
  )

  return {
    investments,
    isLoaded,
    addInvestment,
    updateInvestment,
    removeInvestment,
    getInvestmentsByType,
  }
}
