import { type ContactsState, defaultStoreList, defaultStoreLoading } from "#shared/types/store-states";

export const useContactsStore = defineStore("contacts", {
  state: (): ContactsState => ({
    contacts: { ...defaultStoreList<IContact>() },
    archived: { ...defaultStoreList<IContact>() },
    selectedContact: null,
    loading: { ...defaultStoreLoading() },
  }),
  getters: {
    hasMoreContacts: state => state.contacts.list.length < state.contacts.total,
    hasMoreArchives: state => state.archived.list.length < state.archived.total,
    activeContacts: state => state.contacts.list,
    archivedContacts: state => state.archived.list,
  },
  actions: {
    async loadContacts() {
      if (this.contacts.total !== -1 && !this.hasMoreContacts) return;

      this.loading.fetchingList = true;

      try {
        const { data } = await useFetch<IListResponse<IContact>>("/api/contacts", {
          params: {
            offset: this.activeContacts.length,
          },
        });
        if (!data.value) return;

        this.contacts.total = data.value.total;
        this.contacts.list = [...this.contacts.list, ...data.value.data];
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.fetchingList = false;
      }
    },
    async loadArchives() {
      if (this.archived.total !== -1 && !this.hasMoreArchives) return;

      this.loading.fetchingArchives = true;

      try {
        const { data } = await useFetch<IListResponse<IContact>>("/api/contacts", {
          params: {
            offset: this.archivedContacts.length,
            archived: true,
          },
        });
        if (!data.value) return;

        this.archived.total = data.value.total;
        this.archived.list = [...this.archived.list, ...data.value.data];
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.fetchingArchives = false;
      }
    },
    async loadSpecificContact(contactId: string) {
      this.loading.fetchingItem = true;

      try {
        const { data } = await useFetch<IContact>(`/api/contacts/${contactId}`);
        if (!data.value) return;

        this.selectedContact = data.value;
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.fetchingItem = false;
      }
    },
    async unloadSpecificContact() {
      this.selectedContact = null;
    },

    async createContact(body: IContactCreate): Promise<boolean> {
      this.loading.creatingItem = true;
      let state = true;

      try {
        const contact = await $fetch<IContact>("/api/contacts", {
          method: "POST",
          body,
        });

        this.contacts.list = [contact, ...this.contacts.list];
        this.contacts.total++;
      }
      catch (e) {
        console.error(e);
        state = false;
      }
      finally {
        this.loading.creatingItem = false;
      }
      return state;
    },
    async saveContactInfo(contactId: string, body: IContactUpdate): Promise<boolean> {
      this.loading.updatingItem = true;
      let state = true;

      try {
        const contact = await $fetch<IContact>(`/api/contacts/${contactId}`, {
          method: "PUT",
          body,
        });

        this.contacts.list = this.contacts.list.map(c => c.id === contactId ? { ...contact } : c);
      }
      catch (e) {
        console.error(e);
        state = false;
      }
      finally {
        this.loading.updatingItem = false;
      }
      return state;
    },
    async archiveContact(contactId: string) {
      try {
        const contact = await $fetch<IContact>(`/api/contacts/${contactId}/archive`, {
          method: "DELETE",
        });
        if (!contact) return;

        this.contacts.list = this.contacts.list.filter(c => c.id !== contactId);
        this.contacts.total--;

        if (this.archived.total === -1) return;
        this.archived.list = [
          contact,
          ...this.archived.list,
        ].sort((a, b) => new Date(b.deletedAt as Date).getTime() - new Date(a.deletedAt as Date).getTime());
        this.archived.total++;
      }
      catch (e) {
        console.error(e);
      }
    },
    async restoreContact(contactId: string) {
      try {
        const contact = await $fetch<IContact>(`/api/contacts/${contactId}/restore`, {
          method: "PATCH",
        });
        if (!contact) return;

        this.archived.list = this.archived.list.filter(c => c.id !== contactId);
        this.archived.total--;

        if (this.contacts.total === -1) return;
        this.contacts.list = [
          contact,
          ...this.contacts.list,
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.contacts.total++;
      }
      catch (e) {
        console.error(e);
      }
    },
  },
});
