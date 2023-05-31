<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue";

const observer: Ref<IntersectionObserver | null> = ref(null);
const root = ref() as Ref<Element>;
const emits = defineEmits<{
  (e: "intersect", state: boolean): void;
}>();

onMounted(() => {
  observer.value = new IntersectionObserver(([entry]) => {
    if (entry && entry.isIntersecting) {
      emits("intersect", true);
    } else {
      emits("intersect", false);
    }
  });
  observer.value.observe(root.value);
});
</script>

<template>
  <div ref="root" class="mb-10 ml-2 h-2 w-9"></div>
</template>
