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

const getDashboardSummary = async (
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

    const stats = await Interview.aggregate([
      { $match: { user: userObjectId } },
      {
        $facet: {
          totalInterviews: [{ $count: "count" }],
          completedInterviews: [
            { $match: { status: InterviewStatus.COMPLETED } },
            { $count: "count" },
          ],
          inProgressInterviews: [
            { $match: { status: InterviewStatus.IN_PROGRESS } },
            { $count: "count" },
          ],
          averageScore: [
            {
              $match: {
                status: InterviewStatus.COMPLETED,
                finalScore: { $exists: true, $ne: null },
              },
            },
            {
              $group: {
                _id: null,
                avgScore: { $avg: "$finalScore" },
              },
            },
          ],
          recentInterviews: [
            { $sort: { createdAt: -1 } },
            { $limit: 5 },
            {
              $project: {
                jobRole: 1,
                language: 1,
                difficulty: 1,
                status: 1,
                finalScore: 1,
                createdAt: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = stats[0];

    const summary = {
      totalInterviews: result.totalInterviews[0]?.count || 0,
      completedInterviews: result.completedInterviews[0]?.count || 0,
      inProgressInterviews: result.inProgressInterviews[0]?.count || 0,
      averageScore: Math.round(result.averageScore[0]?.avgScore || 0),
      recentInterviews: result.recentInterviews || [],
    };

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: summary,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    next(error);
  }
};

export const dashboardController = {
  getDashboardSummary,
};
