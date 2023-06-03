<script setup lang="ts">
import ChanelList from "@/components/chanels/ChanelList.vue";
import ServerBar from "@/components/servers/ServerBar.vue";
import { useSideBarStore } from "@/stores/sideBar";
import Profile from "@/components/additional/Profile.vue";
import { useProfileStore } from "@/stores/profile";
import { ref, onMounted } from "vue";
import CreateServerWindow from "@/components/servers/CreateServerWindow.vue";
import ChangeAvatar from "@/components/additional/ChangeAvatar.vue";

const profileStore = useProfileStore();
const userId = ref("");

onMounted(() => {
  userId.value = profileStore.getUserId();
});
const sideBarStore = useSideBarStore();
</script>

<template>
  <div class="flex flex-row">
    <!-- SERVER BAR -->
    <div class="fixed bottom-0 left-0 top-0 z-20 min-h-screen">
      <Suspense>
        <ServerBar v-if="sideBarStore.showBar" />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>

    <!-- CHANELS BAR -->
    <div class="fixed bottom-0 left-0 top-0 z-10 ml-[3.6rem] min-h-screen">
      <Suspense>
        <ChanelList v-if="sideBarStore.showBar" />
        <template #fallback> Loading... </template>
      </Suspense>
    </div>
  </div>

  <!-- CHAT WINDOW -->
  <div class="ml-0 flex md:ml-72">
    <RouterView name="chat" />
  </div>

  <!-- OTHER WINDOWS -->
  <Suspense>
    <Profile v-if="profileStore.showProfile" :userId="userId" :isUser="true" />
    <template #fallback> Loading... </template>
  </Suspense>

  <CreateServerWindow />
  <ChangeAvatar />
  <div
    class="visible fixed left-3 top-1 z-50 h-11 w-8 cursor-pointer select-none content-center justify-center rounded-md bg-sky-200 text-center md:invisible"
    @click="sideBarStore.switchSideBar()"
  >
    <span class="text-4xl">≡</span>
  </div>
</template>
