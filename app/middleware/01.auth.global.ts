const publicPaths: string[] = [
];
const strictPublicPaths: string[] = [
  "/login",
];

export default defineNuxtRouteMiddleware((to) => {
  const { user } = storeToRefs(useUserStore());

  if (publicPaths.some(p => to.path.includes(p)))
    return;
  if (strictPublicPaths.some(p => to.path.includes(p)) && user.value)
    return navigateTo(useLocalePath()("/"));
  if (publicPaths.every(p => !to.path.includes(p)) && strictPublicPaths.every(p => !to.path.includes(p)) && !user.value)
    return navigateTo(useLocalePath()("/login"));
});
