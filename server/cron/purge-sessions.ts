import * as SessionsModel from "~~/prisma/models/auth-session";
import { defineCronHandler } from "#nuxt/cron";

export default defineCronHandler("daily", async () => {
  const count = await SessionsModel.purge();
  console.log(`[Sessions] Purged ${count} sessions`);
});
