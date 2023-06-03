import type { CreateMessage, Message } from "@/types/message.type";
import { defineStore } from "pinia";
import { io } from "socket.io-client";
import { ref, type Ref } from "vue";

export const useSocketStore = defineStore("socket", () => {
  // API URL
  const URL = import.meta.env.VITE_API_URL;

  // PAGE FOR LOADING PREVIOUS MESSAGES
  // NEGATIVE VALUE FOR INIT
  let page = 0;
  const isHasMore = ref(true);

  // CONNECT TO SOCKET SERVER
  const socket = io(URL, {
    autoConnect: true,
    extraHeaders: {
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });

  // ARRAY OF MESSAGES
  const messages: Ref<Message[]> = ref([]);

  // ADD MESSAGES TO THE ARRAY
  socket.on("onGetMessages", (data: Message[]) => {
    isHasMore.value = true;
    messages.value.unshift(...data);
  });

  socket.on("onEmpty", () => {
    isHasMore.value = false;
  });

  // ADD SENDED MESSAGE TO THE ARRAY
  socket.on("newMessage", (data) => {
    messages.value.push(data);
  });

  // UPDATE MESSAGE
  socket.on("onUpdateMessage", (data: Message) => {
    const index = messages.value.findIndex((msg) => msg.id === data.id);
    if (index !== -1) {
      messages.value[index] = data;
    }
  });

  // LOAD PREVIOUS MESSAGES
  function onLoadPrevMsgs(chanelId: string) {
    if (messages.value.length >= 10) {
      page += 10;
      socket.emit("getMessages", chanelId, page);
    }
  }

  // JOIN TO THE CHANEL AS A SOCKET ROOM
  function joinToChanel(chanelId: string) {
    socket.emit("join", chanelId);

    // GET MESSAGES FROM THE SERVER TO THE NEW CHANEL
    socket.emit("getMessages", chanelId);
  }

  function leaveChanel(chanelId: string) {
    socket.emit("leaveChanel", chanelId);
    // CLEAR ARRAY FOR NEW CHANEL
    messages.value = [];
    page = 0;
    isHasMore.value = true;
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
    onLoadPrevMsgs,
    isHasMore,
  };
});
