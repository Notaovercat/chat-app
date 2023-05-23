<script setup lang="ts">
import { useSocketStore } from "@/stores/socket";
import type { Message } from "@/types/message.type";
import {
  onMounted,
  ref,
  watch,
  computed,
  onBeforeUnmount,
  type ComputedRef,
  onBeforeMount,
} from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const socketStore = useSocketStore();
const messages: ComputedRef<Message[]> = computed(() => socketStore.messages);
const messageListRef = ref<HTMLElement | null>(null);
const userId = ref(localStorage.getItem("userId"));

onMounted(() => {
  setTimeout(() => scrollToBottom(), 300);
  socketStore.joinToChanel(route.params.chatId as string);
});

onBeforeUnmount(() => {
  socketStore.leaveChanel(route.params.chatId as string);
});

watch(
  () => route.params.chatId as string,
  (newChatId, oldChatId) => {
    setTimeout(() => scrollToBottom(), 300);
    if (oldChatId) {
      socketStore.leaveChanel(oldChatId);
    }
    if (newChatId) {
      socketStore.joinToChanel(newChatId);
    }
  }
);

const messageInput = ref("");

const onSend = () => {
  socketStore.sendMessage({
    chanelId: route.params.chatId as string,
    content: messageInput.value,
  });
  messageInput.value = "";
  setTimeout(() => scrollToBottom(), 300);
};

const scrollToBottom = () => {
  const messageList = messageListRef.value;
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight;
  }
};
</script>

<template>
  <div class="mx-2 mt-10 flex h-full w-full flex-col md:mt-0">
    <div
      class="-z-10 h-screen w-full overflow-y-scroll rounded-lg bg-slate-50 md:-z-0 md:h-[900px]"
      ref="messageListRef"
    >
      <div v-for="message of messages" class="">
        <div class="m-5 flex flex-row items-center">
          <div
            v-if="!message.createdBy.avatarUrl"
            class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-200"
          >
            N/A
          </div>

          <div
            class="relative ml-3 w-full rounded-xl bg-white px-4 py-4 text-sm shadow-sm"
          >
            <small class="text-lg">{{ message.createdBy.username }}</small>
            <div class="text-xl">{{ message.content }}</div>
            <div v-if="message.creatorId === userId">Update</div>
            <div v-if="message.creatorId === userId">Delete</div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex">
      <input
        class="h-10 w-full rounded-md bg-blue-100 px-3 text-slate-900 outline-none"
        placeholder="Type message here..."
        v-model="messageInput"
      />

      <button class="ml-3 h-10 w-32 rounded-md bg-blue-700" @click="onSend()">
        Send
      </button>
    </div>
  </div>
</template>
