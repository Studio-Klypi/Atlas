<script setup lang="ts">
withDefaults(defineProps<{
  titleKey?: string;
  captionKey?: string;
  cancelKey?: string;
  confirmKey?: string;
}>(), {
  titleKey: "dialogs.defaults.confirm.title",
  captionKey: "dialogs.defaults.confirm.caption",
  cancelKey: "btn.cancel",
  confirmKey: "btn.confirm",
});
defineEmits<{
  confirm: [];
}>();

const open = defineModel<boolean>("open", { default: false });
</script>

<template>
  <AlertDialog v-model:open="open">
    <AlertDialogTrigger as-child>
      <slot />
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ $t(titleKey) }}</AlertDialogTitle>
        <AlertDialogDescription>{{ $t(captionKey) }}</AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>{{ $t(cancelKey) }}</AlertDialogCancel>
        <AlertDialogAction @click="$emit('confirm')">
          {{ $t(confirmKey) }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
