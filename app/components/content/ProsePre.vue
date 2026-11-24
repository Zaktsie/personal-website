<script setup lang="ts">
const props = defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: null },
  filename: { type: String, default: null },
  highlights: { type: Array as () => number[], default: () => [] },
  meta: { type: String, default: null },
  class: { type: String, default: null },
})

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  }
  catch {
    // Clipboard blocked; the code is still selectable.
  }
}
</script>

<template>
  <div class="not-prose relative my-8 overflow-hidden rounded-2xl border border-line bg-surface">
    <div class="flex items-center justify-between gap-4 border-b border-line px-4 py-2 font-sans text-sm text-muted">
      <span>{{ filename || language || 'Code' }}</span>
      <button type="button" class="rounded-full px-3 py-1 font-semibold text-ink hover:bg-bg" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre :class="props.class" class="overflow-x-auto p-4 text-[0.9rem] leading-relaxed"><slot /></pre>
  </div>
</template>
