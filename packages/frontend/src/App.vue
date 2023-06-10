<script setup lang="ts">
import { RouterView } from "vue-router";
import ReloadPWA from "@/components/additional/ReloadPWA.vue";
import { onMounted } from "vue";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

onMounted(() => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY as string
          ),
        })
        .then(function (subscription) {
          // The subscription was successful
          console.log("User is subscribed:", subscription);
        })
        .catch(function (err) {
          console.log("Failed to subscribe the user: ", err);
        });
    });
  }
});
</script>

<template>
  <ReloadPWA />
  <RouterView />
</template>
