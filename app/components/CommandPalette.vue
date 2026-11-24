<script setup lang="ts">
type Entry = { id: string, group: string, label: string, hint?: string, to?: string, run?: () => void }

const open = useState('palette-open', () => false)
const dialog = ref<HTMLDialogElement>()
const input = ref<HTMLInputElement>()
const q = ref('')
const active = ref(0)
const { cycle } = useTheme()
const { copyEmail } = useSiteActions()

const { data } = useAsyncData('palette', async () => {
  const [apps, posts] = await Promise.all([
    queryCollection('apps').select('title', 'path', 'tagline', 'order').order('order', 'ASC').all(),
    queryCollection('blog').where('draft', '=', false).select('title', 'path', 'description', 'date').order('date', 'DESC').all(),
  ])
  return { apps, posts }
})

const entries = computed<Entry[]>(() => [
  { id: 'p-home', group: 'Pages', label: 'Home', to: '/' },
  { id: 'p-apps', group: 'Pages', label: 'Apps', to: '/apps' },
  { id: 'p-blog', group: 'Pages', label: 'Writing', to: '/blog' },
  { id: 'p-work', group: 'Pages', label: 'Experience and skills', to: '/#work' },
  { id: 'p-otc', group: 'Pages', label: 'Games and books', to: '/#off-the-clock' },
  ...(data.value?.apps ?? []).map(a => ({ id: a.path, group: 'Apps', label: a.title, hint: a.tagline, to: a.path })),
  ...(data.value?.posts ?? []).map(p => ({ id: p.path, group: 'Posts', label: p.title, hint: p.description, to: p.path })),
  { id: 'a-theme', group: 'Actions', label: 'Switch theme', run: cycle },
  { id: 'a-email', group: 'Actions', label: 'Copy my email address', run: copyEmail },
])

const results = computed(() => {
  const words = q.value.toLowerCase().split(/\s+/).filter(Boolean)
  return entries.value.filter(e => words.every(w => `${e.label} ${e.hint ?? ''} ${e.group}`.toLowerCase().includes(w)))
})
watch(q, () => (active.value = 0))

watch(open, async (v) => {
  if (v) {
    q.value = ''
    dialog.value?.showModal()
    await nextTick()
    input.value?.focus()
  }
  else if (dialog.value?.open) dialog.value.close()
})

function choose(e?: Entry) {
  if (!e) return
  open.value = false
  if (e.run) e.run()
  else if (e.to) navigateTo(e.to)
}

function onInputKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); active.value = Math.min(active.value + 1, results.value.length - 1) }
  else if (e.key === 'ArrowUp') { e.preventDefault(); active.value = Math.max(active.value - 1, 0) }
  else if (e.key === 'Enter') { e.preventDefault(); choose(results.value[active.value]) }
}
watch(active, i => document.getElementById(`cmd-${i}`)?.scrollIntoView({ block: 'nearest' }))

function onGlobalKey(e: KeyboardEvent) {
  const typing = e.target instanceof HTMLElement && (e.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName))
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open.value = !open.value }
  else if (e.key === '/' && !typing && !open.value) { e.preventDefault(); open.value = true }
}
onMounted(() => window.addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <dialog
    ref="dialog"
    class="m-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] rounded-3xl border border-line bg-surface p-0 text-ink shadow-2xl"
    aria-label="Search the site"
    @close="open = false"
    @click="$event.target === dialog && (open = false)"
  >
    <div class="flex items-center gap-3 border-b border-line px-5">
      <svg class="size-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
      <input
        ref="input"
        v-model="q"
        type="text"
        role="combobox"
        aria-expanded="true"
        aria-controls="cmd-list"
        :aria-activedescendant="results.length ? `cmd-${active}` : undefined"
        placeholder="Search apps, posts and pages"
        class="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-muted"
        @keydown="onInputKey"
      >
      <kbd class="rounded-md border border-line px-1.5 py-0.5 text-xs text-muted">Esc</kbd>
    </div>
    <ul id="cmd-list" role="listbox" class="max-h-[min(26rem,60vh)] overflow-y-auto p-2">
      <li
        v-for="(e, i) in results"
        :id="`cmd-${i}`"
        :key="e.id"
        role="option"
        :aria-selected="i === active"
        class="flex cursor-pointer items-baseline justify-between gap-4 rounded-2xl px-4 py-3"
        :class="i === active ? 'bg-accent text-accent-ink' : ''"
        @mousemove="active = i"
        @click="choose(e)"
      >
        <span class="min-w-0">
          <span class="block truncate font-semibold">{{ e.label }}</span>
          <span v-if="e.hint" class="block truncate text-sm" :class="i === active ? 'opacity-85' : 'text-muted'">{{ e.hint }}</span>
        </span>
        <span class="shrink-0 text-sm" :class="i === active ? 'opacity-85' : 'text-muted'">{{ e.group }}</span>
      </li>
      <li v-if="!results.length" class="px-4 py-6 text-muted">Nothing matches "{{ q }}". Try an app name or a technology.</li>
    </ul>
  </dialog>
</template>
