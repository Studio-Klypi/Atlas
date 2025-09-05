<script lang="ts" setup>
import Page from "~/components/shared/primitives/layout/Page.vue";

const { t } = useI18n();

definePageMeta({
  displayName: "dashboard",
});
useHead({
  title: t("brand.tab-templates.default", { page: t("dashboard.title") }),
});
</script>

<template>
  <Page>
    home
  </Page>
</template>
