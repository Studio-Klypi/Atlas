<script setup lang="ts">
import Page from "@/components/shared/primitives/layout/Page.vue";
import ContactDataTable from "~/components/shared/contacts/data-table/ContactDataTable.vue";
import { Filter, Plus, Search } from "lucide-vue-next";
import ContactDialog from "~/components/shared/contacts/dialogs/ContactDialog.vue";

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
    <ContactDataTable>
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
        <ContactDialog>
          <Button>
            <Plus />
            {{ $t("btn.new") }}
          </Button>
        </ContactDialog>
      </header>
    </ContactDataTable>
  </Page>
</template>
