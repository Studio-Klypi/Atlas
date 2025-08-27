<script setup lang="ts">
import type { IUser } from "#shared/types/user";
import { parseShortDate, parseShortTime } from "#shared/helpers/date";
import { useClipboard } from "@vueuse/core";
import ClickToCopy from "~/components/shared/buttons/ClickToCopy.vue";

const { locale, locales } = useI18n();
const selectedLocale = computed(() => locales.value.find(l => l.code === locale.value));

defineProps<{
  user: IUser;
}>();

const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="flex flex-col items-center">
      <DialogTitle class="sr-only">
        {{ user.firstname }} {{ user.lastname }}
      </DialogTitle>
      <DialogDescription class="sr-only">
        {{ $t("readers.profile-dialog.caption", { name: `${user.firstname} ${user.lastname}` }) }}
      </DialogDescription>

      <Avatar class="mt-4 size-20 outline-4 outline-background">
        <AvatarFallback>{{ user.firstname[0] }}{{ user.lastname[0] }}</AvatarFallback>
      </Avatar>

      <p class="text-lg font-bold">
        {{ user.firstname }} {{ user.lastname }}
      </p>

      <div class="space-y-2 w-full px-4">
        <Label>{{ $t("labels.fields.email") }}</Label>
        <div class="relative w-full">
          <Input
            :model-value="user.email"
            type="email"
            class="w-full"
            disabled
          />
          <ClickToCopy
            :value="user.email"
            class="absolute top-0.5 right-0.5"
          />
        </div>
      </div>

      <div class="space-y-2 w-full px-4">
        <Label>{{ $t("labels.fields.roles") }}</Label>
        <div class="flex items-center gap-2 flex-wrap">
          <Badge
            v-for="role in user.roles"
            :key="role"
            variant="secondary"
          >
            {{ $t(`labels.roles.${role}`) }}
          </Badge>
        </div>
      </div>

      <p class="text-xs text-center text-muted-foreground">
        {{ $t("labels.dates.created-at-with-time", 1, {
          named: {
            date: parseShortDate(user.createdAt, selectedLocale?.code ?? "fr-FR"),
            time: parseShortTime(user.createdAt, selectedLocale?.code ?? "fr-FR"),
          },
        }) }}
      </p>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>
