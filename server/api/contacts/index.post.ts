import { protect } from "~~/server/services/protection";
import { createContact } from "~~/server/services/contact";

export default defineEventHandler(async event => await protect(event, createContact, {
  roles: ["moderator", "accountant"],
}));
