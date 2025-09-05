import type { ColumnDef } from "@tanstack/vue-table";
import { Avatar, AvatarFallback, Button, NuxtLink } from "#components";
import ContactDataTableOptions from "~/components/shared/contacts/data-table/ContactDataTableOptions.vue";
import { parseShortDate, parseShortTime } from "#shared/helpers/date";

export const columns = (): ColumnDef<IContact>[] => {
  const { t, locale } = useNuxtApp().$i18n;

  return [
    {
      id: "avatar",
      cell: ({ row }) => {
        const { firstname, lastname } = row.original;

        const fallback = h(AvatarFallback, `${firstname[0]}${lastname[0]}`);
        const avatar = h(Avatar, { class: "size-8" }, [fallback]);
        return h("div", avatar);
      },
    },
    {
      id: "name",
      header: () => h("div", t("crm.contacts.table.headers.name")),
      cell: ({ row }) => h("div", `${row.original.firstname} ${row.original.lastname}`),
    },
    {
      accessorKey: "email",
      header: () => h("div", t("crm.contacts.table.headers.email")),
      cell: ({ row }) => {
        const { email } = row.original;

        if (!email) return h("div", "-");
        return h("div", { class: "relative z-10" }, h(Button, { variant: "link", size: "sm", asChild: true, class: "px-0! z-10" }, h(NuxtLink, { to: `mailto:${email}` }, email)));
      },
    },
    {
      accessorKey: "phone",
      header: () => h("div", t("crm.contacts.table.headers.phone")),
      cell: ({ row }) => {
        const { phone } = row.original;

        if (!phone) return h("div", "-");
        return h("div", { class: "relative z-10" }, h(Button, { variant: "link", size: "sm", asChild: true, class: "px-0! z-10" }, h(NuxtLink, { to: `tel:${phone}` }, phone)));
      },
    },
    {
      id: "created-by",
      header: () => h("div", t("labels.table.headers.created-by", 1)),
      cell: ({ row }) => {
        const { creator } = row.original;
        if (!creator) return h("div", "-");

        const avatar = h(Avatar, { class: "size-6" }, [
          h(AvatarFallback, { class: "text-xs" }, `${creator.firstname[0]}${creator.lastname[0]}`),
        ]);
        const name = h("p", { class: "text-sm" }, `${creator.firstname} ${creator.lastname}`);

        return h("div", { class: "flex items-center gap-2" }, [
          avatar,
          name,
        ]);
      },
    },
    {
      accessorKey: "createdAt",
      header: () => h("div", t("labels.table.headers.created-at", 1)),
      cell: ({ row }) => h("div", t("labels.dates.with-time", {
        date: parseShortDate(row.original.createdAt, locale.value),
        time: parseShortTime(row.original.createdAt, locale.value),
      })),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return h("div", { class: "relative z-10 flex justify-end" }, h(ContactDataTableOptions, { contact: row.original }));
      },
    },
  ];
};
