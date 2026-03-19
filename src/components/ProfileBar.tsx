import AvatarDemo from "@/components/customized/avatar/avatar-01"
import SettingsContent from "@/components/SettingsContent"
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

interface ProfileBarProps {
  profileName: string
}

export default function ProfileBar({ profileName }: ProfileBarProps) {
  return (
    <div className="flex flex-row justify-between">
      <h1 className="text-2xl opacity-80">Ciao, {profileName}</h1>
      <AlertDialog>
        <AlertDialogTrigger>
          <AvatarDemo />
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
          <SettingsContent />
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Chiudi</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
