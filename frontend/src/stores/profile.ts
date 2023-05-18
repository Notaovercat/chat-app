import { defineStore } from "pinia";
import { ref } from "vue";
import router from "@/router";
export const useProfileStore = defineStore("profile", () => {
  const showProfile = ref(false);

  function getUserId() {
    const id = localStorage.getItem("userId") || "";
    return id;
  }

  return { showProfile, getUserId };
});
