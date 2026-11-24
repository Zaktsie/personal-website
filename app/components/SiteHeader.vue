<script setup lang="ts">
const palette = useState('palette-open', () => false)
const links = [
  { to: '/apps', label: 'Apps' },
  { to: '/blog', label: 'Writing' },
]
</script>

<template>
  <!-- Floating pill nav, like a Material search bar. -->
  <header class="fixed inset-x-0 top-3 z-40 px-3">
    <div class="mx-auto flex w-full max-w-[74rem] items-center justify-between gap-2 rounded-full bg-surface/85 py-2 pr-2 pl-2.5 shadow-[0_8px_30px_-12px_rgb(10_16_34/0.35)] ring-1 ring-line/70 backdrop-blur-xl">
      <NuxtLink to="/" class="flex items-center gap-2.5 rounded-full pr-2 font-extrabold whitespace-nowrap">
        <span class="grid size-9 place-items-center rounded-full bg-field text-sm text-white" aria-hidden="true">ZT</span>
        <span class="hidden sm:inline">Isaac Tsienyane</span>
      </NuxtLink>
      <nav aria-label="Main" class="flex items-center gap-1">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="rounded-full px-3 py-2 font-semibold text-muted transition-colors hover:bg-surface-1 hover:text-ink [&.router-link-active]:bg-primary-container [&.router-link-active]:text-on-primary-container"
        >
          {{ l.label }}
        </NuxtLink>
        <a href="/#work" class="hidden rounded-full px-3 py-2 font-semibold text-muted transition-colors hover:bg-surface-1 hover:text-ink sm:inline">Work</a>
        <button
          type="button"
          class="inline-flex h-10 items-center gap-2 rounded-full bg-surface-1 px-3 text-muted transition-colors hover:text-ink"
          aria-label="Search the site"
          aria-keyshortcuts="Control+K Meta+K /"
          @click="palette = true"
        >
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <kbd class="hidden text-xs md:inline">Ctrl K</kbd>
        </button>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
