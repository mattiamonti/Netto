import { Avatar, AvatarFallback } from "@/components/ui/avatar"
interface AvatarDemoProps {
  profileName: string
}
export default function AvatarDemo({ profileName }: AvatarDemoProps) {
  const initial = profileName.at(0)?.toUpperCase()
  return (
    <Avatar className="cursor-pointer">
      <AvatarFallback>{initial === "." ? "?" : initial}</AvatarFallback>
    </Avatar>
  )
}
