import { protect } from "~~/server/services/protection";
import { recoverSpecificClient } from "~~/server/services/client";

export default defineEventHandler(async event => await protect(event, recoverSpecificClient, {
  roles: ["moderator", "accountant", "support"],
}));
