import { protect } from "~~/server/services/protection";
import { createClient } from "~~/server/services/client";

export default defineEventHandler(async event => await protect(event, createClient, {
  roles: ["moderator", "accountant"],
}));
