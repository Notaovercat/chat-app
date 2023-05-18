<script setup lang="ts">
import type { Server } from "@/types/server.type";
import { reactive, ref, type Ref } from "vue";

interface ServerCardProps {
  server: Server;
}

const props = defineProps<ServerCardProps>();
const server = reactive(props.server);
</script>

<template>
  <div
    class="m-1 flex h-[70px] w-[200px] cursor-pointer flex-row items-center rounded-xl bg-slate-50 px-2 shadow-none transition-all duration-300 hover:shadow-2xl"
  >
    <div class="h-[80%] min-w-[60px] rounded-lg bg-black"></div>

    <p class="ml-1 w-auto truncate pb-8 text-xl">{{ server.name }}</p>
  </div>
</template>
