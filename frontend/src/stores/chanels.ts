import type { Chanel, CreateChanel } from "@/types/chanel.type";
import axios from "axios";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useChanStore = defineStore("chanel", () => {
  const loadingState = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const errorMessage = ref("");
  const chanels: Ref<Chanel[]> = ref([]);

  async function getChanelsByCat(catId: string) {
    // LOADING TRUE
    loadingState.value = true;

    // CLEAR ERROR MESSAGE
    errorMessage.value = "";

    // MAKE A REQUEST
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${apiUrl}/chanels/${catId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // LOADING FALSE
    loadingState.value = false;

    chanels.value = response.data.categories as Chanel[];
  }

  async function createChanel(chanelInput: CreateChanel) {
    try {
      // LOADING TRUE
      loadingState.value = true;

      // CLEAR ERROR MESSAGE
      errorMessage.value = "";

      // MAKE A REQUEST
      const token = localStorage.getItem("jwt");
      const response = await axios.post(`${apiUrl}/chanels/`, chanelInput, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // LOADING FALSE
      loadingState.value = false;

      return response.data.server as Chanel;
    } catch (err) {
      console.log(err);
    }
  }

  return { createChanel, getChanelsByCat, loadingState, errorMessage, chanels };
});
