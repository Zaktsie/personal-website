<script setup lang="ts">
// Analog clock in my timezone, so visitors know when I'm likely to reply.
const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => (now.value = new Date()), 1000)
})
onBeforeUnmount(() => clearInterval(timer))

const parts = computed(() => {
  if (!now.value) return { h: 10, m: 8, s: 0, label: '' }
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false })
  const [h, m, s] = f.format(now.value).split(':').map(Number) as [number, number, number]
  return { h, m, s, label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` }
})
const awake = computed(() => parts.value.h >= 7 && parts.value.h < 22)
</script>

<template>
  <Widget tone="primary" class="flex flex-col items-center text-center">
    <svg viewBox="0 0 100 100" class="size-28" role="img" :aria-label="parts.label ? `${parts.label} in Gauteng` : 'Clock'">
      <circle cx="50" cy="50" r="48" class="fill-surface" />
      <circle v-for="i in 12" :key="i" :cx="50 + 38 * Math.sin((i * Math.PI) / 6)" :cy="50 - 38 * Math.cos((i * Math.PI) / 6)" r="2" class="fill-on-primary-container/40" />
      <line x1="50" y1="50" x2="50" y2="26" stroke-width="6" stroke-linecap="round" class="stroke-on-primary-container" :transform="`rotate(${(parts.h % 12) * 30 + parts.m * 0.5} 50 50)`" />
      <line x1="50" y1="50" x2="50" y2="16" stroke-width="4" stroke-linecap="round" class="stroke-accent" :transform="`rotate(${parts.m * 6} 50 50)`" />
      <line x1="50" y1="56" x2="50" y2="14" stroke-width="1.5" stroke-linecap="round" stroke="#ff3ea5" :transform="`rotate(${parts.s * 6} 50 50)`" />
      <circle cx="50" cy="50" r="4" fill="#ff3ea5" />
    </svg>
    <p class="mt-3 text-2xl font-extrabold">{{ parts.label || 'Gauteng' }}</p>
    <p class="text-sm opacity-80">in Gauteng, South Africa</p>
    <p class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface/60 px-3 py-1 text-sm font-semibold">
      <span class="size-2 rounded-full" :class="awake ? 'bg-[#22c55e]' : 'bg-muted'" aria-hidden="true" />
      {{ awake ? 'Likely online' : 'Probably asleep' }}
    </p>
  </Widget>
</template>
