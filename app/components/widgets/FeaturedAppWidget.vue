<script setup lang="ts">
import type { PhoneApp } from '~/composables/phone'

const props = defineProps<{ app: PhoneApp }>()
const phoneOpen = useState<PhoneApp | null>('phone-open', () => null)

function openOnPhone() {
  phoneOpen.value = props.app
  document.getElementById('phone')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <Widget class="flex flex-col text-white ring-0" :style="{ backgroundColor: app.color }">
    <div class="absolute -right-12 -bottom-16 size-56 rounded-full bg-white/10" aria-hidden="true" />
    <div class="relative flex items-center justify-between gap-3">
      <p class="font-semibold text-white/85">{{ app.status === 'in-development' ? 'Building right now' : 'Featured app' }}</p>
      <StatusDot :status="app.status" />
    </div>
    <div class="relative mt-5 flex items-center gap-4">
      <AppIcon :title="app.title" :color="app.color" :icon="app.icon" size="md" class="ring-2 ring-white/40" />
      <div>
        <p class="text-3xl leading-none font-extrabold">{{ app.title }}</p>
        <p class="mt-1 text-white/80">{{ app.stack.slice(0, 3).join(', ') }}</p>
      </div>
    </div>
    <p class="relative mt-4 max-w-[44ch] text-lg text-white/90">{{ app.tagline }}</p>
    <div class="relative mt-auto flex flex-wrap gap-2 pt-6">
      <button type="button" class="rounded-full bg-white px-4 py-2 font-semibold" :style="{ color: app.color }" @click="openOnPhone">Open on the phone</button>
      <NuxtLink :to="app.path" class="rounded-full border-2 border-white/60 px-4 py-1.5 font-semibold hover:border-white">Read the case study</NuxtLink>
    </div>
  </Widget>
</template>
