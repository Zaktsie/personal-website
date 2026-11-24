<script setup lang="ts">
type Item = { title: string, by: string, platform?: string, color: string, note?: string }
defineProps<{ game: Item }>()

// A media-notification style widget. The bar counts time since you landed on the page.
const seconds = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => { timer = setInterval(() => seconds.value++, 1000) })
onBeforeUnmount(() => clearInterval(timer))
const clock = computed(() => `${Math.floor(seconds.value / 60)}:${String(seconds.value % 60).padStart(2, '0')}`)
</script>

<template>
  <Widget tone="band" class="flex flex-col gap-5">
    <div class="absolute -top-16 -right-10 size-56 rounded-full opacity-60" :style="{ backgroundColor: game.color }" aria-hidden="true" />
    <div class="relative flex items-center gap-2 text-sm text-white/75">
      <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="7" width="20" height="12" rx="4" /><path d="M7 11v4M5 13h4" /><circle cx="16" cy="12" r="1" fill="currentColor" /><circle cx="18" cy="14" r="1" fill="currentColor" /></svg>
      Now playing on {{ game.platform ?? 'console' }}
    </div>
    <div class="relative flex items-center gap-4">
      <div class="grid size-20 shrink-0 place-items-center rounded-2xl text-3xl font-extrabold" :style="{ background: `linear-gradient(135deg, ${game.color}, #ffb547)` }" aria-hidden="true">VI</div>
      <div class="min-w-0">
        <p class="text-2xl leading-tight font-extrabold">{{ game.title }}</p>
        <p class="text-white/75">{{ game.by }}</p>
      </div>
    </div>
    <div class="relative">
      <div class="h-1.5 overflow-hidden rounded-full bg-white/20">
        <div class="h-full rounded-full bg-white transition-[width] duration-1000 ease-linear" :style="{ width: `${Math.min(100, (seconds / 180) * 100)}%` }" />
      </div>
      <div class="mt-2 flex justify-between text-sm text-white/70">
        <span>{{ clock }}</span>
        <span>Your visit so far</span>
      </div>
    </div>
    <div class="eq relative flex h-6 items-end gap-1" aria-hidden="true">
      <span v-for="n in 4" :key="n" class="block h-full w-1.5 rounded-full bg-amber" />
    </div>
  </Widget>
</template>
