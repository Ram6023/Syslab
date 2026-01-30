<template>
  <div class="w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
    <div class="min-w-max relative" :style="{ height: '120px' }">
      <!-- Time axis -->
      <div class="absolute bottom-0 left-0 right-0 h-8 border-t border-white/10 flex items-center">
        <div v-for="t in maxTime + 1" :key="t" 
          class="absolute h-full flex flex-col items-center"
          :style="{ left: `${t * scale}px` }">
          <div class="w-px h-2 bg-white/20"></div>
          <span class="text-[10px] text-muted-foreground mt-1">{{ t }}</span>
        </div>
      </div>

      <!-- Blocks -->
      <div class="h-16 flex items-end">
        <div 
          v-for="(block, index) in ganttChart" 
          :key="index"
          class="absolute h-12 flex items-center justify-center text-xs font-bold transition-all duration-500 hover:scale-[1.02] cursor-default"
          :class="[
            block.processId === 'Idle' ? 'bg-white/5 text-muted-foreground' : 'neon-glow bg-primary/20 text-primary border border-primary/50'
          ]"
          :style="{
            left: `${block.startTime * scale}px`,
            width: `${(block.endTime - block.startTime) * scale}px`,
            bottom: '32px'
          }"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: index * 50 } }"
        >
          {{ block.processId }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface GanttBlock {
  processId: string
  startTime: number
  endTime: number
}

const props = defineProps<{
  ganttChart: GanttBlock[]
}>()

const maxTime = computed(() => {
  if (props.ganttChart.length === 0) return 0
  return props.ganttChart[props.ganttChart.length - 1].endTime
})

const scale = 40 // pixels per unit of time
</script>
