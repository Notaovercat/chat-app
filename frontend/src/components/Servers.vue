<script setup lang="ts">
import type { Server } from "@/types/server.type";
import ServerSideIcon from "./ServerSideIcon.vue";
import UserButton from "./UserButton.vue";
import { useProfileStore } from "@/stores/profile";
import { useServerStore } from "@/stores/servers";

const profileStore = useProfileStore();
const serverStore = useServerStore();

const joinedServers: Server[] = await serverStore.getJoinedServers();
</script>

<template>
  <div
    class="fixed bottom-0 left-0 top-0 h-full w-16 overflow-visible bg-blue-950"
  >
    <ul class="mt-2 flex flex-col items-center space-y-2">
      <li>
        <UserButton @click="profileStore.showProfile = true" />
      </li>
      <hr class="mx-auto my-4 h-1 w-[90%] rounded border-0 bg-gray-50" />
      <!-- Button for servers -->
      <li v-for="server of joinedServers">
        <ServerSideIcon :server="server" />
      </li>
    </ul>
  </div>
</template>
