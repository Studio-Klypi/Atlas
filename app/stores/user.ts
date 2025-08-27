import type { TNull } from "#shared/types/primitives";
import type { IUser } from "#shared/types/user";

interface UserState {
  user: TNull<IUser>;
  loading: {
    loggingIn: boolean;
    updatingProfile: boolean;
  };
  dialogs: {
    profile: boolean;
    preferences: boolean;
  };
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    user: null,
    loading: {
      loggingIn: false,
      updatingProfile: false,
    },
    dialogs: {
      profile: false,
      preferences: false,
    },
  }),
  getters: {
    isLoggedIn: state => !!state.user,
  },
  actions: {
    async fetchMe() {
      try {
        const { data } = await useFetch<IUser>("/api/auth/me");
        if (!data.value) return;
        this.user = data.value;
      }
      catch (e) {
        console.error(e);
      }
    },
    async login(email: string, password: string): Promise<boolean> {
      this.loading.loggingIn = true;
      let state = true;

      try {
        this.user = await $fetch<IUser>("/api/auth/login", {
          method: "POST",
          body: {
            email,
            password,
          },
        });
      }
      catch (e) {
        console.error(e);
        state = false;
      }
      finally {
        this.loading.loggingIn = false;
      }

      return state;
    },
    async logout() {
      try {
        await $fetch("/api/auth/logout", {
          method: "POST",
        });
        this.$reset();
        navigateTo(useLocalePath()("/login"));
      }
      catch (e) {
        console.error(e);
      }
    },
    async revokeAllSessions() {
      try {
        await $fetch("/api/auth/logout-everywhere", {
          method: "POST",
        });
        this.$reset();
        navigateTo(useLocalePath()("/login"));
      }
      catch (e) {
        console.error(e);
      }
    },
    async updateProfile(payload: IUserUpdate) {
      this.loading.updatingProfile = true;
      let state = true;

      try {
        this.user = await $fetch<IUser>("/api/users/me", {
          method: "PUT",
          body: payload,
        });
      }
      catch (e) {
        console.error(e);
        state = false;
      }
      finally {
        this.loading.updatingProfile = false;
      }

      return state;
    },
  },
});
