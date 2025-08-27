<script setup lang="ts">
import { Check, Copy } from "lucide-vue-next";
import { cn } from "~/lib/utils";
import type { HTMLAttributes } from "vue";
import { useClipboard } from "@vueuse/core";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  value: string;
}>();

const { copy, copied } = useClipboard();
</script>

<template>
  <Button
    :class="cn('', props.class)"
    size="sm-icon"
    variant="outline"
    @click="copy(value)"
  >
    <Check v-if="copied" />
    <Copy v-else />
  </Button>
</template>
