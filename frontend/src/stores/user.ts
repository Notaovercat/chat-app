import { defineStore } from "pinia";
import { ref } from "vue";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import type { Profile } from "@/types/user.type";

export const useUserStore = defineStore("user", () => {
  const loadingState = ref(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const errorMessage = ref("");

  async function getUser(id: string): Promise<Profile> {
    try {
      // LOADING TRUE
      loadingState.value = true;

      // CLEAR ERROR MESSAGE
      errorMessage.value = "";

      // MAKE A REQUEST
      const response = await axios.get(`${apiUrl}/user/${id}`);

      // LOADING FALSE
      loadingState.value = false;

      const profile: Profile = response.data.user as Profile;

      if (!profile) {
        throw new Error("Invalid profile object");
      }
      return profile;
    } catch (err) {
      loadingState.value = false;
      errorMessage.value = "Error getting user";
      throw err;
    }
  }

  return { getUser, loadingState, errorMessage };
});
