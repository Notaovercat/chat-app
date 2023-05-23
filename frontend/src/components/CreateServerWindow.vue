<script setup lang="ts">
import { useServerStore } from "@/stores/servers";
import type { CreateServerInput } from "@/types/server.type";
import { reactive, ref } from "vue";
import router from "@/router";
const serverStore = useServerStore();

const serverInput: CreateServerInput = reactive({ name: "" });
const serverEnterCode = ref("");

const errorMessage = ref("");
const errorMessage2 = ref("");

const onCreate = async () => {
  errorMessage.value = "";
  if (serverInput.name.length <= 3) {
    errorMessage.value = "Short name";
    return;
  }
  const server = await serverStore.createServer(serverInput);
  // window.location.reload();
  await serverStore.getJoinedServers();
  router.push({ path: `/server/${server?.id}` });

  serverStore.showServereButton = false;
};

const onJoin = async () => {
  errorMessage2.value = "";
  if (serverEnterCode.value.length < 5) {
    errorMessage2.value = "Invalid code";
    return;
  }
  const joinedServer = await serverStore.joinServer(serverEnterCode.value);
  if (!joinedServer) {
    errorMessage2.value = "No such server";
    return;
  } else {
    await serverStore.getJoinedServers();
    router.push({ path: `/server/${joinedServer.id}` });

    serverStore.showServereButton = false;
  }
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black bg-opacity-40"
    v-if="serverStore.showServereButton"
  >
    <div class="flex h-screen w-screen items-center justify-center">
      <div
        class="flex min-h-[200px] w-[500px] flex-col self-center rounded-lg bg-white bg-opacity-100 pb-2 shadow-lg"
      >
        <!-- CLOSE BUTTON -->
        <div
          class="flex cursor-pointer self-end rounded-es-md bg-rose-600 px-1 text-xs transition-all duration-200 hover:bg-red-500"
          @click="serverStore.showServereButton = false"
        >
          <span>✕</span>
        </div>

        <!-- CREATE SERVER WINDOWS -->
        <span class="self-center text-4xl">Write server name</span>
        <div class="mt-4 flex flex-col items-center justify-center space-y-2">
          <input
            type="text"
            placeholder="Name..."
            v-model="serverInput.name"
            class="h-[50px] w-5/6 rounded-md bg-blue-200 p-2 text-2xl text-slate-900 outline-none"
          />

          <small v-if="errorMessage" class="text-red-600">{{
            errorMessage
          }}</small>

          <button
            class="h-[50px] w-24 rounded-xl bg-sky-200 transition-all hover:bg-sky-400"
            :disabled="serverStore.loadingState"
            @click="onCreate()"
          >
            Create
          </button>
        </div>

        <hr class="mx-auto my-4 h-1 w-10/12 rounded bg-gray-100 md:my-10" />

        <!-- JOIN SERVER  -->
        <span class="self-center text-4xl">Enter a server code</span>
        <div class="mt-4 flex flex-col items-center justify-center space-y-2">
          <input
            type="text"
            placeholder="Name..."
            v-model="serverEnterCode"
            class="h-[50px] w-5/6 rounded-md bg-blue-200 p-2 text-2xl text-slate-900 outline-none"
          />

          <small v-if="errorMessage2" class="text-red-600">{{
            errorMessage2
          }}</small>

          <button
            class="h-[50px] w-24 rounded-xl bg-sky-200 transition-all hover:bg-sky-400"
            @click="onJoin()"
            :disabled="serverStore.loadingState"
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
