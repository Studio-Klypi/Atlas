import type { IAuditLog, IAuditLogCreate } from "../../shares/types/audit-log";
import orm from "../index";

/**
 * Create a new audit log
 * @param payload - Audit log payload
 * @returns - Created audit log
 */
export async function create(payload: IAuditLogCreate): Promise<IAuditLog> {
  return orm.auditLog.create({
    data: {
      ...payload,
    },
    include: {
      actor: true,
      target: true,
    },
  });
}

/**
 * Find audit logs by user id
 * @param userId - User id
 * @returns - Audit logs
 */
export async function findUserAsActor(userId: string): Promise<IAuditLog[]> {
  return orm.auditLog.findMany({
    where: {
      actorId: userId,
    },
    include: {
      actor: true,
      target: true,
    },
  });
}

/**
 * Find audit logs by user id
 * @param userId - User id
 * @returns - Audit logs
 */
export async function findUserAsTarget(userId: string): Promise<IAuditLog[]> {
  return orm.auditLog.findMany({
    where: {
      targetId: userId,
      targetType: "user",
    },
    include: {
      actor: true,
      target: true,
    },
  });
}

/**
 * Find audit logs in a period
 * @param start - Start date
 * @param end - End date
 * @returns - Audit logs
 */
export async function findInPeriod(start: Date, end?: Date): Promise<IAuditLog[]> {
  if (start.getTime() >= end.getTime()) throw new Error("Start date must be before end date");

  return orm.auditLog.findMany({
    where: {
      createdAt: {
        gte: start,
        lte: end ?? new Date(),
      },
    },
    include: {
      actor: true,
      target: true,
    },
  });
}
