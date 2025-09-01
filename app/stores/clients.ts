import type { IListResponse } from "#shared/types/primitives";

interface ClientsState {
  clients: {
    list: IClient[];
    total: number;
  };
  archived: {
    list: IClient[];
    total: number;
  };
  selectedClient: IClient | null;
  loading: {
    fetchingClients: boolean;
    fetchingArchives: boolean;
    fetchingClient: boolean;
    creatingClient: boolean;
    updatingClient: boolean;
  };
}

export const useClientsStore = defineStore("clients", {
  state: (): ClientsState => ({
    clients: {
      list: [],
      total: -1,
    },
    archived: {
      list: [],
      total: -1,
    },
    selectedClient: null,
    loading: {
      fetchingClients: false,
      fetchingArchives: false,
      fetchingClient: false,
      creatingClient: false,
      updatingClient: false,
    },
  }),
  getters: {
    hasMoreClients: state => state.clients.list.length < state.clients.total,
    hasMoreArchives: state => state.archived.list.length < state.archived.total,
    activeClients: state => state.clients.list,
    archivedClients: state => state.archived.list,
  },
  actions: {
    async loadClients() {
      if (this.clients.total !== -1 && !this.hasMoreClients) return;

      this.loading.fetchingClients = true;

      try {
        const { data } = await useFetch<IListResponse<IClient>>("/api/clients", {
          params: {
            offset: this.clients.list.length,
          },
        });
        if (!data.value) return;

        this.clients.total = data.value.total;
        this.clients.list = [...this.clients.list, ...data.value.data];
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.fetchingClients = false;
      }
    },
    async loadArchives() {
      if (this.archived.total !== -1 && !this.hasMoreArchives) return;

      this.loading.fetchingArchives = true;

      try {
        const { data } = await useFetch<IListResponse<IClient>>("/api/clients", {
          params: {
            offset: this.archived.list.length,
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

    async createClient(payload: IClientCreate): Promise<boolean> {
      this.loading.creatingClient = true;
      let state = true;

      try {
        const client = await $fetch<IClient>("/api/clients", {
          method: "POST",
          body: payload,
        });

        this.clients.list = [
          client,
          ...this.clients.list,
        ];
      }
      catch (e) {
        console.error(e);
        state = false;
      }
      finally {
        this.loading.creatingClient = false;
      }

      return state;
    },
    async saveClientInfo(clientId: string, payload: IClientUpdate): Promise<boolean> {
      this.loading.updatingClient = true;
      let state = true;

      try {
        const client = await $fetch<IClient>(`/api/clients/${clientId}`, {
          method: "PUT",
          body: payload,
        });

        this.clients.list = this.clients.list.map(c => c.id === clientId ? { ...client } : c);
      }
      catch (e) {
        state = false;
        console.error(e);
      }
      finally {
        this.loading.updatingClient = false;
      }

      return state;
    },
    async archiveClient(clientId: string) {
      try {
        const client = await $fetch<IClient>(`/api/clients/${clientId}/archive`, {
          method: "DELETE",
        });
        if (!client) return;

        this.clients.list = this.clients.list.filter(c => c.id !== clientId);
        this.clients.total--;

        if (this.archived.total === -1) return;
        this.archived.list = [
          client,
          ...this.archived.list,
        ];
        this.archived.total++;
      }
      catch (e) {
        console.error(e);
      }
    },
  },
});
