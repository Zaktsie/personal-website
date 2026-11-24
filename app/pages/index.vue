<script setup lang="ts">
import type { PhoneApp } from '~/composables/phone'

const [{ data: apps }, { data: posts }, { data: experience }, { data: skills }, { data: shelf }] = await Promise.all([
  useAsyncData('home-apps', () => queryCollection('apps').order('order', 'ASC').all()),
  useAsyncData('home-posts', () => queryCollection('blog').where('draft', '=', false).order('date', 'DESC').limit(3).all()),
  useAsyncData('experience', () => queryCollection('experience').first()),
  useAsyncData('skills', () => queryCollection('skills').first()),
  useAsyncData('shelf', () => queryCollection('shelf').first()),
])

const openApp = useState<PhoneApp | null>('phone-open', () => null)
const building = computed(() => apps.value?.find(a => a.status === 'in-development'))
const featured = computed(() => building.value ?? apps.value?.find(a => a.featured) ?? apps.value?.[0])
const playing = computed(() => shelf.value?.items.find(i => i.kind === 'game' && i.status === 'now'))
const reading = computed(() => shelf.value?.items.find(i => i.kind === 'book' && i.status === 'now'))
const latest = computed(() => posts.value?.[0])

useSeoMeta({
  title: null,
  description: 'Isaac Tsienyane is a senior full-stack and Android developer in Gauteng, South Africa, building mobile apps and the systems behind them.',
  ogTitle: 'Isaac Tsienyane, senior full-stack & Android developer',
  ogDescription: 'Android apps, Nuxt and Laravel systems, agentic coding, and notes on building them.',
})
</script>

<template>
  <div>
    <!-- Hero: the phone is the portfolio. -->
    <section class="relative overflow-hidden bg-field text-white" aria-labelledby="intro">
      <div class="pointer-events-none absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle,white_1px,transparent_1.5px)] [background-size:28px_28px]" aria-hidden="true" />
      <div class="pointer-events-none absolute top-1/2 right-[8%] hidden size-[42rem] -translate-y-1/2 rounded-full border-[3rem] border-white/6 lg:block" aria-hidden="true" />
      <div class="wrap relative grid items-center gap-14 pt-32 pb-36 lg:grid-cols-[1fr_auto] lg:gap-16 lg:pt-36 lg:pb-40">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full bg-white/12 py-1.5 pr-4 pl-2 text-white/90">
            <span class="relative flex size-2.5" aria-hidden="true"><span class="absolute inset-0 animate-ping rounded-full bg-amber opacity-70" /><span class="relative size-2.5 rounded-full bg-amber" /></span>
            Senior frontend &amp; Android developer
          </p>
          <h1 id="intro" class="mt-6 max-w-[15ch] text-[clamp(2.9rem,6.2vw,5.6rem)] leading-[0.94] font-extrabold tracking-[-0.035em]">
            Android apps and frontends that feel native.
          </h1>
          <p class="mt-8 max-w-[52ch] text-xl leading-relaxed text-white/85">
            I'm Isaac (Zak) Tsienyane. I've spent ten years building for the web and mobile, in Java and Swift on the device and Vue and Nuxt on the screen. Right now that's the MiWay app and website, and I pair with coding agents to ship faster.
          </p>
          <div class="mt-9 flex flex-wrap items-center gap-3">
            <NuxtLink to="/apps" class="rounded-full bg-white px-6 py-3 text-lg font-semibold text-field transition-transform hover:-translate-y-0.5">Explore my apps</NuxtLink>
            <a href="#lab" class="rounded-full border-2 border-white/60 px-6 py-2.5 text-lg font-semibold transition-colors hover:border-white">Try the live demos</a>
          </div>
        </div>

        <div id="phone" class="flex scroll-mt-28 flex-col items-center gap-4">
          <PhoneMock v-model:open="openApp" :apps="apps ?? []" :building="building?.title" />
          <p class="text-center text-white/80">Tap an app to open it. Tap the bar at the bottom, or press Esc, to go home.</p>
        </div>
      </div>
    </section>

    <!-- Home screen: widgets pulled up over the hero edge. -->
    <section class="wrap relative -mt-20" aria-label="About me at a glance">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AboutWidget class="sm:col-span-2 lg:row-span-2" />
        <NowPlayingWidget v-if="playing" :game="playing" class="sm:col-span-2" />
        <ReadingWidget v-if="reading" :book="reading" />
        <ClockWidget />
        <FeaturedAppWidget v-if="featured" :app="featured" class="sm:col-span-2" />
        <StackFolderWidget :categories="skills?.categories ?? []" />
        <AwardsWidget v-if="skills?.honors.length" :honors="skills.honors" />
        <AgentWidget class="sm:col-span-2" />
        <NuxtLink v-if="latest" :to="latest.path" class="group relative flex min-h-72 flex-col overflow-hidden rounded-[2rem] bg-surface ring-1 ring-line/70 sm:col-span-2">
          <div class="h-40 overflow-hidden"><Cover :seed="latest.path" class="transition-transform duration-500 group-hover:scale-105" /></div>
          <div class="flex flex-1 flex-col p-6">
            <p class="text-sm text-muted">Latest post, {{ formatDate(latest.date) }}</p>
            <p class="mt-2 text-2xl leading-tight font-extrabold group-hover:text-accent">{{ latest.title }}</p>
            <p class="mt-2 text-muted">{{ latest.description }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Live demos: proof of the Android and frontend work. -->
    <section id="lab" class="wrap scroll-mt-24 pt-32" aria-labelledby="lab-heading">
      <h2 id="lab-heading" class="text-[clamp(2.5rem,5vw,4rem)] leading-none font-extrabold tracking-[-0.03em]">See the work running</h2>
      <p class="mt-4 max-w-[58ch] text-xl text-muted">Four things I built at MiWay, rebuilt so you can try them here, next to the code that makes them work.</p>
      <div class="mt-10">
        <AndroidLab />
      </div>
    </section>

    <!-- Work -->
    <section id="work" class="wrap scroll-mt-24 pt-32" aria-labelledby="work-heading">
      <h2 id="work-heading" class="text-[clamp(2.5rem,5vw,4rem)] leading-none font-extrabold tracking-[-0.03em]">Ten years of shipping</h2>
      <p class="mt-4 max-w-[56ch] text-xl text-muted">Flip a tile to see where I've used a technology, at work and in my own apps. Open a notification for the details.</p>
      <div class="mt-10">
        <WorkExplorer :apps="apps ?? []" :roles="experience?.work ?? []" />
      </div>

      <div class="mt-16 grid gap-4 sm:grid-cols-3">
        <Widget v-for="ed in experience?.education" :key="ed.school" tone="tint">
          <h3 class="font-extrabold">Education</h3>
          <p class="mt-2 text-muted">{{ ed.degree }}, {{ ed.school }}, {{ ed.period }}</p>
        </Widget>
        <Widget tone="tint">
          <h3 class="font-extrabold">Certifications</h3>
          <p class="mt-2 text-muted">{{ skills?.certifications.length }} certificates, including CCNA and freeCodeCamp's front-end track.</p>
        </Widget>
        <Widget tone="tint">
          <h3 class="font-extrabold">Languages I speak</h3>
          <p class="mt-2 text-muted">{{ skills?.languages.map(l => l.name).join(', ') }}</p>
        </Widget>
      </div>
    </section>
  </div>
</template>
