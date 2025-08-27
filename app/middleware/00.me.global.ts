export default defineNuxtRouteMiddleware(async () => {
  const token = useCookie("auth-token");
  const userId = useCookie("auth-user-id");

  if (!token.value || !userId.value) return;

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);

  if (user.value) return;
  await userStore.fetchMe();
});
