export type ActivityType =
  | "call"
  | "email"
  | "meeting"
  | "proposal"
  | "follow_up"
  | "networking"
  | "research"
  | "presentation"
  | "contract"
  | "training"
  | "admin"
  | "other";

export interface User {
  id: string;
  name: string;
  role: "loan_officer" | "admin" | "owner";
}

export const COUNTABLE_ACTIVITIES: ActivityType[] = [
  "call",
  "email",
  "proposal",
  "follow_up",
];

export interface Activity {
  id: string;
  type: ActivityType;
  timestamp: Date;
  notes?: string;
  userId: string;
  loId: string; // Loan Officer ID
  count?: number; // Number of activities completed
}

export interface DailyStats {
  total: number;
  byType: Record<ActivityType, number>;
}
