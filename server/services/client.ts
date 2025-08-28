import * as AuditLogModel from "~~/prisma/models/audit-log";
import * as ClientModel from "~~/prisma/models/client";

export async function recoverClients(event: HttpEvent) {
  const user = event.context.user;
  const agent = getHeader(event, "user-agent") ?? "unknown";
  const query = getQuery<{
    perPage?: string;
    page?: string;
    archived?: string;
  }>(event);

  const take = Number(query.perPage || 30);
  const skip = (Number(query.page || 1) - 1) * take;
  const archived = query.archived === "true";

  try {
    const client = await ClientModel.findAll(skip, take, archived);

    await AuditLogModel.create({
      actorId: user.id,
      action: "client.recover-list",
      agent,
      status: "success",
      meta: {
        take,
        skip,
        archived,
      },
    });

    event.node.res.statusCode = 201;
    return client;
  }
  catch (e) {
    await AuditLogModel.create({
      actorId: user.id,
      action: "client.recover-list",
      agent,
      status: "failure",
      meta: {
        error: e,
        take,
        skip,
        archived,
      },
    });
    return {
      error: "Failed to recover clients",
    };
  }
}

export async function createClient(event: HttpEvent) {
  const user = event.context.user;
  const body = await readBody<IClientCreate>(event);
  const agent = getHeader(event, "user-agent") ?? "unknown";

  try {
    const client = await ClientModel.create(body, user.id);

    await AuditLogModel.create({
      actorId: user.id,
      action: "client.create",
      agent,
      status: "success",
      meta: {
        ...body,
      },
    });

    event.node.res.statusCode = 201;
    return client;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "client.create",
      agent,
      status: "failure",
      meta: {
        error: "Failed to create client",
        input: body,
      },
    });
    return {
      error: "Failed to create client",
    };
  }
}
