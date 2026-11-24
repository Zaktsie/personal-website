<script setup lang="ts">
// Replays (a condensed version of) the real agent session that rebuilt this site.
type Step = { kind: 'you' | 'tool' | 'ok' | 'agent', text: string }
const steps: Step[] = [
  { kind: 'you', text: 'Rebuild my site on Nuxt. Show I\'m a senior full-stack and Android dev, with a blog and an apps showcase.' },
  { kind: 'tool', text: 'Read 23 files in src/' },
  { kind: 'agent', text: 'Plan: Nuxt 4 + Nuxt Content, apps and blog collections, a phone that runs your apps.' },
  { kind: 'tool', text: 'Write app/components/PhoneMock.vue' },
  { kind: 'tool', text: 'Run nuxi typecheck' },
  { kind: 'ok', text: '0 type errors' },
  { kind: 'tool', text: 'Run npm run build' },
  { kind: 'ok', text: '29 routes prerendered' },
  { kind: 'you', text: 'Looks good, but make it feel like a 10x portfolio.' },
  { kind: 'agent', text: 'Turning every section into part of the phone: widgets, quick settings, notifications.' },
]

const shown = ref(steps.length)
const root = ref<HTMLElement>()
let timer: ReturnType<typeof setInterval> | undefined

function replay() {
  clearInterval(timer)
  shown.value = 0
  timer = setInterval(() => {
    shown.value++
    if (shown.value >= steps.length) clearInterval(timer)
  }, 650)
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // Play once when the widget scrolls into view.
  const io = new IntersectionObserver(([e]) => {
    if (e?.isIntersecting) { replay(); io.disconnect() }
  }, { threshold: 0.4 })
  if (root.value) io.observe(root.value)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div ref="root">
    <Widget tone="band" class="flex h-full flex-col">
      <div class="flex items-center justify-between gap-3">
        <p class="flex items-center gap-2 font-semibold">
          <span class="grid size-8 place-items-center rounded-xl bg-pink/90" aria-hidden="true">
            <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" /></svg>
          </span>
          Agentic coding
        </p>
        <button type="button" class="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20" @click="replay">Replay</button>
      </div>
      <p class="mt-3 text-white/75">I pair with coding agents every day. This is the session that rebuilt this site.</p>

      <ol class="mt-5 space-y-2.5 text-[0.95rem]" aria-live="polite">
        <li v-for="(s, i) in steps.slice(0, shown)" :key="i" class="flex gap-3">
          <span
            class="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[0.65rem] font-bold"
            :class="{
              'bg-white text-band': s.kind === 'you',
              'bg-white/15 text-white': s.kind === 'tool',
              'bg-[#22c55e] text-band': s.kind === 'ok',
              'bg-pink text-white': s.kind === 'agent',
            }"
            aria-hidden="true"
          >{{ { you: 'Z', tool: '›', ok: '✓', agent: '✦' }[s.kind] }}</span>
          <span :class="{ 'font-semibold': s.kind === 'you', 'text-white/70': s.kind === 'tool', 'text-[#86efac]': s.kind === 'ok' }">
            <span class="sr-only">{{ { you: 'Me:', tool: 'Agent ran:', ok: 'Result:', agent: 'Agent:' }[s.kind] }}</span>
            {{ s.text }}
          </span>
        </li>
        <li v-if="shown < steps.length" class="flex gap-3 text-white/60" aria-hidden="true">
          <span class="mt-1 size-3 animate-pulse rounded-full bg-pink" />
          Working
        </li>
      </ol>
    </Widget>
  </div>
</template>
