<script setup lang="ts">
// An Android app folder: tap to open it and see the full stack.
type Category = { name: string, skills: string[] }
const props = defineProps<{ categories: Category[] }>()

const colors = ['#2141d0', '#0f8a6b', '#d9822b', '#7a4fd6', '#c2414b', '#1f7fa8', '#5f7a1f', '#d6336c', '#15213b']
const featured = ['Kotlin', 'Java', 'Swift', 'Vue.js', 'Nuxt.js', 'Laravel', 'Firebase Realtime Database', 'PHP', 'Tailwind CSS']
const preview = computed(() => featured.map((name, i) => ({ name, color: colors[i % colors.length]! })))
const open = ref(false)
const dialog = ref<HTMLDialogElement>()
watch(open, v => (v ? dialog.value?.showModal() : dialog.value?.close()))

const short = (s: string) => s.replace(/\s*\(.*\)/, '').replace('Firebase Realtime Database', 'Firebase').replace('Huawei HMS Integration', 'Huawei HMS').replace('.js', '')
</script>

<template>
  <Widget tone="tint" class="flex flex-col items-center text-center">
    <button type="button" class="group flex flex-col items-center" aria-haspopup="dialog" @click="open = true">
      <span class="grid size-32 grid-cols-3 gap-1.5 rounded-[2rem] bg-surface p-3 transition-transform group-hover:scale-105 group-active:scale-95">
        <span v-for="p in preview" :key="p.name" class="grid place-items-center rounded-[28%] text-[0.6rem] font-extrabold text-white" :style="{ backgroundColor: p.color }" aria-hidden="true">
          {{ short(p.name).slice(0, 2) }}
        </span>
      </span>
      <span class="mt-3 text-xl font-extrabold">My stack</span>
      <span class="text-sm text-muted">Tap to open the folder</span>
    </button>

    <dialog ref="dialog" class="m-auto w-[min(34rem,calc(100vw-2rem))] rounded-[2rem] bg-surface p-0 text-ink" aria-label="My stack" @close="open = false" @click="$event.target === dialog && (open = false)">
      <Transition name="folder" appear>
        <div v-if="open" class="p-7">
          <div class="flex items-center justify-between">
            <p class="text-2xl font-extrabold">My stack</p>
            <button type="button" class="rounded-full px-3 py-1.5 font-semibold hover:bg-surface-1" @click="open = false">Close</button>
          </div>
          <div v-for="(cat, ci) in props.categories" :key="cat.name" class="mt-5">
            <p class="text-sm font-semibold text-muted">{{ cat.name }}</p>
            <ul class="mt-2 grid grid-cols-4 gap-3 sm:grid-cols-5">
              <li v-for="(s, si) in cat.skills" :key="s" class="flex flex-col items-center gap-1 text-center">
                <span class="grid size-11 place-items-center rounded-[28%] text-xs font-extrabold text-white" :style="{ backgroundColor: colors[(ci * 3 + si) % colors.length] }" aria-hidden="true">{{ short(s).slice(0, 2) }}</span>
                <span class="w-full truncate text-xs">{{ short(s) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </dialog>
  </Widget>
</template>
