<script setup lang="ts">
const { toasts } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex flex-col items-center gap-2 px-4" aria-live="polite">
    <TransitionGroup name="fade">
      <p v-for="t in toasts" :key="t.id" class="rounded-full bg-ink px-5 py-2.5 text-bg shadow-lg">{{ t.text }}</p>
    </TransitionGroup>
  </div>
</template>
