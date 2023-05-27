<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
import { useAuthStore } from "@/stores/auth";
import type { Profile } from "@/types/user.type";
import { useAvatarStore } from "@/stores/avatar";

interface ProfileProps {
  userId: string;
  isUser: boolean;
}

const props = defineProps<ProfileProps>();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const avatarStore = useAvatarStore();

const userId = props.userId;
const isUser = props.isUser;

const profile: Profile = await profileStore.getUser(userId);
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
          <!-- USER AVATAR -->

          <!-- NO AVATAR -->
          <div
            @click="avatarStore.showAvatarWindow = true"
            v-if="!profile.avatarName"
            class="flex h-[80px] w-[80px] cursor-pointer items-center justify-center rounded-xl bg-slate-400 text-slate-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-18 w-18"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </div>

          <!-- AVATAR IMG -->
          <div v-else>
            <img
              @click="avatarStore.showAvatarWindow = true"
              class="inline-block h-[80px] w-[80px] cursor-pointer select-none rounded-lg"
              :src="'http://localhost:3333/images/' + profile.avatarName"
            />
          </div>

          <!-- USER INFO -->
          <div class="ml-3 flex flex-col">
            <span class="text-3xl">{{ profile.username }}</span>
            <span class="text-2xl">{{ profile.email }}</span>
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
