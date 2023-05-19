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
  <div class="absolute bg-black bg-opacity-60">
    <div class="flex h-screen w-screen items-center justify-center">
      <div
        class="flex h-[400px] w-[700px] flex-col items-center rounded-lg bg-white shadow-lg"
      >
        <!-- CLOSE TAG -->
        <div
          class="flex cursor-pointer select-text self-end rounded-es-md bg-rose-600 px-1 text-xs transition-all duration-200 hover:bg-red-500"
          @click="profileStore.showProfile = false"
        >
          <span>✕</span>
        </div>

        <!-- PROFILE INFO -->
        <div
          class="mt-2 flex min-h-[100px] w-[95%] flex-wrap content-center rounded-xl bg-slate-300 px-4 py-4"
        >
          <div class="h-[80px] w-[80px] rounded-xl bg-black"></div>
          <div class="ml-3 flex flex-col">
            <span class="text-3xl"> {{ user.username }} </span>
            <span class="text-2xl"> {{ user.email }} </span>
          </div>
        </div>

        <!-- SERVERS -->
        <div
          class="mt-2 flex h-[200px] w-[95%] flex-wrap overflow-auto rounded-xl bg-slate-300 px-4 py-2"
        >
          <p class="select-none text-3xl font-bold text-slate-400">
            User has not provided info
          </p>
        </div>

        <!-- LOGOUT -->
        <button
          class="mr-2 mt-3 flex h-[30px] self-end rounded-xl bg-red-600 p-1 shadow-lg transition-all duration-200 hover:bg-red-500"
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
