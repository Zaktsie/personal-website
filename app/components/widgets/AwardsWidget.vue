<script setup lang="ts">
defineProps<{ honors: { name: string, org: string }[] }>()
</script>

<template>
  <Widget tone="pink" class="flex flex-col">
    <p class="flex items-center gap-2 font-semibold">
      <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" /></svg>
      Hackathons
    </p>
    <ul class="mt-4 space-y-4">
      <li v-for="h in honors.slice(0, 2)" :key="h.name">
        <p class="text-xl leading-tight font-extrabold">{{ h.name.split(' — ')[0] }}</p>
        <p class="text-sm opacity-80">{{ h.org }}</p>
      </li>
    </ul>
  </Widget>
</template>
