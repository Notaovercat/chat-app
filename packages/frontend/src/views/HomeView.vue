<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
import { ref, onMounted } from "vue";
import router from "@/router";
import axios from "axios";
import type { Server } from "@/types/server.type";
const profileStore = useProfileStore();
const userId = ref("");
import ServerBar from "@/components/servers/ServerBar.vue";
import Profile from "@/components/additional/Profile.vue";
import CreateServerWindow from "@/components/servers/CreateServerWindow.vue";
import ChangeAvatar from "@/components/additional/ChangeAvatar.vue";

onMounted(async () => {
  try {
    userId.value = profileStore.getUserId();
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/servers/getFirst`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );
    const server = response.data.server as Server;
    if (response.data.server) {
      router.push({ path: `/server/${server.id}` });
    }
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <InitPush />
  <div class="flex flex-row">
    <!-- SERVER BAR -->
    <div class="fixed bottom-0 left-0 top-0 z-20 min-h-screen">
      <Suspense>
        <ServerBar />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
  </div>
  <CreateServerWindow />
  <ChangeAvatar />

  <!-- OTHER WINDOWS -->
  <Suspense>
    <Profile v-if="profileStore.showProfile" :userId="userId" :isUser="true" />
    <template #fallback> Loading... </template>
  </Suspense>
</template>
