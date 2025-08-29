<script setup lang="ts">
import { Archive, Check, Copy, Download, Edit, Eye, MoreHorizontal } from "lucide-vue-next";
import { useClipboard } from "@vueuse/core";
import ClientDialog from "~/components/shared/clients/dialogs/ClientDialog.vue";

defineProps<{
  client: IClient;
}>();

const { copy, copied } = useClipboard();

const editOpen = ref<boolean>(false);
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
        <DropdownMenuGroup>
          <DropdownMenuItem as-child>
            <NuxtLinkLocale :to="`/crm/clients/${client.id}`">
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
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <Archive />
            {{ $t("btn.archive") }}
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
  </div>
</template>
