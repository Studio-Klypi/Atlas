<script setup lang="ts">
import { columns } from "./columns";

const { clients } = storeToRefs(useClientsStore());
</script>

<template>
  <DataTable
    :columns="columns()"
    :data="clients"
    row-link-key="id"
    row-link="/crm/clients/{key}"
  />
</template>
