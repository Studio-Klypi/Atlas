import type { HttpEvent } from "~~/shares/types/primitives";
import type { ERole, IRichUser } from "~~/shares/types/user";
import { findSession } from "~~/prisma/models/auth-session";

export async function protect(event: HttpEvent, next: (e: HttpEvent) => Promise<unknown>, options: {
  roles?: ERole[];
}) {
  const token = getCookie(event, "auth-token");
  const userId = getCookie(event, "auth-user-id");

  if (!token || !userId) {
    event.node.res.statusCode = 401;
    return {
      error: "Unauthorized",
    };
  }

  const session = await findSession({ token, userId });
  const user = session.user as IRichUser;
  event.context.user = user;

  if (!options.roles?.length || (options.roles.length === 1 && options.roles[0] === "member")) return next(event);
  if (user.roles.includes("admin")) return next(event);
  if (options.roles.every(r => !user.roles.includes(r))) {
    event.node.res.statusCode = 403;
    return {
      error: "Not enough permissions",
    };
  }
  return next(event);
}
