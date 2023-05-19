<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
import { onMounted, ref } from "vue";
import Servers from "@/components/Servers.vue";
import Profile from "@/components/Profile.vue";

const profileStore = useProfileStore();
const userId = ref("");

onMounted(() => {
  userId.value = profileStore.getUserId();
});
</script>

<template>
  <Suspense>
    <Profile
      class="z-50"
      v-if="profileStore.showProfile"
      :userId="userId"
      :isUser="true"
    />
    <template #fallback> Loading... </template>
  </Suspense>
  <!-- Side menu for servers change -->
  <Suspense>
    <Servers class="z-40" />
    <template #fallback> Loading... </template>
  </Suspense>
  
</template>
