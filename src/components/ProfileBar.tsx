import AvatarDemo from "@/components/customized/avatar/avatar-01"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileBarProps {
  profileName: string
  onNavigate: (tab: "home" | "strumenti" | "settings") => void
}

export default function ProfileBar({
  profileName,
  onNavigate,
}: ProfileBarProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-row items-center justify-between">
      <h1 className="text-2xl opacity-80">Ciao, {profileName}</h1>
      <div className="flex flex-row items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          className="h-10 w-10"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        <div
          onClick={(e) => {
            e.preventDefault()
            onNavigate?.("settings")
          }}
        >
          <AvatarDemo profileName={profileName} />
        </div>
      </div>
    </div>
  )
}
