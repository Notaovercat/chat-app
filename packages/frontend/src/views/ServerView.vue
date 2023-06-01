<script setup lang="ts">
import ChanelList from "@/components/ChanelList.vue";
import ServerBar from "@/components/ServerBar.vue";
import { useSideBarStore } from "@/stores/sideBar";
import Profile from "@/components/Profile.vue";
import { useProfileStore } from "@/stores/profile";
import { ref, onMounted } from "vue";
import CreateServerWindow from "@/components/CreateServerWindow.vue";
import ChangeAvatar from "@/components/ChangeAvatar.vue";

const profileStore = useProfileStore();
const userId = ref("");

onMounted(() => {
  userId.value = profileStore.getUserId();
});
const sideBarStore = useSideBarStore();
</script>

<template>
  <div class="flex flex-row">
    <div class="fixed bottom-0 left-0 top-0 z-20 min-h-screen">
      <!-- <ShowBarButton /> -->
      <ServerBar v-if="sideBarStore.showBar" />
    </div>
    <div class="fixed bottom-0 left-0 top-0 z-10 ml-[3.6rem] min-h-screen">
      <ChanelList v-if="sideBarStore.showBar" />
    </div>
  </div>
  <div
    class="mx-auto my-4 flex min-h-[80%] w-full items-center md:ml-[19rem] md:mr-4 md:w-10/12"
  >
    <RouterView name="chat" />
  </div>

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
