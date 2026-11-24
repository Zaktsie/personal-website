<script setup lang="ts">
defineProps<{ status: string }>()
</script>

<template>
  <span class="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-2.5 py-1 text-sm font-semibold text-white">
    <span class="relative flex size-2" aria-hidden="true">
      <span v-if="status === 'in-development'" class="absolute inset-0 animate-ping rounded-full bg-amber opacity-75" />
      <span class="relative size-2 rounded-full" :class="status === 'in-development' ? 'bg-amber' : 'bg-white'" />
    </span>
    {{ statusLabel[status] ?? status }}
  </span>
</template>
