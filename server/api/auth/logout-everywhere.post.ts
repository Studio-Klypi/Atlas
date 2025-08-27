import { protect } from "~~/server/services/protection";
import { revokeAllSessions } from "~~/server/services/authentication";

export default defineEventHandler(async event => await protect(event, revokeAllSessions, {}));
