import type { TNull } from "./primitives";
import type { IAuthSession } from "./auth-session";

export const Roles = [
  "admin",
  "moderator",
  "accountant",
  "writer",
  "support",
  "member",
] as const;
export type ERole = (typeof Roles)[number];

export interface IRichUser {
  id: string;
  firstname: string;
  lastname: string;
  roles: ERole[];
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: TNull<Date>;

  // relations
  authSessions?: TNull<IAuthSession[]>;
}
export type IUser = Omit<IRichUser, "password">;

export type IUserCreate = Omit<IRichUser, "id" | "createdAt" | "updatedAt" | "deletedAt" | "authSessions" | "logsAsTarget" | "logsAsActor">;
export type IUserUpdate = Partial<IUserCreate>;
