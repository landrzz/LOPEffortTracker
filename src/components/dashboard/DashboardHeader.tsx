import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardHeader() {
  return (
    <div className="flex justify-between items-center p-6 bg-background border-b">
      <h1 className="text-2xl font-bold">LO Portal Effort Tracker</h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="gap-2">
          <UserCircle className="h-5 w-5" />
          <span>John Doe</span>
        </Button>
      </div>
    </div>
  );
}
