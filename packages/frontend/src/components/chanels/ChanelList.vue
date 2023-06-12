<script setup lang="ts">
import { useCatsStore } from "@/stores/categories";
import { useServerStore } from "@/stores/servers";
import type { Category } from "@/types/category.type";
import { ref, watch, type Ref, onBeforeMount } from "vue";
import { useRoute } from "vue-router";
import type { Server } from "@/types/server.type";
import CreateCategory from "@/components/chanels/CreateCategory.vue";
import CreateChanel from "@/components/chanels/CreateChanel.vue";
import ChanelItem from "@/components/chanels/ChanelItem.vue";
const route = useRoute();

const catsStore = useCatsStore();
const categories: Ref<Category[]> = ref([]);
const serverId = ref("");
const serverStore = useServerStore();
const server = ref<Server | undefined>();
const isUserOwner = ref(false);

const loadComponent = async () => {
  serverId.value = route.params.serverId as string;
  catsStore.loadingState = true;
  serverStore.currentServerId = serverId.value;
  server.value = await serverStore.getServerById(serverId.value);
  if (!server.value) throw new Error();
  serverStore.currentServerName = server.value.name;
  isUserOwner.value = serverStore.checkIfUserServOwner(
    server.value.creatorId,
    localStorage.getItem("userId") as string
  );
  await catsStore.getCatsByServer(server.value.id);
  categories.value = catsStore.categories;

  catsStore.loadingState = false;
};

watch(
  () => route.params.serverId,
  async () => await loadComponent()
);

watch(
  () => catsStore.categories,
  async () => (categories.value = catsStore.categories)
);

onBeforeMount(async () => await loadComponent());
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
      <CreateChanel
        v-if="isUserOwner"
        :categoryId="category.id"
        :server-id="serverId"
      />
      <div v-for="chanel of category.chanels">
        <ChanelItem :serverId="serverStore.currentServerId" :chanel="chanel" />
      </div>
    </div>

    <div v-else>Loading...</div>
    <CreateCategory v-if="isUserOwner" />
  </div>
</template>
