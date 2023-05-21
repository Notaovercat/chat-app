<script setup lang="ts">
import { useChanStore } from "@/stores/chanels";
import { reactive, ref } from "vue";

interface CreateChanelprops {
  categoryId: string;
}

const { categoryId } = defineProps<CreateChanelprops>();

const chanelStore = useChanStore();

const chanelInput = reactive({
  name: "",
});

const errorMessage = ref("");

const showModal = ref(false);

const onCreate = async () => {
  errorMessage.value = "";
  if (chanelInput.name.length <= 3) {
    errorMessage.value = "Short name";
    return;
  }

  await chanelStore.createChanel({
    name: chanelInput.name,
    categoryId: categoryId,
  });
  window.location.reload();
};
</script>

<template>
  <span
    @click="showModal = true"
    class="ml-1 cursor-pointer select-none rounded-full px-1 text-center font-bold text-white transition-colors hover:bg-blue-50 hover:text-black"
    >+</span
  >

  <div
    class="fixed inset-0 bg-black bg-opacity-40 font-normal text-black"
    v-if="showModal"
  >
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
          >Write chanel name</span
        >
        <div class="mt-4 flex flex-col items-center justify-center space-y-2">
          <input
            type="text"
            placeholder="Name..."
            v-model="chanelInput.name"
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
