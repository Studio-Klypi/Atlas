<script setup lang="ts">
import { columns } from "./columns";
import { ArrowDown, LoaderCircle } from "lucide-vue-next";

const clientsStore = useClientsStore();
const { loading } = storeToRefs(clientsStore);
const route = useRoute();

const selectedTab = ref<"active" | "archived">(route.query.tab as "active" | "archived" | undefined || "active");
watch(selectedTab, (value) => {
  const query = { ...route.query };
  if (value === "active") delete query.tab;
  else query.tab = value;

  navigateTo({ query }, { replace: true });
  if (value === "archived") clientsStore.loadArchives();
  else clientsStore.loadClients();
});

if (selectedTab.value === "archived") clientsStore.loadArchives();
else clientsStore.loadClients();
</script>

<template>
  <Tabs v-model="selectedTab">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <TabsList>
        <TabsTrigger value="active">
          {{ $t("crm.clients.tabs.active") }}
        </TabsTrigger>
        <TabsTrigger value="archived">
          {{ $t("crm.clients.tabs.archived") }}
        </TabsTrigger>
      </TabsList>

      <slot />
    </div>

    <TabsContent value="active">
      <DataTable
        :columns="columns()"
        :data="clientsStore.activeClients"
        row-link-key="id"
        row-link="/crm/clients/{key}"
      />
      <footer
        v-if="clientsStore.hasMoreClients"
        class="flex justify-center"
      >
        <Button
          variant="ghost"
          size="sm"
          :disabled="loading.fetchingClients"
          @click="clientsStore.loadClients"
        >
          <LoaderCircle
            v-if="loading.fetchingClients"
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
        :data="clientsStore.archivedClients"
        row-link-key="id"
        row-link="/crm/clients/{key}"
      />
      <footer
        v-if="clientsStore.hasMoreArchives"
        class="flex justify-center"
      >
        <Button
          variant="ghost"
          size="sm"
          :disabled="loading.fetchingArchives"
          @click="clientsStore.loadArchives"
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
