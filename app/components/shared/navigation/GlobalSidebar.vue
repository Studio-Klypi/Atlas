<script setup lang="ts">
import { Building, Contact, Globe, LayoutDashboard } from "lucide-vue-next";
import { useSidebar } from "~/components/ui/sidebar";
import UserContextMenu from "~/components/shared/user/context/UserContextMenu.vue";

const { state } = useSidebar();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const groups = [
  {
    key: "default",
    label: false,
    items: [
      {
        icon: LayoutDashboard,
        label: "dashboard",
        href: "/",
      },
    ],
  },
  {
    key: "crm",
    label: true,
    items: [
      {
        icon: Building,
        label: "clients",
        href: "/clients",
      },
      {
        icon: Contact,
        label: "contacts",
        href: "/contacts",
      },
    ],
  },
];
</script>

<template>
  <Sidebar collapsible="icon">
    <SidebarHeader
      :data-collapsible="state"
      class="border-b overflow-hidden h-16 px-4 data-[collapsible=collapsed]:px-2! flex items-center flex-row gap-2 transition-[width,height,padding]"
    >
      <div class="shrink-0 grid place-items-center size-8 bg-primary text-primary-foreground rounded-md">
        <Globe class="size-4" />
      </div>
      <p class="font-bold flex-1 overflow-hidden">
        atlas.
      </p>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup
        v-for="group in groups"
        :key="group.key"
      >
        <SidebarGroupLabel v-if="group.label">
          {{ $t(`navigation.${group.key}.label`) }}
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="(item, index) in group.items"
              :key="`${group.key}-${index}`"
            >
              <SidebarMenuButton
                :tooltip="$t(`navigation.${group.key}.${item.label}`)"
                as-child
              >
                <NuxtLinkLocale
                  :to="item.href"
                  active-class="bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                >
                  <component :is="item.icon" />

                  {{ $t(`navigation.${group.key}.${item.label}`) }}
                </NuxtLinkLocale>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter
      v-if="user"
      class="border-t"
    >
      <SidebarMenu>
        <SidebarMenuItem>
          <UserContextMenu
            side="right"
            align="end"
          >
            <SidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar class="rounded-md">
                <AvatarFallback>{{ user.firstname[0] }}{{ user.lastname[0] }}</AvatarFallback>
              </Avatar>

              <div class="grid auto-rows-auto">
                <span>{{ user.firstname }} {{ user.lastname }}</span>
                <span class="text-xs text-muted-foreground">{{ user.email }}</span>
              </div>
            </SidebarMenuButton>
          </UserContextMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail />
  </Sidebar>
</template>
