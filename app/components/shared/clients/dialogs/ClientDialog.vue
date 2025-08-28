<script setup lang="ts">
import { useForm } from "vee-validate";
import { z } from "zod";
import { ClientTypes } from "#shared/types/client";
import { toTypedSchema } from "@vee-validate/zod";
import { Link, LoaderCircle, Plus, Save } from "lucide-vue-next";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  client?: IClient;
}>();
const client = computed(() => props.client);
watch(client, (val) => {
  if (!val) form.resetForm({
    values: {
      type: "individual",
      name: undefined,
      legalForm: undefined,
      street: undefined,
      zip: undefined,
      city: undefined,
      country: undefined,
      registrationNumber: undefined,
      siret: undefined,
      vatNumber: undefined,
      billingCurrency: "eur",
      email: undefined,
      phone: undefined,
      website: undefined,
      notes: undefined,
    },
  });
  else form.resetForm({
    values: {
      type: val.type,
      name: val.name,
      legalForm: val.legalForm ?? undefined,
      street: val.street,
      zip: val.zip,
      city: val.city,
      country: val.country,
      registrationNumber: val.registrationNumber ?? undefined,
      siret: val.siret ?? undefined,
      vatNumber: val.vatNumber ?? undefined,
      billingCurrency: val.billingCurrency,
      email: val.email ?? undefined,
      phone: val.phone ?? undefined,
      website: val.website ?? undefined,
      notes: val.notes ?? undefined,
    },
  });
});
watch(open, (val) => {
  if (!val) return;
  form.resetForm();
});

