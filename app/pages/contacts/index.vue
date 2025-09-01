<script setup lang="ts">
import Page from "@/components/shared/primitives/layout/Page.vue";

const { t } = useI18n();

definePageMeta({
  displayName: "crm.contacts",
});
useHead({
  title: t("brand.tab-templates.default", { page: t("crm.contacts.title") }),
});
</script>

<template>
  <Page name="crm.contacts.list">
    crm contacts list
  </Page>
</template>
