import { protect } from "~~/server/services/protection";
import { restoreClient } from "~~/server/services/client";

export default defineEventHandler(async event => await protect(event, restoreClient, {
  roles: ["moderator", "accountant"],
}));
