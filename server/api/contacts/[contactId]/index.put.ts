import { protect } from "~~/server/services/protection";
import { updateContact } from "~~/server/services/contact";

export default defineEventHandler(async event => await protect(event, updateContact, {
  roles: ["accountant", "moderator"],
}));
