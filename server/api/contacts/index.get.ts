import { protect } from "~~/server/services/protection";
import { recoverContacts } from "~~/server/services/contact";

export default defineEventHandler(async event => await protect(event, recoverContacts, {
  roles: ["moderator", "accountant"],
}));
