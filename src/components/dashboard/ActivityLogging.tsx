import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

export default function ActivityLogging() {
  // Debug Supabase configuration
  useEffect(() => {
    console.log("Supabase URL:", import.meta.env.VITE_SUPABASE_URL);
    console.log("Supabase key exists:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    
    // Check if we're authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Current session:", session);
      if (session?.user) {
        console.log("User ID from session:", session.user.id);
      }
    });
  }, []);

  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [type, setType] = useState<ActivityType>("call");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [count, setCount] = useState<number>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthReady(true);
        console.log('Auth check completed:', {
          sessionExists: !!session,
          userId: session?.user?.id
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthReady(false);
      }
    };

    checkAuth();
  }, []);

  // Debug auth state
  useEffect(() => {
    if (!isAuthReady) return;
    
    const debugAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.group('Auth Debug Information');
      console.log('1. Session user ID:', session?.user?.id);
      console.log('2. Context user ID:', user?.id);
      console.log('3. Complete user object:', user);
      console.log('4. Auth Ready:', isAuthReady);
      console.groupEnd();
    };

    debugAuth();
  }, [user, isAuthReady]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!type) newErrors.type = "Activity type is required";
    if (!date) newErrors.date = "Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!isAuthReady) {
      toast({
        title: "Error",
        description: "Authentication is not ready. Please wait or refresh the page.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to log activities",
        variant: "destructive",
      });
      return;
    }

    // Debug authentication info
    const { data: { session } } = await supabase.auth.getSession();
    console.log("Debug Auth Info:");
    console.log("Session user ID:", session?.user?.id);
    console.log("Context user ID:", user?.id);
    console.log("User object:", user);

    // Verify Supabase configuration
    if (!supabase.auth.getSession()) {
      toast({
        title: "Error",
        description: "Supabase session not found. Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const activityData = {
        type,
        notes,
        user_id: user?.id,
        lo_id: '1234',
        ...(COUNTABLE_ACTIVITIES.includes(type) && { count }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.group('Activity Submission Debug');
      console.log('4. Activity data being inserted:', activityData);
      console.groupEnd();
      
      console.log("Activity Data to insert:", activityData);
      console.log("User ID being used:", user?.id);
      
      const { error, data } = await supabase
        .from("activities")
        .insert(activityData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log("Successfully inserted activity:", data);

      toast({
        title: "Success",
        description: "Activity logged successfully",
      });

      // Reset form
      setNotes("");
      setDate(new Date());
      setType("call");
      setCount(1);
    } catch (error: any) {
      console.error("Error logging activity:", error);
      
      // Provide more specific error feedback
      const errorMessage = error?.message || error?.details || "Unknown error occurred";
      const errorCode = error?.code || "";
      
      toast({
        title: "Failed to Log Activity",
        description: `Error: ${errorMessage}${errorCode ? ` (Code: ${errorCode})` : ""}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

        <div className="space-y-2">
          <Label>Loan Officer</Label>
          <p>1234</p>
        </div>

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

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isLoading || !user}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    "Log Activity"
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {!user && (
              <TooltipContent>
                <p>Please log in to submit activities</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
