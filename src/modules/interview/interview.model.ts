
import mongoose, { Schema } from "mongoose";
import {
  IInterview,
  InterviewDifficulty,
  InterviewLanguage,
  InterviewStatus,
} from "./interview.interfaces";

const answerSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
    },
  },
  {
    _id: false,
  },
);

const interviewSchema = new Schema<IInterview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    language: {
      type: String,
      enum: Object.values(InterviewLanguage),
      required: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(InterviewDifficulty),
      required: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
      min: 3,
      max: 10,
    },
    questions: {
      type: [String],
      required: true,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(InterviewStatus),
      default: InterviewStatus.IN_PROGRESS,
      index: true,
    },
    finalScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    overallFeedback: String,
    strengths: {
      type: [String],
      default: [],
    },
    improvements: {
      type: [String],
      default: [],
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

interviewSchema.index({
  user: 1,
  createdAt: -1,
});

const Interview: mongoose.Model<IInterview> =
  (mongoose.models.Interview as mongoose.Model<IInterview>) ||
  mongoose.model<IInterview>("Interview", interviewSchema);

export default Interview;
