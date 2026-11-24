<script setup lang="ts">
import type { PhoneApp } from '~/composables/phone'

const { data: apps } = await useAsyncData('apps', () => queryCollection('apps').order('order', 'ASC').all())

const filters = [
  { value: 'all', label: 'All' },
  { value: 'android', label: 'Android' },
  { value: 'ios', label: 'iOS' },
  { value: 'web', label: 'Web' },
  { value: 'backend', label: 'Backend' },
] as const
type Filter = (typeof filters)[number]['value']
const active = ref<Filter>('all')

const available = computed(() => filters.filter(f => f.value === 'all' || apps.value?.some(a => a.platforms.includes(f.value))))
const visible = computed(() => (apps.value ?? []).filter(a => active.value === 'all' || a.platforms.includes(active.value)))
const groups = computed(() => (['in-development', 'shipped', 'archived'] as const)
  .map(status => ({ status, items: visible.value.filter(a => a.status === status) }))
  .filter(g => g.items.length))

// The phone previews whichever app is hovered or focused in the list.
const preview = ref<PhoneApp | null>(apps.value?.[0] ?? null)

useSeoMeta({
  title: 'Apps',
  description: 'Android, web and backend apps Isaac Tsienyane has built or is building.',
})
</script>

<template>
  <div>
    <section class="bg-field text-white">
      <div class="wrap pt-32 pb-16 sm:pb-20">
        <h1 class="text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.035em]">Apps</h1>
        <p class="mt-5 max-w-[56ch] text-xl text-white/85">
          Things I've shipped and things I'm still building. Point at one to preview it on the phone, or open its case study.
        </p>
        <div v-if="available.length > 2" class="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter by platform">
          <button
            v-for="f in available"
            :key="f.value"
            type="button"
            class="rounded-full border-2 px-4 py-1.5 font-semibold transition-colors"
            :class="active === f.value ? 'border-white bg-white text-field' : 'border-white/50 hover:border-white'"
            :aria-pressed="active === f.value"
            @click="active = f.value"
          >
            {{ f.label }}
          </button>
        </div>
      </div>
    </section>

    <div class="wrap grid gap-16 pt-4 lg:grid-cols-[1fr_auto]">
      <div>
        <section v-for="g in groups" :key="g.status" class="mt-12" :aria-labelledby="`group-${g.status}`">
          <h2 :id="`group-${g.status}`" class="flex items-baseline gap-3 text-2xl font-extrabold">
            {{ statusLabel[g.status] }}
            <span class="font-normal text-muted">{{ g.items.length }}</span>
          </h2>
          <div class="mt-4 space-y-1">
            <div
              v-for="app in g.items"
              :key="app.path"
              class="py-2"
              @mouseenter="preview = app"
              @focusin="preview = app"
            >
              <AppRow :app="app" />
            </div>
          </div>
        </section>
        <p v-if="!groups.length" class="mt-14 text-lg text-muted">
          Nothing here for this platform yet. <button type="button" class="link" @click="active = 'all'">Show all apps</button>
        </p>
      </div>

      <aside class="hidden pt-12 lg:block" aria-label="Preview">
        <div class="sticky top-6">
          <PhoneMock v-model:open="preview" :launcher="false" />
        </div>
      </aside>
    </div>
  </div>
</template>
