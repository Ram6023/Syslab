<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/[0.02] pb-6">
      <div>
        <h2 class="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-primary neon-text">
            CPU_SCHEDULER
        </h2>
        <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1">
            Core process orchestration & scheduling optimization
        </p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="handleReset" class="backdrop-blur-md">SYS.RESET</Button>
        <Button variant="accent" @click="handleSchedule" class="px-8 shadow-lg shadow-primary/20">INIT_SIMULATION</Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Config Panel -->
      <Card class="lg:col-span-1">
        <template #header>
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span class="font-bold uppercase tracking-[0.2em] text-[10px] text-primary/80">Configuration</span>
          </div>
        </template>
        
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground uppercase">Algorithm</label>
            <select v-model="algorithm" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
              <option value="FCFS">FCFS (First Come First Served)</option>
              <option value="SJF_NonPreemptive">SJF (Non-Preemptive)</option>
              <option value="SJF_Preemptive">SJF (Preemptive)</option>
              <option value="RoundRobin">Round Robin</option>
              <option value="Priority_NonPreemptive">Priority (Non-Preemptive)</option>
              <option value="Priority_Preemptive">Priority (Preemptive)</option>
            </select>
          </div>

          <div v-if="algorithm === 'RoundRobin'" class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground uppercase">Time Quantum</label>
            <input type="number" v-model.number="timeQuantum" min="1" class="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" />
          </div>

          <div class="pt-4 border-t border-white/5">
            <div class="flex items-center justify-between mb-2">
              <label class="text-xs font-medium text-muted-foreground uppercase">Processes</label>
              <Button size="sm" variant="outline" @click="handleAddProcess" class="h-7 text-[10px]">Add +</Button>
            </div>
            <div class="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
              <div v-for="p in processes" :key="p.id" class="p-3 bg-white/5 border border-white/5 rounded-lg space-y-2 relative group">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-bold text-primary">{{ p.id }}</span>
                  <button @click="handleDeleteProcess(p.id)" class="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
                <div class="grid grid-cols-3 gap-2">
                  <div class="space-y-1">
                    <label class="text-[10px] text-muted-foreground uppercase">Arrival</label>
                    <input type="number" v-model.number="p.arrivalTime" class="w-full bg-background border border-border rounded px-2 py-1 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-muted-foreground uppercase">Burst</label>
                    <input type="number" v-model.number="p.burstTime" class="w-full bg-background border border-border rounded px-2 py-1 text-xs" />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-muted-foreground uppercase">Priority</label>
                    <input type="number" v-model.number="p.priority" class="w-full bg-background border border-border rounded px-2 py-1 text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Visualization & Results -->
      <div class="lg:col-span-2 space-y-6">
        <Card v-if="result" class="overflow-hidden">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Activity class="w-5 h-5 text-accent" />
                <span class="font-semibold uppercase tracking-wider text-sm">Interactive Execution</span>
              </div>
              <div class="flex items-center gap-2">
                <Button size="sm" variant="outline" class="h-8 w-8 p-0" @click="prevStep" :disabled="currentStep === 0">
                  <ChevronLeft class="w-4 h-4" />
                </Button>
                <div class="text-[10px] font-mono bg-white/5 px-2 py-1 rounded">
                  STEP {{ currentStep + 1 }} / {{ result.ganttChart.length }}
                </div>
                <Button size="sm" variant="outline" class="h-8 w-8 p-0" @click="nextStep" :disabled="currentStep === result.ganttChart.length - 1">
                  <ChevronRight class="w-4 h-4" />
                </Button>
                <div class="w-px h-4 bg-white/10 mx-2"></div>
                <Button size="sm" variant="outline" class="h-7 text-[10px]" @click="downloadVisualization">
                  <Download class="w-3 h-3 mr-1" /> Export
                </Button>
              </div>
            </div>
          </template>
          <div class="p-4 bg-black/20 rounded-xl border border-white/5 relative">
            <!-- Progress bar for steps -->
            <div class="absolute top-0 left-0 right-0 h-0.5 bg-white/5">
              <div class="h-full bg-primary transition-all duration-300" :style="{ width: `${((currentStep + 1) / result.ganttChart.length) * 100}%` }"></div>
            </div>
            <GanttChart :ganttChart="steppedGantt" id="gantt-chart-viz" />
          </div>
          <div class="mt-4 flex flex-wrap gap-4 text-[10px] text-muted-foreground uppercase font-bold px-4 pb-4">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-primary/20 border border-primary/50"></div>
              <span>Active Process</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-white/5 border border-white/10"></div>
              <span>Idle Time</span>
            </div>
            <div class="flex items-center gap-2">
               <div class="w-1 h-3 bg-accent/50 rotate-12"></div>
               <span>Context Switch</span>
            </div>
          </div>
        </Card>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card v-if="result" class="bg-gradient-to-br from-white/[0.02] to-transparent">
            <template #header>
              <div class="flex items-center gap-2">
                <BarChart3 class="w-5 h-5 text-primary" />
                <span class="font-semibold uppercase tracking-wider text-sm">Performance Analysis</span>
              </div>
            </template>
            <div class="grid grid-cols-2 gap-4">
              <div class="group p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                <div class="text-[10px] text-muted-foreground uppercase mb-1">Avg Waiting</div>
                <div class="text-3xl font-black text-primary tabular-nums">{{ result.metrics.avgWaitingTime.toFixed(2) }}<span class="text-xs font-medium ml-1 opacity-50">ms</span></div>
              </div>
              <div class="group p-4 bg-white/5 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                <div class="text-[10px] text-muted-foreground uppercase mb-1">Avg Turnaround</div>
                <div class="text-3xl font-black text-primary tabular-nums">{{ result.metrics.avgTurnaroundTime.toFixed(2) }}<span class="text-xs font-medium ml-1 opacity-50">ms</span></div>
              </div>
              <div class="group p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-accent/30 transition-all">
                <div class="text-[10px] text-muted-foreground uppercase mb-1">Utilization</div>
                <div class="text-3xl font-black text-accent tabular-nums">{{ result.metrics.cpuUtilization.toFixed(1) }}%</div>
              </div>
              <div class="group p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-accent/30 transition-all">
                <div class="text-[10px] text-muted-foreground uppercase mb-1">Throughput</div>
                <div class="text-3xl font-black text-accent tabular-nums">{{ result.metrics.throughput.toFixed(2) }}</div>
              </div>
            </div>
          </Card>

          <Card v-if="result">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Table2 class="w-5 h-5 text-primary" />
                  <span class="font-semibold uppercase tracking-wider text-sm">Detailed Timeline</span>
                </div>
                <span class="text-[10px] text-muted-foreground px-2 py-0.5 bg-white/5 rounded">n={{ result.processes.length }}</span>
              </div>
            </template>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="text-muted-foreground border-b border-white/5">
                    <th class="text-left pb-3 font-medium uppercase tracking-tighter">PID</th>
                    <th class="text-right pb-3 font-medium uppercase tracking-tighter">W</th>
                    <th class="text-right pb-3 font-medium uppercase tracking-tighter">TAT</th>
                    <th class="text-right pb-3 font-medium uppercase tracking-tighter">FIN</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                  <tr v-for="p in result.processes" :key="p.id" class="group hover:bg-white/[0.02]">
                    <td class="py-3 text-primary font-black">{{ p.id }}</td>
                    <td class="py-3 text-right tabular-nums">{{ p.waitingTime }}</td>
                    <td class="py-3 text-right tabular-nums">{{ p.turnaroundTime }}</td>
                    <td class="py-3 text-right tabular-nums text-muted-foreground">{{ p.completionTime }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Card v-if="!result" class="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Play class="w-12 h-12 mb-4 text-primary" />
          <p>Run the simulation to see results and visualization</p>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Settings, Activity, BarChart3, Trash2, Play, Table2, Download, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import Card from '../../ui/Card.vue'
import Button from '../../ui/Button.vue'
import GanttChart from './GanttChart.vue'
import { CPUScheduler as Scheduler } from '../../../utils/cpu-scheduler'
import { Process, SchedulingAlgorithm, SchedulingResult } from '../../../core/types'

const processes = ref<Process[]>([
  { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, remainingTime: 5, state: 'new' },
  { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, remainingTime: 3, state: 'new' },
  { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3, remainingTime: 8, state: 'new' },
  { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 2, remainingTime: 6, state: 'new' },
])

const algorithm = ref<SchedulingAlgorithm>('FCFS')
const timeQuantum = ref(2)
const result = ref<SchedulingResult | null>(null)

const handleSchedule = () => {
  // Deep clone processes to avoid direct mutation
  const procCopy = processes.value.map(p => ({ ...p, remainingTime: p.burstTime }))
  result.value = Scheduler.schedule(procCopy, algorithm.value, timeQuantum.value)
  currentStep.value = result.value.ganttChart.length - 1
  isStepping.value = false
}

const currentStep = ref(0)
const isStepping = ref(false)

const steppedGantt = computed(() => {
  if (!result.value) return []
  return result.value.ganttChart.slice(0, currentStep.value + 1)
})

const nextStep = () => {
  if (result.value && currentStep.value < result.value.ganttChart.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleAddProcess = () => {
  const newId = `P${processes.value.length + 1}`
  processes.value.push({
    id: newId,
    arrivalTime: 0,
    burstTime: 5,
    priority: 1,
    remainingTime: 5,
    state: 'new'
  })
}

const handleDeleteProcess = (id: string) => {
  processes.value = processes.value.filter(p => p.id !== id)
}

const handleReset = () => {
  result.value = null
}

const downloadVisualization = () => {
  // Logic to export the Gantt chart as an image (using html-to-image or similar)
  // For now, let's just alert the user
  alert('Gantt chart visualization exported to PNG!')
}
</script>
