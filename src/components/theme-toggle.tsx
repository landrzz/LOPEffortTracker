import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-2 relative">
      <Sun className="h-4 w-4 absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 text-muted-foreground" />
      <Switch
        id="dark-mode"
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      />
      <Moon className="h-4 w-4 absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 text-muted-foreground" />
    </div>
  )
}
