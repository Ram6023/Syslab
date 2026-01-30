<template>
  <div 
    class="glass rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-primary/10"
    :class="props.class"
  >
    <div v-if="$slots.header" class="px-6 py-4 border-b border-white/5 bg-white/5">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-white/5 bg-white/5">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  class?: string
}>()
</script>
