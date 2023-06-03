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
  type Ref,
} from "vue";
import { useRoute } from "vue-router";
import ObserverBottom from "@/components/chat/ObserverBottom.vue";
import ObserverTop from "@/components/chat/ObserverTop.vue";

// INITIALIZE ROUTE
const route = useRoute();

// INITIALIZE SOCKET STORE
const socketStore = useSocketStore();

// COMPUTE MESSAGES FROM SOCKET STORE
const messages: ComputedRef<Message[]> = computed(() => socketStore.messages);

// INITIALIZE MESSAGE WINDOW HTML COMPONENT
const messageListRef = ref<HTMLElement | null>(null);

// GET USER ID FROM LOCAL STORAGE
const userId = ref(localStorage.getItem("userId"));

// INITIALIZE MESSAGE INPUT REFERENCE
const messageInput = ref("");

// INITIALIZE HOVERED MESSAGE REFERENCE
const hoveredMessage: Ref<string | null> = ref("");

// INITIALIZE EDIT MODE REFERENCE
const editMode = ref(false);

// INITIALIZE EDIT CONTENT REFERENCE
const editContent = ref("");

// GET API URL FROM ENV
const aip_url = ref(import.meta.env.VITE_API_URL);

// INITIALIZE BOTTOM
const isBottom = ref(false);

// INITIALIZE TOP
const isTop = ref(false);

// INITIALIZE MOBILE STATE
const mobileState = ref(false);

// EDIT MESSAGE
const onEditMode = (content: string) => {
  editMode.value = true;
  editContent.value = content;
};

// SEND MESSAGE
const onSend = () => {
  socketStore.sendMessage({
    chanelId: route.params.chatId as string,
    content: messageInput.value,
  });
  messageInput.value = "";
  setTimeout(() => scrollToBottom(), 100);
};

// UPDATE MESSAGE
const onUpdate = (msgId: string, content: string) => {
  socketStore.updateMessage(route.params.chatId as string, msgId, content);
  editMode.value = false;
};

// DELETE MESSAGE
const onDelete = (msgId: string) => {
  socketStore.deleteMessage(route.params.chatId as string, msgId);
  editMode.value = false;
};

// JOIN CHANNEL WHEN COMPONENT MOUNTS
onMounted(() => {
  socketStore.joinToChanel(route.params.chatId as string);
  setTimeout(() => scrollToBottom(), 200);
});

// WATCH CHAT ID AND JOIN OR LEAVE CHANNEL ACCORDINGLY
watch(
  () => route.params.chatId as string,
  (newChatId, oldChatId) => {
    setTimeout(() => scrollToBottom(), 200);
    if (oldChatId) {
      socketStore.leaveChanel(oldChatId);
    }
    if (newChatId) {
      socketStore.joinToChanel(newChatId);
    }
  }
);

// WATCH FOR NEW MESSAGES AND SCROLL TO BOTTOM IF NECESSARY
watch(
  () => socketStore.messages.length,
  () => {
    if (isBottom.value) setTimeout(() => scrollToBottom(), 200);
  }
);

// LEAVE CHANNEL WHEN COMPONENT UNMOUNTS
onBeforeUnmount(() => {
  socketStore.leaveChanel(route.params.chatId as string);
});

// FUNCTION TO SCROLL TO BOTTOM
const scrollToBottom = () => {
  const messageList = messageListRef.value;
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight;
  }
  // const msgInput = inputBar.value;
  // if (msgInput) {
  //   msgInput.scrollTop = msgInput.scrollHeight;
  // }
};

// FUNCTION TO SCROLL TO HALF BOTTOM
const scrollToHalfBottom = () => {
  const messageList = messageListRef.value;
  if (messageList) {
    messageList.scrollTop = messageList.scrollHeight / 2;
  }
};

// WATCH FOR SCROLLING TO TOP AND LOAD PREVIOUS MESSAGES IF NECESSARY
watch(
  () => isTop.value,
  () => {
    if (isTop.value) {
      socketStore.onLoadPrevMsgs(route.params.chatId as string);
      setTimeout(() => scrollToHalfBottom(), 200);
    }
  }
);
</script>

