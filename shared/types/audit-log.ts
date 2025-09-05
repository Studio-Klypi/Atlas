import type { TNull } from "./primitives";
import type { IRichUser } from "./user";

export const TargetTypes = [
  "user",
] as const;
export type ETargetType = (typeof TargetTypes)[number];

export const ActionStatus = [
  "success",
  "failure",
] as const;
export type EActionStatus = (typeof ActionStatus)[number];

export interface IAuditLog {
  id: string;
  actorId?: TNull<string>;
  targetId?: TNull<string>;
  targetType?: TNull<ETargetType>;
  action: string;
  ip?: TNull<string>;
  agent?: TNull<string>;
  status: EActionStatus;
  meta?: TNull<object>;
  createdAt: Date;

  // relations
  actor?: TNull<IRichUser>;
  target?: TNull<IRichUser>;
}

export type IAuditLogCreate = Omit<IAuditLog, "id" | "createdAt" | "actor" | "target">;
