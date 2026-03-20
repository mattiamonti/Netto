import AvatarDemo from "@/components/customized/avatar/avatar-01"
import SettingsContent from "@/components/SettingsContent"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import UserSettingsForm from "./UserSettingsForm"

interface ProfileBarProps {
  profileName: string
}

export default function ProfileBar({ profileName }: ProfileBarProps) {
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
        <AlertDialog>
          <AlertDialogTrigger>
            <AvatarDemo profileName={profileName} />
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-lg!">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold tracking-[-0.015em]">
                Impostazioni
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[15px]">
                Configura la tua app
              </AlertDialogDescription>
            </AlertDialogHeader>
            <UserSettingsForm />
            <AlertDialogFooter className="-mt-4">
              <AlertDialogCancel>Chiudi</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