<template>
  <div class="mx-2 mt-10 flex h-full w-full flex-col p-4 md:mt-0 md:p-8">
    <!-- CHAT WINDOW -->
    <div class="w-full flex-grow overflow-y-auto rounded-lg bg-slate-50">
      <div
        class="-z-10 mb-16 h-[600px] w-full overflow-y-scroll scroll-smooth rounded-lg bg-slate-50 md:-z-0 md:mb-0 md:h-full md:max-h-[880px]"
        ref="messageListRef"
      >
        <ObserverTop @intersect="isTop = $event" />
        <div class="" v-for="message of messages.slice()" :key="message.id">
          <div class="m-5 flex flex-row items-center">
            <!-- USER AVATAR -->

            <!-- NO AVATAR -->
            <div
              v-if="!message.createdBy.avatarName"
              class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-400 text-center text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="h-14 w-14"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>

            <!-- AVATAR IMG -->
            <div class="select-none" v-else>
              <img
                class="pointer-events-none inline-block h-14 w-14 rounded-full ring-2 ring-white"
                :src="`${aip_url}/images/${message.createdBy.avatarName}`"
              />
            </div>

            <!-- MESSAGE -->
            <div
              class="relative ml-3 flex w-full flex-wrap rounded-xl bg-white px-4 py-4 pb-8 text-sm shadow-sm"
              @mouseenter="if (!editMode) hoveredMessage = message.id;"
              @mouseleave="if (!editMode) hoveredMessage = null;"
              @touchstart="
                if (!mobileState) {
                  if (!editMode) hoveredMessage = message.id;
                  mobileState = true;
                }
              "
            >
              <div class="flex flex-col">
                <!-- USERNAME -->
                <div class="text-base">{{ message.createdBy.username }}</div>

                <!-- MESSAGE CONTENT -->
                <div
                  v-if="!editMode || hoveredMessage !== message.id"
                  class="text-xl"
                >
                  {{ message.content }}
                </div>

                <!-- EDIT MESSAGE INPUT -->
                <input
                  v-if="editMode && hoveredMessage === message.id"
                  class="w-full rounded-md border-none bg-slate-50 p-1 text-xl text-slate-950"
                  type="text"
                  v-model="editContent"
                />
              </div>

              <!-- EDIT AND DELETE  -->
              <div
                class="ml-3 flex flex-row items-center"
                v-if="
                  hoveredMessage === message.id &&
                  message.createdBy.id === userId &&
                  editMode === false &&
                  !message.isMessageDeleted
                "
              >
                <!-- EDIT BUTTON -->
                <button
                  class="mr-1 rounded-lg bg-sky-500 p-1 text-white opacity-80 transition delay-75 hover:bg-sky-700 hover:opacity-100"
                  @click="onEditMode(message.content)"
                >
                  <!-- PENCIL ICON SVG -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>

                <!-- DELETE BUTTON -->
                <button
                  class="rounded-lg bg-red-500 p-1 text-white opacity-80 transition delay-75 hover:bg-red-700 hover:opacity-100"
                  @click="onDelete(hoveredMessage)"
                >
                  <!-- TRASH CAN ICON SVG -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>

                <!-- CLOSE BUTTON FOR MOBILE DEICES -->
                <button
                  class="visible ml-1 rounded-lg bg-red-500 p-1 text-white opacity-80 transition delay-75 hover:bg-red-700 hover:opacity-100 md:invisible"
                  @click="mobileState = false"
                >
                  <!-- TRASH CAN ICON SVG -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- CONFIRM AND DISCARD -->
              <div
                class="ml-3 flex flex-row items-center"
                v-if="
                  hoveredMessage === message.id &&
                  message.createdBy.id === userId &&
                  editMode === true
                "
              >
                <!-- CONFIRM BUTTON -->
                <button
                  class="mr-1 rounded-lg bg-green-500 p-1 text-white opacity-80 transition delay-75 hover:bg-green-700 hover:opacity-100"
                  @click="onUpdate(hoveredMessage, editContent)"
                >
                  <!-- CHECK ICON SVG -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </button>

                <!-- DISCARD BUTTON -->
                <button
                  @click="editMode = false"
                  class="rounded-lg bg-red-500 p-1 text-white opacity-80 transition delay-75 hover:bg-red-700 hover:opacity-100"
                >
                  <!-- BACK ICON SVG -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <ObserverBottom @intersect="isBottom = $event" />

        <!-- MESSAGE INPUT -->
        <div
          class="fixed bottom-0 box-border flex w-11/12 flex-grow md:pr-[300px]"
        >
          <input
            class="h-10 w-full rounded-md bg-blue-100 px-3 text-slate-900 outline-none"
            placeholder="Type message here..."
            v-model="messageInput"
          />

          <button
            class="mb-3 ml-3 h-10 w-auto rounded-md bg-blue-700 px-1 text-white md:mr-auto md:px-5"
            @click="onSend()"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
