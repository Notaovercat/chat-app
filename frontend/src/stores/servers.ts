import type { Server } from "@/types/server.type";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useServerStore = defineStore("server", () => {
  const loadingState = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const errorMessage = ref("");

  async function getJoinedServers(): Promise<Server[]> {
    // LOADING TRUE
    loadingState.value = true;

    // CLEAR ERROR MESSAGE
    errorMessage.value = "";

    // MAKE A REQUEST
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${apiUrl}/servers/joined`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // LOADING FALSE
    loadingState.value = false;

    const joinedSevers = response.data.servers as Server[];

    return joinedSevers;
  }

  async function getServerById(id: string): Promise<Server> {
    // LOADING TRUE
    loadingState.value = true;

    // CLEAR ERROR MESSAGE
    errorMessage.value = "";

    // MAKE A REQUEST
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${apiUrl}/servers/id/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // LOADING FALSE
    loadingState.value = false;

    const foundServer = response.data.server as Server;

    return foundServer;
  }

  return { getJoinedServers, loadingState, errorMessage, getServerById };
});
