<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

const props = withDefaults(defineProps<{
  name?: string;
  class?: HTMLAttributes["class"];
}>(), {
  name: "home",
});
</script>

<template>
  <div
    :data-page="name"
    :class="cn('flex flex-col gap-4', props.class)"
  >
    <slot />
  </div>
</template>
