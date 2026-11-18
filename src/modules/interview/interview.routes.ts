import { Router } from "express";
import rateLimit from "express-rate-limit";
import { interviewController } from "./interview.controller";
import { checkAuth } from "../middleware/auth.middleware";

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

router.post(
  "/start",
  checkAuth(),
  aiLimiter,
  interviewController.startInterview,
);

router.get("/my-interviews", checkAuth(), interviewController.getMyInterviews);

router.get("/:id", checkAuth(), interviewController.getInterviewById);

router.post("/:id/answer", checkAuth(), interviewController.submitAnswer);

router.post(
  "/:id/finish",
  checkAuth(),
  aiLimiter,
  interviewController.finishInterview,
);

router.patch("/:id/cancel", checkAuth(), interviewController.cancelInterview);

export const interviewRoute = router;
