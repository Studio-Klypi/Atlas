import { protect } from "~~/server/services/protection";
import { recoverClients } from "~~/server/services/client";

export default defineEventHandler(async event => await protect(event, recoverClients, {
  roles: ["moderator", "accountant"],
}));
