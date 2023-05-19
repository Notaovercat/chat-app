import type { CreateServerInput, Server } from "@/types/server.type";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useServerStore = defineStore("server", () => {
  const loadingState = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const errorMessage = ref("");

  async function getJoinedServers(): Promise<Server[] | undefined> {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async function getServerById(id: string): Promise<Server | undefined> {
    try {
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
    } catch (error) {
      console.log(error);
    }
  }

  async function createServer(
    serverInput: CreateServerInput
  ): Promise<Server | undefined> {
    try {
      // LOADING TRUE
      loadingState.value = true;

      // CLEAR ERROR MESSAGE
      errorMessage.value = "";

      // MAKE A REQUEST
      const token = localStorage.getItem("jwt");
      const response = await axios.post(`${apiUrl}/servers/`, serverInput, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // LOADING FALSE
      loadingState.value = false;

      return response.data.server as Server;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    getJoinedServers,
    loadingState,
    errorMessage,
    getServerById,
    createServer,
  };
});
