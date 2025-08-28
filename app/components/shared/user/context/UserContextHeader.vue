<script setup lang="ts">
const { user } = storeToRefs(useUserStore());
</script>

<template>
  <DropdownMenuGroup v-if="user">
    <div class="p-1 pr-3 flex items-center gap-2">
      <!-- todo: avatar -->
      <Avatar class="size-10 rounded-md">
        <AvatarFallback>{{ user.firstname[0] }}{{ user.lastname[0] }}</AvatarFallback>
      </Avatar>

      <div class="flex flex-col leading-none">
        <p>
          {{ user.firstname }} {{ user.lastname }}
        </p>
        <span class="block text-xs text-muted-foreground">{{ user.email }}</span>
      </div>
    </div>
  </DropdownMenuGroup>
</template>
