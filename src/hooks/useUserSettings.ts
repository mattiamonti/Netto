import { useState, useCallback, useEffect } from "react"

const STORAGE_KEY = "user_settings"

export interface UserSettings {
  name: string
  taxPercentage: number
}

const DEFAULT_SETTINGS: UserSettings = {
  name: "",
  taxPercentage: 26,
}

function loadSettingsFromStorage(): UserSettings {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Errore nel parsing delle impostazioni utente:", e)
    }
  }
  return DEFAULT_SETTINGS
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(
    loadSettingsFromStorage
  )
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    }
  }, [settings, isLoaded])

  const updateSettings = useCallback((data: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...data }))
  }, [])

  return {
    settings,
    isLoaded,
    updateSettings,
  }
}
