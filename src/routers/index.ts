import { Router } from "express";
import { userRoute } from "../modules/user/user.routes";
import { AuthRouter } from "../modules/auth/auth.routes";
import { interviewRoute } from "../modules/interview/interview.routes";
import { dashboardRoute } from "../modules/dashboard/dashboard.routes";
import { insightRoute } from "../modules/insight/insight.routes";



export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    router: userRoute,
  },
  {
    path: "/auth",
    router: AuthRouter,
  },
  {
    path: "/interview",
    router: interviewRoute,
  },
  {
    path: "/dashboard",
    router: dashboardRoute,
  },
  {
    path: "/insights",
    router: insightRoute,
  },
 
  
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.router);
});
