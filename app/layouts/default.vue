<script lang="ts" setup>
import GlobalSidebar from "~/components/shared/navigation/GlobalSidebar.vue";

const { t } = useI18n();

const pageName = computed(() => t(`${useRoute().meta.displayName}.title`));
</script>

<template>
  <SidebarProvider data-layout="default">
    <GlobalSidebar />
    <SidebarInset class="min-w-0">
      <header class="px-4 h-16 data-[state=open]:h-12 flex items-center border-b gap-4">
        <div class="flex items-center gap-2">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            class="h-6!"
          />
          <p class="text-sm font-bold">
            {{ pageName }}
          </p>
        </div>
      </header>

      <div class="p-4">
        <NuxtPage />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
