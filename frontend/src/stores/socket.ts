import type { CreateMessage, Message } from "@/types/message.type";
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ref, type Ref } from "vue";

export const useSocketStore = defineStore("socket", () => {
  const URL = "http://localhost:3333";

  const socket = io(URL, {
    autoConnect: true,
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });

  const messages: Ref<Message[]> = ref([]);

  socket.on("onGetMessages", (data) => {
    messages.value = data;
  });

  socket.on("newMessage", (data) => {
    messages.value.push(data);
  });

  socket.on("onUpdateMessage", (data: Message) => {
    const index = messages.value.findIndex((msg) => msg.id === data.id);
    if (index !== -1) {
      messages.value[index] = data;
    }
  });

  function joinToChanel(chanelId: string) {
    socket.emit("join", chanelId);
    socket.emit("getMessages", chanelId);
  }

  function leaveChanel(chanelId: string) {
    socket.emit("leaveChanel", chanelId);
  }

  function sendMessage(message: CreateMessage) {
    socket.emit("sendMessage", message);
  }

  function updateMessage(chanelId: string, messageId: string, content: string) {
    socket.emit("updateMessage", chanelId, messageId, content);
  }

  function deleteMessage(chanelId: string, messageId: string) {
    socket.emit("deleteMessage", chanelId, messageId);
  }

  return {
    socket,
    joinToChanel,
    messages,
    sendMessage,
    leaveChanel,
    updateMessage,
    deleteMessage,
  };
});
