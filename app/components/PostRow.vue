<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content'

defineProps<{ post: BlogCollectionItem }>()
</script>

<template>
  <NuxtLink :to="post.path" class="group grid gap-1 border-t border-line py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
    <time :datetime="new Date(post.date).toISOString()" class="text-muted">{{ formatDate(post.date, 'short') }}</time>
    <span>
      <span class="block text-xl font-bold group-hover:text-accent">{{ post.title }}</span>
      <span class="mt-1 block max-w-[65ch] text-muted">{{ post.description }}</span>
    </span>
  </NuxtLink>
</template>
