import type { Chanel } from "@/types/channel.type";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useChanStore = defineStore("chanel", () => {
  const loadingState = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const errorMessage = ref("");

  async function getChanelsByCat(catId: string): Promise<Chanel[]> {
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

    const chanels = response.data.categories as Chanel[];

    return chanels;
  }

  return { getChanelsByCat, loadingState, errorMessage };
});
