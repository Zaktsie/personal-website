<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { data: post } = await useAsyncData(`post-${slug}`, () => queryCollection('blog').path(`/blog/${slug}`).first())

if (!post.value || post.value.draft) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`post-surround-${slug}`, () =>
  queryCollectionItemSurroundings('blog', `/blog/${slug}`, { fields: ['title', 'description'] })
    .where('draft', '=', false).order('date', 'DESC'))

useSeoMeta({
  title: post.value.title,
  description: post.value.description,
  ogType: 'article',
  ogTitle: post.value.title,
  ogDescription: post.value.description,
  articlePublishedTime: new Date(post.value.date).toISOString(),
})

type TocLink = { id: string, text: string, depth: number, children?: TocLink[] }
const toc = computed<TocLink[]>(() => (post.value?.body as { toc?: { links?: TocLink[] } })?.toc?.links ?? [])
const flatToc = computed(() => toc.value.flatMap(l => [l, ...(l.children ?? [])]))

const progress = ref(0)
const activeId = ref('')
const articleEl = ref<HTMLElement>()
let observer: IntersectionObserver | undefined

function onScroll() {
  const el = articleEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const total = rect.height - window.innerHeight
  progress.value = Math.min(1, Math.max(0, total > 0 ? -rect.top / total : 1))
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) activeId.value = e.target.id
  }, { rootMargin: '0px 0px -70% 0px' })
  flatToc.value.forEach(l => document.getElementById(l.id) && observer!.observe(document.getElementById(l.id)!))
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  observer?.disconnect()
})
</script>

<template>
  <article v-if="post">
    <div class="fixed inset-x-0 top-0 z-40 h-1 origin-left bg-amber" :style="{ transform: `scaleX(${progress})` }" aria-hidden="true" />

    <header class="relative overflow-hidden bg-band text-white">
      <div class="absolute inset-y-0 right-0 hidden w-[38%] opacity-90 lg:block [mask-image:linear-gradient(to_right,transparent,black_35%)]" aria-hidden="true"><Cover :seed="post.path" base="#121a33" /></div>
      <div class="wrap relative pt-32 pb-14 sm:pb-20">
        <NuxtLink to="/blog" class="font-semibold underline decoration-white/50 underline-offset-4 hover:decoration-white">All writing</NuxtLink>
        <h1 class="mt-10 max-w-[18ch] text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.035em]">{{ post.title }}</h1>
        <p class="mt-6 max-w-[56ch] text-xl text-white/80">{{ post.description }}</p>
        <p class="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-white/70">
          <time :datetime="new Date(post.date).toISOString()">{{ formatDate(post.date) }}</time>
          <span>{{ readingMinutes(post.rawbody) }} min read</span>
          <span v-if="post.tags?.length">Filed under {{ post.tags.join(', ') }}</span>
        </p>
      </div>
    </header>

    <div class="wrap grid gap-14 pt-14 lg:grid-cols-[1fr_15rem]">
      <div ref="articleEl" class="min-w-0">
        <ContentRenderer :value="post" class="article prose" />
      </div>
      <nav v-if="toc.length" aria-label="On this page" class="hidden lg:block">
        <div class="sticky top-8">
          <p class="font-bold">On this page</p>
          <ul class="mt-3 space-y-1 border-l-2 border-line">
            <li v-for="l in flatToc" :key="l.id">
              <a
                :href="`#${l.id}`"
                class="-ml-0.5 block border-l-2 py-1 transition-colors"
                :class="[l.depth > 2 ? 'pl-7' : 'pl-4', activeId === l.id ? 'border-accent font-semibold text-ink' : 'border-transparent text-muted hover:text-ink']"
              >{{ l.text }}</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <nav v-if="surround?.some(Boolean)" class="wrap mt-24 grid gap-4 sm:grid-cols-2" aria-label="More posts">
      <NuxtLink v-if="surround?.[1]" :to="surround[1].path" class="group rounded-3xl border-2 border-line p-6 hover:border-ink">
        <span class="text-muted">Older post</span>
        <span class="mt-2 block text-2xl font-extrabold group-hover:text-accent">{{ surround[1].title }}</span>
      </NuxtLink>
      <NuxtLink v-if="surround?.[0]" :to="surround[0].path" class="group rounded-3xl border-2 border-line p-6 text-right hover:border-ink sm:col-start-2">
        <span class="text-muted">Newer post</span>
        <span class="mt-2 block text-2xl font-extrabold group-hover:text-accent">{{ surround[0].title }}</span>
      </NuxtLink>
    </nav>
  </article>
</template>
