import { protect } from "~~/server/services/protection";
import { recoverSpecificContact } from "~~/server/services/contact";

export default defineEventHandler(async event => await protect(event, recoverSpecificContact, {}));
