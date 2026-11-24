<script setup lang="ts">
import type { PhoneApp } from '~/composables/phone'

const props = withDefaults(defineProps<{
  apps?: PhoneApp[]
  building?: string
  /** When false the phone only shows the open app (no home screen to go back to). */
  launcher?: boolean
}>(), { apps: () => [], launcher: true })

const open = defineModel<PhoneApp | null>('open', { default: null })

const screen = ref<HTMLElement>()
const origin = ref('50% 50%')
const time = ref('09:41')
const date = ref('')
let timer: ReturnType<typeof setInterval> | undefined

function tick() {
  const d = new Date()
  time.value = d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })
  date.value = d.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' })
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value && props.launcher) open.value = null
}

onMounted(() => {
  tick()
  timer = setInterval(tick, 15_000)
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('keydown', onKey)
})

function launch(app: PhoneApp, e: MouseEvent) {
  // Grow the app out of the icon that was tapped.
  const s = screen.value?.getBoundingClientRect()
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect()
  if (s) origin.value = `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`
  open.value = app
}

function home() {
  if (props.launcher) open.value = null
}

const dock = [
  { label: 'Email', href: `mailto:${EMAIL}`, path: 'M3 6h18v12H3z M3 7l9 6 9-6' },
  { label: 'GitHub', href: 'https://github.com/Zaktsie', path: 'M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.3 5.8 2.6 5.8 2.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/isaac-tsienyane-98b59885/', path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' },
  { label: 'Writing', href: '/blog', path: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
]
</script>

<template>
  <div
    class="relative mx-auto aspect-[9/19.5] w-[min(19.5rem,82vw)] shrink-0 rounded-[3.1rem] bg-[#070b16] p-[11px] shadow-[0_50px_90px_-35px_rgb(0_0_0/0.65),inset_0_0_0_1.5px_rgb(255_255_255/0.1)]"
    role="group"
    aria-label="Interactive phone showing my apps"
  >
    <!-- Side buttons -->
    <span class="absolute top-28 -right-[3px] h-16 w-[3px] rounded-r bg-[#070b16]" aria-hidden="true" />
    <span class="absolute top-48 -right-[3px] h-10 w-[3px] rounded-r bg-[#070b16]" aria-hidden="true" />

    <div ref="screen" class="relative isolate flex h-full flex-col overflow-hidden rounded-[2.5rem] bg-[#0f1a3d] text-white">
      <!-- Wallpaper -->
      <div class="absolute -top-20 -right-24 -z-10 size-80 rounded-full bg-[#3a63ff]" aria-hidden="true" />
      <div class="absolute -bottom-28 -left-20 -z-10 size-96 rounded-full bg-amber/95" aria-hidden="true" />
      <div class="absolute top-[38%] -left-10 -z-10 size-28 rounded-full bg-[#ff3ea5]/80" aria-hidden="true" />

      <!-- Status bar -->
      <div class="relative z-30 flex items-center justify-between px-6 pt-3 text-[12.5px] font-semibold" :class="open ? 'text-white' : ''">
        <span>{{ time }}</span>
        <span class="absolute top-2.5 left-1/2 size-[13px] -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
        <span class="flex items-center gap-1" aria-hidden="true">
          <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22h20V2z" /></svg>
          <svg class="size-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21 0 8.5a17 17 0 0 1 24 0z" /></svg>
          <svg class="h-3.5 w-6" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="21" height="12" rx="3" /><rect x="3" y="3" width="14" height="8" rx="1.5" fill="currentColor" stroke="none" /><path d="M24 5v4" /></svg>
        </span>
      </div>

      <!-- Home screen -->
      <template v-if="launcher">
        <div class="px-6 pt-7">
          <p class="text-[1.35rem] leading-tight font-semibold">{{ date || 'Welcome' }}</p>
          <p v-if="building" class="mt-1 flex items-center gap-1.5 text-[13px] text-white/85">
            <span class="size-1.5 rounded-full bg-amber" aria-hidden="true" />
            Building {{ building }}
          </p>
        </div>

        <ul class="mt-auto grid grid-cols-4 gap-x-1 gap-y-4 px-3.5" aria-label="Apps">
          <li v-for="(app, i) in apps" :key="app.path" class="pop" :style="{ '--i': i }">
            <button
              type="button"
              class="group flex w-full flex-col items-center gap-1.5 rounded-xl py-0.5 focus-visible:outline-white"
              :aria-label="`Open ${app.title}`"
              @click="launch(app, $event)"
            >
              <AppIcon :title="app.title" :color="app.color" :icon="app.icon" size="xs" class="ring-1 ring-white/25 transition-transform group-hover:-translate-y-0.5 group-active:scale-90" />
              <span class="w-full truncate px-0.5 text-center text-[10.5px] font-medium [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">{{ app.title }}</span>
            </button>
          </li>
        </ul>

        <ul class="mx-3 mt-5 mb-2 grid grid-cols-4 rounded-[1.75rem] bg-white/20 p-2 backdrop-blur-md" aria-label="Dock">
          <li v-for="(d, i) in dock" :key="d.label" class="pop flex justify-center" :style="{ '--i': apps.length + i }">
            <a
              :href="d.href"
              :target="d.href.startsWith('http') ? '_blank' : undefined"
              :rel="d.href.startsWith('http') ? 'noopener noreferrer' : undefined"
              class="grid size-[2.9rem] place-items-center rounded-full bg-white text-[#15213b] transition-transform hover:-translate-y-0.5 active:scale-90"
              :aria-label="d.label"
            >
              <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="d.path" /></svg>
            </a>
          </li>
        </ul>
      </template>

      <!-- Open app -->
      <Transition name="app-open">
        <div v-if="open" :key="open.path" class="absolute inset-0 z-20" :style="{ transformOrigin: origin }">
          <PhoneScreenApp :app="open" :can-go-back="launcher" @back="home" />
        </div>
      </Transition>

      <!-- Gesture bar -->
      <div class="relative z-30 flex justify-center pt-1 pb-2" :class="{ 'mt-auto': !launcher }">
        <button
          type="button"
          class="h-[5px] w-28 rounded-full transition-colors"
          :class="open ? 'bg-[#15213b]/70' : 'bg-white/85'"
          :aria-label="launcher ? 'Go to home screen' : 'Home'"
          :disabled="!launcher"
          @click="home"
        />
      </div>
    </div>
  </div>
</template>
