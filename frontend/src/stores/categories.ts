import type { Category } from "@/types/category.type";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCatsStore = defineStore("category", () => {
  const loadingState = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const errorMessage = ref("");

  async function getCatsByServer(id: string): Promise<Category[]> {
    // LOADING TRUE
    loadingState.value = true;

    // CLEAR ERROR MESSAGE
    errorMessage.value = "";

    // MAKE A REQUEST
    const token = localStorage.getItem("jwt");
    const response = await axios.get(`${apiUrl}/categories/server/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // LOADING FALSE
    loadingState.value = false;

    const categories = response.data.categories as Category[];

    return categories;
  }

  return { getCatsByServer };
});
