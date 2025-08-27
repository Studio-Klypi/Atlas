import type { TNull } from "./primitives";
import type { IAuditLog } from "./audit-log";
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

export interface IUser {
  id: string;
  firstname: string;
  lastname: string;
  roles: ERole[];
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  // relations
  authSessions?: TNull<IAuthSession[]>;
  logsAsActor?: TNull<IAuditLog[]>;
  logsAsTarget?: TNull<IAuditLog[]>;
}
