import { protect } from "~~/server/services/protection";
import { updateProfile } from "~~/server/services/user";

export default defineEventHandler(async event => await protect(event, updateProfile, {}));
