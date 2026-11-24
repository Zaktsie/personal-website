<script setup lang="ts">
useHead({
  titleTemplate: t => (t ? `${t} | Isaac Tsienyane` : 'Isaac Tsienyane, senior full-stack & Android developer'),
})
</script>

<template>
  <div class="flex min-h-screen flex-col overflow-x-clip">
    <a href="#main" class="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink">Skip to content</a>
    <SiteHeader />
    <main id="main" class="flex-1">
      <NuxtPage />
    </main>
    <SiteFooter />
    <CommandPalette />
    <ToastHost />
  </div>
</template>
