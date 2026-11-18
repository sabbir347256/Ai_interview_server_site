import { Router } from "express";
import { checkAuth } from "../middleware/auth.middleware";
import { dashboardController } from "./dasboard.controller";

const router = Router();

router.get("/summary", checkAuth(), dashboardController.getDashboardSummary);

export const dashboardRoute = router;
