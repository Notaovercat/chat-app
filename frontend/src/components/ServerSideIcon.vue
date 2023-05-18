<script setup lang="ts">
import { ref } from "vue";
import ServerName from "./ServerName.vue";
import type { Server } from "@/types/server.type";
import router from "@/router";

interface ServerSideIconProps {
  server: Server;
}

const props = defineProps<ServerSideIconProps>();

const server = props.server;

const showName = ref(false);
</script>

<template>
  <div class="flex items-center justify-between">
    <div
      class="h-[44px] w-[44px] cursor-pointer rounded-2xl bg-white shadow-md transition-all duration-300 ease-in-out hover:rounded-xl hover:shadow-xl"
      @mouseenter="showName = true"
      @mouseout="showName = false"
      @click="router.push({ path: `/server/${server.id}` })"
    ></div>
    <ServerName :name="server.name" v-show="showName" />
  </div>
</template>
