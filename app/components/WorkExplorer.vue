<script setup lang="ts">
import type { AppsCollectionItem } from '@nuxt/content'

type Role = { title: string, org: string, location: string, period: string, description: string, bullets: string[], tags: string[] }
const props = defineProps<{ apps: AppsCollectionItem[], roles: Role[] }>()

const active = ref('all')
const filter = computed(() => techFilters.find(f => f.id === active.value)!)
const expanded = ref<string | null>(props.roles[0]?.org ?? null)

const appText = (a: AppsCollectionItem) => [a.title, ...a.stack, ...a.platforms].join(' ')
const counts = computed(() => Object.fromEntries(techFilters.map((f) => {
  if (!f.match) return [f.id, null]
  return [f.id, props.apps.filter(a => f.match!.test(appText(a))).length
    + props.roles.reduce((n, r) => n + r.bullets.filter(b => f.match!.test(b)).length, 0)]
})))

const view = computed(() => props.roles.map((role) => {
  const m = filter.value.match
  const bullets = m ? role.bullets.filter(b => m.test(b)) : role.bullets
  return { role, bullets, relevant: !m || bullets.length > 0 || role.tags.some(t => m.test(t)) }
}))
const matchingApps = computed(() => {
  const m = filter.value.match
  return m ? props.apps.filter(a => m.test(appText(a))) : props.apps.slice(0, 5)
})

const orgColors: Record<string, string> = { 'MiWay Insurance Limited': '#2141d0', 'Exclusive Books': '#c2414b', 'inSite Education': '#0f8a6b' }
const initials = (s: string) => s.split(/\s+/).slice(0, 2).map(w => w[0]).join('')

const icons: Record<string, string> = {
  all: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  android: 'M7 10h10v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1zM7 10a5 5 0 0 1 10 0M9 4l1 2M15 4l-1 2M5 11v5M19 11v5',
  ios: 'M12 7c-1-2 0-4 2-4 0 2-1 3-2 4zM17 13c0-2 2-3 2-3-1-2-3-2-4-2s-2 1-3 1-2-1-3-1c-2 0-4 2-4 5 0 4 3 8 5 8 1 0 2-1 3-1s2 1 3 1c1 0 3-2 4-5-2-1-3-2-3-3z',
  vue: 'M2 4h4l6 10 6-10h4L12 21zM7 4h3l2 3 2-3h3',
  php: 'M4 7h16v10H4zM8 10v4M8 10h1.5a1 1 0 0 1 0 2H8M13 10v4M16 10v4M13 12h3',
  firebase: 'M5 19 8 3l4 7 2-4 5 13-7 3z',
  apis: 'M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16',
  testing: 'M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3',
}
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
    <div>
      <!-- Quick settings: each tile is a filter. -->
      <div class="rounded-[2rem] bg-surface-1 p-3">
        <ul class="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Filter my work by technology">
          <li v-for="f in techFilters" :key="f.id">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-[1.4rem] p-3 text-left transition-colors"
              :class="active === f.id ? 'bg-accent text-accent-ink' : 'bg-surface text-ink hover:bg-surface-2'"
              :aria-pressed="active === f.id"
              @click="active = f.id"
            >
              <svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="icons[f.id]" /></svg>
              <span class="min-w-0">
                <span class="block truncate text-sm leading-tight font-bold">{{ f.label }}</span>
                <span class="block text-xs opacity-75">{{ counts[f.id] === null ? 'All work' : `${counts[f.id]} matches` }}</span>
              </span>
            </button>
          </li>
        </ul>
      </div>

      <!-- Notification shade: one notification per role. -->
      <div class="mt-6 flex items-baseline justify-between">
        <h3 class="text-xl font-extrabold">Experience</h3>
        <button v-if="active !== 'all'" type="button" class="font-semibold text-accent" @click="active = 'all'">Clear filter</button>
      </div>
      <p class="sr-only" aria-live="polite">Showing {{ filter.label }}</p>
      <ul class="mt-3 space-y-2">
        <li
          v-for="{ role, bullets, relevant } in view"
          :key="role.org"
          class="rounded-[1.75rem] bg-surface ring-1 ring-line/70 transition-opacity duration-300"
          :class="relevant ? '' : 'opacity-40'"
        >
          <button
            type="button"
            class="flex w-full items-start gap-4 p-5 text-left"
            :aria-expanded="expanded === role.org"
            @click="expanded = expanded === role.org ? null : role.org"
          >
            <span class="grid size-11 shrink-0 place-items-center rounded-full text-sm font-extrabold text-white" :style="{ backgroundColor: orgColors[role.org] ?? '#15213b' }" aria-hidden="true">{{ initials(role.org) }}</span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm text-muted">{{ role.org }}, {{ role.period }}</span>
              <span class="mt-0.5 block text-lg leading-snug font-bold">{{ role.title }}</span>
              <span class="mt-1 block text-muted" :class="expanded === role.org ? '' : 'line-clamp-1'">{{ role.description }}</span>
            </span>
            <svg class="mt-1 size-5 shrink-0 text-muted transition-transform" :class="{ 'rotate-180': expanded === role.org }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <Transition name="expand">
            <div v-if="expanded === role.org" class="grid grid-rows-[1fr]">
              <div class="overflow-hidden px-5 pb-5 sm:pl-20">
                <p v-if="filter.match" class="mb-2 text-sm font-semibold text-accent">{{ bullets.length }} of {{ role.bullets.length }} highlights use {{ filter.label }}</p>
                <ul class="list-disc space-y-2 pl-5 marker:text-accent">
                  <li v-for="b in bullets" :key="b">{{ b }}</li>
                </ul>
                <p v-if="!bullets.length" class="text-muted">No highlights for {{ filter.label }} in this role.</p>
                <ul class="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                  <li v-for="t in role.tags" :key="t" class="rounded-full px-2.5 py-0.5 text-sm" :class="filter.match?.test(t) ? 'bg-accent text-accent-ink' : 'bg-surface-1 text-muted'">{{ t }}</li>
                </ul>
              </div>
            </div>
          </Transition>
        </li>
      </ul>
    </div>

    <div class="lg:sticky lg:top-24 lg:self-start">
      <div class="rounded-[2rem] bg-surface-1 p-5">
        <h3 class="px-1 text-xl font-extrabold">{{ filter.match ? `Apps with ${filter.label}` : 'Apps' }}</h3>
        <TransitionGroup tag="div" name="fade" class="mt-3 space-y-1">
          <AppRow v-for="app in matchingApps" :key="app.path" :app="app" />
        </TransitionGroup>
        <p v-if="!matchingApps.length" class="px-1 py-4 text-muted">
          No public {{ filter.label }} apps yet. That work lives inside MiWay's apps, so open a MiWay notification on the left.
        </p>
        <NuxtLink to="/apps" class="mt-3 inline-block rounded-full bg-surface px-4 py-2 font-semibold hover:bg-surface-2">See every app</NuxtLink>
      </div>
    </div>
  </div>
</template>
