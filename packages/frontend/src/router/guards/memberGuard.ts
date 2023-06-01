import { useServerStore } from "@/stores/servers";
import type { NavigationGuard } from "vue-router";

export const memberCheck: NavigationGuard = async (to, from, next) => {
  const serverStore = useServerStore();
  const userId = localStorage.getItem("userId") as string;
  const serverId = to.params["serverId"] as string;
  const checkMember = await serverStore.checkIsUserMember(serverId, userId);
  checkMember ? next() : next({ name: "home" });
};
