import type { TNull } from "#shared/types/primitives";
import type { IUser } from "#shared/types/user";
import type { IClientContact } from "#shared/types/client";

export interface IContact {
  id: string;
  firstname: string;
  lastname: string;
  email?: TNull<string>;
  phone?: TNull<string>;
  notes?: TNull<string>;
  createdBy?: TNull<string>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: TNull<Date>;

  // relations
  creator?: TNull<IUser>;
  clients?: IClientContact[];
}
export type IContactCreate = Omit<IContact, "id" | "createdBy" | "createdAt" | "updatedAt" | "deletedAt" | "creator" | "clients">;
export type IContactUpdate = Partial<IContactCreate>;
