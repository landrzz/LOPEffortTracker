import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ActivityType } from "@/types/activity";

// Color palette based on theme colors with complementary variations
const ACTIVITY_COLORS = {
  call: "#6E2594",      // Primary Purple
  email: "#ECD444",     // Primary Yellow
  meeting: "#9B4ECD",   // Light Purple
  proposal: "#B8A032",  // Dark Yellow
  follow_up: "#4A1A63", // Dark Purple
  networking: "#FFE066" // Light Yellow
};

interface ActivityData {
  type: ActivityType;
  count: number;
}

interface PeriodData {
  activities: ActivityData[];
  totalCount: number;
}

interface MetricsData {
  daily: PeriodData;
  weekly: PeriodData;
  monthly: PeriodData;
}

export default function MetricsVisualization() {
  // Mock data - replace with real data
  const mockData: MetricsData = {
    daily: {
      activities: [
        { type: "call", count: 15 },
        { type: "email", count: 25 },
        { type: "meeting", count: 5 },
        { type: "proposal", count: 3 },
        { type: "follow_up", count: 8 },
        { type: "networking", count: 2 },
      ],
      totalCount: 58,
    },
    weekly: {
      activities: [
        { type: "call", count: 75 },
        { type: "email", count: 120 },
        { type: "meeting", count: 25 },
        { type: "proposal", count: 15 },
        { type: "follow_up", count: 40 },
        { type: "networking", count: 10 },
      ],
      totalCount: 285,
    },
    monthly: {
      activities: [
        { type: "call", count: 300 },
        { type: "email", count: 480 },
        { type: "meeting", count: 100 },
        { type: "proposal", count: 60 },
        { type: "follow_up", count: 160 },
        { type: "networking", count: 40 },
      ],
      totalCount: 1140,
    },
  };

  const formatActivityName = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card className="p-6 bg-background">
      <h2 className="text-xl font-semibold mb-4">Activity Metrics</h2>
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {Object.entries(mockData).map(([period, data]) => (
          <TabsContent key={period} value={period} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-[300px]">
                <h3 className="text-sm font-medium mb-2">
                  Activity Distribution
                </h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.activities}
                    layout="vertical"
                    margin={{ left: 80 }}
                  >
                    <XAxis type="number" />
                    <YAxis
                      dataKey="type"
                      type="category"
                      tickFormatter={formatActivityName}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        formatActivityName(String(name)),
                      ]}
                    />
                    <Bar
                      dataKey="count"
                      fill="#6E2594"
                    >
                      {data.activities.map((entry) => (
                        <Cell
                          key={`cell-${entry.type}`}
                          fill={ACTIVITY_COLORS[entry.type as keyof typeof ACTIVITY_COLORS]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="h-[300px]">
                <h3 className="text-sm font-medium mb-2">Activity Share</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.activities}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      label={({ type, percent }) =>
                        `${formatActivityName(type)} (${(percent * 100).toFixed(0)}%)`
                      }
                    >
                      {data.activities.map((entry) => (
                        <Cell
                          key={`cell-${entry.type}`}
                          fill={ACTIVITY_COLORS[entry.type as keyof typeof ACTIVITY_COLORS]}
                        />
                      ))}
                    </Pie>
                    <Legend
                      formatter={(value) => formatActivityName(String(value))}
                    />
                    <Tooltip
                      formatter={(value, name) => [
                        value,
                        formatActivityName(String(name))
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="text-sm text-muted-foreground text-center">
              Total Activities: {data.totalCount}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}
