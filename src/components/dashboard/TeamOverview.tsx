import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  activities: number;
  avatar?: string;
}

export default function TeamOverview() {
  // TODO: Replace with real data
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "John Doe",
      activities: 12,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
    {
      id: "2",
      name: "Jane Smith",
      activities: 15,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
    },
    {
      id: "3",
      name: "Mike Johnson",
      activities: 8,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    },
  ];

  return (
    <Card className="p-6 bg-background">
      <h2 className="text-xl font-semibold mb-4">Team Activity</h2>
      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={member.avatar} />
                <AvatarFallback>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{member.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {member.activities} activities today
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
