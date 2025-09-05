<script setup lang="ts">
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { LoaderCircle, Plus, Save } from "lucide-vue-next";
import OptionalField from "~/components/shared/labels/OptionalField.vue";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps<{
  contact?: IContact;
}>();
const contact = computed(() => props.contact);
watch(contact, (val) => {
  if (!val) form.resetForm({
    values: {
      firstname: undefined,
      lastname: undefined,
      email: undefined,
      phone: undefined,
      notes: undefined,
    },
  });
  else form.resetForm({
    values: {
      firstname: contact.value?.firstname,
      lastname: contact.value?.lastname,
      email: contact.value?.email ?? undefined,
      phone: contact.value?.phone ?? undefined,
      notes: contact.value?.notes ?? undefined,
    },
  });
});
watch(open, (val) => {
  if (!val) return;
  form.resetForm();
});

const contactsStore = useContactsStore();
const editMode = computed(() => !!props.contact);
const { loading } = storeToRefs(contactsStore);

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.email().optional(),
    phone: z.string().optional(),
    notes: z.string().optional(),
  })),
  initialValues: {
    firstname: props.contact?.firstname,
    lastname: props.contact?.lastname,
    email: props.contact?.email ?? undefined,
    phone: props.contact?.phone ?? undefined,
    notes: props.contact?.notes ?? undefined,
  },
});
const handleSubmit = form.handleSubmit(async (values) => {
  const payload: IContactCreate | IContactUpdate = {
    ...values,
  };

  const status = editMode.value
    ? await contactsStore.saveContactInfo((contact.value as IContact).id, payload as IContactUpdate)
    : await contactsStore.createContact(payload as IContactCreate);
  open.value = !status;
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ editMode ? `${contact?.firstname} ${contact?.lastname}` : $t("crm.contacts.dialogs.create.title") }}</DialogTitle>
        <DialogDescription>{{ $t(editMode ? "crm.contacts.dialogs.edit.caption" : "crm.contacts.dialogs.create.caption") }}</DialogDescription>
      </DialogHeader>

      <Separator />

      <form
        class="flex flex-col gap-4"
        @submit="handleSubmit"
      >
        <section class="grid sm:grid-cols-2 gap-4">
          <FormField
            v-slot="{ componentField }"
            name="firstname"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.firstname") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Input placeholder="ex. John" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="lastname"
          >
            <FormItem>
              <FormLabel>{{ $t("labels.fields.lastname") }}</FormLabel>
              <FormControl v-bind="componentField">
                <Input placeholder="ex. DOE" />
              </FormControl>
            </FormItem>
          </FormField>
        </section>

        <FormField
          v-slot="{ componentField }"
          name="email"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.email") }} <OptionalField /></FormLabel>
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
            <FormLabel>{{ $t("labels.fields.phone") }} <OptionalField /></FormLabel>
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
          name="notes"
        >
          <FormItem>
            <FormLabel>{{ $t("labels.fields.notes") }} <OptionalField /></FormLabel>
            <FormControl v-bind="componentField">
              <Textarea />
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
          <Button
            type="submit"
            :disabled="editMode ? loading.updatingItem : loading.creatingItem"
          >
            <template v-if="editMode">
              <LoaderCircle
                v-if="loading.updatingItem"
                class="animate-spin"
              />
              <Save v-else />
              {{ $t("btn.save") }}
            </template>
            <template v-else>
              <LoaderCircle
                v-if="loading.creatingItem"
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
