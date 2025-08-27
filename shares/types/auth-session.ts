import type { TNull } from "./primitives";
import type { IUser } from "./user";

export interface IAuthSession {
  token: string;
  userId: string;
  agent: string;
  createdAt: Date;
  expiresAt: Date;

  // relations
  user?: TNull<IUser>;
}
