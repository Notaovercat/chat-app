<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import { useServerStore } from "@/stores/servers";
import type { Profile } from "@/types/user.type";
import ServerCard from "@/components/ServerCard.vue";
import type { Server } from "@/types/server.type";

interface ProfileProps {
  userId: string;
  isUser: boolean;
}

const props = defineProps<ProfileProps>();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const serverStore = useServerStore();

const userId = props.userId;
const isUser = props.isUser;

const user: Profile = await profileStore.getUser(userId);
// const servers: Server[] = await serverStore.getJoinedServers()
</script>

<template>
  <div
    class="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
  >
    <div class="w-11/12 rounded-md bg-white md:w-[700px]">
      <!-- CLOSE TAG -->
      <div class="flex justify-end">
        <div
          class="flex cursor-pointer select-text rounded-es-md bg-rose-600 px-1 text-xs transition-all duration-200 hover:bg-red-500"
          @click="profileStore.showProfile = false"
        >
          <span>✕</span>
        </div>
      </div>

      <!-- PROFILE INFO -->
      <div class="mx-4 mt-2 rounded-xl bg-slate-300 px-4 py-4">
        <div class="flex items-center">
          <div class="h-[80px] w-[80px] rounded-xl bg-black"></div>
          <div class="ml-3 flex flex-col">
            <span class="text-3xl">{{ user.username }}</span>
            <span class="text-2xl">{{ user.email }}</span>
          </div>
        </div>
      </div>

      <!-- SERVERS -->
      <div
        class="mx-4 mt-2 h-[200px] overflow-auto rounded-xl bg-slate-300 px-4 py-2"
      >
        <p class="select-none text-3xl font-bold text-slate-400">
          User has not provided info
        </p>
      </div>

      <!-- LOGOUT -->
      <div class="m-2 flex items-end justify-end">
        <button
          class="h-[30px] rounded-xl bg-red-600 p-1 shadow-lg transition-all duration-200 hover:bg-red-500"
          @click="authStore.handleLogOut"
          v-if="isUser"
          :disabled="authStore.loadingState"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</template>
