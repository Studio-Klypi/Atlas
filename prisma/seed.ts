import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/users";
import { seedClients } from "./seeds/clients";

const client = new PrismaClient();

const seeds = {
  users: seedUsers,
  clients: seedClients,
};

async function seed() {
  console.log("[Atlas DB] Seeding...");

  const keys = Object.keys(seeds);
  for (let i = 0; i < Object.keys(seeds).length; ++i) {
    console.log(`[Atlas DB] Seeding ${keys[0]} (${i}/${keys.length})`);
    await seeds[keys[i]](client);
  }

  console.log(`[Atlas DB] Database seeded! (${keys.length}/${keys.length})`);
}

seed()
  .then(() => client.$disconnect())
  .catch((e) => {
    client.$disconnect();
    console.error(e);
    process.exit(1);
  });
