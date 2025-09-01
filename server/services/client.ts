import * as AuditLogModel from "~~/prisma/models/audit-log";
import * as ClientModel from "~~/prisma/models/client";

export async function recoverClients(event: HttpEvent) {
  const user = event.context.user;
  const agent = event.context.agent;
  const query = getQuery<{
    offset?: string;
    archived?: string;
  }>(event);

  const take = 30;
  const skip = query.offset ? Number(query.offset) : 0;
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
  const agent = event.context.agent;

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

export async function updateClient(event: HttpEvent) {
  const { user, agent } = event.context;
  const clientId = getRouterParam(event, "clientId");
  if (!user || !clientId) return;

  const body = await readBody<IClientUpdate>(event);

  try {
    const client = await ClientModel.update(clientId, body);
    event.node.res.statusCode = 202;
    return client;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "client.update",
      agent,
      status: "failure",
      meta: {
        error: "Failed to update client",
      },
    });

    return {
      error: "Failed to update client",
    };
  }
}

export async function archiveClient(event: HttpEvent) {
  const { user, agent } = event.context;
  const id = getRouterParam(event, "clientId");
  if (!user || !id) return;

  try {
    const client = await ClientModel.archive(id);

    await AuditLogModel.create({
      actorId: user.id,
      action: "client.archive",
      agent,
      status: "success",
      meta: {
        id,
        archivedAt: client.deletedAt,
      },
    });

    event.node.res.statusCode = 202;
    return client;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "client.archive",
      agent,
      status: "failure",
      meta: {
        id,
      },
    });
    return {
      error: "Failed to archive client",
    };
  }
}
