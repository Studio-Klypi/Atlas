-- AddForeignKey
ALTER TABLE "public"."client_contacts" ADD CONSTRAINT "client_contacts_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
