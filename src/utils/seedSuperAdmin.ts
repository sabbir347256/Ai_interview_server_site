
import bcrypt from "bcryptjs";
import User from "../modules/user/user.model";
import { UserRole, UserStatus } from "../modules/user/user.interfaces";

export const seedSuperAdmin = async () => {
  try {
    const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.SUPER_ADMIN_PASSWORD;

    if (!email || !password || password.length < 8) {
      throw new Error("Valid Super Admin credentials are required");
    }

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Super Admin email already exists");
      return;
    }

    const existingRoleAdmin = await User.exists({
      role: UserRole.ADMIN,
    });

    if (existingRoleAdmin) {
      console.log("An Admin already exists. Skipping seed.");
      return;
    }

    await User.create({
      name: "Super Admin",
      email,
      password,
      role: UserRole.ADMIN,
      isActive: UserStatus.ACTIVE,
    });

    console.log("Super Admin created successfully");
  } catch (error) {
    console.error("Super Admin creation failed:", error);
    throw error;
  }
};
