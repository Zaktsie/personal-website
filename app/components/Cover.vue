<script setup lang="ts">
/**
 * Generative "wallpaper" art built from the same shapes as the phone's wallpaper.
 * Deterministic per seed, so a post always gets the same cover.
 */
const props = withDefaults(defineProps<{ seed: string, base?: string }>(), { base: '#0f1a3d' })

const palette = ['#3a63ff', '#ffb547', '#ff3ea5', '#2141d0', '#7fa0ff', '#ffd9ec']

function rand(seed: string) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h ^= h << 13; h ^= h >>> 17; h ^= h << 5
    return ((h >>> 0) % 10000) / 10000
  }
}

const shapes = computed(() => {
  const r = rand(props.seed)
  const pick = () => palette[Math.floor(r() * palette.length)]!
  return {
    circle: { cx: 60 + r() * 280, cy: 40 + r() * 140, r: 70 + r() * 70, fill: pick() },
    pill: { x: r() * 260, y: 120 + r() * 80, w: 180 + r() * 120, rot: -30 + r() * 60, fill: pick() },
    dot: { cx: 40 + r() * 320, cy: 30 + r() * 180, r: 18 + r() * 26, fill: pick() },
    arc: { cx: r() > 0.5 ? 400 : 0, fill: pick() },
  }
})
</script>

<template>
  <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" class="block size-full" aria-hidden="true">
    <rect width="400" height="240" :fill="base" />
    <circle :cx="shapes.arc.cx" cy="240" r="150" :fill="shapes.arc.fill" opacity="0.9" />
    <circle :cx="shapes.circle.cx" :cy="shapes.circle.cy" :r="shapes.circle.r" :fill="shapes.circle.fill" />
    <rect
      :x="shapes.pill.x" :y="shapes.pill.y" :width="shapes.pill.w" height="56" rx="28"
      :fill="shapes.pill.fill"
      :transform="`rotate(${shapes.pill.rot} ${shapes.pill.x + shapes.pill.w / 2} ${shapes.pill.y + 28})`"
    />
    <circle :cx="shapes.dot.cx" :cy="shapes.dot.cy" :r="shapes.dot.r" fill="none" stroke="white" stroke-width="6" opacity="0.85" />
  </svg>
</template>
