<script setup lang="ts">
type Item = { title: string, by: string, color: string, note?: string }
defineProps<{ book: Item }>()
</script>

<template>
  <Widget tone="amber" class="flex flex-col">
    <p class="flex items-center gap-2 text-sm font-semibold">
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
      Reading now
    </p>
    <div class="mt-5 flex items-end gap-4">
      <!-- Book cover: a tilted hardback with a spine highlight -->
      <div class="relative h-32 w-22 shrink-0 -rotate-3 rounded-r-md rounded-l-sm p-2 text-white shadow-[inset_4px_0_0_rgb(255_255_255/0.2),6px_8px_0_rgb(0_0_0/0.12)]" :style="{ backgroundColor: book.color }" aria-hidden="true">
        <p class="text-[0.7rem] leading-tight font-extrabold">{{ book.title }}</p>
        <p class="absolute bottom-2 left-2 text-[0.55rem] opacity-80">{{ book.by }}</p>
      </div>
      <div class="min-w-0 pb-1">
        <p class="text-xl leading-tight font-extrabold">{{ book.title }}</p>
        <p class="mt-1 text-sm opacity-80">{{ book.by }}</p>
      </div>
    </div>
    <p v-if="book.note" class="mt-4 font-serif">{{ book.note }}</p>
  </Widget>
</template>
