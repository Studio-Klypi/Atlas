<script setup lang="ts">
import Page from "~/components/shared/primitives/layout/Page.vue";
import { Filter, Plus, Search } from "lucide-vue-next";
import ClientDataTable from "~/components/shared/clients/data-table/ClientDataTable.vue";
import ClientDialog from "~/components/shared/clients/dialogs/ClientDialog.vue";

const { t } = useI18n();

definePageMeta({
  displayName: "crm.clients",
});
useHead({
  title: t("brand.tab-templates.default", { page: t("crm.clients.title") }),
});
</script>

<template>
  <Page name="crm.clients.list">
    <ClientDataTable>
      <header class="flex items-center gap-2">
        <div class="relative flex-1">
          <Input
            placeholder="Search..."
            class="pl-8"
            disabled
          />
          <Search class="size-4 absolute top-2.5 left-2.5 text-muted-foreground" />
        </div>
        <Button
          size="icon"
          variant="outline"
        >
          <Filter />
        </Button>
        <ClientDialog>
          <Button>
            <Plus />
            {{ $t("btn.new") }}
          </Button>
        </ClientDialog>
      </header>
    </ClientDataTable>
  </Page>
</template>
