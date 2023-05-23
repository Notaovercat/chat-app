import { useAuthStore } from "@/stores/auth";
import type { NavigationGuard } from "vue-router";

export const jwtGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  const isLoggedIn = authStore.isLogin();
  isLoggedIn ? next() : next({ name: "login" });
};
