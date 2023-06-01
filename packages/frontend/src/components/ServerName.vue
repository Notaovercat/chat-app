<script setup lang="ts">
interface ServerNameProps {
  name: string;
}

const props = defineProps<ServerNameProps>();
const name = props.name;
</script>

<template>
  <div
    class="absolute z-50 ml-[3.5rem] flex max-h-5 min-w-0 max-w-screen-sm items-center justify-center whitespace-nowrap rounded-md bg-black shadow-xl"
  >
    <h1 class="px-1 text-white">{{ name }}</h1>
  </div>
</template>
