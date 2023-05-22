<script setup lang="ts">
import ServerSideIcon from "@/components/ServerSideIcon.vue";
import UserButton from "@/components/UserButton.vue";
import CreateServerButton from "@/components/CreateServerButton.vue";
import type { Server } from "@/types/server.type";
import { useProfileStore } from "@/stores/profile";
import { useServerStore } from "@/stores/servers";
const profileStore = useProfileStore();
const serverStore = useServerStore();

const joinedServers: Server[] =
  (await serverStore.getJoinedServers()) as Server[];
</script>

<template>
  <div class="h-full overflow-visible bg-blue-950 px-2 pt-11 md:pt-0">
    <ul class="flex flex-col items-center space-y-2 pt-2">
      <li>
        <UserButton @click="profileStore.showProfile = true" />
      </li>
      <hr class="mx-auto my-4 h-1 w-[90%] rounded border-0 bg-gray-50" />
      <!-- Button for servers -->
      <li v-for="server of joinedServers">
        <ServerSideIcon :server="server" />
      </li>
      <li>
        <CreateServerButton />
      </li>
    </ul>
  </div>
</template>
