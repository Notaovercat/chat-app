import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AuthView from "@/views/AuthView.vue";
import ServerView from "@/views/ServerView.vue";
import Chat from "@/components/chat/Chat.vue";
import { jwtGuard } from "./guards/jwtGuard";
import { memberCheck } from "./guards/memberGuard";
import { loginGuard } from "./guards/loginGuard";
import Main from "@/components/chat/Main.vue";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      components: { default: HomeView, chat: Chat },
      beforeEnter: jwtGuard,
    },
    {
      path: "/server/:serverId",
      name: "server",
      component: ServerView,
      beforeEnter: [jwtGuard, memberCheck],
      children: [
        {
          path: "",
          name: "main",
          components: {
            chat: Main,
          },
        },
        {
          path: "chat/:chatId",
          name: "chat",
          components: {
            chat: Chat,
          },
        },
      ],
    },

    {
      path: "/login",
      name: "login",
      component: AuthView,
      beforeEnter: loginGuard,
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

export default router;
