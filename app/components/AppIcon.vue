<script setup lang="ts">
const props = withDefaults(defineProps<{ title: string, color?: string, icon?: string, size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }>(), {
  color: '#2f5bea',
  size: 'md',
})
const initials = computed(() =>
  props.title.split(/\s+/).filter(w => /^[A-Za-z0-9]/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase(),
)
const sizes = { xs: 'size-[2.9rem] text-sm', sm: 'size-12 text-base', md: 'size-16 text-xl', lg: 'size-24 text-3xl', xl: 'size-32 text-5xl' }
</script>

<template>
  <!-- Android launcher-style squircle; uses the app's own icon when one is provided. -->
  <span
    class="grid shrink-0 place-items-center overflow-hidden rounded-[28%] font-extrabold text-white shadow-[inset_0_-6px_0_rgb(0_0_0/0.12)]"
    :class="sizes[size]"
    :style="{ backgroundColor: color }"
    aria-hidden="true"
  >
    <img v-if="icon" :src="icon" alt="" class="size-full object-cover">
    <template v-else>{{ initials }}</template>
  </span>
</template>
