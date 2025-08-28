import type { IClient } from "../../shared/types/client";
import type { PrismaClient } from "@prisma/client";

const data: Omit<IClient, "createdAt" | "createdBy" | "updatedAt" | "deletedAt">[] = [
  {
    id: "cmevn6ev1000108jvghx11vps",
    type: "company",
    name: "Humonio",
    legalForm: "sas",
    street: "34a Rue de Mulhouse",
    zip: "67100",
    city: "Strasbourg",
    country: "France",
    siret: "88451136100021",
    billingCurrency: "eur",
    email: "contact@humonio.com",
    phone: "01 23 45 67 89",
    website: "https://humonio.com",
  },
];

export async function seedClients(client: PrismaClient) {
  for (const c of data) {
    await client.client.upsert({
      where: {
        id: c.id,
      },
      update: {
        ...c,
      },
      create: {
        ...c,
      },
    });
  }
}
