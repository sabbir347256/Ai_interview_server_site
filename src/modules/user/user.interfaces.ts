
export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: UserStatus;
  refreshTokenHash?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
