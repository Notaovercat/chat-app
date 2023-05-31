import { useAuthStore } from "@/stores/auth";
import type { NavigationGuard } from "vue-router";

export const jwtGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();

  const isLoggedIn = authStore.isLogin();

  if (!isLoggedIn) next({ name: "login" });

  const isTokenExpired = authStore.isTokenExpired();

  if (isTokenExpired) next({ name: "login" });

  next();
};
