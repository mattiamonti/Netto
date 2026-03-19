import { useState, useEffect } from "react"
import { Share, Plus, Download } from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed/running as PWA
    const isStandaloneMode =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore - iOS specific
      window.navigator.standalone === true

    setIsStandalone(isStandaloneMode)

    // Check if iOS
    const isIOSDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      // @ts-ignore - iOS specific
      !window.MSStream

    setIsIOS(isIOSDevice)

    // Check if user has dismissed the prompt before
    const hasDismissed = localStorage.getItem("pwa-prompt-dismissed")
    const dismissedAt = hasDismissed ? parseInt(hasDismissed) : 0
    const daysSinceDismissal = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24)

    // Show prompt if not installed, not dismissed recently (7 days), and is iOS
    if (!isStandaloneMode && isIOSDevice && daysSinceDismissal > 7) {
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString())
  }

  if (!showPrompt || isStandalone) return null

  return (
    <AlertDialog open={showPrompt} onOpenChange={(open) => !open && handleDismiss()}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Installa l'app
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Installa Portafoglio per accedere rapidamente ai tuoi investimenti
              direttamente dalla home screen.
            </p>

            {isIOS && (
              <div className="flex flex-col gap-3 rounded-lg bg-muted p-4 text-sm">
                <p className="font-medium">Su iPhone/iPad:</p>
                <ol className="flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      1
                    </span>
                    Tocca il pulsante{" "}
                    <Share className="h-4 w-4" />
                    <span className="italic">Condividi</span> nella barra Safari
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      2
                    </span>
                    Scorri e tocca{" "}
                    <span className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Aggiungi alla home
                    </span>
                  </li>
                </ol>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDismiss}>
            Più tardi
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
