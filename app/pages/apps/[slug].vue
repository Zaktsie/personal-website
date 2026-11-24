<script setup lang="ts">
import type { PhoneApp } from '~/composables/phone'

const route = useRoute()
const slug = route.params.slug as string
const { data: app } = await useAsyncData(`app-${slug}`, () => queryCollection('apps').path(`/apps/${slug}`).first())

if (!app.value) {
  throw createError({ statusCode: 404, statusMessage: 'App not found', fatal: true })
}

const { data: siblings } = await useAsyncData(`app-siblings-${slug}`, () => queryCollection('apps').select('title', 'path', 'order').order('order', 'ASC').all())
const index = computed(() => siblings.value?.findIndex(s => s.path === app.value?.path) ?? -1)
const next = computed(() => siblings.value?.[(index.value + 1) % (siblings.value?.length || 1)])

useSeoMeta({
  title: app.value.title,
  description: app.value.description,
  ogTitle: `${app.value.title} | Isaac Tsienyane`,
  ogDescription: app.value.tagline,
})

const previewApp = ref<PhoneApp | null>(app.value)

const links = computed(() => [
  app.value?.playStore && { href: app.value.playStore, label: 'Get it on Google Play', primary: true },
  app.value?.appStore && { href: app.value.appStore, label: 'Download on the App Store', primary: !app.value.playStore },
  app.value?.url && { href: app.value.url, label: 'Visit the site', primary: !app.value.playStore && !app.value.appStore },
  app.value?.github && { href: app.value.github, label: 'View source on GitHub', primary: false },
].filter(Boolean) as { href: string, label: string, primary: boolean }[])
</script>

<template>
  <article v-if="app">
    <header class="relative text-white" :style="{ backgroundColor: app.color }">
      <div class="absolute inset-0 bg-black/10" aria-hidden="true" />
      <div class="wrap relative grid items-end gap-12 pt-28 lg:grid-cols-[1fr_auto]">
        <div class="pb-14">
          <NuxtLink to="/apps" class="font-semibold underline decoration-white/50 underline-offset-4 hover:decoration-white">All apps</NuxtLink>
          <AppIcon :title="app.title" :color="app.color" :icon="app.icon" size="xl" class="mt-10 ring-4 ring-white/30" />
          <h1 class="mt-8 text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.035em]">{{ app.title }}</h1>
          <p class="mt-3 font-semibold text-white/80">Isaac Tsienyane</p>
          <p class="mt-4 max-w-[46ch] text-2xl text-white/90">{{ app.tagline }}</p>
          <!-- Play Store-style stats row -->
          <dl class="mt-8 flex max-w-xl divide-x divide-white/25 rounded-[1.5rem] bg-black/15 py-4 text-center">
            <div class="flex-1 px-3"><dt class="text-sm text-white/70">Status</dt><dd class="mt-1 font-bold">{{ statusLabel[app.status] }}</dd></div>
            <div class="flex-1 px-3"><dt class="text-sm text-white/70">Runs on</dt><dd class="mt-1 font-bold">{{ app.platforms.map(p => platformLabel[p]).join(', ') }}</dd></div>
            <div class="flex-1 px-3"><dt class="text-sm text-white/70">Built with</dt><dd class="mt-1 font-bold">{{ app.stack.length }} tools</dd></div>
          </dl>
          <div v-if="links.length" class="mt-8 flex flex-wrap gap-3">
            <a
              v-for="l in links"
              :key="l.href"
              :href="l.href"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-full px-6 py-3 font-semibold transition-transform hover:-translate-y-0.5"
              :class="l.primary ? 'bg-white text-[#15213b]' : 'border-2 border-white/60 hover:border-white'"
            >{{ l.label }}</a>
          </div>
        </div>
        <div class="hidden translate-y-24 lg:block">
          <PhoneMock v-model:open="previewApp" :launcher="false" />
        </div>
      </div>
    </header>

    <div class="wrap grid gap-14 pt-14 lg:grid-cols-[1fr_18rem]">
      <div class="min-w-0">
        <div v-if="app.screenshots?.length" class="-mx-4 mb-12 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <img
            v-for="(src, i) in app.screenshots"
            :key="src"
            :src="src"
            :alt="`${app.title} screenshot ${i + 1}`"
            loading="lazy"
            class="aspect-[9/19.5] w-52 shrink-0 snap-start rounded-3xl border border-line object-cover"
          >
        </div>
        <h2 class="text-2xl font-extrabold">About this app</h2>
        <ContentRenderer :value="app" class="article prose mt-4" />
      </div>

      <dl class="grid grid-cols-2 gap-6 self-start rounded-[2rem] bg-surface-1 p-6 lg:mt-40 lg:grid-cols-1">
        <div><dt class="text-sm text-muted">Status</dt><dd class="mt-1"><StatusPill :status="app.status" /></dd></div>
        <div><dt class="text-sm text-muted">Platforms</dt><dd class="mt-1 font-semibold">{{ app.platforms.map(p => platformLabel[p]).join(', ') }}</dd></div>
        <div v-if="app.role"><dt class="text-sm text-muted">My role</dt><dd class="mt-1 font-semibold">{{ app.role }}</dd></div>
        <div v-if="app.year"><dt class="text-sm text-muted">Year</dt><dd class="mt-1 font-semibold">{{ app.year }}</dd></div>
        <div class="col-span-2 lg:col-span-1">
          <dt class="text-sm text-muted">Built with</dt>
          <dd class="mt-2 flex flex-wrap gap-1.5">
            <span v-for="s in app.stack" :key="s" class="rounded-full border border-line px-2.5 py-0.5 text-sm">{{ s }}</span>
          </dd>
        </div>
      </dl>
    </div>

    <div v-if="next && next.path !== app.path" class="wrap mt-24">
      <NuxtLink :to="next.path" class="group flex items-center justify-between gap-6 border-t-2 border-ink pt-8">
        <span>
          <span class="block text-muted">Next app</span>
          <span class="block text-[clamp(2rem,5vw,3.5rem)] leading-none font-extrabold tracking-[-0.03em] group-hover:text-accent">{{ next.title }}</span>
        </span>
        <svg class="size-10 shrink-0 transition-transform group-hover:translate-x-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </NuxtLink>
    </div>
  </article>
</template>
