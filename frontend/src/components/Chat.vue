<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const chatMessages = reactive([
  { sender: "John", text: "Hello, how are you?" },
  { sender: "Alice", text: "I'm good, thanks!" },
  { sender: "John", text: "What have you been up to lately?" },
  { sender: "Alice", text: "Just working on some projects." },
  { sender: "John", text: "That's great!" },
  { sender: "Alice", text: "Yes, it's been busy but exciting." },
  { sender: "John", text: "Hello, how are you?" },
  { sender: "Alice", text: "I'm good, thanks!" },
  { sender: "John", text: "What have you been up to lately?" },
  { sender: "Alice", text: "Just working on some projects." },
  { sender: "John", text: "That's great!" },
  { sender: "Alice", text: "Yes, it's been busy but exciting." },
  { sender: "John", text: "Hello, how are you?" },
  { sender: "Alice", text: "I'm good, thanks!" },
  { sender: "John", text: "What have you been up to lately?" },
  { sender: "Alice", text: "Just working on some projects." },
  { sender: "John", text: "That's great!" },
  { sender: "Alice", text: "Yes, it's been busy but exciting." },
  { sender: "John", text: "Hello, how are you?" },
  { sender: "Alice", text: "I'm good, thanks!" },
  { sender: "John", text: "What have you been up to lately?" },
  { sender: "Alice", text: "Just working on some projects." },
  { sender: "John", text: "That's great!" },
  { sender: "Alice", text: "Yes, it's been busy but exciting." },
]);

const onSend = (message: string) => {
  chatMessages.push({ sender: "You", text: message });
};

const message = ref("");
</script>

<template>
  <div
    class="min-w-screen mr-auto flex min-h-screen flex-col items-center bg-blue-100"
  >
    <div class="fixed bottom-0 flex w-full flex-row bg-white px-4 py-2">
      <input
        type="text"
        class="ml-[17rem] w-full rounded-lg border border-gray-300 px-3 py-2 outline-none"
        placeholder="Type your message..."
        v-model="message"
      />
      <button
        class="ml-4 rounded-lg bg-blue-700 px-4 py-2 text-white outline-none hover:bg-blue-600"
        @click="onSend(message)"
      >
        Send
      </button>
    </div>

    <div
      class="mb-20 ml-[17rem] h-full w-[80%] justify-end overflow-x-clip bg-slate-50 p-6"
    >
      <!-- Chat messages go here -->
      <div v-for="message in chatMessages" class="mb-4">
        <div class="mb-1 text-gray-600">{{ message.sender }}</div>
        <div class="rounded-lg bg-gray-100 p-2">{{ message.text }}</div>
      </div>
    </div>
  </div>
</template>
