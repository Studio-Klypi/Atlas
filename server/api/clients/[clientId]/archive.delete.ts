import { protect } from "~~/server/services/protection";
import { archiveClient } from "~~/server/services/client";

export default defineEventHandler(async event => await protect(event, archiveClient, { roles: ["moderator", "accountant"] }));
