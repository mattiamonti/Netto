import UserSettingsForm from "@/components/UserSettingsForm"
import { PageTransition } from "@/components/PageTransition"

export default function SettingsPage() {
  return (
    <PageTransition>
      <UserSettingsForm />
    </PageTransition>
  )
}
