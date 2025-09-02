import type { IListResponse } from "#shared/types/primitives";
import type { IContact, IContactCreate, IContactUpdate } from "#shared/types/contact";
import orm from "../index";
import * as UserModel from "./user";
import * as ClientModel from "./client";

/**
 * Purify contact object
 * @param contact - Contact object
 * @returns - Purified contact object
 */
export function purify(contact: IContact): IContact {
  return {
    ...contact,
    creator: contact.creator ? UserModel.purify(contact.creator as IRichUser) : null,
    clients: contact.clients?.map(client => ({
      ...client,
      creator: client.creator ? UserModel.purify(client.creator as IRichUser) : null,
      client: client.client ? ClientModel.purify(client.client) : null,
    })) ?? [],
  };
}

/**
 * Create a new contact
 * @param data - Contact data
 * @param creatorId - Creator id
 * @returns - Created contact
 */
export async function create(data: IContactCreate, creatorId?: string): Promise<IContact> {
  const contact = await orm.contact.create({
    data: {
      ...data,
      createdBy: creatorId ?? null,
    },
    include: {
      creator: true,
      clients: {
        include: {
          client: true,
        },
      },
    },
  });
  return purify(contact);
}

/**
 * Update a contact
 * @param clientId - Contact id
 * @param data - Contact data
 * @returns - Updated contact
 * @throws - Error if contact not found
 */
export async function update(clientId: string, data: IContactUpdate): Promise<IContact> {
  if (!await exists(clientId)) throw new Error("Failed to update contact");
  const contact = await orm.contact.update({
    where: {
      id: clientId,
      deletedAt: null,
    },
    data: {
      ...data,
    },
    include: {
      creator: true,
      clients: {
        include: {
          client: true,
        },
      },
    },
  });
  return purify(contact);
}

/**
 * Archive a contact
 * @param contactId - Contact id
 * @param archivedAt - Archived at
 * @returns - Archived contact
 * @throws - Error if contact not found
 */
export async function archive(contactId: string, archivedAt: Date): Promise<IContact> {
  const contact = await orm.contact.update({
    where: {
      id: contactId,
      deletedAt: null,
    },
    data: {
      deletedAt: archivedAt,
    },
    include: {
      creator: true,
      clients: {
        include: {
          client: true,
        },
      },
    },
  });
  if (!contact) throw new Error("Failed to archive contact");
  return purify(contact);
}

/**
 * Restore a contact
 * @param contactId - Contact id
 * @returns - Restored contact
 * @throws - Error if contact not found
 */
export async function restore(contactId: string): Promise<IContact> {
  const contact = await orm.contact.update({
    where: {
      id: contactId,
      deletedAt: {
        not: null,
      },
    },
    data: {
      deletedAt: null,
    },
    include: {
      creator: true,
      clients: {
        include: {
          client: true,
        },
      },
    },
  });
  if (!contact) throw new Error("Failed to restore contact");
  return purify(contact);
}

/**
 * Delete a contact
 * @param contactId - Contact id
 * @returns - Deleted contact
 * @throws - Error if contact not found
 */
export async function destroy(contactId: string): Promise<IContact> {
  return orm.contact.delete({
    where: {
      id: contactId,
    },
  });
}

/**
 * Find a contact by id
 * @param contactId - Contact id
 * @returns - Contact
 * @throws - Error if contact not found
 */
export async function findOne(contactId: string): Promise<IContact> {
  const contact = await orm.contact.findUnique({
    where: {
      id: contactId,
      deletedAt: null,
    },
    include: {
      creator: true,
      clients: {
        include: {
          client: true,
        },
      },
    },
  });
  if (!contact) throw new Error("Failed to find contact");
  return purify(contact);
}

/**
 * Retrieves a list of contact records from the database with optional pagination and archived filters.
 * @param {number} [offset=0] - The number of records to skip for pagination.
 * @param {boolean} [archived=false] - Flag to include archived records. If true, only archived records are retrieved; otherwise, non-archived records are retrieved.
 * @return {Promise<IContact[]>} A promise that resolves to a list of contact records.
 */
export async function findAll(offset: number = 0, archived: boolean = false): Promise<IListResponse<IContact>> {
  const data = await orm.contact.findMany({
    where: {
      deletedAt: archived
        ? {
            not: null,
          }
        : null,
    },
    orderBy: archived ? { deletedAt: "desc" } : { createdAt: "desc" },
    skip: offset,
    take: 30,
    include: {
      creator: true,
      clients: {
        include: {
          client: true,
        },
      },
    },
  });
  const total = await orm.contact.count({
    where: {
      deletedAt: archived
        ? {
            not: null,
          }
        : null,
    },
  });

  return {
    data: data.map(contact => purify(contact)),
    total,
  };
}

/**
 * Check if a contact exists
 * @param clientId - Contact id
 * @returns - True if contact exists, false otherwise
 */
export async function exists(clientId: string): Promise<boolean> {
  return !!(await orm.contact.findUnique({
    where: {
      id: clientId,
    },
  }));
}
