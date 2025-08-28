<script lang="ts" setup>
import Layout from "~/components/shared/primitives/layout/Layout.vue";
import GlobalSidebar from "~/components/shared/navigation/GlobalSidebar.vue";

const { t } = useI18n();

const pageName = computed(() => t(`${useRoute().meta.displayName}.title`));
</script>

<template>
  <Layout>
    <SidebarProvider>
      <GlobalSidebar />

      <SidebarInset>
        <main class="flex-1">
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
        </main>
      </SidebarInset>
    </SidebarProvider>
  </Layout>
</template>
