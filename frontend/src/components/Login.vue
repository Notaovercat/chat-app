<script setup lang="ts">
import type { SignInInput } from "@/types/signIn.type";
import { useAuthStore } from "@/stores/auth";
import { reactive, ref } from "vue";
import type { SignUpInput } from "@/types/signUp.type";

const authStore = useAuthStore();

const userCred = reactive({
  email: "",
  username: "",
  password: "",
});

const errorMessage1 = ref("");
const errorMessage2 = ref("");
const errorMessage3 = ref("");

const isSignup = ref(false);

const onAuth = () => {
  isSignup.value ? onSignup() : onLogin();
};

const onLogin = () => {
  // VALIDATE EMAIL
  errorMessage1.value = "";
  if (userCred.email.trim().length <= 5) {
    errorMessage1.value = "Email must be valid";
  }

  errorMessage2.value = "";
  if (userCred.password.trim().length <= 5) {
    errorMessage2.value = "Password must be valid";
  }

  authStore.errorMessage = "";

  if (userCred.email.trim().length <= 5 || userCred.password.trim().length <= 5)
    return;

  authStore.handleLogin({
    email: userCred.email,
    password: userCred.password,
  } as SignInInput);
};

const onSignup = () => {
  errorMessage1.value = "";
  if (userCred.email.trim().length <= 5) {
    errorMessage1.value = "Email must be valid";
  }

  errorMessage2.value = "";
  if (userCred.password.trim().length <= 5) {
    errorMessage2.value = "Password must be valid";
  }

  errorMessage3.value = "";
  if (userCred.username.trim().length <= 3) {
    errorMessage3.value = "Username must be valid";
  }

  authStore.errorMessage = "";

  if (
    userCred.email.trim().length <= 5 ||
    userCred.password.trim().length <= 5 ||
    userCred.username.trim().length <= 3
  )
    return;

  //   console.log({
  //   email: userCred.email,
  //   username: userCred.username,
  //   password: userCred.password,
  // })
  authStore.handleRegistration({
    email: userCred.email,
    username: userCred.username,
    password: userCred.password,
  } as SignUpInput);
};
</script>

<template>
  <div
    class="flex max-h-screen min-h-[300px] w-[350px] flex-col items-center justify-center space-y-5 rounded-lg bg-white pb-3 text-center shadow-2xl"
  >
    <span class="mt-5 text-3xl font-bold">
      {{ isSignup ? "Sign Up" : "Login" }}
    </span>
    <span
      @click="isSignup = !isSignup"
      class="text-md cursor-pointer select-none rounded-md bg-blue-100 px-1 shadow-sm transition-all duration-100 hover:bg-blue-500 hover:text-white hover:shadow-2xl"
    >
      {{ isSignup ? "Login" : "Sign Up" }}
    </span>

    <div class="w-[90%]">
      <input
        type="email"
        v-model="userCred.email"
        placeholder="Email.."
        class="mx-auto flex h-11 w-full rounded-lg bg-slate-200 p-2 text-xl text-black placeholder-black shadow-lg outline-none"
      />
      <span v-if="errorMessage1" class="text-red-500">
        {{ errorMessage1 }}
      </span>
    </div>

    <div class="w-[90%]" v-if="isSignup">
      <input
        type="text"
        v-model="userCred.username"
        placeholder="Username.."
        class="mx-auto flex h-11 w-full rounded-lg bg-slate-200 p-2 text-xl text-black placeholder-black shadow-lg outline-none"
      />
      <span v-if="errorMessage3" class="text-red-500">
        {{ errorMessage3 }}
      </span>
    </div>

    <div class="w-[90%]">
      <input
        type="password"
        v-model="userCred.password"
        placeholder="Password..."
        class="mx-auto flex h-11 w-full rounded-lg bg-slate-200 p-2 text-xl text-black placeholder-black shadow-lg outline-none"
      />
      <span v-if="errorMessage2" class="text-red-500">
        {{ errorMessage2 }}
      </span>
    </div>

    <div class="m-5 w-[20%]">
      <button
        class="h-[50px] w-full rounded-xl bg-blue-400 text-lg shadow-xl transition-all duration-300 enabled:hover:bg-blue-950 enabled:hover:text-white disabled:text-white disabled:opacity-50"
        @click="onAuth()"
        :disabled="authStore.loadingState"
      >
        {{ isSignup ? "Sign Up" : "Login" }}
      </button>
    </div>
    <span v-if="authStore.errorMessage" class="text-red-500">
      {{ authStore.errorMessage }}
    </span>
  </div>
</template>
