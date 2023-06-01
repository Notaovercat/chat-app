import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAvatarStore = defineStore("avatar", () => {
  const showAvatarWindow = ref(false);
  const loadingState = ref(false);
  const errorMessage = ref("");
  const apiUrl = import.meta.env.VITE_API_URL;

  async function uploadAvatar(fileInput: File) {
    try {
      if (!fileInput) throw new Error("Empty file");

      // LOADING TRUE
      loadingState.value = true;

      // CLEAR ERROR MESSAGE
      errorMessage.value = "";

      // CREATE FORM DATA
      const formData = new FormData();
      formData.append("image", fileInput);

      // MAKE A REQUEST
      const token = localStorage.getItem("jwt");
      const response = await axios.post(
        `${apiUrl}/user/changeAvatar`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // LOADING FALSE
      loadingState.value = false;

      return response.status;
    } catch (err) {
      console.log(err);
    }
  }

  return { showAvatarWindow, uploadAvatar, loadingState, errorMessage };
});
