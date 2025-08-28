import type { TNull } from "#shared/types/primitives";
import type { IUser } from "#shared/types/user";
import type { IContact } from "#shared/types/contact";

export const ClientTypes = [
  "company",
  "individual",
] as const;
export type EClientType = (typeof ClientTypes)[number];

export const Currencies = [
  "eur",
  "usd",
] as const;
export type ECurrency = (typeof Currencies)[number];

export interface IClient {
  id: string;
  type: EClientType;
  name: string;
  legalForm?: TNull<string>;
  street: string;
  zip: string;
  city: string;
  country: string;
  registrationNumber?: TNull<string>;
  siren?: TNull<string>;
  siret?: TNull<string>;
  vatNumber?: TNull<string>;
  billingCurrency: ECurrency;
  email?: TNull<string>;
  phone?: TNull<string>;
  website?: TNull<string>;
  notes?: TNull<string>;
  createdBy?: TNull<string>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: TNull<Date>;

  // relations
  creator?: TNull<IUser>;
  contacts?: TNull<IClientContact[]>;
}
export type IClientCreate = Omit<IClient, "id" | "createdBy" | "createdAt" | "updatedAt" | "deletedAt" | "creator" | "contacts">;
export type IClientUpdate = Partial<IClientCreate>;

export interface IClientContact {
  clientId: string;
  contactId: string;
  role: string;
  isBillingContact: boolean;
  emailOverride?: TNull<string>;
  createdBy?: TNull<string>;
  createdAt: Date;
  updatedAt: Date;

  // relations
  client?: TNull<IClient>;
  contact?: TNull<IContact>;
}
