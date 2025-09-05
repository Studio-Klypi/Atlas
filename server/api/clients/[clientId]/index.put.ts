import { protect } from "~~/server/services/protection";
import { updateClient } from "~~/server/services/client";

export default defineEventHandler(async event => await protect(event, updateClient, {
  roles: ["moderator", "accountant"],
}));
