import envVars from "../config/envars";
import { IUser } from "../modules/user/user.interfaces";
import { generateToken } from "./jwt";

export const createUserToken = async(user : Partial<IUser>) => {
    const jwtPayload = {
        mongoUserId: user?._id,
        email: user?.email,
        userId: user?.userId,
        role: user?.role,
        name : user?.name,
        phone : user?.mobileNumber,
        project : user?.project,
        active: user?.isActive,
        mainWalletBalance: user?.salary,
        advanceWalletBalance: user?.advanceSalary
      };
    
      const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,String(envVars.JWT_ACCESS_EXPIRES));
      const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,String(envVars.JWT_REFRESH_EXPIRES));

      return {
        accessToken,
        refreshToken
      }
};
