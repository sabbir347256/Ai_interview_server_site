
import { Types } from "mongoose";

export enum InterviewLanguage {
  BANGLA = "bn",
  ENGLISH = "en",
}

export enum InterviewDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum InterviewStatus {
  IN_PROGRESS = "IN_PROGRESS",
  EVALUATING = "EVALUATING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IInterviewAnswer {
  question: string;
  answer: string;
  score?: number;
  feedback?: string;
}

export interface IInterview {
  user: Types.ObjectId;
  jobRole: string;
  language: InterviewLanguage;
  difficulty: InterviewDifficulty;
  totalQuestions: number;
  questions: string[];
  answers: IInterviewAnswer[];
  currentQuestionIndex: number;
  status: InterviewStatus;
  finalScore?: number;
  overallFeedback?: string;
  strengths: string[];
  improvements: string[];
  startedAt: Date;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
