export default defineEventHandler(event => event.context.agent = getHeader(event, "user-agent") ?? "unknown");
