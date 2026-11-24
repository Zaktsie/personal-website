<script setup lang="ts">
withDefaults(defineProps<{ tone?: 'surface' | 'primary' | 'amber' | 'pink' | 'band' | 'tint', as?: string }>(), { tone: 'surface', as: 'div' })
const tones = {
  surface: 'bg-surface text-ink ring-1 ring-line/70',
  tint: 'bg-surface-2 text-ink',
  primary: 'bg-primary-container text-on-primary-container',
  amber: 'bg-amber-container text-on-amber-container',
  pink: 'bg-pink-container text-on-pink-container',
  band: 'bg-band text-white',
}
</script>

<template>
  <!-- An Android home-screen widget: large radius, tonal fill, no drop shadow. -->
  <component :is="as" class="relative overflow-hidden rounded-[2rem] p-6" :class="tones[tone]">
    <slot />
  </component>
</template>
