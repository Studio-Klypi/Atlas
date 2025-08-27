import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/users";

const client = new PrismaClient();

async function seed() {
  console.log("[Atlas DB] Seeding...");

  console.log("[Atlas DB] Seeding users (0/1)");
  await seedUsers(client);

  console.log("[Atlas DB] Database seeded! (1/1)");
}

seed()
  .then(() => client.$disconnect())
  .catch((e) => {
    client.$disconnect();
    console.error(e);
    process.exit(1);
  });
