<script setup lang="ts">
import { Archive, ArchiveRestore, Check, Copy, Download, Edit, Eye, MoreHorizontal } from "lucide-vue-next";
import { useClipboard } from "@vueuse/core";
import ConfirmDialog from "~/components/shared/dialogs/ConfirmDialog.vue";

const props = defineProps<{
  contact: IContact;
}>();

const { copy, copied } = useClipboard();
const contactsStore = useContactsStore();

const editOpen = ref<boolean>(false);
const archiveConfirmOpen = ref<boolean>(false);
const isArchived = computed(() => !!props.contact.deletedAt);
</script>

<template>
  <div class="flex">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <template v-if="!isArchived">
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <NuxtLinkLocale :to="`/contacts/${contact.id}`">
                <Eye />
                {{ $t("crm.contacts.table.actions.access") }}
              </NuxtLinkLocale>
            </DropdownMenuItem>
            <DropdownMenuItem @click="editOpen = true">
              <Edit />
              {{ $t("crm.contacts.table.actions.edit") }}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Download />
              {{ $t("crm.contacts.table.actions.download") }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </template>
        <DropdownMenuGroup>
          <DropdownMenuItem
            v-if="isArchived"
            @click="contactsStore.restoreContact(contact.id)"
          >
            <ArchiveRestore />
            {{ $t("crm.contacts.table.actions.restore") }}
          </DropdownMenuItem>
          <DropdownMenuItem
            v-else
            variant="destructive"
            @click="archiveConfirmOpen = true"
          >
            <Archive />
            {{ $t("crm.contacts.table.actions.archive") }}
          </DropdownMenuItem>
          <DropdownMenuItem @click="copy(contact.id)">
            <template v-if="copied">
              <Check />
              {{ $t("labels.copied", 1) }}
            </template>
            <template v-else>
              <Copy />
              {{ $t("btn.copy-id") }}
            </template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- <ClientDialog
      v-model:open="editOpen"
      :client="client"
    /> -->
    <ConfirmDialog
      v-model:open="archiveConfirmOpen"
      caption-key="crm.contacts.dialogs.archive-confirm.caption"
      cancel-key="crm.contacts.dialogs.archive-confirm.cancel"
      confirm-key="crm.contacts.dialogs.archive-confirm.confirm"
      @confirm="contactsStore.archiveContact(contact.id)"
    />
  </div>
</template>
