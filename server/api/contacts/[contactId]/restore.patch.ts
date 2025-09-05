import { protect } from "~~/server/services/protection";
import { restoreContact } from "~~/server/services/contact";

export default defineEventHandler(async event => await protect(event, restoreContact, {
  roles: ["accountant", "moderator"],
}));
