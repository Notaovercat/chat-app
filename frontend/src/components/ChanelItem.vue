<script setup lang="ts">
import type { Chanel } from "@/types/chanel.type";
import { RouterLink } from "vue-router";
interface Chanelprops {
  chanel: Chanel;
  serverId: string;
}
const props = defineProps<Chanelprops>();
const { chanel } = props;
</script>

<template>
  <RouterLink
    class="mx-4 mt-1 flex h-[35px] min-w-[80%] cursor-pointer select-none items-center rounded-sm pl-1 text-center font-bold text-white transition-all duration-200 ease-in-out hover:bg-blue-200 hover:bg-opacity-50 hover:text-slate-50"
    :to="`/server/${serverId}/chat/${chanel.id}`"
    active-class="bg-blue-200 bg-opacity-50 text-slate-50"
  >
    {{ chanel.name }}
  </RouterLink>
</template>
