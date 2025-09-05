<script setup lang="ts">
import { columns } from "./columns";
import { ArrowDown, LoaderCircle } from "lucide-vue-next";

const contactsStore = useContactsStore();
const { loading } = storeToRefs(contactsStore);
const route = useRoute();

const selectedTab = ref<"active" | "archived">(route.query.tab as "active" | "archived" | undefined || "active");
watch(selectedTab, (value) => {
  const query = { ...route.query };
  if (value === "active") delete query.tab;
  else query.tab = value;

  navigateTo({ query }, { replace: true });
  if (value === "archived") contactsStore.loadArchives();
  else contactsStore.loadContacts();
});

if (selectedTab.value === "archived") contactsStore.loadArchives();
else contactsStore.loadContacts();
</script>

<template>
  <Tabs v-model="selectedTab">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <TabsList>
        <TabsTrigger value="active">
          {{ $t("crm.contacts.tabs.active") }}
        </TabsTrigger>
        <TabsTrigger value="archived">
          {{ $t("crm.contacts.tabs.archived") }}
        </TabsTrigger>
      </TabsList>

      <slot />
    </div>

    <TabsContent value="active">
      <DataTable
        :columns="columns()"
        :data="contactsStore.activeContacts"
        row-link-key="id"
        row-link="/contacts/{key}"
      />
      <footer
        v-if="contactsStore.hasMoreContacts"
        class="flex justify-center"
      >
        <Button
          variant="ghost"
          size="sm"
          :disabled="loading.fetchingList"
          @click="contactsStore.loadContacts"
        >
          <LoaderCircle
            v-if="loading.fetchingList"
            class="animate-spin"
          />
          <ArrowDown v-else />
          {{ $t("btn.load-more") }}
        </Button>
      </footer>
    </TabsContent>
    <TabsContent value="archived">
      <DataTable
        :columns="columns()"
        :data="contactsStore.archivedContacts"
        row-link-key="id"
        row-link="/contacts/{key}"
      />
      <footer
        v-if="contactsStore.hasMoreArchives"
        class="flex justify-center"
      >
        <Button
          variant="ghost"
          size="sm"
          :disabled="loading.fetchingArchives"
          @click="contactsStore.loadArchives"
        >
          <LoaderCircle
            v-if="loading.fetchingArchives"
            class="animate-spin"
          />
          <ArrowDown v-else />
          {{ $t("btn.load-more") }}
        </Button>
      </footer>
    </TabsContent>
  </Tabs>
</template>
