<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)
useSeoMeta({ title: notFound.value ? 'Page not found' : 'Something went wrong', robots: 'noindex' })
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <SiteHeader />
    <main id="main" class="wrap flex-1 pt-36">
      <p class="text-[clamp(5rem,16vw,10rem)] leading-none font-extrabold text-line">{{ error.statusCode }}</p>
      <h1 class="mt-4 text-4xl font-extrabold">{{ notFound ? 'This page doesn’t exist' : 'Something went wrong' }}</h1>
      <p class="mt-4 max-w-[55ch] text-lg text-muted">
        {{ notFound ? 'The link may be old, or the page may have moved.' : 'Reload the page to try again.' }}
        Head back to the home page, or browse the apps.
      </p>
      <div class="mt-8 flex gap-6 text-lg">
        <button type="button" class="link" @click="clearError({ redirect: '/' })">Go to the home page</button>
        <button type="button" class="link" @click="clearError({ redirect: '/apps' })">Browse apps</button>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>
