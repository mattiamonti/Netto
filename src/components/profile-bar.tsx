import AvatarDemo from "@/components/customized/avatar/avatar-01"

interface ProfileBarProps {
  profileName: string
}

export default function ProfileBar({ profileName }: ProfileBarProps) {
  return (
    <div className="flex flex-row justify-between">
      <h1 className="text-2xl opacity-80">Ciao, {profileName}</h1>
      <AvatarDemo />
    </div>
  )
}
