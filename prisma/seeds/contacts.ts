import type { PrismaClient } from "@prisma/client";
import type { IContact } from "../../shared/types/contact";

const data: Omit<IContact, "deletedAt" | "creator" | "clients">[] = [
  {
    id: "cmf1l211s000105ikh20ffalu",
    firstname: "Nicolas",
    lastname: "Sigrist",
    email: "nicolas@humonio.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export async function seedContacts(client: PrismaClient) {
  for (const contact of data)
    await client.contact.upsert({
      where: {
        id: contact.id,
      },
      update: {
        ...contact,
      },
      create: {
        ...contact,
      },
    });
}
