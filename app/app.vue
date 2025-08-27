<script setup lang="ts">
import UserProfile from "~/components/shared/user/dialogs/UserProfile.vue";
import UserPreferences from "~/components/shared/user/dialogs/UserPreferences.vue";

const { user, dialogs } = storeToRefs(useUserStore());
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout />

    <UserProfile
      v-if="user"
      v-model:open="dialogs.profile"
      :user="user"
    />
    <UserPreferences
      v-if="user"
      v-model:open="dialogs.preferences"
      :user="user"
    />
  </div>
</template>
