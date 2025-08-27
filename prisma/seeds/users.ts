import type { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import type { ERole } from "../../shares/types/user";

const data: {
  id: string;
  firstname: string;
  lastname: string;
  roles: ERole[];
  email: string;
  password?: string;
}[] = [
  {
    id: "cmetrwumx000104jrhpqu4t16",
    firstname: "Root",
    lastname: "Root",
    roles: ["admin", "moderator", "writer", "support", "accountant", "member"],
    email: "contact@studio-klypi.com",
  },
];

export async function seedUsers(client: PrismaClient) {
  for (const user of data)
    await client.user.upsert({
      where: {
        id: user.id,
      },
      update: {
        ...user,
        password: user.password ?? await argon2.hash(process.env.ROOT_PASSWORD ?? "root"),
      },
      create: {
        ...user,
        password: user.password ?? await argon2.hash(process.env.ROOT_PASSWORD ?? "root"),
      },
    });
}
