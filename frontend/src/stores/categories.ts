import type { Category, CreateCategoryInput } from "@/types/category.type";
import axios from "axios";
import { defineStore } from "pinia";
import { ref, type Ref } from "vue";

export const useCatsStore = defineStore("category", () => {
  const loadingState = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const errorMessage = ref("");
  const categories: Ref<Category[]> = ref([]);

  async function getCatsByServer(id: string) {
    // LOADING TRUE
    loadingState.value = true;

    categories.value = [];

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

    categories.value = response.data.categories as Category[];

    // return categories;
  }

  async function createCateory(
    categoryInput: CreateCategoryInput
  ): Promise<Category | undefined> {
    try {
      // LOADING TRUE
      loadingState.value = true;

      // CLEAR ERROR MESSAGE
      errorMessage.value = "";

      // MAKE A REQUEST
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        `${apiUrl}/categories/`,
        categoryInput,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // LOADING FALSE
      loadingState.value = false;

      return response.data.server as Category;
    } catch (error) {
      console.log(error);
    }
  }

  return { getCatsByServer, createCateory, loadingState, categories };
});
