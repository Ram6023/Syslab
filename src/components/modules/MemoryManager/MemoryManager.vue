<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/[0.02] pb-6">
      <div>
        <h2 class="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-accent via-white to-accent">
            MEMORY_SPACE
        </h2>
        <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1">
            Virtual memory mapping & frame replacement logic
        </p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="handleReset" class="backdrop-blur-md">SYS.FLUSH</Button>
        <Button variant="accent" @click="handleSimulate" class="px-8 shadow-lg shadow-accent/20">ALLOCATE_MEMORY</Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Config Panel -->
      <Card class="lg:col-span-1">
        <template #header>
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-accent"></div>
            <span class="font-bold uppercase tracking-[0.2em] text-[10px] text-accent/80">Configuration</span>
          </div>
        </template>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground uppercase">Algorithm</label>
            <select v-model="algorithm" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none">
              <option value="FIFO">FIFO (First In First Out)</option>
              <option value="LRU">LRU (Least Recently Used)</option>
              <option value="Optimal">Optimal</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground uppercase">Number of Frames</label>
            <input type="number" v-model.number="numFrames" min="1" max="10" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none" />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground uppercase">Page References (Comma separated)</label>
            <input 
              type="text" 
              :value="pageReferences.join(', ')"
              @input="updatePageReferences"
              class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
        </div>
      </Card>

      <!-- Visualization Area -->
      <div class="lg:col-span-3 space-y-6">
        <Card v-if="result">
          <template #header>
            <div class="flex items-center gap-2">
              <Box class="w-5 h-5 text-primary" />
              <span class="font-semibold uppercase tracking-wider text-sm">Step-by-Step Visualization</span>
            </div>
          </template>
          
          <div class="overflow-x-auto pb-4 scrollbar-thin">
            <div class="flex gap-1 min-w-max">
              <div v-for="(step, i) in result.steps" :key="i" class="flex flex-col items-center gap-2">
                <div 
                  class="w-10 h-10 flex items-center justify-center font-bold rounded-lg border transition-all"
                  :class="[
                    step.hit ? 'bg-primary/20 border-primary text-primary neon-glow' : 'bg-destructive/20 border-destructive text-destructive'
                  ]"
                >
                  {{ pageReferences[i] }}
                </div>
                <div class="flex flex-col gap-1">
                  <div 
                    v-for="(frame, fi) in numFrames" :key="fi"
                    class="w-10 h-10 flex items-center justify-center text-xs border border-white/10 rounded-md bg-white/5"
                  >
                    {{ step.frames[fi] !== undefined ? step.frames[fi] : '-' }}
                  </div>
                </div>
                <div class="text-[10px] uppercase font-bold" :class="step.hit ? 'text-primary' : 'text-destructive'">
                  {{ step.hit ? 'Hit' : 'Miss' }}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Metrics Card -->
          <Card v-if="result">
            <template #header>
              <div class="flex items-center gap-2">
                <Activity class="w-5 h-5 text-accent" />
                <span class="font-semibold uppercase tracking-wider text-sm">Efficiency Metrics</span>
              </div>
            </template>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                <div class="text-[10px] text-muted-foreground uppercase mb-1">Page Faults</div>
                <div class="text-2xl font-bold text-destructive">{{ result.metrics.pageFaults }}</div>
              </div>
              <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                <div class="text-[10px] text-muted-foreground uppercase mb-1">Page Hits</div>
                <div class="text-2xl font-bold text-primary">{{ result.metrics.pageHits }}</div>
              </div>
              <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                <div class="text-[10px] text-muted-foreground uppercase mb-1">Hit Ratio</div>
                <div class="text-2xl font-bold text-accent">{{ (result.metrics.hitRatio * 100).toFixed(1) }}%</div>
              </div>
              <div class="p-4 bg-white/5 rounded-xl border border-white/5">
                <div class="text-[10px] text-muted-foreground uppercase mb-1">Fault Ratio</div>
                <div class="text-2xl font-bold text-destructive">{{ (result.metrics.faultRatio * 100).toFixed(1) }}%</div>
              </div>
            </div>
          </Card>

          <Card v-if="result" class="flex flex-col">
            <template #header>
              <div class="flex items-center gap-2">
                <Zap class="w-5 h-5 text-primary" />
                <span class="font-semibold uppercase tracking-wider text-sm">Simulation Summary</span>
              </div>
            </template>
            <div class="flex-grow flex items-center justify-center p-6">
              <div class="relative w-32 h-32">
                 <!-- Simple SVG partial circle for hit ratio -->
                 <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.05)" 
                      stroke-width="10" 
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="hsl(var(--primary))" 
                      stroke-width="10" 
                      :stroke-dasharray="2 * Math.PI * 45"
                      :stroke-dashoffset="2 * Math.PI * 45 * (1 - result.metrics.hitRatio)"
                      class="transition-all duration-1000"
                    />
                 </svg>
                 <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-2xl font-bold">{{ Math.round(result.metrics.hitRatio * 100) }}%</span>
                    <span class="text-[8px] uppercase text-muted-foreground">Hit Ratio</span>
                 </div>
              </div>
            </div>
          </Card>
        </div>

        <Card v-if="!result" class="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Database class="w-12 h-12 mb-4 text-accent" />
          <p>Configure parameters and run simulation to visualize memory behavior</p>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Settings, Box, Activity, Zap, Database } from 'lucide-vue-next'
import Card from '../../ui/Card.vue'
import Button from '../../ui/Button.vue'
import { MemoryManager as Manager } from '../../../utils/memory-manager'
import { MemoryResult, PageReplacementAlgorithm } from '../../../core/types'

const pageReferences = ref<number[]>([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1])
const numFrames = ref(3)
const algorithm = ref<PageReplacementAlgorithm>('FIFO')
const result = ref<MemoryResult | null>(null)

const handleSimulate = () => {
  result.value = Manager.simulate(pageReferences.value, numFrames.value, algorithm.value)
}

const updatePageReferences = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  pageReferences.value = val.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
}

const handleReset = () => {
  result.value = null
}
</script>
