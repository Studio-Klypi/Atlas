import type { HttpEvent } from "#shared/types/primitives";
import type { IAuthSessionKey } from "#shared/types/auth-session";
import * as UserModel from "~~/prisma/models/user";
import * as SessionModel from "~~/prisma/models/auth-session";
import type { CookieSerializeOptions } from "cookie-es";

const setCookies = (event: HttpEvent, key: IAuthSessionKey, expiration: Date) => {
  const cookiesOptions: CookieSerializeOptions = {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiration,
    sameSite: "lax",
  };

  setCookie(event, "auth-token", key.token, cookiesOptions);
  setCookie(event, "auth-user-id", key.userId, cookiesOptions);
};
const getCookies = (event: HttpEvent) => {
  const token = getCookie(event, "auth-token");
  const userId = getCookie(event, "auth-user-id");
  if (!token || !userId) return null;

  return {
    token,
    userId,
  };
};
const clearCookies = (event: HttpEvent) => {
  deleteCookie(event, "auth-token");
  deleteCookie(event, "auth-user-id");
};

export async function login(event: HttpEvent) {
  const body = await readBody<{
    email: string;
    password: string;
  }>(event);
  const agent = getHeader(event, "user-agent") ?? "unknown";

  try {
    const user = await UserModel.authenticate(body.email, body.password);
    const session = await SessionModel.create(user.id, agent);

    const key = {
      token: session.token,
      userId: session.userId,
    };
    setCookies(event, key, new Date(session.expiresAt));

    return user;
  }
  catch {
    event.node.res.statusCode = 500;
    return {
      error: "Invalid credentials",
    };
  }
}

export async function logout(event: HttpEvent) {
  const key = getCookies(event);
  if (!key) return;

  try {
    await SessionModel.revoke(key);
    clearCookies(event);
    return;
  }
  catch {
    event.node.res.statusCode = 500;
    return {
      error: "Failed to logout",
    };
  }
}

export async function revokeAllSessions(event: HttpEvent) {
  const user = event.context.user;
  if (!user) return;

  try {
    await SessionModel.revokeAll(user.id);
    return;
  }
  catch {
    event.node.res.statusCode = 500;
    return {
      error: "Failed to revoke all sessions",
    };
  }
}

export async function self(event: HttpEvent) {
  return UserModel.purify(event.context.user);
}
