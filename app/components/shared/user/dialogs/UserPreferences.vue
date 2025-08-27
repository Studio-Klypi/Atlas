<script setup lang="ts">
import { Edit, Save } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import ClickToCopy from "~/components/shared/buttons/ClickToCopy.vue";

const { locale: loc, locales } = useI18n();
const locale = ref<"fr">(loc.value);
watch(locale, value => navigateTo(useSwitchLocalePath()(value)));

const props = defineProps<{
  user: IUser;
}>();
watch(props.user, val => form.resetForm({
  values: {
    firstname: val.firstname,
    lastname: val.lastname,
    email: val.email,
  },
}));

const open = defineModel<boolean>("open", { default: false });
watch(open, (val) => {
  if (!val) return;
  form.resetForm({
    values: {
      firstname: props.user.firstname,
      lastname: props.user.lastname,
      email: props.user.email,
    },
  });
});

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    firstname: z.string().min(1).transform(s => s.trim()),
    lastname: z.string().min(1).transform(s => s.trim()),
    email: z.email(),
  })),
  initialValues: {
    firstname: props.user.firstname,
    lastname: props.user.lastname,
    email: props.user.email,
  },
});
const handleSubmit = form.handleSubmit(async (values) => {
  console.table(values);
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="sm:max-h-[80dvh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ $t("dialogs.preferences.title") }}</DialogTitle>
        <DialogDescription>{{ $t("dialogs.preferences.caption") }}</DialogDescription>
      </DialogHeader>

      <Separator />

      <section class="flex flex-col gap-4">
        <header>
          <p class="font-bold">
            {{ $t("dialogs.preferences.sections.profile.label") }}
          </p>
        </header>

        <main>
          <form
            class="w-full flex flex-col gap-4"
            @submit="handleSubmit"
          >
            <div class="flex items-center gap-4">
              <div class="grid gap-4 flex-1">
                <FormField
                  v-slot="{ componentField }"
                  name="firstname"
                >
                  <FormItem>
                    <FormLabel>{{ $t("labels.fields.firstname") }}</FormLabel>
                    <FormControl v-bind="componentField">
                      <Input placeholder="ex. John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField
                  v-slot="{ componentField }"
                  name="lastname"
                >
                  <FormItem>
                    <FormLabel>{{ $t("labels.fields.lastname") }}</FormLabel>
                    <FormControl v-bind="componentField">
                      <Input placeholder="ex.DOE" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>
              <div class="relative shrink-0">
                <Avatar class="size-28">
                  <AvatarFallback>{{ user.firstname[0] }}{{ user.lastname[0] }}</AvatarFallback>
                </Avatar>
                <Button
                  size="sm-icon"
                  variant="outline"
                  class="absolute bottom-0 right-0"
                  disabled
                >
                  <Edit />
                </Button>
              </div>
            </div>

            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <FormItem>
                <FormLabel>{{ $t("labels.fields.email") }}</FormLabel>
                <div class="relative w-full">
                  <FormControl v-bind="componentField">
                    <Input
                      type="email"
                      placeholder="ex. john.doe@example.xyz"
                      disabled
                    />
                  </FormControl>
                  <ClickToCopy
                    :value="user.email"
                    class="absolute top-0.5 right-0.5"
                  />
                </div>
                <FormMessage />
              </FormItem>
            </FormField>

            <div class="flex items-center gap-2 justify-end">
              <Button type="submit">
                <Save />
                {{ $t("btn.save") }}
              </Button>
            </div>
          </form>
        </main>
      </section>

      <Separator />

      <section class="flex flex-col gap-4">
        <header>
          <p class="font-bold">
            {{ $t("dialogs.preferences.sections.interface.label") }}
          </p>
        </header>

        <main class="grid gap-4">
          <div class="space-y-2">
            <Label>{{ $t("labels.fields.theme") }}</Label>
            <Select v-model="$colorMode.preference">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="light">
                  {{ $t("labels.themes.light") }}
                </SelectItem>
                <SelectItem value="dark">
                  {{ $t("labels.themes.dark") }}
                </SelectItem>
                <SelectItem value="system">
                  {{ $t("labels.themes.system") }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="space-y-2">
            <Label>{{ $t("labels.fields.language") }}</Label>
            <Select v-model="locale">
              <SelectTrigger class="w-full">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem
                  v-for="l in locales"
                  :key="l.code"
                  :value="l.code"
                >
                  {{ l.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </main>
      </section>
    </DialogContent>
  </Dialog>
</template>
