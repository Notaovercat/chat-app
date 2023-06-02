<script setup lang="ts">
import ServerList from "@/components/Servers/ServerList.vue";
</script>

<template>
  <!-- Side menu for ServerList change -->
  <Suspense>
    <ServerList />
    <template #fallback> Loading... </template>
  </Suspense>
</template>
