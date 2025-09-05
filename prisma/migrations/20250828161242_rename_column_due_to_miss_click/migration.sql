/*
  Warnings:

  - You are about to drop the column `billindCurrency` on the `clients` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."clients" DROP COLUMN "billindCurrency",
ADD COLUMN     "billingCurrency" "public"."Currency" NOT NULL DEFAULT 'eur';
