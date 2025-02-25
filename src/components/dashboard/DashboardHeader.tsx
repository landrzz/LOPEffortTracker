import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import logo from "@/assets/images/TheLOPortal.webp";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center p-6 bg-background border-b">
      <div className="flex items-center gap-3">
        <img 
          src={logo} 
          alt="LO Portal Logo" 
          className="h-14 w-auto" // Increased height for the logo
        />
        <h1 className="text-2xl font-bold text-[hsl(270,50%,60%)] dark:text-[hsl(270,70%,40%)]">
          The LO Portal <br /> Effort Tracker
        </h1>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button variant="ghost" className="gap-2">
          <UserCircle className="h-5 w-5" />
          <span>John Doe</span>
        </Button>
        <ThemeToggle className="self-center" />
      </div>
    </div>
  );
}
