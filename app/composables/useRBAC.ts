import type { ERole } from "#shared/types/user";

export const useRBAC = () => {
  const hasRole = (roles: ERole[]) => roles.some(r => storeToRefs(useUserStore()).user.value?.roles.includes(r));

  return {
    hasRole,
  };
};
