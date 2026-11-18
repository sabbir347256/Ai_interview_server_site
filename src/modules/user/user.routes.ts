
import { Router } from "express";
import { userController } from "./user.controller";
import { UserRole } from "./user.interfaces";
import { checkAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/createUsers",checkAuth(UserRole.SUPER_ADMIN), userController?.createUser);


export const userRoute = router;

