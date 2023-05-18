import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ref, type Ref } from "vue";

export const useSocketStore = defineStore("socket", () => {
  const URL = "http://localhost:3333";
  const socket = io(URL);

  const messages: Ref<string[]> = ref([]);

  socket.on("connect", () => {
    console.log("Connected");
  });

  socket.on("recieve message", (msg) => {
    messages.value.push(msg);
  });

  const sendMessage = (msg: string) => {
    socket.emit("send message", msg);
  };

  return { socket, messages, sendMessage };
});
