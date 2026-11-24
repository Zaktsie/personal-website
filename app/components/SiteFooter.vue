<script setup lang="ts">
const { copyEmail } = useSiteActions()

const targets = [
  { label: 'Email', href: `mailto:${EMAIL}?subject=Hello%20from%20your%20website`, color: '#2141d0', d: 'M3 6h18v12H3zM3 7l9 6 9-6' },
  { label: 'GitHub', href: 'https://github.com/Zaktsie', color: '#15213b', d: 'M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.3 5.8 2.6 5.8 2.6a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/isaac-tsienyane-98b59885/', color: '#0a66c2', d: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z' },
]
</script>

<template>
  <footer class="mt-32 bg-field pt-20 text-white">
    <div class="wrap">
      <p class="max-w-[15ch] text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.03em]">Got an app that needs building?</p>
      <p class="mt-6 max-w-[52ch] text-xl text-white/80">I'm open to senior full-stack and Android roles, and to side projects worth losing sleep over.</p>
    </div>

    <!-- Android share sheet -->
    <div class="wrap mt-14">
      <div class="rounded-t-[2.5rem] bg-surface px-6 pt-3 pb-8 text-ink sm:px-10">
        <div class="mx-auto h-1.5 w-10 rounded-full bg-line" aria-hidden="true" />
        <p class="mt-6 text-lg font-bold">Say hello</p>
        <ul class="mt-5 flex flex-wrap gap-6 sm:gap-10">
          <li v-for="t in targets" :key="t.label">
            <a :href="t.href" :target="t.href.startsWith('http') ? '_blank' : undefined" :rel="t.href.startsWith('http') ? 'noopener noreferrer' : undefined" class="group flex w-20 flex-col items-center gap-2 text-center">
              <span class="grid size-16 place-items-center rounded-full text-white transition-transform group-hover:-translate-y-1 group-active:scale-90" :style="{ backgroundColor: t.color }">
                <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path :d="t.d" /></svg>
              </span>
              <span class="font-semibold">{{ t.label }}</span>
            </a>
          </li>
          <li>
            <button type="button" class="group flex w-20 flex-col items-center gap-2 text-center" @click="copyEmail">
              <span class="grid size-16 place-items-center rounded-full bg-surface-2 transition-transform group-hover:-translate-y-1 group-active:scale-90">
                <svg class="size-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="8" y="8" width="13" height="13" rx="3" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></svg>
              </span>
              <span class="font-semibold">Copy email</span>
            </button>
          </li>
        </ul>
        <p class="mt-10 border-t border-line pt-6 text-muted">Gauteng, South Africa</p>
      </div>
    </div>
  </footer>
</template>
