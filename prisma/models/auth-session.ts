import type { IAuthSession, IAuthSessionKey } from "#shared/types/auth-session";
import orm from "../index";
import * as UserModel from "./user";
import type { IRichUser } from "#shared/types/user";

/**
 * Create a new auth session
 * @param userId - User id
 * @param agent - User agent
 * @returns - Created auth session
 */
export async function create(userId: string, agent: string): Promise<IAuthSession> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30); // 30 days

  return orm.authSession.create({
    data: {
      userId,
      agent,
      expiresAt,
    },
  });
}

/**
 * Find an auth session by key
 * @param key - Auth session key
 * @returns - Auth session
 * @throws - Error if session not found
 */
export async function findSession(key: IAuthSessionKey): Promise<IAuthSession> {
  const session = await orm.authSession.findUnique({
    where: {
      key: {
        userId: key.userId,
        token: key.token,
      },
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        include: {
          authSessions: true,
        },
      },
    },
  });
  if (!session) throw new Error("Session not found");
  return {
    ...session,
    user: UserModel.purify(session.user as IRichUser),
  };
}

/**
 * Revoke an auth session
 * @param key - Auth session key
 * @returns - Revoke auth session
 * @throws - Error if session not found
 */
export async function revoke(key: IAuthSessionKey): Promise<IAuthSession> {
  if (!await exists(key)) throw new Error("Session not found");
  const now = new Date();
  return orm.authSession.update({
    where: {
      key,
      expiresAt: {
        gt: now,
      },
    },
    data: {
      expiresAt: now,
    },
  });
}

/**
 * Revoke all auth sessions for a user
 * @param userId - User id
 * @returns - Number of revoked sessions
 */
export async function revokeAll(userId: string): Promise<number> {
  const now = new Date();
  const { count } = await orm.authSession.updateMany({
    where: {
      userId,
      expiresAt: {
        gt: now,
      },
    },
    data: {
      expiresAt: now,
    },
  });
  return count;
}

/**
 * Purge expired auth sessions
 * @returns - Number of purged sessions
 */
export async function purge(): Promise<number> {
  const { count } = await orm.authSession.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });
  return count;
}

/**
 * Check if an auth session exists
 * @param key - Auth session key
 * @returns - True if session exists, false otherwise
 */
export async function exists(key: IAuthSessionKey): Promise<boolean> {
  const session = await orm.authSession.findUnique({
    where: {
      key,
    },
  });
  return !!session;
}
