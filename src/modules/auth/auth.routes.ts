import { Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", authController.credentialLogin);
router.get("/me", checkAuth(), authController.getMe);
// router.post("/agent&admin/login", authController.agentLogin);
router.post("/logout", authController.logout);

export const AuthRouter = router;
