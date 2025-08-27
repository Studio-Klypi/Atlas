<script lang="ts" setup>
import UserContextMenu from "~/components/shared/user/context/UserContextMenu.vue";
</script>

<template>
  <div>
    <!-- temp buttons
    todo: remove -->
    <UserContextMenu>
      <Button>US</Button>
    </UserContextMenu>

    <NuxtPage />
  </div>
</template>
