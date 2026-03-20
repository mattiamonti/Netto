import { useCallback } from "react"
import type { Investment } from "@/types/investment"
import type { UserSettings } from "./useUserSettings"

const INVESTMENTS_KEY = "investments_data"
const SETTINGS_KEY = "user_settings"

export interface AppConfigData {
  version: number
  exportedAt: number
  investments: Investment[]
  settings: UserSettings
}

export function useAppConfig() {
  const exportConfig = useCallback((): AppConfigData => {
    const investments = localStorage.getItem(INVESTMENTS_KEY)
    const settings = localStorage.getItem(SETTINGS_KEY)

    const config: AppConfigData = {
      version: 1,
      exportedAt: Date.now(),
      investments: investments ? JSON.parse(investments) : [],
      settings: settings ? JSON.parse(settings) : { name: "", taxPercentage: 0 },
    }

    return config
  }, [])

  const importConfig = useCallback((configData: AppConfigData): boolean => {
    try {
      if (!configData.version || !configData.exportedAt) {
        console.error("Configurazione non valida")
        return false
      }

      localStorage.setItem(
        INVESTMENTS_KEY,
        JSON.stringify(configData.investments)
      )
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(configData.settings))

      window.dispatchEvent(new Event("storage"))

      return true
    } catch (e) {
      console.error("Errore durante l'importazione:", e)
      return false
    }
  }, [])

  return {
    exportConfig,
    importConfig,
  }
}
