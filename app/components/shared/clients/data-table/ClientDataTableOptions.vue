<script setup lang="ts">
import { Archive, ArchiveRestore, Check, Copy, Download, Edit, Eye, MoreHorizontal } from "lucide-vue-next";
import { useClipboard } from "@vueuse/core";
import ClientDialog from "~/components/shared/clients/dialogs/ClientDialog.vue";
import ConfirmDialog from "~/components/shared/dialogs/ConfirmDialog.vue";

const props = defineProps<{
  client: IClient;
}>();

const { copy, copied } = useClipboard();
const clientsStore = useClientsStore();

const editOpen = ref<boolean>(false);
const archiveConfirmOpen = ref<boolean>(false);
const isArchived = computed(() => !!props.client.deletedAt);
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
              <NuxtLinkLocale :to="`/clients/${client.id}`">
                <Eye />
                {{ $t("crm.clients.table.actions.access") }}
              </NuxtLinkLocale>
            </DropdownMenuItem>
            <DropdownMenuItem @click="editOpen = true">
              <Edit />
              {{ $t("crm.clients.table.actions.edit") }}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <Download />
              {{ $t("crm.clients.table.actions.download") }}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
        </template>
        <DropdownMenuGroup>
          <DropdownMenuItem
            v-if="isArchived"
            @click="clientsStore.restoreClient(client.id)"
          >
            <ArchiveRestore />
            {{ $t("crm.clients.table.actions.restore") }}
          </DropdownMenuItem>
          <DropdownMenuItem
            v-else
            variant="destructive"
            @click="archiveConfirmOpen = true"
          >
            <Archive />
            {{ $t("crm.clients.table.actions.archive") }}
          </DropdownMenuItem>
          <DropdownMenuItem @click="copy(client.id)">
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

    <ClientDialog
      v-model:open="editOpen"
      :client="client"
    />
    <ConfirmDialog
      v-model:open="archiveConfirmOpen"
      caption-key="crm.clients.dialogs.archive-confirm.caption"
      cancel-key="crm.clients.dialogs.archive-confirm.cancel"
      confirm-key="crm.clients.dialogs.archive-confirm.confirm"
      @confirm="clientsStore.archiveClient(client.id)"
    />
  </div>
</template>
