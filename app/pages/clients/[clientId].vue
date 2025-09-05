<script setup lang="ts">
import Page from "~/components/shared/primitives/layout/Page.vue";
import { parseShortDate, parseShortTime } from "#shared/helpers/date";
import { Archive, ArchiveRestore, Edit, Globe, Mail, MoreHorizontal, Phone } from "lucide-vue-next";
import ClientDialog from "~/components/shared/clients/dialogs/ClientDialog.vue";

const { locale } = useI18n();

definePageMeta({
  displayName: "crm.client-details",
});

const { buildString, buildUrl } = useMap();
const route = useRoute();
const clientId = computed(() => route.params.clientId as string);

const clientsStore = useClientsStore();
const { selectedClient: client } = storeToRefs(clientsStore);
const archived = computed(() => !!client.value?.deletedAt);
const mapLink = computed(() => {
  if (!client.value) return null;
  const { street, city, zip, country } = client.value;
  return buildUrl(street, zip, city, country);
});

const editModalOpen = ref<boolean>(false);
const selectedTab = ref("about");

onBeforeUnmount(clientsStore.unloadSpecificClient);
clientsStore.loadSpecificClient(clientId.value);
</script>

<template>
  <Page
    v-if="client"
    name="crm.contacts.specific"
    class="mx-auto w-full max-w-6xl"
  >
    <main class="flex flex-col gap-12">
      <section class="flex items-start justify-between">
        <div class="flex gap-4 items-center">
          <Avatar class="size-20">
            <AvatarFallback>{{ client.name.substring(0, 2) }}</AvatarFallback>
          </Avatar>

          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-4">
              <h1 class="text-xl font-semibold">
                {{ client.name }}
              </h1>
              <Badge
                v-if="archived"
                variant="destructive"
              >
                {{ $t("labels.archived", 1) }}
              </Badge>
            </div>
            <span
              v-if="client.siret || client.siren"
              class="text-sm text-muted-foreground -mt-1"
            >N° {{ client.siret ?? client.siren }}</span>
          </div>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                size="icon"
                variant="outline"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuGroup v-if="archived">
                <DropdownMenuItem @click="clientsStore.restoreClient(client.id)">
                  <ArchiveRestore />
                  {{ $t("btn.restore") }}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuGroup v-else>
                <DropdownMenuItem @click="editModalOpen = true">
                  <Edit />
                  {{ $t("btn.edit-sheet") }}
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  @click="clientsStore.archiveClient(client.id)"
                >
                  <Archive />
                  {{ $t("btn.archive") }}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <ClientDialog
            v-model:open="editModalOpen"
            :client="client"
          />
        </div>
      </section>

      <section>
        <Tabs v-model="selectedTab">
          <TabsList>
            <TabsTrigger value="about">
              {{ $t("crm.labels.tabs.about") }}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <section class="pt-2 grid sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div
                  v-if="mapLink"
                  class="flex flex-col items-start"
                >
                  <p class="text-sm font-medium text-muted-foreground">
                    {{ $t("labels.fields.address") }}
                  </p>
                  <Button
                    variant="ghost"
                    class="h-auto !items-start !whitespace-normal"
                    as-child
                  >
                    <NuxtLink
                      :to="mapLink"
                      target="_blank"
                    >
                      <Globe class="mt-1" />
                      <span>
                        {{ buildString(client.street, client.zip, client.city, client.country) }}
                      </span>
                    </NuxtLink>
                  </Button>
                </div>
                <div
                  v-if="client.email"
                  class="flex flex-col items-start"
                >
                  <p class="text-sm font-medium text-muted-foreground">
                    {{ $t("labels.fields.email") }}
                  </p>
                  <Button
                    variant="ghost"
                    as-child
                  >
                    <NuxtLink :to="`mailto:${client.email}?subject=Contact from ${user?.firstname} ${user?.lastname}&body=Hi ${client.firstname},`">
                      <Mail />
                      {{ client.email }}
                    </NuxtLink>
                  </Button>
                </div>
                <div
                  v-if="client.phone"
                  class="flex flex-col items-start"
                >
                  <p class="text-sm font-medium text-muted-foreground">
                    {{ $t("labels.fields.phone") }}
                  </p>
                  <Button
                    variant="ghost"
                    as-child
                  >
                    <NuxtLink :to="`tel:${client.phone}`">
                      <Phone />
                      {{ client.phone }}
                    </NuxtLink>
                  </Button>
                </div>
              </div>

              <div
                v-if="client.notes"
                class="sm:col-span-2"
              >
                <p class="text-sm text-muted-foreground font-medium">
                  {{ $t("labels.fields.notes") }}
                </p>
                <p class="leading-relaxed whitespace-pre-line">
                  {{ client.notes }}
                </p>
              </div>

              <Separator class="sm:col-span-2" />

              <div>
                <p class="text-sm text-muted-foreground font-medium">
                  {{ $t("labels.table.headers.created-at") }}
                </p>
                <p>{{ $t("labels.dates.with-time", { date: parseShortDate(client.createdAt, locale), time: parseShortTime(client.createdAt, locale) }) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground font-medium">
                  {{ $t("labels.table.headers.updated-at") }}
                </p>
                <p>{{ $t("labels.dates.with-time", { date: parseShortDate(client.updatedAt, locale), time: parseShortTime(client.updatedAt, locale) }) }}</p>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  </Page>
</template>
