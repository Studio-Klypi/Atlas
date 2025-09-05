-- CreateEnum
CREATE TYPE "public"."ClientType" AS ENUM ('company', 'individual');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('eur', 'usd');

-- CreateTable
CREATE TABLE "public"."contacts" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clients" (
    "id" TEXT NOT NULL,
    "type" "public"."ClientType" NOT NULL,
    "name" TEXT NOT NULL,
    "legalForm" TEXT,
    "street" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "registrationNumber" TEXT,
    "siren" TEXT,
    "siret" TEXT,
    "vatNumber" TEXT,
    "billindCurrency" "public"."Currency" NOT NULL DEFAULT 'eur',
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."client_contacts" (
    "clientId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "isBillingContact" BOOLEAN NOT NULL DEFAULT false,
    "emailOverride" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_contacts_pkey" PRIMARY KEY ("clientId","contactId")
);

-- CreateIndex
CREATE UNIQUE INDEX "contacts_email_deletedAt_key" ON "public"."contacts"("email", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "clients_siret_deletedAt_key" ON "public"."clients"("siret", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "clients_registrationNumber_deletedAt_key" ON "public"."clients"("registrationNumber", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "clients_vatNumber_deletedAt_key" ON "public"."clients"("vatNumber", "deletedAt");

-- AddForeignKey
ALTER TABLE "public"."contacts" ADD CONSTRAINT "contacts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clients" ADD CONSTRAINT "clients_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_contacts" ADD CONSTRAINT "client_contacts_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "public"."clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."client_contacts" ADD CONSTRAINT "client_contacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "public"."contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
