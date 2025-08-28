<script setup lang="ts">
import { columns } from "./columns";

const data = ref<IClient[]>([
  {
    id: "humonio-workspace",
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]);
</script>

<template>
  <DataTable
    :columns="columns()"
    :data="data"
    row-link-key="id"
    row-link="/crm/clients/{key}"
  />
</template>
