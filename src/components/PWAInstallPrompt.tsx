import { useState, useEffect } from "react"
import {
  Share,
  Plus,
  Download,
  X,
  Option,
  Dot,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore - iOS specific
      window.navigator.standalone === true

    setIsStandalone(isStandaloneMode)

    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      // @ts-ignore - iOS specific
      !window.MSStream

    setIsIOS(isIOSDevice)

    const hasDismissed = localStorage.getItem("pwa-prompt-dismissed")
    const dismissedAt = hasDismissed ? parseInt(hasDismissed) : 0
    const daysSinceDismissal =
      (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)

    if (!isStandaloneMode && isIOSDevice && daysSinceDismissal > 7) {
      const timer = setTimeout(() => setShowPrompt(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString())
  }

  if (!showPrompt || isStandalone) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-md animate-in rounded-2xl border bg-background p-6 shadow-lg slide-in-from-bottom-10 fade-in">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 rounded-full p-1 hover:bg-muted"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <img src="/Netto/icon.svg" className="h-12 w-12" />
          </div>

          <h2 className="mb-2 text-xl font-semibold">
            Installa l'app nella home
          </h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Ottieni un'esperienza migliore, accedi rapidamente ai tuoi
            investimenti direttamente dalla tua home screen.
          </p>

          {isIOS && (
            <div className="w-full space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-muted p-4 text-left">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  1
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm">Premi</span>
                  <Share className="h-4 w-4" />
                  <span className="text-sm font-medium">Condividi</span>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-muted p-4 text-left">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  2
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm">Premi</span>
                  <MoreHorizontal className="h-5 w-5" />
                  <span className="text-sm font-medium">Altro</span>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl bg-muted p-4 text-left">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  3
                </div>
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm">Premi</span>
                  <Plus className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Aggiungi alla schermata home
                  </span>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleDismiss}
            className="mt-6 w-full"
            variant="outline"
          >
            Più tardi
          </Button>
        </div>
      </div>
    </div>
  )
}
