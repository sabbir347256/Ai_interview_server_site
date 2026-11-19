import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status-codes";
import expressSession from 'express-session';
import passport from "passport";
import path from "path";

import './config/passport';
import envVars from "./config/envars";
import { globalErrorHandler } from "./errorHelper/globalErrorHandle";
import notFound from "./errorHelper/notFound";
import { router } from "./routers/index";

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://179.236.82.35:5173",
      "http://179.236.82.35:5000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(
  expressSession({
    secret: envVars?.JWT_ACCESS_SECRET || "Your Secret",
    resave: false,
    saveUninitialized: false,
  }),
);



app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


app.use("/api/v1", router);

app.get("/", async (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    message: "welcome to our ai-interview project server............",
  });
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
