import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function AvatarDemo() {
  return (
    <Avatar className="cursor-pointer">
      <AvatarFallback>MM</AvatarFallback>
    </Avatar>
  )
}
