import { protect } from "~~/server/services/protection";
import { archiveContact } from "~~/server/services/contact";

export default defineEventHandler(async event => await protect(event, archiveContact, {
  roles: ["accountant", "moderator"],
}));
