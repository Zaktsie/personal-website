<script setup lang="ts">
defineProps<{ status: string }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 text-sm"
    :class="status === 'in-development' ? 'text-now' : 'text-muted'"
  >
    <span
      class="size-2 rounded-full"
      :class="{ 'bg-now': status === 'in-development', 'bg-accent': status === 'shipped', 'border border-muted': status === 'archived' }"
      aria-hidden="true"
    />
    {{ statusLabel[status] ?? status }}
  </span>
</template>
