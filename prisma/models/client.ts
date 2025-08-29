import type { IClient, IClientCreate, IClientUpdate } from "#shared/types/client";
import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/binary";
import orm from "../index";
import type { IListResponse } from "#shared/types/primitives";
import * as UserModel from "./user";

/**
 * Purify client object
 * @param client - Client object
 * @returns - Purified client object
 */
export function purify(client: IClient): IClient {
  return {
    ...client,
    creator: client.creator ? UserModel.purify(client.creator as IRichUser) : null,
    contacts: client.contacts?.map(c => ({
      ...c,
      creator: c.creator ? UserModel.purify(c.creator as IRichUser) : null,
      contact: c.contact
        ? {
            ...c.contact,
            creator: c.contact.creator ? UserModel.purify(c.contact.creator as IRichUser) : null,
          }
        : null,
    })) ?? [],
  };
}

/**
 * Create a new client
 * @param payload - Client payload
 * @param creatorId - Creator id
 * @returns - Created client
 * @throws - Error if client already exists
 */
export async function create(payload: IClientCreate, creatorId?: string): Promise<IClient> {
  try {
    return purify(await orm.client.create({
      data: {
        ...payload,
        createdBy: creatorId ?? null,
      },
      include: {
        creator: true,
        contacts: true,
      },
    }));
  }
  catch (e) {
    switch ((e as PrismaClientKnownRequestError).code) {
      case "P2002": {
        throw new Error("Client already exists");
      }
      default: {
        throw e;
      }
    }
  }
}

/**
 * Update a client
 * @param id - Client id
 * @param payload - Client payload
 * @returns - Updated client
 * @throws - Error if client not found
 */
export async function update(id: string, payload: IClientUpdate): Promise<IClient> {
  if (!await exists(id)) throw new Error("Client not found");
  return purify(await orm.client.update({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      ...payload,
    },
    include: {
      creator: true,
      contacts: true,
    },
  }));
}

/**
 * Archive a client
 * @param id - Client id
 * @returns - Archived client
 * @throws - Error if client not found
 */
export async function archive(id: string): Promise<IClient> {
  if (!await exists(id)) throw new Error("Client not found");
  return purify(await orm.client.update({
    where: {
      id,
      deletedAt: null,
    },
    data: {
      deletedAt: new Date(),
    },
    include: {
      creator: true,
      contacts: true,
    },
  }));
}

/**
 * Restore a client
 * @param id - Client id
 * @returns - Restored client
 * @throws - Error if client not found
 */
export async function restore(id: string): Promise<IClient> {
  if (!await exists(id, true)) throw new Error("Client not found");
  return purify(await orm.client.update({
    where: {
      id,
      deletedAt: {
        not: null,
      },
    },
    data: {
      deletedAt: null,
    },
    include: {
      creator: true,
      contacts: true,
    },
  }));
}

/**
 * Delete a client
 * @param id - Client id
 * @returns - Deleted client
 * @throws - Error if client not found
 */
export async function destroy(id: string): Promise<IClient> {
  if (!await exists(id)) throw new Error("Client not found");
  return purify(await orm.client.delete({
    where: {
      id,
      deletedAt: null,
    },
  }));
}

/**
 * Find a client by id
 * @param id - Client id
 * @returns - Client
 * @throws - Error if client not found
 */
export async function findOne(id: string): Promise<IClient> {
  const client = await orm.client.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      creator: true,
      contacts: {
        include: {
          contact: {
            include: {
              creator: true,
            },
          },
        },
      },
    },
  });
  if (!client) throw new Error("Client not found");
  return purify(client);
}

/**
 * Retrieves a list of client records from the database with optional pagination and archived filters.
 * @param {number} [skip=0] - The number of records to skip for pagination.
 * @param {number} [take=30] - The maximum number of records to retrieve.
 * @param {boolean} [archived=false] - Flag to include archived records. If true, only archived records are retrieved; otherwise, non-archived records are retrieved.
 * @return {Promise<IClient[]>} A promise that resolves to a list of client records.
 */
export async function findAll(skip: number = 0, take: number = 30, archived: boolean = false): Promise<IListResponse<IClient>> {
  const data = await orm.client.findMany({
    where: {
      deletedAt: archived ? { not: null } : null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take,
    skip,
    include: {
      creator: true,
      contacts: true,
    },
  });
  const total = await orm.client.count({
    where: {
      deletedAt: archived ? { not: null } : null,
    },
  });
  return {
    data: data.map(client => purify(client)),
    total,
  };
}

/**
 * Check if a client exists
 * @param id - Client id
 * @param archived
 * @returns - True if client exists, false otherwise
 */
export async function exists(id: string, archived: boolean = false): Promise<boolean> {
  const client = await orm.client.findUnique({
    where: {
      id,
      ...(archived ? { NOT: { deletedAt: null } } : { deletedAt: null }),
    },
  });
  return !!client;
}
