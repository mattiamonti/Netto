import { Routes, Route, Navigate } from "react-router-dom"
import { useUserSettings } from "@/hooks/useUserSettings"
import HomePage from "@/pages/HomePage"
import StrumentiPage from "@/pages/StrumentiPage"
import ComposizionePage from "@/pages/ComposizionePage"
import SettingsPage from "@/pages/SettingsPage"
import ProfileBar from "@/components/ProfileBar"
import NavigationMenuApp from "@/components/NavigationMenuApp"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"

interface PageLayoutProps {
  children: React.ReactNode
  activeTab: "home" | "strumenti" | "composizione" | "settings"
  onNavigate: (tab: "home" | "strumenti" | "composizione" | "settings") => void
}

function PageLayout({ children, activeTab, onNavigate }: PageLayoutProps) {
  const { settings } = useUserSettings()
  const profileName = settings.name || "..."

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <ProfileBar profileName={profileName} />
      <PWAInstallPrompt />
      {children}
      <NavigationMenuApp activeTab={activeTab} onNavigate={onNavigate} />
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route path="/Netto" element={<Navigate to="/Netto/home" replace />} />
      <Route
        path="/Netto/home"
        element={
          <PageLayout activeTab="home" onNavigate={() => {}}>
            <HomePage />
          </PageLayout>
        }
      />
      <Route
        path="/Netto/strumenti"
        element={
          <PageLayout activeTab="strumenti" onNavigate={() => {}}>
            <StrumentiPage />
          </PageLayout>
        }
      />
      <Route
        path="/Netto/composizione"
        element={
          <PageLayout activeTab="composizione" onNavigate={() => {}}>
            <ComposizionePage />
          </PageLayout>
        }
      />
      <Route
        path="/Netto/settings"
        element={
          <PageLayout activeTab="settings" onNavigate={() => {}}>
            <SettingsPage />
          </PageLayout>
        }
      />
    </Routes>
  )
}

export default App
