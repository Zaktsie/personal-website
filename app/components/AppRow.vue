<script setup lang="ts">
import type { AppsCollectionItem } from '@nuxt/content'

defineProps<{ app: AppsCollectionItem }>()
</script>

<template>
  <NuxtLink
    :to="app.path"
    class="group flex items-start gap-4 rounded-[1.5rem] p-3 transition-colors hover:bg-surface"
  >
    <AppIcon :title="app.title" :color="app.color" :icon="app.icon" />
    <span class="min-w-0 flex-1">
      <span class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span class="text-xl font-bold group-hover:text-accent">{{ app.title }}</span>
        <StatusPill :status="app.status" />
      </span>
      <span class="mt-1 block text-muted">{{ app.tagline }}</span>
      <span class="mt-2 block text-sm text-muted">
        {{ app.platforms.map(p => platformLabel[p]).join(', ') }} &nbsp;/&nbsp; {{ app.stack.slice(0, 4).join(', ') }}
      </span>
    </span>
  </NuxtLink>
</template>
