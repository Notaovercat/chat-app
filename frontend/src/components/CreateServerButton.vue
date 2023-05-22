<script setup lang="ts">
import { useServerStore } from "@/stores/servers";
const serverStore = useServerStore();
</script>

<template>
  <div
    class="flex h-[44px] w-[44px] cursor-pointer rounded-full bg-blue-900 shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:shadow-xl"
    @click="serverStore.showServereButton = true"
  >
    <span class="mx-auto select-none text-4xl text-white">+</span>
  </div>
</template>
