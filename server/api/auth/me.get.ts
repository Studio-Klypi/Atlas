import { protect } from "~~/server/services/protection";
import { self } from "~~/server/services/authentication";

export default defineEventHandler(async event => await protect(event, self, {}));
