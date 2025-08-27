import { protect } from "~~/server/services/protection";
import { logout } from "~~/server/services/authentication";

export default defineEventHandler(async event => await protect(event, logout, {}));
