import DashboardHeader from "./dashboard/DashboardHeader";
import ActivityLogging from "./dashboard/ActivityLogging";
import ActivityCounter from "./dashboard/ActivityCounter";
import MetricsVisualization from "./dashboard/MetricsVisualization";
import TeamOverview from "./dashboard/TeamOverview";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <div className="container mx-auto p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-2">
          <ActivityLogging />
          <div className="grid gap-4 lg:gap-6 grid-cols-1">
            <ActivityCounter />
            <TeamOverview />
          </div>
        </div>
        <MetricsVisualization />
      </div>
    </div>
  );
}
