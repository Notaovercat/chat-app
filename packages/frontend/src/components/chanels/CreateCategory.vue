<script setup lang="ts">
import { useCatsStore } from "@/stores/categories";
import { reactive, ref } from "vue";
import { useServerStore } from "@/stores/servers";

const serverStore = useServerStore();

const categoryStore = useCatsStore();

const categoryInput = reactive({
  name: "",
});

const showModal = ref(false);

const errorMessage = ref("");

const onCreate = async () => {
  errorMessage.value = "";
  if (categoryInput.name.length <= 3) {
    errorMessage.value = "Short name";
    return;
  }

  await categoryStore.createCateory({
    name: categoryInput.name,
    serverId: serverStore.currentServerId,
  });
  // window.location.reload();
  await categoryStore.getCatsByServer(serverStore.currentServerId);
  showModal.value = false;
};
</script>

<template>
  <div
    class="mx-2 mt-2 flex justify-center rounded-lg bg-blue-400 font-bold text-slate-400"
    @click="showModal = true"
  >
    <span
      class="cursor-pointer select-none text-white transition-all duration-100 hover:text-blue-100"
    >
      Create Category +
    </span>
  </div>

  <div class="fixed inset-0 bg-black bg-opacity-40" v-if="showModal">
    <div class="flex h-screen w-screen items-center justify-center">
      <div
        class="flex min-h-[200px] w-[500px] flex-col items-center self-center rounded-lg bg-white bg-opacity-100 pb-2 shadow-lg"
      >
        <div
          class="flex cursor-pointer self-end rounded-es-md bg-rose-600 px-1 text-xs transition-all duration-200 hover:bg-red-500"
          @click="showModal = false"
        >
          <span>✕</span>
        </div>
        <span class="self-center px-6 text-center text-4xl"
          >Write category name for {{ serverStore.currentServerName }}</span
        >
        <div class="mt-4 flex flex-col items-center justify-center space-y-2">
          <input
            type="text"
            placeholder="Name..."
            v-model="categoryInput.name"
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
