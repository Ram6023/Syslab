<template>
  <div class="h-screen w-screen bg-black text-white relative flex overflow-hidden">
    <!-- Boot Sequence / Loading Overlay -->
    <Transition name="fade">
      <div v-if="booting" class="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono">
        <div class="space-y-4 max-w-md w-full px-10">
          <div class="text-primary font-black text-2xl tracking-widest mb-10">SYSLAB_INIT_v2.0</div>
          <div v-for="(log, i) in bootLogs" :key="i" class="text-xs text-muted-foreground animate-pulse">
            <span class="text-primary">></span> {{ log }}
          </div>
          <div class="h-1 bg-white/5 rounded-full overflow-hidden mt-10">
            <div class="h-full bg-primary transition-all duration-300" :style="{ width: `${bootProgress}%` }"></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Background Interactive Layer -->
    <GridBackground />

    <!-- Sidebar Mini-Dock -->
    <aside class="w-16 md:w-20 h-full glass border-r border-white/5 flex flex-col items-center py-6 z-50">
      <!-- Branded Logo Section -->
      <div class="mb-10 flex flex-col items-center gap-1 group cursor-default">
        <div class="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform duration-500">
          <Layers class="w-5 h-5 text-black" />
        </div>
        <div class="mt-2 flex flex-col items-center">
            <span class="text-[10px] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent uppercase leading-none">Sys</span>
            <span class="text-[10px] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary uppercase leading-none">Lab</span>
        </div>
      </div>

      <div class="flex-grow flex flex-col gap-6">
        <button 
          v-for="mod in modules" 
          :key="mod.id"
          @click="activeModule = mod.id"
          class="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group"
          :class="[activeModule === mod.id ? 'bg-primary/20 text-primary neon-glow-primary scale-110 shadow-xl' : 'hover:bg-white/5 text-muted-foreground']"
        >
          <component :is="mod.icon" class="w-5 h-5 group-hover:scale-110 transition-transform" />
          <div class="absolute left-full ml-4 px-2 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-primary text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all shadow-2xl whitespace-nowrap z-50">
            {{ mod.name }}
          </div>
        </button>
      </div>

      <div class="mt-auto pb-4">
        <!-- Removed Settings Option as requested -->
        <div class="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
      </div>
    </aside>

    <!-- Main Command Interface -->
    <main class="flex-grow flex flex-col relative z-10">
      <!-- Top Title Bar (Floating) -->
      <div class="h-20 flex items-center justify-between px-10 border-b border-white/[0.02]">
        <div class="flex items-center gap-6">
          <div class="flex flex-col">
            <h1 class="text-[10px] font-black tracking-[0.4em] uppercase text-primary/60">
                Functional Terminal
            </h1>
            <div class="flex items-center gap-3">
                <div class="h-px w-4 bg-accent/50"></div>
                <span class="text-xl font-black italic tracking-tight text-white uppercase">{{ currentModuleName }}</span>
            </div>
          </div>
        </div>
        
        <div class="flex items-center gap-8">
          <div class="hidden md:flex flex-col items-end gap-1">
            <div class="flex items-center gap-2">
                <span class="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Network_Link</span>
                <div class="flex gap-0.5">
                    <div v-for="i in 4" :key="i" class="w-1 h-2 rounded-full" :class="i < 4 ? 'bg-primary' : 'bg-white/10'"></div>
                </div>
            </div>
            <div class="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-primary to-accent animate-pulse" :style="{ width: '74%' }"></div>
            </div>
          </div>
          
          <div class="glass-pill px-4 py-2 flex items-center gap-3 border-white/5 shadow-inner">
             <Activity class="w-3 h-3 text-primary animate-pulse" />
             <span class="text-xs font-mono font-bold text-primary/80 tabular-nums">{{ currentTime }}</span>
          </div>
        </div>
      </div>

      <!-- Centered Workspace Stage -->
      <div class="flex-grow p-10 flex items-center justify-center overflow-auto scrollbar-thin">
        <div class="w-full max-w-6xl h-full flex flex-col">
          <Transition name="layout-change" mode="out-in">
            <div :key="activeModule" class="h-full">
              <CPUScheduler v-if="activeModule === 'cpu'" />
              <MemoryManager v-if="activeModule === 'memory'" />
              <NetworkSimulator v-if="activeModule === 'network'" />
              <CompilerPlayground v-if="activeModule === 'compiler'" />
              <DatabaseEngine v-if="activeModule === 'database'" />
            </div>
          </Transition>
        </div>
      </div>

      <!-- Bottom System Status Bar -->
      <footer class="h-10 bg-black border-t border-white/5 flex items-center justify-between px-6 text-[9px] uppercase font-bold tracking-widest text-muted-foreground/50">
        <div class="flex gap-6 items-center">
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
            <span>System Active</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-accent"></div>
            <span>Vite_Dev_Server_v5.4.21</span>
          </div>
        </div>
        <div class="flex gap-10">
          <span>Mem_Usage: 512MB</span>
          <span>Core_Temp: 42°C</span>
          <span class="text-primary hover:text-primary-foreground cursor-pointer transition-colors">© 2026 SYSLAB_CORE</span>
        </div>
      </footer>
    </main>

    <!-- Floating Global Decoration -->
    <div class="absolute bottom-20 right-10 pointer-events-none select-none opacity-5 animate-float">
      <div class="text-[120px] font-black leading-none tracking-tighter">CORE</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
    Layers, Cpu, HardDrive, Network, Code, Database, 
    Settings, Activity 
} from 'lucide-vue-next'
import GridBackground from './components/shared/GridBackground.vue'

