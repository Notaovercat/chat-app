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

  socket.on("chanelData", (data) => {
    // console.log(data);
    messages.value = data;
  });

  socket.on("newMessage", (data) => {
    messages.value.push(data);
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

  return { socket, joinToChanel, messages, sendMessage, leaveChanel };
});
