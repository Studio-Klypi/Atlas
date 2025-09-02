import type { IClient } from "#shared/types/client";
import type { IContact } from "#shared/types/contact";

interface StoreSharedList<T> {
  list: T[];
  total: number;
}
export const defaultStoreList = <T>(): StoreSharedList<T> => ({
  list: [],
  total: -1,
});

interface StoreSharedLoading {
  fetchingList: boolean;
  fetchingArchives: boolean;
  fetchingItem: boolean;
  creatingItem: boolean;
  updatingItem: boolean;
}
export const defaultStoreLoading = (): StoreSharedLoading => ({
  fetchingList: false,
  fetchingArchives: false,
  fetchingItem: false,
  creatingItem: false,
  updatingItem: false,
});

export interface ClientsState {
  clients: StoreSharedList<IClient>;
  archived: StoreSharedList<IClient>;
  selectedClient: IClient | null;
  // TODO: replace loading type by StoreSharedLoading
  loading: {
    fetchingClients: boolean;
    fetchingArchives: boolean;
    fetchingClient: boolean;
    creatingClient: boolean;
    updatingClient: boolean;
  };
}

export interface ContactsState {
  contacts: StoreSharedList<IContact>;
  archived: StoreSharedList<IContact>;
  selectedContact: IContact | null;
  loading: StoreSharedLoading;
}
