<script setup lang="ts">
import { useServerStore } from "@/stores/servers";
import type { CreateServerInput } from "@/types/server.type";
import { reactive, ref } from "vue";
import router from "@/router";
const serverStore = useServerStore();

const serverInput: CreateServerInput = reactive({ name: "" });

const showModal = ref(false);

const errorMessage = ref("");

const onCreate = async () => {
  errorMessage.value = "";
  if (serverInput.name.length <= 3) {
    errorMessage.value = "Short name";
    return;
  }
  const server = await serverStore.createServer(serverInput);
  router.push({ path: `/server/${server?.id}` });
  window.location.reload();
};
</script>

<template>
  <div
    class="flex h-[44px] w-[44px] cursor-pointer rounded-full bg-blue-900 shadow-md transition-all duration-300 ease-in-out hover:bg-black hover:shadow-xl"
    @click="showModal = true"
  >
    <span class="mx-auto select-none text-4xl text-white">+</span>
  </div>

  <div class="fixed inset-0 bg-black bg-opacity-40" v-if="showModal">
    <div class="flex h-screen w-screen items-center justify-center">
      <div
        class="flex min-h-[200px] w-[500px] flex-col self-center rounded-lg bg-white bg-opacity-100 pb-2 shadow-lg"
      >
        <div
          class="flex cursor-pointer self-end rounded-es-md bg-rose-600 px-1 text-xs transition-all duration-200 hover:bg-red-500"
          @click="showModal = false"
        >
          <span>✕</span>
        </div>
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
            @click="onCreate()"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
