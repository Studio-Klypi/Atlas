<script setup lang="ts">
import { LogOut, Settings2, User } from "lucide-vue-next";
import UserContextHeader from "~/components/shared/user/context/UserContextHeader.vue";

defineProps<{
  side?: "top" | "left" | "right" | "bottom";
  align?: "start" | "center" | "end";
}>();

const userStore = useUserStore();
const { dialogs } = storeToRefs(userStore);
</script>

<template>
  <div class="flex">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <slot />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        :side="side"
        :align="align"
      >
        <UserContextHeader />

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem @click="dialogs.profile = true">
            <User />
            {{ $t("btn.profile") }}
          </DropdownMenuItem>
          <DropdownMenuItem @click="dialogs.preferences = true">
            <Settings2 />
            {{ $t("btn.preferences") }}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            @click="userStore.logout()"
          >
            <LogOut />
            {{ $t("btn.log-out") }}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
