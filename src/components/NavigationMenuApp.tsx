import { Home, List, PieChart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

interface NavigationMenuAppProps {
  activeTab?: "home" | "strumenti" | "composizione" | "settings"
  onNavigate?: (tab: "home" | "strumenti" | "composizione" | "settings") => void
}

const navigationMenuItems = [
  { title: "Home", href: "#", icon: Home, id: "home" as const },
  {
    title: "Strumenti",
    href: "#strumenti",
    icon: List,
    id: "strumenti" as const,
  },
  {
    title: "Composizione",
    href: "#composizione",
    icon: PieChart,
    id: "composizione" as const,
  },
  {
    title: "Impostazioni",
    href: "#settings",
    icon: Settings,
    id: "settings" as const,
  },
]

export default function NavigationMenuApp({
  activeTab = "home",
  onNavigate,
}: NavigationMenuAppProps) {
  return (
    <NavigationMenu className="fixed right-0 bottom-0 left-0 min-w-full border-t bg-background pb-8 shadow-lg md:pb-0">
      <NavigationMenuList className="flex min-w-full items-center justify-around">
        {navigationMenuItems.map((item) => (
          <NavigationMenuItem key={item.title} className="min-w-[25%] flex-1">
            <NavigationMenuLink
              active={activeTab === item.id}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1 px-12 py-3 text-xs font-medium transition-colors",
                "data-[active=true]:text-primary",
                "hover:text-primary"
              )}
              onClick={(e) => {
                e.preventDefault()
                onNavigate?.(item.id)
              }}
            >
              <item.icon
                className={cn(
                  "h-12 w-12 shrink-0 scale-150 transition-transform",
                  activeTab === item.id ? "scale-170" : ""
                )}
              />
              <span className="hidden">{item.title}</span>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
