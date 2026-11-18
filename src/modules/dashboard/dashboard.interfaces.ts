import { Types } from "mongoose";

export interface IDashboardStats {
  totalInterviews: number;
  completedInterviews: number;
  inProgressInterviews: number;
  averageScore: number;
}
