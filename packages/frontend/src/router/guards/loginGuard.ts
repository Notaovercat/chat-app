import { useAuthStore } from "@/stores/auth";
import type { NavigationGuard } from "vue-router";

export const loginGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLogin();

  if (!isLoggedIn) {
    next();
  } else {
    next({ name: "home" });
  }
};
