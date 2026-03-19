import { Home, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

interface NavigationMenuAppProps {
  activeTab?: "home" | "settings"
  onNavigate?: (tab: "home" | "settings") => void
}

const navigationMenuItems = [
  { title: "Home", href: "#", icon: Home, id: "home" as const },
  { title: "Impostazioni", href: "#settings", icon: Settings, id: "settings" as const },
]

export default function NavigationMenuApp({ activeTab = "home", onNavigate }: NavigationMenuAppProps) {
  return (
    <NavigationMenu className="fixed bottom-4 outline">
      <NavigationMenuList className="space-x-8">
        {navigationMenuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
              active={activeTab === item.id}
              asChild
              className={cn(
                "group relative inline-flex h-9 w-max items-center justify-center px-0.5 py-2 text-sm font-medium",
                "before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:bg-primary before:transition-transform",
                "hover:text-accent-foreground hover:before:scale-x-100",
                "focus:text-accent-foreground focus:outline-hidden focus:before:scale-x-100",
                "disabled:pointer-events-none disabled:opacity-50",
                "data-[state=open]:before:scale-x-100 data-active:bg-transparent data-active:before:scale-x-100",
                "hover:bg-transparent focus:bg-transparent active:bg-transparent"
              )}
              onClick={(e) => {
                e.preventDefault()
                onNavigate?.(item.id)
              }}
            >
              <div className="flex-row items-center gap-2.5">
                <item.icon className="h-5 w-5 shrink-0" />
                {item.title}
              </div>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
