import {
  createRouter,
  createWebHistory,
  type NavigationGuard,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import HomeView from "@/views/HomeView.vue";
import AuthView from "@/views/AuthView.vue";
import ServerView from "@/views/ServerView.vue";

const jwtGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  if (authStore.isLogin()) {
    next();
  } else {
    next({ name: "login" });
  }
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      beforeEnter: jwtGuard,
    },
    {
      path: "/server/:id",
      name: "server",
      component: ServerView,
      beforeEnter: jwtGuard,
    },
    {
      path: "/login",
      name: "login",
      component: AuthView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore();
        if (!authStore.isLogin()) {
          next();
        } else {
          next({ name: "home" });
        }
      },
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
