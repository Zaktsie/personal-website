<script setup lang="ts">
import type { PhoneApp } from '~/composables/phone'

defineProps<{ app: PhoneApp, canGoBack?: boolean }>()
defineEmits<{ back: [] }>()
</script>

<template>
  <!-- An app "opened" inside the phone: a compact preview of the case study. -->
  <div class="flex h-full flex-col bg-white text-[#15213b]">
    <div class="px-5 pt-11 pb-5 text-white" :style="{ backgroundColor: app.color }">
      <button
        v-if="canGoBack"
        type="button"
        class="-ml-1.5 mb-3 grid size-8 place-items-center rounded-full hover:bg-white/15"
        aria-label="Back to home screen"
        @click="$emit('back')"
      >
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <div class="flex items-center gap-3">
        <AppIcon :title="app.title" :color="app.color" :icon="app.icon" size="sm" class="ring-2 ring-white/40" />
        <div class="min-w-0">
          <p class="truncate text-lg leading-tight font-bold">{{ app.title }}</p>
          <p class="text-[13px] opacity-85">{{ app.platforms.map(p => platformLabel[p]).join(', ') }}</p>
        </div>
      </div>
    </div>

    <img v-if="app.screenshots?.length" :src="app.screenshots[0]" :alt="`${app.title} screenshot`" class="min-h-0 flex-1 object-cover object-top">
    <div v-else class="min-h-0 flex-1 space-y-4 overflow-hidden px-5 pt-4 text-[13.5px] leading-snug">
      <p class="inline-flex items-center gap-1.5 font-semibold" :class="app.status === 'in-development' ? 'text-[#9a5d00]' : 'text-[#2141d0]'">
        <span class="size-2 rounded-full" :class="app.status === 'in-development' ? 'bg-[#ffb547]' : 'bg-[#2141d0]'" aria-hidden="true" />
        {{ statusLabel[app.status] }}
      </p>
      <p class="font-semibold">{{ app.tagline }}</p>
      <p class="line-clamp-4 text-[#57617a]">{{ app.description }}</p>
      <ul class="flex flex-wrap gap-1.5" aria-label="Built with">
        <li v-for="s in app.stack.slice(0, 5)" :key="s" class="rounded-full bg-[#eef0f4] px-2.5 py-1 text-[12px]">{{ s }}</li>
      </ul>
    </div>

    <div class="space-y-2 px-5 pt-3 pb-9">
      <NuxtLink v-if="$route.path !== app.path" :to="app.path" class="block rounded-full py-2.5 text-center text-sm font-semibold text-white" :style="{ backgroundColor: app.color }">
        Read the case study
      </NuxtLink>
      <a v-if="app.github" :href="app.github" target="_blank" rel="noopener noreferrer" class="block py-1 text-center text-[13px] font-semibold underline underline-offset-2" :style="{ color: app.color }">View source on GitHub</a>
    </div>
  </div>
</template>
