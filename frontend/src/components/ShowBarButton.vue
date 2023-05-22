<template>
  <button
    class="visible fixed bottom-0 z-40 m-1 rounded-lg bg-white p-2 shadow-xl md:invisible"
    @click="sideBarStore.switchSideBar()"
  >
    Show
  </button>
</template>

<script setup lang="ts">
import { useSideBarStore } from "@/stores/sideBar";
const sideBarStore = useSideBarStore();
</script>
