<script setup lang="ts">
const long = ref(false)
</script>

<template>
  <Widget class="flex flex-col">
    <div class="flex items-start justify-between gap-4">
      <img src="/images/profile.jpg" alt="Isaac Tsienyane" width="88" height="88" class="size-22 rounded-[28%] object-cover">
      <div class="flex rounded-full bg-surface-1 p-1 text-sm font-semibold" role="group" aria-label="Bio length">
        <button type="button" class="rounded-full px-3 py-1.5 transition-colors" :class="!long ? 'bg-ink text-bg' : 'text-muted'" :aria-pressed="!long" @click="long = false">Short</button>
        <button type="button" class="rounded-full px-3 py-1.5 transition-colors" :class="long ? 'bg-ink text-bg' : 'text-muted'" :aria-pressed="long" @click="long = true">Long</button>
      </div>
    </div>
    <h2 class="mt-6 text-3xl leading-tight font-extrabold tracking-[-0.02em]">About me</h2>
    <Transition name="fade" mode="out-in">
      <div v-if="!long" key="s" class="mt-3 space-y-3 text-lg text-muted">
        <p>I'm Zak. I make Android apps feel native and the backends behind them boringly reliable.</p>
        <p>Ten years in, I still get a kick out of the moment a permission dialog, a push notification and an API call all line up on a real device.</p>
      </div>
      <div v-else key="l" class="mt-3 space-y-3 text-muted">
        <p>I'm Isaac "Zak" Tsienyane, a senior developer in Gauteng. I've been at MiWay since 2022. Today I'm on the MiWay app, where I was part of the team behind the MiMotor combo sales flow and MiHelp enhancements, and I build Prismic slices for the Nuxt-powered MiWay website. Before that I worked on the Blink app across Android, iOS and the web: permission flows for Android 9 to 13, Huawei push, and Nuxt front ends on Oracle and PHP. On the telematics team I architected the MiWay telematics plugin, which gives our JavaScript apps native Android and iOS powers: permissions, provider onboarding and more.</p>
        <p>Before that I spent two years as a full-stack engineer at Exclusive Books, shipping Symfony tools that replaced manual database edits, and three years building client sites and a drag-and-drop email builder at inSite Education.</p>
        <p>I've won Best Innovative Idea at the MiWay Hackathon for an OCR feature that reads number plates and licence discs from photos. These days I build with coding agents in the loop: I set the plan and the standards, the agent does the legwork, and I review every diff. Off the clock I'm gaming on my PS5 or reading spy fiction.</p>
      </div>
    </Transition>
    <div class="mt-auto flex flex-wrap gap-2 pt-6">
      <a href="https://github.com/Zaktsie" target="_blank" rel="noopener noreferrer" class="rounded-full bg-surface-1 px-4 py-2 font-semibold hover:bg-surface-2">GitHub</a>
      <a href="https://www.linkedin.com/in/isaac-tsienyane-98b59885/" target="_blank" rel="noopener noreferrer" class="rounded-full bg-surface-1 px-4 py-2 font-semibold hover:bg-surface-2">LinkedIn</a>
      <a :href="`mailto:${EMAIL}`" class="rounded-full bg-accent px-4 py-2 font-semibold text-accent-ink">Email me</a>
    </div>
  </Widget>
</template>
