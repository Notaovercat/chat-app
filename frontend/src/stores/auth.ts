import { signInSchema, type SignInInput } from "@/types/signIn.type";
import { defineStore } from "pinia";
import { ref } from "vue";
import axios, { AxiosError } from "axios";
import { ZodError } from "zod";
import { signUpSchema, type SignUpInput } from "@/types/signUp.type";
import router from "@/router";

export const useAuthStore = defineStore("auth", () => {
  // JWT TOKEN
  const token = ref(localStorage.getItem("jwt") || "");
  const userId = ref("");
  const errorMessage = ref("");
  const apiUrl = import.meta.env.VITE_API_URL;
  const loadingState = ref(false);

  async function handleLogin(loginData: SignInInput) {
    try {
      // SWITCH LOADING TO TRUE FOR FRONT
      loadingState.value = true;

      // RESET ERROR MESSAGE
      errorMessage.value = "";

      // VALIDATE USER DATA
      const inputCreds = signInSchema.parse(loginData);

      // MAKE A REQ TO A BACKEND
      const response = await axios.post(`${apiUrl}/auth/signIn`, inputCreds);

      token.value = response.data.token as string;
      console.log(response.data);
      userId.value = response.data.id;

      localStorage.setItem("userId", userId.value);
      localStorage.setItem("jwt", token.value);

      loadingState.value = false;

      router.push({ name: "home" });
    } catch (err) {
      loadingState.value = false;
      console.log(err);
      if (err instanceof ZodError) {
        errorMessage.value = err.issues[0].message;
      }
      if (err instanceof AxiosError) {
        err.response?.status === 401
          ? (errorMessage.value = "Wrong email and password")
          : (errorMessage.value = "Server error");
      }
    }
  }

  async function handleRegistration(signupData: SignUpInput) {
    try {
      // SWITCH LOADING TO TRUE FOR FRONT
      loadingState.value = true;

      // RESET ERROR MESSAGE
      errorMessage.value = "";

      // VALIDATE USER DATA
      const inputCreds = signUpSchema.parse(signupData);

      // MAKE A REQ TO A BACKEND
      const response = await axios.post(`${apiUrl}/auth/signUp`, inputCreds);

      token.value = response.data.token;
      userId.value = response.data.id;

      localStorage.setItem("userId", userId.value);
      localStorage.setItem("jwt", token.value);

      loadingState.value = false;

      router.push({ name: "home" });
    } catch (err) {
      loadingState.value = false;
      console.log(err);
      if (err instanceof ZodError) {
        errorMessage.value = err.issues[0].message;
      }
      if (err instanceof AxiosError) {
        errorMessage.value = "Server error";
      }
    }
  }

  function isLogin() {
    if (!localStorage.getItem("jwt")) return false;
    return true;
  }

  function handleLogOut() {
    loadingState.value = true;
    localStorage.clear();
    loadingState.value = false;
    window.location.reload();
  }

  return {
    handleLogin,
    handleRegistration,
    loadingState,
    isLogin,
    errorMessage,
    token,
    handleLogOut,
  };
});
