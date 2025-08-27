import type { IRichUser, IUser, IUserCreate, IUserUpdate } from "#shared/types/user";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
import orm from "../index";
import argon2 from "argon2";

/**
 * Purify user object
 * @param user - User object
 * @returns - Purified user object
 */
export function purify(user: IRichUser): IUser {
  const json = { ...user } as Partial<IRichUser>;
  delete json.password;
  return json as IUser;
}

/**
 * Create a new user
 * @param payload - User payload
 * @returns - Created user
 * @throws - Error if user already exists
 */
export async function create(payload: IUserCreate): Promise<IUser> {
  try {
    const user = await orm.user.create({
      data: {
        ...payload,
        password: await argon2.hash(payload.password),
        logsAsTarget: {
          create: {
            targetType: "user",
            action: "user.create",
            status: "success",
            meta: JSON.stringify({
              body: {
                ...payload,
                password: "··········",
              },
            }),
          },
        },
      },
      include: {
        logsAsActor: {
          include: {
            target: true,
          },
        },
        logsAsTarget: {
          include: {
            actor: true,
          },
        },
      },
    });

    return purify(user as unknown as IRichUser);
  }
  catch (e) {
    switch ((e as PrismaClientKnownRequestError).code) {
      case "P2002":
        throw new Error("User already exists");
      default:
        throw e;
    }
  }
}

/**
 * Find a user by id
 * @param id - User id
 * @returns - User
 * @throws - Error if user not found
 */
export async function findOne(id: string): Promise<IUser> {
  const user = await orm.user.findUnique({
    where: {
      id,
    },
    include: {
      logsAsActor: {
        include: {
          target: true,
        },
      },
      logsAsTarget: {
        include: {
          actor: true,
        },
      },
    },
  });
  if (!user) throw new Error("User not found");
  return purify(user as unknown as IRichUser);
}

/**
 * Find a user by email
 * @param email - User email
 * @returns - User
 * @throws - Error if user not found
 */
export async function findByEmail(email: string): Promise<IUser> {
  const user = await orm.user.findUnique({
    where: {
      email,
    },
    include: {
      logsAsActor: {
        include: {
          target: true,
        },
      },
      logsAsTarget: {
        include: {
          actor: true,
        },
      },
    },
  });
  if (!user) throw new Error("User not found");
  return purify(user as unknown as IRichUser);
}

/**
 * Authenticate a user
 * @param email - User email
 * @param password - User password
 * @returns - User
 * @throws - Error if user not found or password is invalid
 */
export async function authenticate(email: string, password: string): Promise<IUser> {
  const user = await orm.user.findUnique({
    where: {
      email,
    },
    include: {
      logsAsActor: {
        include: {
          target: true,
        },
      },
      logsAsTarget: {
        include: {
          actor: true,
        },
      },
    },
  });
  if (!user) throw new Error("User not found");
  if (!await argon2.verify(user.password, password)) throw new Error("Invalid password");
  return purify(user as unknown as IRichUser);
}

/**
 * Update a user
 * @param id - User id
 * @param payload - User payload
 * @returns - Updated user
 * @throws - Error if user not found
 */
export async function update(id: string, payload: IUserUpdate): Promise<IUser> {
  if (!await exists(id)) throw new Error("User not found");
  const user = await orm.user.update({
    where: {
      id,
    },
    data: {
      ...payload,
    },
  });
  return purify(user);
}

/**
 * Delete a user
 * @param id - User id
 * @returns - Deleted user
 * @throws - Error if user not found
 */
export async function deleteOne(id: string): Promise<IUser> {
  if (!await exists(id)) throw new Error("User not found");
  const user = await orm.user.delete({
    where: {
      id,
    },
    include: {
      logsAsActor: {
        include: {
          target: true,
        },
      },
      logsAsTarget: {
        include: {
          actor: true,
        },
      },
    },
  });
  return purify(user as unknown as IRichUser);
}

/**
 * Check if a user exists
 * @param id - User id
 * @returns - True if user exists, false otherwise
 */
export async function exists(id: string): Promise<boolean> {
  const user = await orm.user.findUnique({
    where: {
      id,
    },
  });
  return !!user;
}
