import { useAuth } from "@/lib/auth-context";
import DashboardHeader from "./dashboard/DashboardHeader";
import ActivityLogging from "./dashboard/ActivityLogging";
import ActivityCounter from "./dashboard/ActivityCounter";
import TeamOverview from "./dashboard/TeamOverview";
import MetricsVisualization from "./dashboard/MetricsVisualization";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
          <ActivityLogging />
          {user && (
            <div className="grid gap-4 lg:gap-6 grid-cols-1">
              <ActivityCounter />
              <TeamOverview />
            </div>
          )}
        </div>
        {user && <MetricsVisualization />}
      </div>
    </div>
  );
}
