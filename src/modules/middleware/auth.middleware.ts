import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import appError from "../../errorHelper/appError";
import { verifyToken } from "../../utils/jwt";
import envVars from "../../config/envars";
import User from "../user/user.model";
import { UserRole, UserStatus } from "../user/user.interfaces";

export const checkAuth =
  (...roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : undefined;

      const accessToken = req.cookies?.accessToken || bearerToken;

      if (!accessToken) {
        throw new appError(httpStatus.UNAUTHORIZED, "Token not provided!");
      }

      const verifyUser = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET,
      ) as JwtPayload;

      if (!verifyUser?.mongoUserId) {
        throw new appError(httpStatus.UNAUTHORIZED, "Invalid token!");
      }

      const isUser = await User.findById(verifyUser.mongoUserId).select(
        "-password",
      );

      if (!isUser) {
        throw new appError(httpStatus.UNAUTHORIZED, "No user found!");
      }

      if (isUser.isActive !== UserStatus.ACTIVE) {
        throw new appError(httpStatus.FORBIDDEN, "Your account is inactive!");
      }

      if (roles.length > 0 && !roles.includes(isUser.role)) {
        throw new appError(
          httpStatus.FORBIDDEN,
          "You are not permitted to access this route!",
        );
      }

      req.user = {
        ...verifyUser,
        mongoUserId: isUser._id.toString(),
        userId: isUser.userId,
        role: isUser.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
