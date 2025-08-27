<script setup lang="ts">
import Page from "~/components/shared/primitives/layout/Page.vue";

definePageMeta({
  layout: "empty-center",
  auth: false,
});
</script>

<template>
  <Page name="login">
    {{ $t("login.title") }}
  </Page>
</template>
