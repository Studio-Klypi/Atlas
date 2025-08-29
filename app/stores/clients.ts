import type { IListResponse } from "#shared/types/primitives";

interface ClientsState {
  clients: IClient[];
  list: {
    page: number;
    archived: boolean;
    total: number;
  };
  selectedClient: IClient | null;
  loading: {
    fetchingClients: boolean;
    fetchingClient: boolean;
    creatingClient: boolean;
    updatingClient: boolean;
  };
}

export const useClientsStore = defineStore("clients", {
  state: (): ClientsState => ({
    clients: [],
    list: {
      page: 0,
      archived: false,
      total: 30,
    },
    selectedClient: null,
    loading: {
      fetchingClients: false,
      fetchingClient: false,
      creatingClient: false,
      updatingClient: false,
    },
  }),
  getters: {
    hasMore: state => state.clients.length < state.list.total,
  },
  actions: {
    async loadClients(page?: number, archived?: boolean) {
      if (!this.hasMore) return;
      if (this.list.page === page) return;

      this.loading.fetchingClients = true;

      try {
        const { data } = await useFetch<IListResponse<IClient>>("/api/clients", {
          params: {
            page,
            archived,
          },
        });
        if (!data.value) return;
        this.list.total = data.value.total;
        this.clients = [...this.clients, ...data.value.data];

        this.list.page = page ?? 1;
        this.list.archived = archived ?? false;
      }
      catch (e) {
        console.error(e);
      }
      finally {
        this.loading.fetchingClients = false;
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

        this.clients = [
          client,
          ...this.clients,
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

        this.clients = this.clients.map(c => c.id === clientId ? { ...client } : c);
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
  },
});
