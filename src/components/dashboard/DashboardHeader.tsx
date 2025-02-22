import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center p-6 bg-background border-b">
      <h1 className="text-2xl font-bold text-[hsl(270,50%,60%)] dark:text-[hsl(270,70%,40%)]">LO Portal Effort Tracker</h1>
      <div className="flex flex-col items-end gap-3">
        <Button variant="ghost" className="gap-2">
          <UserCircle className="h-5 w-5" />
          <span>John Doe</span>
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
}
