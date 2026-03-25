import { Home, List, PieChart, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

const navigationMenuItems = [
  { title: "Home", href: "/Netto/home", icon: Home, id: "home" as const },
  {
    title: "Strumenti",
    href: "/Netto/strumenti",
    icon: List,
    id: "strumenti" as const,
  },
  {
    title: "Composizione",
    href: "/Netto/composizione",
    icon: PieChart,
    id: "composizione" as const,
  },
  {
    title: "Impostazioni",
    href: "/Netto/settings",
    icon: Settings,
    id: "settings" as const,
  },
]

export default function NavigationMenuApp({
  activeTab = "home",
  onNavigate,
}: {
  activeTab?: "home" | "strumenti" | "composizione" | "settings"
  onNavigate?: (tab: "home" | "strumenti" | "composizione" | "settings") => void
}) {
  const location = useLocation()

  const getCurrentTab = () => {
    const path = location.pathname.slice(1) || "home"
    return path as "home" | "strumenti" | "composizione" | "settings"
  }

  const currentTab = activeTab || getCurrentTab()

  return (
    <NavigationMenu className="fixed right-0 bottom-0 left-0 min-w-full border-t bg-background pb-8 shadow-lg md:pb-0">
      <NavigationMenuList className="flex min-w-full items-center justify-around">
        {navigationMenuItems.map((item) => (
          <NavigationMenuItem key={item.title} className="min-w-[25%] flex-1">
            <NavigationMenuLink
              active={currentTab === item.id}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1 px-10 py-3 text-xs font-medium transition-colors",
                "data-[active=true]:text-primary",
                "hover:text-primary"
              )}
              asChild
            >
              <Link to={item.href} onClick={() => onNavigate?.(item.id)}>
                <item.icon
                  className={cn(
                    "h-12 w-12 shrink-0 scale-150 transition-transform",
                    currentTab === item.id ? "scale-170" : ""
                  )}
                />
                <span className="hidden">{item.title}</span>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
