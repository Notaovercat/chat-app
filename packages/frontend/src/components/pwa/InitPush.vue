<script setup lang="ts">
import { onMounted } from "vue";
import axios from "axios";

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

function arrayBufferToBase64(buffer: any) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

onMounted(async () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY as string
          ),
        })
        .then(async function (subscription) {
          // The subscription was successful

          // Extract the keys from the subscription object
          const key = subscription.getKey ? subscription.getKey("p256dh") : "";
          const auth = subscription.getKey ? subscription.getKey("auth") : "";

          await axios.post(`${import.meta.env.VITE_API_URL}/push/subscribe`, {
            subscription: {
              endpoint: subscription.endpoint,
              keys: {
                auth: auth ? arrayBufferToBase64(auth) : "",
                p256dh: key ? arrayBufferToBase64(key) : "",
              },
            },
            userId: localStorage.getItem("userId"),
          });
        })
        .catch(function (err) {
          console.log("Failed to subscribe the user: ", err);
        });
    });
  }
});
</script>

<template></template>
