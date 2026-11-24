<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () =>
  queryCollection('blog').where('draft', '=', false).order('date', 'DESC').all())

const tags = computed(() => [...new Set((posts.value ?? []).flatMap(p => p.tags ?? []))].sort())
const tag = ref<string | null>(null)
const visible = computed(() => (posts.value ?? []).filter(p => !tag.value || p.tags?.includes(tag.value)))
const featured = computed(() => visible.value[0])
const rest = computed(() => visible.value.slice(1))

useSeoMeta({
  title: 'Writing',
  description: 'Notes from Isaac Tsienyane on Android, full-stack development, and the games and books in between.',
})
</script>

<template>
  <div>
    <section class="bg-band text-white">
      <div class="wrap pt-32 pb-16 sm:pb-20">
        <h1 class="text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] font-extrabold tracking-[-0.035em]">Writing</h1>
        <p class="mt-5 max-w-[56ch] text-xl text-white/80">
          Notes on Android, frontend craft, agentic coding, and the occasional game or book worth talking about.
        </p>
        <div v-if="tags.length" class="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter posts by topic">
          <button
            type="button"
            class="rounded-full border-2 px-4 py-1.5 font-semibold transition-colors"
            :class="!tag ? 'border-white bg-white text-band' : 'border-white/40 hover:border-white'"
            :aria-pressed="!tag"
            @click="tag = null"
          >
            All topics
          </button>
          <button
            v-for="t in tags"
            :key="t"
            type="button"
            class="rounded-full border-2 px-4 py-1.5 font-semibold transition-colors"
            :class="tag === t ? 'border-amber bg-amber text-[#15213b]' : 'border-white/40 hover:border-white'"
            :aria-pressed="tag === t"
            @click="tag = t"
          >
            {{ t }}
          </button>
        </div>
      </div>
    </section>

    <div class="wrap pt-14">
      <NuxtLink v-if="featured" :to="featured.path" class="group grid overflow-hidden rounded-[2rem] bg-surface ring-1 ring-line/70 lg:grid-cols-[1.1fr_1fr]">
        <div class="h-64 overflow-hidden lg:h-auto lg:min-h-96"><Cover :seed="featured.path" class="transition-transform duration-500 group-hover:scale-105" /></div>
        <div class="flex flex-col p-8 sm:p-10">
          <p class="text-muted">{{ formatDate(featured.date) }}, {{ readingMinutes(featured.rawbody) }} min read</p>
          <p class="mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1] font-extrabold tracking-[-0.03em] group-hover:text-accent">{{ featured.title }}</p>
          <p class="mt-4 text-lg text-muted">{{ featured.description }}</p>
          <ul v-if="featured.tags?.length" class="mt-auto flex flex-wrap gap-2 pt-8">
            <li v-for="t in featured.tags" :key="t" class="rounded-full bg-primary-container px-3 py-1 text-sm font-semibold text-on-primary-container">{{ t }}</li>
          </ul>
        </div>
      </NuxtLink>

      <div v-if="rest.length" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="post in rest" :key="post.path" :to="post.path" class="group overflow-hidden rounded-[2rem] bg-surface ring-1 ring-line/70">
          <div class="h-40 overflow-hidden"><Cover :seed="post.path" class="transition-transform duration-500 group-hover:scale-105" /></div>
          <div class="p-6">
            <p class="text-sm text-muted">{{ formatDate(post.date, 'short') }}</p>
            <p class="mt-2 text-xl leading-tight font-extrabold group-hover:text-accent">{{ post.title }}</p>
            <p class="mt-2 line-clamp-2 text-muted">{{ post.description }}</p>
          </div>
        </NuxtLink>
      </div>

      <p v-if="!visible.length" class="mt-12 text-lg text-muted">
        No posts yet. Add a Markdown file to content/blog to publish the first one.
      </p>
    </div>
  </div>
</template>
