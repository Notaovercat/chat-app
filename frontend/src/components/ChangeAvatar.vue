<script setup lang="ts">
import { useAvatarStore } from "@/stores/avatar";
import { ref, type Ref } from "vue";

const avatarStore = useAvatarStore();
const errorMessage = ref("");
const fileInput: Ref<File | null | undefined> = ref();

const onSubmit = async () => {
  if (!fileInput.value) {
    errorMessage.value = "Empty file";
    return;
  }
  await avatarStore.uploadAvatar(fileInput.value);
  avatarStore.showAvatarWindow = false;
  window.location.reload();
};

const onFileChanged = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  if (target && target.files) {
    fileInput.value = target.files[0];
  }
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 bg-black bg-opacity-40"
    v-if="avatarStore.showAvatarWindow"
  >
    <div class="flex h-screen w-screen items-center justify-center">
      <div
        class="flex min-h-[200px] w-[500px] flex-col self-center rounded-lg bg-white bg-opacity-100 pb-2 shadow-lg"
      >
        <!-- CLOSE BUTTON -->
        <div
          class="flex cursor-pointer self-end rounded-es-md bg-rose-600 px-1 text-xs transition-all duration-200 hover:bg-red-500"
          @click="avatarStore.showAvatarWindow = false"
        >
          <span>✕</span>
        </div>

        <!-- UPLOAD AVATAR -->
        <div
          class="flex flex-col items-center justify-center space-y-5 self-center"
        >
          <div class="text-3xl font-bold">Upload Avatar</div>
          <input
            @change="onFileChanged($event)"
            type="file"
            class="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
          />
          <button
            class="rounded-lg bg-sky-300 px-1 py-2 text-blue-700 shadow-lg hover:bg-sky-500 hover:text-white"
            @click="onSubmit()"
          >
            Upload
          </button>
          <small v-if="errorMessage" class="text-red-600">{{
            errorMessage
          }}</small>
        </div>
      </div>
    </div>
  </div>
</template>
