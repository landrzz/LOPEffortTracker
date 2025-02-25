import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ActivityCounter() {
  // TODO: Replace with real data
  const dailyGoal = 10;
  const currentCount = 7;
  const progress = (currentCount / dailyGoal) * 100;

  return (
    <Card className="p-6 bg-background">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Today's Efforts</h3>
          <span className="text-2xl font-bold">{currentCount}</span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground">
          {dailyGoal - currentCount} more to reach daily goal
        </p>
      </div>
    </Card>
  );
}
