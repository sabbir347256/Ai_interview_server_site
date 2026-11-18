import { Router } from "express";
import { insightController } from "./insight.controller";
import { checkAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/", checkAuth(), insightController.getPerformerInsights);

export const insightRoute = router;
