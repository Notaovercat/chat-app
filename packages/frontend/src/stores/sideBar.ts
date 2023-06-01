import { defineStore } from "pinia";
import { ref } from "vue";

export const useSideBarStore = defineStore("sideBar", () => {
  const showBar = ref(true);

  function switchSideBar() {
    showBar.value = !showBar.value;
  }

  return { switchSideBar, showBar };
});
