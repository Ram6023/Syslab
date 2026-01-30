<template>
  <div class="flex flex-col items-center">
    <div 
      class="flex gap-1 border-2 rounded-lg p-2 transition-all duration-500"
      :class="[
        isHighlighted ? 'border-primary bg-primary/20 scale-110 neon-glow' : 'border-white/10 bg-white/5'
      ]"
    >
      <div 
        v-for="(key, i) in node.keys" 
        :key="i"
        class="w-8 h-8 flex items-center justify-center font-bold text-xs"
        :class="key === highlightId ? 'text-primary' : 'text-muted-foreground'"
      >
        {{ key }}
      </div>
    </div>

    <div v-if="node.children && node.children.length > 0" class="relative mt-8 flex gap-8">
       <!-- SVG lines connecting to children -->
       <div class="absolute inset-0 -top-8 pointer-events-none">
          <svg class="w-full h-8 overflow-visible">
            <line 
              v-for="(child, ci) in node.children" 
              :key="ci"
              :x1="50 + '%'" 
              y1="0" 
              :x2="(ci * (100 / (node.children.length-1 || 1))) + '%'" 
              y2="100%" 
              stroke="rgba(255,255,255,0.1)" 
              stroke-width="1"
            />
          </svg>
       </div>
       <TreeNode 
        v-for="(child, ci) in node.children" 
        :key="ci" 
        :node="child" 
        :highlight-id="highlightId" 
       />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  node: any
  highlightId: number
}>()

const isHighlighted = computed(() => {
    return props.node.keys.includes(props.highlightId) || 
           (props.node.children && props.node.children.some((c: any) => c.keys.includes(props.highlightId)))
})
</script>
