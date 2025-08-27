import type { TNull } from "./primitives";
import type { IUser } from "./user";

export const TargetTypes = [] as const;
export type ETargetType = (typeof TargetTypes)[number];

export const ActionStatus = [] as const;
export type EActionStatus = (typeof ActionStatus)[number];

export interface IAuditLog {
  id: string;
  actorId: TNull<string>;
  targetId: TNull<string>;
  targetType: TNull<ETargetType>;
  action: string;
  ip: TNull<string>;
  agent: TNull<string>;
  status: EActionStatus;
  meta: TNull<object>;
  createdAt: Date;

  // relations
  actor?: TNull<IUser>;
  target?: TNull<IUser>;
}
