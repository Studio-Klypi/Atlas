import * as UserModel from "~~/prisma/models/user";
import * as AuditLogModel from "~~/prisma/models/audit-log";

export async function updateProfile(event: HttpEvent) {
  const user = event.context.user;
  const agent = event.context.agent;
  const body = await readBody<IUserUpdate>(event);

  try {
    const newUser = await UserModel.update(user.id, body);

    await AuditLogModel.create({
      actorId: user.id,
      action: "user.update-profile",
      agent,
      status: "success",
      meta: {
        body,
      },
    });

    event.node.res.statusCode = 202;
    return newUser;
  }
  catch {
    event.node.res.statusCode = 500;
    await AuditLogModel.create({
      actorId: user.id,
      action: "user.update-profile",
      agent,
      status: "failure",
      meta: {
        error: "Failed to update profile",
        body,
      },
    });
    return {
      error: "Failed to update profile",
    };
  }
}
