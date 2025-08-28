<script setup lang="ts">
import Page from "~/components/shared/primitives/layout/Page.vue";
import { Filter, Plus, Search } from "lucide-vue-next";

definePageMeta({
  displayName: "crm.clients",
});
</script>

<template>
  <Page name="crm.clients.list">
    <header class="flex items-center gap-2">
      <div class="relative flex-1">
        <Input
          placeholder="Search..."
          class="pl-8"
        />
        <Search class="size-4 absolute top-2.5 left-2.5 text-muted-foreground" />
      </div>
      <Button
        size="icon"
        variant="outline"
      >
        <Filter />
      </Button>
      <Button>
        <Plus />
        {{ $t("btn.new") }}
      </Button>
    </header>

    <main>
      <!-- todo: data table -->
    </main>

    <footer>
      <!-- todo: pagination -->
    </footer>
  </Page>
</template>
