import * as UserModel from "~~/prisma/models/user";

export async function updateProfile(event: HttpEvent) {
  const user = event.context.user;
  const body = await readBody<IUserUpdate>(event);

  try {
    const newUser = await UserModel.update(user.id, body);
    event.node.res.statusCode = 202;
    return newUser;
  }
  catch {
    event.node.res.statusCode = 500;
    return {
      error: "Failed to update profile",
    };
  }
}
