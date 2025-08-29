import type { ColumnDef } from "@tanstack/vue-table";
import { Avatar, Button, NuxtLink } from "#components";
import { AvatarFallback } from "~/components/ui/avatar";
import { parseShortDate, parseShortTime } from "#shared/helpers/date";
import ClientDataTableOptions from "~/components/shared/clients/data-table/ClientDataTableOptions.vue";

export const columns = (): ColumnDef<IClient>[] => {
  const { t, locale } = useNuxtApp().$i18n;

  return [
    {
      id: "image",
      cell: ({ row }) => h("div", h(Avatar, [
        h(AvatarFallback, `${row.original.name.substring(0, 2)}`),
      ])),
    },
    {
      accessorKey: "name",
      header: () => h("div", t("crm.clients.table.headers.name")),
      cell: ({ row }) => h("div", row.original.name),
    },
    {
      accessorKey: "type",
      header: () => h("div", t("crm.clients.table.headers.type")),
      cell: ({ row }) => h("div", t(`labels.client-types.${row.original.type}`)),
    },
    {
      accessorKey: "legalForm",
      header: () => h("div", t("crm.clients.table.headers.legal-form")),
      cell: ({ row }) => h("div", { class: "uppercase" }, row.original.legalForm || "-"),
    },
    {
      id: "address",
      header: () => h("div", t("crm.clients.table.headers.address")),
      cell: ({ row }) => {
        const { street, zip, city, country } = row.original;
        return h("div", { class: "relative z-10" }, h(Button, { variant: "link", size: "sm", asChild: true, class: "px-0!" }, h(NuxtLink, { to: useMap().buildUrl(street, zip, city, country), target: "_blank" }, `${street}, ${zip} ${city} (${country})`)));
      },
    },
    {
      accessorKey: "registrationNumber",
      header: () => h("div", t("crm.clients.table.headers.registration-number")),
      cell: ({ row }) => h("div", row.original.registrationNumber || "-"),
    },
    {
      accessorKey: "siret",
      header: () => h("div", t("crm.clients.table.headers.siret")),
      cell: ({ row }) => h("div", row.original.siret || "-"),
    },
    {
      accessorKey: "website",
      header: () => h("div", t("crm.clients.table.headers.website")),
      cell: ({ row }) => {
        const display = row.original.website?.split("/")[2];
        return h("div", { class: "relative z-10" }, row.original.website ? h(Button, { variant: "link", size: "sm", asChild: true, class: "px-0!" }, h(NuxtLink, { to: row.original.website, target: "_blank" }, display)) : "-");
      },
    },
    {
      id: "created-by",
      header: () => h("div", t("crm.clients.table.headers.created-by")),
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
      header: () => h("div", t("crm.clients.table.headers.created-at")),
      cell: ({ row }) => h("div", t("labels.dates.with-time", {
        date: parseShortDate(row.original.createdAt, locale.value),
        time: parseShortTime(row.original.createdAt, locale.value),
      })),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return h("div", { class: "relative z-10 flex justify-end" }, h(ClientDataTableOptions, { client: row.original }));
      },
    },
  ];
};
