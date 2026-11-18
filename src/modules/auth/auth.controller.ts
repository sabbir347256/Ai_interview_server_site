import { NextFunction, Request, Response } from "express";
import passport from "passport";
import httpStatus from "http-status-codes";
import appError from "../../errorHelper/appError";
import { createUserToken } from "../../utils/createUserToken";
import { setAuthCookies } from "../../utils/setCookies";
import { sendResponse } from "../../utils/utils";
import User from "../user/user.model";
import { UserStatus } from "../user/user.interfaces";
import mongoose from "mongoose";

const credentialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password.trim()
    ) {
      return next(
        new appError(httpStatus.BAD_REQUEST, "Email and password are required"),
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    req.body.email = normalizedEmail;

    passport.authenticate(
      "user-local",
      { session: false },
      async (err: any, user: any, info: any) => {
        try {
          if (err) {
            console.error("Passport authentication error:", err);

            return next(
              new appError(
                httpStatus.INTERNAL_SERVER_ERROR,
                "Authentication failed. Please try again.",
              ),
            );
          }

          if (!user) {
            console.log(
              "Passport login rejected:",
              info?.message || "Invalid credentials",
            );

            return next(
              new appError(
                httpStatus.UNAUTHORIZED,
                info?.message || "Invalid email or password",
              ),
            );
          }

          if (user.isActive !== UserStatus.ACTIVE) {
            return next(
              new appError(
                httpStatus.FORBIDDEN,
                "Your account is inactive. Please contact support.",
              ),
            );
          }

          const userTokens = await createUserToken(user);

          setAuthCookies(res, userTokens);

          const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          };

          return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Login successful",
            data: {
              user: userData,
            },
          });
        } catch (error) {
          console.error("Login processing error:", error);
          return next(error);
        }
      },
    )(req, res, next);
  } catch (error) {
    console.error("Credential login error:", error);
    return next(error);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = req.user as
      | {
          mongoUserId?: string;
          _id?: string;
          id?: string;
          sub?: string;
        }
      | undefined;

    const userId =
      authUser?.mongoUserId || authUser?._id || authUser?.id || authUser?.sub;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return next(
        new appError(
          httpStatus.UNAUTHORIZED,
          "Invalid authentication. Please login again.",
        ),
      );
    }

    const user = await User.findById(userId)
      .select("-password -refreshTokenHash")
      .lean();

    if (!user) {
      return next(new appError(httpStatus.NOT_FOUND, "User not found"));
    }

    if (user.isActive !== UserStatus.ACTIVE) {
      return next(
        new appError(httpStatus.FORBIDDEN, "Your account is inactive"),
      );
    }

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("Get Me Error:", error);
    return next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logout successful",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  credentialLogin,
  getMe,
  logout
};