const editMode = computed(() => !!props.client);
const clientsStore = useClientsStore();
const { loading } = storeToRefs(clientsStore);

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    type: z.string(),
    name: z.string(),
    legalForm: z.string().optional(),
    street: z.string(),
    zip: z.string(),
    city: z.string(),
    country: z.string(),
    registrationNumber: z.string().optional(),
    siret: z.string().optional(),
    vatNumber: z.string().optional(),
    billingCurrency: z.string(),
    email: z.email().optional(),
    phone: z.string().optional(),
    website: z.string().optional(),
    notes: z.string().optional(),
  })),
  initialValues: {
    type: props.client?.type ?? "individual",
    name: props.client?.name,
    legalForm: props.client?.legalForm ?? undefined,
    street: props.client?.street,
    zip: props.client?.zip,
    city: props.client?.city,
    country: props.client?.country,
    registrationNumber: props.client?.registrationNumber ?? undefined,
    siret: props.client?.siret ?? undefined,
    vatNumber: props.client?.vatNumber ?? undefined,
    billingCurrency: props.client?.billingCurrency ?? "eur",
    email: props.client?.email ?? undefined,
    phone: props.client?.phone ?? undefined,
    website: props.client?.website ?? undefined,
    notes: props.client?.notes ?? undefined,
  },
});
const handleSubmit = form.handleSubmit(async (values) => {
  const payload: IClientCreate | IClientUpdate = {
    ...values,
    type: values.type as EClientType,
    billingCurrency: values.billingCurrency as ECurrency,
    siren: values.siret ? values.siret.substring(0, 9) : undefined,
  };

  const status = editMode.value ? false : await clientsStore.createClient(payload);
  open.value = !status;
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent class="max-h-[calc(100dvh-3rem)] sm:max-h-[80dvh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{{ editMode ? client.name : $t("crm.clients.dialogs.create.title") }}</DialogTitle>
        <DialogDescription>{{ $t(editMode ? "crm.clients.dialogs.edit.caption" : "crm.clients.dialogs.create.caption") }}</DialogDescription>
      </DialogHeader>

      <Separator />

      <form
        class="flex flex-col gap-4"
        @submit="handleSubmit"
      >
        <FormField
          v-slot="{ value, handleChange }"
          name="type"
        >
          <FormItem class="sm:col-span-2">
            <FormLabel>{{ $t("crm.clients.dialogs.fields.client-type") }}</FormLabel>
            <Select
              :model-value="value"
              @update:model-value="handleChange"
            >
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem
                  v-for="type in ClientTypes"
                  :key="type"
                  :value="type"
                >
                  {{
                    $t(`labels.client-types.${type}`)
                  }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>
        <FormField
          v-slot="{ componentField }"
          name="name"
        >
          <FormItem class="sm:col-span-2">
            <FormLabel>{{ $t("labels.fields.name") }}</FormLabel>
            <FormControl v-bind="componentField">
              <Input placeholder="ex. Studio Klypi" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField
          v-if="form.values.type === 'company'"
          v-slot="{ componentField }"
          name="legalForm"
        >
          <FormItem class="sm:col-span-2">
            <FormLabel>{{ $t("crm.clients.dialogs.fields.legal-form") }} <span class="text-xs text-muted-foreground font-normal">{{ $t("labels.optional", 1) }}</span></FormLabel>
            <FormControl v-bind="componentField">
              <Input placeholder="ex. SAS" />
            </FormControl>
          </FormItem>
        </FormField>

        <Separator />

        <section class="grid sm:grid-cols-2 gap-4">
          <p class="-mb-2 sm:col-span-2 text-xs font-medium italic text-muted-foreground">
            {{ $t("crm.clients.dialogs.sections.address") }}
          </p>
          <FormField
            v-slot="{ componentField }"
            name="street"
          >
            <FormItem class="sm:col-span-2">
              <FormLabel>{{ $t("labels.fields.street") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Input placeholder="ex. 12 rue de la paix" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="city"
          >
            <FormItem class="sm:col-span-2">
              <FormLabel>{{ $t("labels.fields.city") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Input placeholder="ex. Paris" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="zip"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.zip") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Input placeholder="ex. 71000" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="country"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.country") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Input placeholder="ex. France" />
              </FormControl>
            </FormItem>
          </FormField>
        </section>

        <FormField
          v-slot="{ value, handleChange }"
          name="billingCurrency"
        >
          <FormItem class="sm:col-span-2">
            <FormLabel>{{ $t("crm.clients.dialogs.fields.billing-currency") }}</FormLabel>
            <Select
              :model-value="value"
              @update:model-value="handleChange"
            >
              <FormControl>
                <SelectTrigger class="w-full">
                  <SelectValue />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                <SelectItem
                  v-for="currency in Currencies"
                  :key="currency"
                  :value="currency"
                >
                  {{ currency.toUpperCase() }}
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </FormField>

        <template v-if="form.values.type === 'company'">
          <Separator />

          <section
            class="grid sm:grid-cols-2 gap-4"
          >
            <p class="-mb-2 sm:col-span-2 text-xs font-medium italic text-muted-foreground">
              {{ $t("crm.clients.dialogs.sections.identification") }}
            </p>
            <FormField
              v-slot="{ componentField }"
              name="registrationNumber"
            >
              <FormItem class="sm:col-span-2">
                <FormLabel>{{ $t("crm.clients.dialogs.fields.registration-number") }} <span class="text-xs text-muted-foreground font-normal">{{ $t("labels.optional", 1) }}</span></FormLabel>
                <FormControl v-bind="componentField">
                  <Input placeholder="ex. 01234567890" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="siret"
            >
              <FormItem>
                <FormLabel>{{ $t("crm.clients.dialogs.fields.siret") }} <span class="text-xs text-muted-foreground font-normal">{{ $t("labels.optional", 1) }}</span></FormLabel>
                <FormControl v-bind="componentField">
                  <Input placeholder="ex. 012345678" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField
              v-slot="{ componentField }"
              name="vatNumber"
            >
              <FormItem>
                <FormLabel>{{ $t("crm.clients.dialogs.fields.vat-number") }} <span class="text-xs text-muted-foreground font-normal">{{ $t("labels.optional", 1) }}</span></FormLabel>
                <FormControl v-bind="componentField">
                  <Input placeholder="ex. 01234567890001" />
                </FormControl>
              </FormItem>
            </FormField>
          </section>
        </template>

        <Separator />

        <section class="grid sm:grid-cols-2 gap-4">
          <p class="sm:col-span-2 text-xs font-medium italic text-muted-foreground">
            {{ $t("crm.clients.dialogs.sections.contact") }}
          </p>

          <FormField
            v-slot="{ componentField }"
            name="email"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.email") }} <span class="text-xs text-muted-foreground font-normal">{{ $t("labels.optional", 1) }}</span></FormLabel>
              <FormControl v-bind="componentField">
                <Input
                  type="email"
                  placeholder="ex. john.doe@example.xyz"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="phone"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.phone") }} <span class="text-xs text-muted-foreground font-normal">{{ $t("labels.optional", 1) }}</span></FormLabel>
              <FormControl v-bind="componentField">
                <Input
                  type="tel"
                  placeholder="ex. 01 23 45 67 89"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="website"
          >
            <FormItem class="sm:col-span-2">
              <FormLabel>{{ $t("crm.clients.dialogs.fields.website") }} <span class="text-xs text-muted-foreground font-normal">{{ $t("labels.optional", 1) }}</span></FormLabel>
              <div class="relative w-full">
                <FormControl v-bind="componentField">
                  <Input
                    type="url"
                    class="pl-8"
                    placeholder="ex. https://atlas.studio-klypi.com"
                  />
                </FormControl>
                <Link class="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
              </div>
            </FormItem>
          </FormField>
        </section>

        <Separator />

        <FormField
          v-slot="{ componentField }"
          name="notes"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.notes") }} <span class="text-xs text-muted-foreground font-normal">{{ $t("labels.optional", 1) }}</span></FormLabel>
            <FormControl v-bind="componentField">
              <Textarea :placeholder="$t('labels.placeholders.write-notes')" />
            </FormControl>
          </FormItem>
        </FormField>

        <DialogFooter>
          <DialogClose as-child>
            <Button
              type="button"
              variant="secondary"
            >
              {{ $t("btn.cancel") }}
            </Button>
          </DialogClose>
          <Button type="submit">
            <template v-if="editMode">
              <LoaderCircle
                v-if="loading.updatingClient"
                class="animate-spin"
              />
              <Save v-else />
              {{ $t("btn.save") }}
            </template>
            <template v-else>
              <LoaderCircle
                v-if="loading.creatingClient"
                class="animate-spin"
              />
              <Plus v-else />
              {{ $t("btn.create-entry") }}
            </template>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
