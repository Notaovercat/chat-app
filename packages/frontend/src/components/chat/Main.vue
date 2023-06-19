<script setup lang="ts"></script>

<template>
  <div class="mx-2 mt-10 flex h-full w-full flex-col p-4 md:mt-0 md:p-8">
    <!-- CHAT WINDOW -->
    <div class="w-full flex-grow overflow-y-auto rounded-lg bg-slate-50">
      <div
        class="-z-10 mb-16 min-h-[600px] w-full overflow-y-scroll scroll-smooth rounded-lg bg-slate-50 md:-z-0 md:mb-0 md:h-full md:max-h-[880px]"
        ref="messageListRef"
      ></div>
    </div>
  </div>
</template>
