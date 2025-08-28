<script setup lang="ts">
import { Archive, Check, Copy, Download, Eye, MoreHorizontal } from "lucide-vue-next";
import { useClipboard } from "@vueuse/core";

defineProps<{
  client: IClient;
}>();

const { copy, copied } = useClipboard();
</script>

<template>
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
</template>
