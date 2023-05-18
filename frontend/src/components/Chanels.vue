<script setup lang="ts">
import { useCatsStore } from "@/stores/categories";
import { useServerStore } from "@/stores/servers";
import type { Category } from "@/types/category.type";
// import { useChanStore } from "@/stores/chanels";
// import type { Chanel } from "@/types/channel.type";
import { ref, watch, type Ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Chanel from "./Chanel.vue";
import type { Server } from "@/types/server.type";

const route = useRoute();

const catsStore = useCatsStore();
const categories: Ref<Category[]> = ref([]);

const serverStore = useServerStore();
const server = ref<Server>();

// const chanStore = useChanStore();
// const chanels: Ref<Chanel[]> = ref([]);

const loadComponent = async () => {
  server.value = await serverStore.getServerById(route.params.id as string);
  categories.value = await catsStore.getCatsByServer(route.params.id as string);
};

watch(
  () => route.params.id as string,
  async () => loadComponent()
);

onMounted(async () => loadComponent());
</script>

<template>
  <div
    class="fixed bottom-0 left-0 top-0 h-full w-52 flex-col overflow-visible bg-blue-800 pl-2 shadow-xl"
  >
    <div class="text-center text-2xl font-bold text-white">
      <span>{{ server?.name }}</span>
    </div>

    <div class="mt-2 font-bold text-slate-400" v-for="category of categories">
      <span
        class="cursor-pointer select-none text-white transition-all duration-100 hover:text-blue-100"
      >
        {{ category.name }}
      </span>
      <div v-for="chanel of category.chanels">
        <Chanel :chanel="chanel" />
      </div>
    </div>
  </div>
</template>