// Modules
import CPUScheduler from './components/modules/CPUScheduler/CPUScheduler.vue'
import MemoryManager from './components/modules/MemoryManager/MemoryManager.vue'
import NetworkSimulator from './components/modules/NetworkSimulator/NetworkSimulator.vue'
import CompilerPlayground from './components/modules/CompilerPlayground/CompilerPlayground.vue'
import DatabaseEngine from './components/modules/DatabaseEngine/DatabaseEngine.vue'

const activeModule = ref('cpu')
const booting = ref(true)
const bootProgress = ref(0)
const bootLogs = ref<string[]>([])
const currentTime = ref('')

const modules = [
  { id: 'cpu', name: 'Process Control', icon: Cpu },
  { id: 'memory', name: 'Memory Space', icon: HardDrive },
  { id: 'network', name: 'Signal Link', icon: Network },
  { id: 'compiler', name: 'Code Logic', icon: Code },
  { id: 'database', name: 'Data Storage', icon: Database },
]

const currentModuleName = computed(() => {
  return modules.find(m => m.id === activeModule.value)?.name
})

const runBootSequence = async () => {
  const steps = [
    'Initializing kernel structures...',
    'Loading CPUScheduler.sys...',
    'Mapping memory frames...',
    'Establishing network sockets...',
    'Optimizing B-Tree indices...',
    'Starting visual simulation engine...'
  ]

  for (let i = 0; i < steps.length; i++) {
    bootLogs.value.push(steps[i])
    bootProgress.value = ((i + 1) / steps.length) * 100
    await new Promise(r => setTimeout(r, 600))
  }
  
  setTimeout(() => {
    booting.value = false
  }, 1000)
}

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

onMounted(() => {
  runBootSequence()
  updateTime()
  setInterval(updateTime, 1000)
})
</script>

<style>
.layout-change-enter-active,
.layout-change-leave-active {
  transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.layout-change-enter-from {
  opacity: 0;
  transform: scale(1.05) translateY(20px);
  filter: blur(10px);
}

.layout-change-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
  filter: blur(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 3s ease infinite;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.98);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(1.02);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(34, 197, 94, 0.2);
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(34, 197, 94, 0.4);
}
</style>
