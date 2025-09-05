import * as ContactModel from "~~/prisma/models/contact";
import * as AuditLogModel from "~~/prisma/models/audit-log";
import type { IContactCreate } from "#shared/types/contact";

export async function createContact(event: HttpEvent) {
  const { user, agent } = event.context;
  const body = await readBody<IContactCreate>(event);

  try {
    const contact = await ContactModel.create(body, user.id);
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.create",
      agent,
      status: "success",
      meta: {
        ...body,
      },
    });

    event.node.res.statusCode = 201;
    return contact;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.create",
      agent,
      status: "failure",
      meta: {
        error: "Failed to create contact",
        input: body,
      },
    });
    return {
      error: "Failed to create contact",
    };
  }
}

export async function updateContact(event: HttpEvent) {
  const { user, agent } = event.context;
  const body = await readBody<IContactUpdate>(event);
  const contactId = getRouterParam(event, "contactId");
  if (!user || !contactId) return;

  try {
    const contact = await ContactModel.update(contactId, body);
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.update",
      agent,
      status: "success",
      meta: {
        ...body,
      },
    });
    return contact;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.update",
      agent,
      status: "failure",
      meta: {
        error: "Failed to update contact",
        input: body,
      },
    });
    return {
      error: "Failed to update contact",
    };
  }
}

export async function archiveContact(event: HttpEvent) {
  const { user, agent } = event.context;
  const contactId = getRouterParam(event, "contactId");
  if (!user || !contactId) return;

  try {
    const now = new Date();
    const contact = await ContactModel.archive(contactId, now);

    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.archive",
      agent,
      status: "success",
      meta: {
        contactId,
        time: now.toISOString(),
      },
    });
    return contact;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.archive",
      agent,
      status: "failure",
      meta: {
        contactId,
      },
    });
    return {
      error: "Failed to restore contact",
    };
  }
}

export async function restoreContact(event: HttpEvent) {
  const { user, agent } = event.context;
  const contactId = getRouterParam(event, "contactId");
  if (!user || !contactId) return;

  try {
    const contact = await ContactModel.restore(contactId);
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.restore",
      agent,
      status: "success",
      meta: {
        contactId,
      },
    });
    return contact;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.restore",
      agent,
      status: "failure",
      meta: {
        contactId,
      },
    });
    return {
      error: "Failed to restore contact",
    };
  }
}

export async function recoverSpecificContact(event: HttpEvent) {
  const { user, agent } = event.context;
  const contactId = getRouterParam(event, "contactId");
  if (!user || !contactId) return;

  try {
    const contact = await ContactModel.findOne(contactId);

    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.recover-specific",
      agent,
      status: "success",
      meta: {
        contactId,
      },
    });

    return contact;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.recover-specific",
      agent,
      status: "failure",
      meta: {
        contactId,
      },
    });

    return {
      error: "Failed to recover contact",
    };
  }
}

export async function recoverContacts(event: HttpEvent) {
  const { user, agent } = event.context;
  const query = getQuery<{
    offset?: string;
    archived?: string;
  }>(event);

  const offset = Number(query.offset ?? 0);
  const archived = query.archived === "true";

  try {
    const result = await ContactModel.findAll(offset, archived);

    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.recover-list",
      agent,
      status: "success",
      meta: {
        offset,
        archived,
      },
    });

    event.node.res.statusCode = 202;
    return result;
  }
  catch {
    await AuditLogModel.create({
      actorId: user.id,
      action: "contact.recover-list",
      agent,
      status: "failure",
      meta: {
        offset,
        archived,
      },
    });
    return {
      error: "Failed to recover contacts",
    };
  }
}
