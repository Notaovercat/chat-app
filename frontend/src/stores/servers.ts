import type { CreateServerInput, Server } from "@/types/server.type";
import type { Profile, User } from "@/types/user.type";
import axios from "axios";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useServerStore = defineStore("server", () => {
  const loadingState = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const errorMessage = ref("");
  const currentServerId = ref("");
  const currentServerName = ref("");
  const showServereButton = ref(false);
  const joinedServers: Ref<Server[]> = ref([]);

  async function getJoinedServers() {
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

      joinedServers.value = response.data.servers as Server[];
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

  function checkIfUserServOwner(creatorId: string, userId: string) {
    return creatorId === userId ? true : false;
  }

  async function joinServer(joinCode: string) {
    try {
      // LOADING TRUE
      loadingState.value = true;

      // CLEAR ERROR MESSAGE
      errorMessage.value = "";

      // MAKE A REQUEST
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        `${apiUrl}/servers/join/${joinCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // LOADING FALSE
      loadingState.value = false;

      return response.data.server as Server;
    } catch (error) {
      console.log(error);
    }
  }

  async function getServerMembers(serverId: string) {
    try {
      // LOADING TRUE
      loadingState.value = true;

      // CLEAR ERROR MESSAGE
      errorMessage.value = "";

      // MAKE A REQUEST
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `${apiUrl}/servers/members/${serverId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // LOADING FALSE
      loadingState.value = false;

      const foundMembers = response.data.members as Profile[];

      return foundMembers;
    } catch (err) {
      console.log(err);
    }
  }

  async function checkIsUserMember(serverId: string, userId: string) {
    try {
      // LOADING TRUE
      loadingState.value = true;

      // CLEAR ERROR MESSAGE
      errorMessage.value = "";

      // MAKE A REQUEST
      const members = await getServerMembers(serverId);
      console.log(members);
      if (!members) return false;
      if (members.find((member) => member.id === userId)) return true;
      return false;
    } catch (err) {
      console.log(err);
    }
  }

  return {
    getJoinedServers,
    loadingState,
    errorMessage,
    getServerById,
    createServer,
    checkIfUserServOwner,
    currentServerId,
    currentServerName,
    showServereButton,
    joinServer,
    joinedServers,
    checkIsUserMember,
    getServerMembers,
  };
});
