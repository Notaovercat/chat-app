<script setup lang="ts">
import { ref } from "vue";
import ServerName from "@/components/servers/ServerName.vue";
import type { Server } from "@/types/server.type";
import router from "@/router";

interface ServerSideIconProps {
  server: Server;
}

const props = defineProps<ServerSideIconProps>();
const aip_url = ref(import.meta.env.VITE_API_URL);
const server = props.server;

const showName = ref(false);
</script>

<template>
  <div class="flex items-center justify-between">
    <div
      class="h-[44px] w-[44px] cursor-pointer rounded-2xl shadow-md transition-all duration-300 ease-in-out hover:rounded-xl hover:shadow-xl"
      :class="!server.iconName ? 'bg-slate-400' : ''"
      @mouseenter="showName = true"
      @mouseout="showName = false"
      @click="router.push({ path: `/server/${server.id}` })"
    >
      <img
        v-if="server.iconName"
        :src="`${aip_url}/images/${server.iconName}`"
        alt="serverIcon.png"
        class="h-full w-full rounded-2xl transition-all ease-in-out hover:rounded-xl hover:shadow-xl"
      />
    </div>

    <ServerName :name="server.name" v-show="showName" />
  </div>
</template>
