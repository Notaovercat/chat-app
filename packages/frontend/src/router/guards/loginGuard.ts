import { useAuthStore } from "@/stores/auth";
import type { NavigationGuard } from "vue-router";

export const loginGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  !authStore.isLogin() ? next() : next({ name: "home" });
};
