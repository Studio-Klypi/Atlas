<script setup lang="ts">
import Page from "~/components/shared/primitives/layout/Page.vue";
import { Archive, ArchiveRestore, Edit, Mail, MoreHorizontal, Phone } from "lucide-vue-next";
import ContactDialog from "~/components/shared/contacts/dialogs/ContactDialog.vue";
import { parseShortDate, parseShortTime } from "#shared/helpers/date";

const { locale } = useI18n();

definePageMeta({
  displayName: "crm.contact-details",
});

const route = useRoute();
const contactId = computed(() => route.params.contactId as string);

const { user } = storeToRefs(useUserStore());
const contactsStore = useContactsStore();
const { selectedContact: contact } = storeToRefs(contactsStore);

const archived = computed(() => !!contact.value?.deletedAt);
const selectedTab = ref("about");
const editModalOpen = ref<boolean>(false);

onBeforeUnmount(contactsStore.unloadSpecificContact);
contactsStore.loadSpecificContact(contactId.value);
</script>

<template>
  <Page
    v-if="contact"
    name="crm.clients.specific"
    class="mx-auto w-full max-w-6xl"
  >
    <main class="flex flex-col gap-12">
      <section class="flex items-start justify-between">
        <div class="flex gap-4 items-center">
          <Avatar class="size-20">
            <AvatarFallback>{{ contact.firstname[0] }}{{ contact.lastname[0] }}</AvatarFallback>
          </Avatar>

          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-4">
              <h1 class="text-xl font-semibold">
                {{ contact.firstname }} {{ contact.lastname }}
              </h1>
              <Badge
                v-if="archived"
                variant="destructive"
              >
                {{ $t("labels.archived", 1) }}
              </Badge>
            </div>
            <span class="text-sm text-muted-foreground -mt-1">{{ contact?.email }}</span>
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
                <DropdownMenuItem @click="contactsStore.restoreContact(contact.id)">
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
                  @click="contactsStore.archiveContact(contact.id)"
                >
                  <Archive />
                  {{ $t("btn.archive") }}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <ContactDialog
            v-model:open="editModalOpen"
            :contact="contact"
          />
        </div>
      </section>

      <section>
        <Tabs v-model="selectedTab">
          <TabsList>
            <TabsTrigger value="about">
              À propos
            </TabsTrigger>
            <!-- <TabsTrigger value="quotes">
              Devis
            </TabsTrigger>
            <TabsTrigger value="billings">
              Factures
            </TabsTrigger> -->
          </TabsList>

          <TabsContent value="about">
            <section class="grid sm:grid-cols-2 gap-4">
              <div class="sm:col-span-2 flex items-center gap-2 flex-wrap">
                <Button
                  v-if="contact.email"
                  variant="ghost"
                  as-child
                >
                  <NuxtLink :to="`mailto:${contact.email}?subject=Contact from ${user?.firstname} ${user?.lastname}&body=Hi ${contact.firstname},`">
                    <Mail />
                    {{ contact.email }}
                  </NuxtLink>
                </Button>
                <Button
                  v-if="contact.phone"
                  variant="ghost"
                  as-child
                >
                  <NuxtLink :to="`tel:${contact.phone}`">
                    <Phone />
                    {{ contact.phone }}
                  </NuxtLink>
                </Button>
              </div>

              <div
                v-if="contact.notes"
                class="sm:col-span-2"
              >
                <p class="text-sm text-muted-foreground font-medium">
                  {{ $t("labels.fields.notes") }}
                </p>
                <p class="leading-relaxed whitespace-pre-line">
                  {{ contact.notes }}
                </p>
              </div>

              <Separator class="sm:col-span-2" />

              <div>
                <p class="text-sm text-muted-foreground font-medium">
                  {{ $t("labels.table.headers.created-at") }}
                </p>
                <p>{{ $t("labels.dates.with-time", { date: parseShortDate(contact.createdAt, locale), time: parseShortTime(contact.createdAt, locale) }) }}</p>
              </div>
              <div>
                <p class="text-sm text-muted-foreground font-medium">
                  {{ $t("labels.table.headers.updated-at") }}
                </p>
                <p>{{ $t("labels.dates.with-time", { date: parseShortDate(contact.updatedAt, locale), time: parseShortTime(contact.updatedAt, locale) }) }}</p>
              </div>
            </section>
          </TabsContent>
          <!-- <TabsContent value="quotes">
            Quotes table
          </TabsContent>
          <TabsContent value="billings">
            Billings table
          </TabsContent> -->
        </Tabs>
      </section>
    </main>
  </Page>
</template>
