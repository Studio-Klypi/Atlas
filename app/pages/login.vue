<script setup lang="ts">
import Page from "~/components/shared/primitives/layout/Page.vue";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";

const { t } = useI18n();

definePageMeta({
  layout: "empty-center",
  auth: false,
});

const userStore = useUserStore();

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    email: z.email({ error: t("validations.valid-email") }),
    password: z.string({ error: t("validations.valid-password") }).min(12, { error: t("validations.valid-password") }),
  })),
});
const handleSubmit = form.handleSubmit(async (values) => {
  const state = await userStore.login(values.email, values.password);

  if (state) return navigateTo(useLocalePath()("/"));
});
</script>

<template>
  <Page
    name="login"
    class="w-full min-h-dvh grid grid-cols-1 md:grid-cols-2"
  >
    <section class="grid place-items-center">
      <Card class="w-[min(25rem,100%)]">
        <CardHeader>
          <CardTitle>{{ $t("login.title") }}</CardTitle>
        </CardHeader>

        <form
          class="flex flex-col gap-6"
          @submit="handleSubmit"
        >
          <CardContent class="grid auto-rows-auto gap-4">
            <FormField
              v-slot="{ componentField }"
              name="email"
            >
              <FormItem>
                <FormLabel>{{ $t("labels.fields.email") }}</FormLabel>
                <FormControl v-bind="componentField">
                  <Input
                    type="email"
                    placeholder="ex. john.doe@example.xyz"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="password"
            >
              <FormItem>
                <FormLabel>{{ $t("labels.fields.password") }}</FormLabel>
                <FormControl v-bind="componentField">
                  <Input
                    type="password"
                    placeholder="···············"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </CardContent>

          <CardFooter class="justify-end">
            <Button type="submit">
              {{ $t("btn.log-in") }}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
    <section class="relative border border-border">
      <NuxtImg
        class="absolute size-full object-cover"
        src="/images/login-splash.webp"
      />
    </section>
  </Page>
</template>
