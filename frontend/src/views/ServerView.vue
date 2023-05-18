<script setup lang="ts">
import Chanels from "@/components/Chanels.vue";
import SideBar from "@/components/SideBar.vue";
</script>

<template>
  <SideBar />
  <main class="flex min-h-screen w-screen bg-blue-50">
    <Chanels class="z-30 ml-[4rem]" />
  </main>
</template>
