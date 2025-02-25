import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ActivityType, User, COUNTABLE_ACTIVITIES } from "@/types/activity";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ACTIVITY_TYPES: { value: ActivityType; label: string }[] = [
  { value: "call", label: "Phone Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "proposal", label: "Proposal" },
  { value: "follow_up", label: "Follow Up" },
  { value: "networking", label: "Networking" },
  { value: "research", label: "Research" },
  { value: "presentation", label: "Presentation" },
  { value: "contract", label: "Contract" },
  { value: "training", label: "Training" },
  { value: "admin", label: "Administrative" },
  { value: "other", label: "Other" },
];

// Mock data - replace with real data
const MOCK_USER: User = {
  id: "1",
  name: "John Doe",
  role: "loan_officer",
};

const MOCK_LOAN_OFFICERS = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Mike Johnson" },
];

export default function ActivityLogging() {
  const [type, setType] = useState<ActivityType>("call");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [loId, setLoId] = useState(MOCK_USER.id);
  const [count, setCount] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!type) newErrors.type = "Activity type is required";
    if (!date) newErrors.date = "Date is required";
    if (!loId) newErrors.loId = "Loan Officer is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const activity = {
      id: crypto.randomUUID(),
      type,
      timestamp: date,
      notes,
      userId: MOCK_USER.id,
      loId,
      ...(COUNTABLE_ACTIVITIES.includes(type) && { count }),
    };

    console.log("Submitting activity:", activity);
    setNotes("");
    setDate(new Date());
    setType("call");
  };

  return (
    <Card className="p-6 bg-background">
      <h2 className="text-xl font-semibold mb-4">Log an Activity</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="activity-type">Activity Type</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as ActivityType)}
          >
            <SelectTrigger id="activity-type">
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_TYPES.map((activity) => (
                <SelectItem key={activity.value} value={activity.value}>
                  {activity.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COUNTABLE_ACTIVITIES.includes(type) && (
            <div className="space-y-2">
              <Label htmlFor="count">
                {type === "call"
                  ? "Number of Calls"
                  : type === "email"
                    ? "Number of Emails"
                    : type === "proposal"
                      ? "Number of Proposals"
                      : type === "follow_up"
                        ? "Number of Follow-ups"
                        : "Number of Activities"}
              </Label>
              <Input
                id="count"
                type="number"
                min="1"
                value={count}
                onChange={(e) =>
                  setCount(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Date & Time</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date}</p>
            )}
          </div>
        </div>

        {MOCK_USER.role !== "loan_officer" && (
          <div className="space-y-2">
            <Label htmlFor="lo-select">Loan Officer</Label>
            <Select value={loId} onValueChange={setLoId}>
              <SelectTrigger id="lo-select">
                <SelectValue placeholder="Select loan officer" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_LOAN_OFFICERS.map((lo) => (
                  <SelectItem key={lo.id} value={lo.id}>
                    {lo.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.loId && (
              <p className="text-sm text-destructive">{errors.loId}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any relevant details"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <Button onClick={handleSubmit} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          Log Activity
        </Button>
      </div>
    </Card>
  );
}
