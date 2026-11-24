<script setup lang="ts">
const { choice, cycle } = useTheme()
const label = computed(() => ({ system: 'System theme', light: 'Light theme', dark: 'Dark theme' })[choice.value])
</script>

<template>
  <button
    type="button"
    class="inline-flex h-10 items-center gap-2 rounded-full bg-surface-1 px-3 text-sm text-muted transition-colors hover:text-ink"
    :aria-label="`${label}. Switch theme`"
    @click="cycle"
  >
    <svg v-if="choice === 'system'" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor" />
    </svg>
    <svg v-else-if="choice === 'light'" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
    <svg v-else class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" />
    </svg>
    <span class="hidden lg:inline">{{ { system: 'System', light: 'Light', dark: 'Dark' }[choice] }}</span>
  </button>
</template>
