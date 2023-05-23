<script setup lang="ts">
import { useCatsStore } from "@/stores/categories";
import { useServerStore } from "@/stores/servers";
import type { Category } from "@/types/category.type";
import { ref, watch, type Ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import type { Server } from "@/types/server.type";
import CreateCategory from "./CreateCategory.vue";
import CreateChanel from "./CreateChanel.vue";
import ChanelItem from "./ChanelItem.vue";
import { useSideBarStore } from "@/stores/sideBar";
const sideBarStore = useSideBarStore();
const route = useRoute();

const catsStore = useCatsStore();
const categories: Ref<Category[]> = ref([]);

const serverStore = useServerStore();
const server = ref<Server | undefined>();
const isUserOwner = ref(false);

// const chanStore = useChanStore();
// const chanels: Ref<Chanel[]> = ref([]);

const loadComponent = async () => {
  catsStore.loadingState = true;
  categories.value = [];
  serverStore.currentServerId = route.params.serverId as string;

  server.value = await serverStore.getServerById(
    route.params.serverId as string
  );
  if (!server.value) throw new Error();
  serverStore.currentServerName = server.value.name;
  isUserOwner.value = serverStore.checkIfUserServOwner(
    server.value.creatorId,
    localStorage.getItem("userId") as string
  );

  categories.value = await catsStore.getCatsByServer(
    route.params.serverId as string
  );
  catsStore.loadingState = false;
};

watch(
  () => route.params.serverId,
  async () => await loadComponent()
);

onMounted(async () => await loadComponent());
</script>

<template>
  <div class="h-full w-52 flex-col overflow-visible bg-blue-800 shadow-xl">
    <div class="flex flex-col pl-2 text-center text-2xl font-bold text-white">
      <span>{{ server?.name }}</span>
      <small v-if="isUserOwner" class="text-xs"
        >Join Code: {{ server?.joinCode }}</small
      >
    </div>

    <div
      class="mt-2 pl-2 font-bold text-slate-400"
      v-if="!catsStore.loadingState"
      v-for="category of categories"
    >
      <span
        class="cursor-pointer select-none text-white transition-all duration-100 hover:text-blue-100"
      >
        {{ category.name }}
      </span>
      <CreateChanel v-if="isUserOwner" :categoryId="category.id" />
      <div v-for="chanel of category.chanels">
        <ChanelItem :serverId="serverStore.currentServerId" :chanel="chanel" />
      </div>
    </div>

    <div v-else>Loading...</div>
    <CreateCategory v-if="isUserOwner" />
  </div>
</template>
