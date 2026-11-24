<script setup lang="ts">
withDefaults(defineProps<{ dark?: boolean, label: string }>(), { dark: false })
</script>

<template>
  <!-- A smaller device frame for live feature demos. -->
  <div class="relative mx-auto aspect-[9/19] w-[min(17rem,78vw)] shrink-0 rounded-[2.6rem] bg-[#070b16] p-[9px] shadow-[0_40px_70px_-30px_rgb(0_0_0/0.55)]" role="group" :aria-label="label">
    <div class="relative flex h-full flex-col overflow-hidden rounded-[2.1rem]" :class="dark ? 'bg-[#0f1a3d] text-white' : 'bg-[#f3f5fc] text-[#111936]'">
      <div class="relative z-30 flex items-center justify-between px-5 pt-2.5 text-[11px] font-semibold">
        <span>9:41</span>
        <span class="absolute top-2 left-1/2 size-[11px] -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
        <span class="flex gap-1" aria-hidden="true">
          <svg class="size-3" viewBox="0 0 24 24" fill="currentColor"><path d="M2 22h20V2z" /></svg>
          <svg class="h-3 w-5" viewBox="0 0 26 14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="1" width="21" height="12" rx="3" /><rect x="3" y="3" width="14" height="8" rx="1.5" fill="currentColor" stroke="none" /></svg>
        </span>
      </div>
      <div class="relative min-h-0 flex-1">
        <slot />
      </div>
      <div class="flex justify-center pt-1 pb-2" aria-hidden="true"><span class="h-1 w-24 rounded-full bg-current opacity-60" /></div>
    </div>
  </div>
</template>
