import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Interview from "../interview/interview.model";
import { InterviewStatus } from "../interview/interview.interfaces";

const getUserId = (req: Request) => {
  const user = req.user as
    | {
        _id?: mongoose.Types.ObjectId | string;
        mongoUserId?: string;
      }
    | undefined;

  return user?._id?.toString() || user?.mongoUserId;
};

const getPerformerInsights = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const completedInterviews = await Interview.find({
      user: userObjectId,
      status: InterviewStatus.COMPLETED,
    }).sort({ createdAt: 1 });

    const totalCompleted = completedInterviews.length;

    const avgFinalScore =
      totalCompleted > 0
        ? Math.round(
            completedInterviews.reduce(
              (acc, item) => acc + (item.finalScore || 0),
              0,
            ) / totalCompleted,
          )
        : 75;

    const skills = [
      {
        name: "Technical Proficiency",
        percentage: Math.min(100, avgFinalScore + 5),
        color: "bg-[#6366F1]",
      },
      {
        name: "Communication",
        percentage: Math.min(100, avgFinalScore - 2),
        color: "bg-[#6366F1]",
      },
      {
        name: "Soft Skills",
        percentage: Math.min(100, avgFinalScore + 2),
        color: "bg-[#6366F1]",
      },
      {
        name: "Problem Solving",
        percentage: Math.max(40, avgFinalScore - 15),
        color: "bg-[#4B5563]",
      },
    ];

    const improvements = [
      {
        title: "System Architecture Deep-Dive",
        description:
          "Focus on scalability patterns and distributed consensus mechanisms.",
        iconType: "Layers",
        tags: [
          {
            label: "PRIORITY HIGH",
            bg: "bg-[#FEE2E2]",
            text: "text-[#EF4444]",
          },
          { label: "TECH SKILL", bg: "bg-[#EEF2FF]", text: "text-[#6366F1]" },
        ],
      },
      {
        title: "Concise Articulation",
        description:
          "Practice reducing 2-minute answers down to impactful 45-second responses.",
        iconType: "MessageSquare",
        tags: [
          { label: "PRIORITY MID", bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
          { label: "COMM SKILL", bg: "bg-[#EEF2FF]", text: "text-[#6366F1]" },
        ],
      },
      {
        title: "Conflict Resolution Examples",
        description:
          "Identify more specific STAR-method scenarios for difficult team interactions.",
        iconType: "Target",
        tags: [
          { label: "PRIORITY MID", bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
          { label: "SOFT SKILL", bg: "bg-[#EEF2FF]", text: "text-[#6366F1]" },
        ],
      },
    ];

    const lastInterview = completedInterviews[completedInterviews.length - 1];
    const lastScoreOutOf10 = lastInterview?.finalScore
      ? (lastInterview.finalScore / 10).toFixed(1)
      : "8.4";

    const responseData = {
      skills,
      improvements,
      lastScore: lastScoreOutOf10,
      streakDays: 12,
      latestObservation:
        "You've shown a consistent improvement in technical precision. However, you tend to over-explain simple concepts which can detract from executive presence.",
      readinessChart: completedInterviews.map((item) => ({
        date: new Date(item.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        score: item.finalScore || 0,
      })),
    };

    return res.status(200).json({
      success: true,
      message: "Performer insights fetched successfully",
      data: responseData,
    });
  } catch (error) {
    next(error);
  }
};

export const insightController = {
  getPerformerInsights,
};
