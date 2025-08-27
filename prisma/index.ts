import { PrismaClient } from "@prisma/client";

const orm = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
});
export default orm;
