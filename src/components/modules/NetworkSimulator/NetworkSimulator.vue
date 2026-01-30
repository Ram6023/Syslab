<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/[0.02] pb-6">
      <div>
        <h2 class="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-info via-white to-info">
            SIGNAL_LINK
        </h2>
        <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1">
            Reliable data transmission & congestion control simulation
        </p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="handleReset" class="backdrop-blur-md">SYS.OFF</Button>
        <Button variant="accent" @click="handleSimulate" :disabled="simulating" class="px-8 shadow-lg shadow-info/20">
          {{ simulating ? 'ACTIVE_LINK...' : 'ESTABLISH_LINK' }}
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Config -->
      <Card class="lg:col-span-1">
        <template #header>
          <div class="flex items-center gap-2">
            <div class="w-1.5 h-1.5 rounded-full bg-info"></div>
            <span class="font-bold uppercase tracking-[0.2em] text-[10px] text-info/80">Parameters</span>
          </div>
        </template>
        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground uppercase">Loss Rate (%)</label>
            <input type="range" v-model.number="lossRate" min="0" max="50" class="w-full accent-info" />
            <div class="text-right text-xs font-bold text-info">{{ lossRate }}%</div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-medium text-muted-foreground uppercase">Network Latency (ms)</label>
            <input type="range" v-model.number="latency" min="10" max="500" class="w-full accent-info" />
            <div class="text-right text-xs font-bold text-info">{{ latency }}ms</div>
          </div>
        </div>
      </Card>

      <!-- Main Visualization -->
      <div class="lg:col-span-2 space-y-6 flex flex-col">
        <Card class="relative min-h-[350px] flex-grow">
          <template #header>
            <div class="flex items-center gap-2">
              <Network class="w-5 h-5 text-info" />
              <span class="font-semibold uppercase tracking-wider text-sm">Real-time Packet Flow</span>
            </div>
          </template>

          <div class="relative h-[250px] mt-8 flex justify-between items-center px-20">
            <!-- Client -->
            <div class="flex flex-col items-center gap-4 z-10">
              <div class="w-20 h-20 glass-strong flex items-center justify-center rounded-2xl border-info/50 neon-glow-accent" style="box-shadow: 0 0 20px rgba(14, 165, 233, 0.2)">
                <Laptop class="w-10 h-10 text-info" />
              </div>
              <span class="text-xs font-bold uppercase tracking-widest text-info">Client</span>
              <div class="text-[10px] text-muted-foreground font-mono">SEQ: {{ currentSeq }}</div>
            </div>

            <!-- Server -->
            <div class="flex flex-col items-center gap-4 z-10">
              <div class="w-20 h-20 glass-strong flex items-center justify-center rounded-2xl border-white/20">
                <Server class="w-10 h-10 text-accent" />
              </div>
              <span class="text-xs font-bold uppercase tracking-widest text-accent">Server</span>
              <div class="text-[10px] text-muted-foreground font-mono">ACK: {{ currentAck }}</div>
            </div>

            <!-- Connection Line -->
            <div class="absolute left-40 right-40 top-[40px] h-0.5 bg-gradient-to-r from-info/30 via-white/5 to-accent/30 opacity-20"></div>

            <!-- Packets -->
            <TransitionGroup name="packet">
              <div 
                v-for="packet in packets" 
                :key="packet.id"
                class="absolute top-[32px] w-4 h-4 rounded-full flex items-center justify-center transition-all duration-1000 ease-linear"
                :style="{ 
                    left: packet.direction === 'request' ? '160px' : 'calc(100% - 176px)',
                    transform: packet.arrived ? (packet.direction === 'request' ? 'translateX(calc(100% - 176px - 160px))' : 'translateX(calc(-100% + 160px + 176px))') : 'none',
                    opacity: packet.lost ? 0 : 1
                }"
              >
                 <div class="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]" :class="packet.direction === 'request' ? 'bg-info' : 'bg-accent'"></div>
                 <div class="absolute -top-6 text-[10px] font-bold whitespace-nowrap" :class="packet.direction === 'request' ? 'text-info' : 'text-accent'">
                    {{ packet.label }}
                 </div>
              </div>
            </TransitionGroup>
          </div>

          <div class="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] max-h-32 overflow-y-auto scrollbar-thin">
            <div v-for="(log, i) in logs" :key="i" class="mb-1" :class="log.color">
               <span class="opacity-50">[{{ log.time }}]</span> {{ log.message }}
            </div>
          </div>
        </Card>

        <!-- Congestion Control Graph -->
        <Card class="h-[200px]">
           <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <TrendingUp class="w-4 h-4 text-primary" />
                <span class="font-semibold uppercase tracking-wider text-[10px]">Congestion Window (cwnd)</span>
              </div>
              <div class="text-[10px] text-muted-foreground font-mono">Current: {{ cwnd }}</div>
            </div>
          </template>
          <div class="h-full w-full py-4 pr-4">
             <svg class="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                <!-- Grid Lines -->
                <line v-for="i in 5" :key="i" x1="0" :y1="i*20" x2="400" :y2="i*20" stroke="rgba(255,255,255,0.05)" stroke-width="1" />
                
                <!-- CWND Path -->
                <path 
                  :d="cwndPath" 
                  fill="none" 
                  stroke="hsl(var(--primary))" 
                  stroke-width="2" 
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="transition-all duration-300"
                />
                
                <!-- Threshold Line -->
                <line x1="0" :y1="100 - ssthresh * 5" x2="400" :y2="100 - ssthresh * 5" stroke="rgba(255,165,0,0.3)" stroke-width="1" stroke-dasharray="4" />
             </svg>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Settings, Network, Laptop, Server, TrendingUp } from 'lucide-vue-next'
import Card from '../../ui/Card.vue'
import Button from '../../ui/Button.vue'

interface Packet {
  id: number
  direction: 'request' | 'response'
  label: string
  arrived: boolean
  lost: boolean
}

interface Log {
  time: string
  message: string
  color: string
}

const lossRate = ref(10)
const latency = ref(100)
const simulating = ref(false)
const packets = ref<Packet[]>([])
const logs = ref<Log[]>([])
const currentSeq = ref(0)
const currentAck = ref(0)

// Congestion Control State
const cwnd = ref(1)
const ssthresh = ref(8)
const cwndHistory = ref<number[]>([1])

const cwndPath = computed(() => {
  if (cwndHistory.value.length < 2) return ''
  const points = cwndHistory.value.map((val, i) => {
    const x = (i / (cwndHistory.value.length - 1 || 1)) * 400
    const y = 100 - (val * 5) // Scale for visualization
    return `${x},${y}`
  }).join(' L ')
  return `M ${points}`
})

let packetId = 0

const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  const colors = {
    info: 'text-info',
    success: 'text-primary',
    warning: 'text-accent',
    error: 'text-destructive'
  }
  logs.value.unshift({
    time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    message,
    color: colors[type]
  })
}

const sendPacket = (direction: 'request' | 'response', label: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const id = ++packetId
    const isLost = Math.random() * 100 < lossRate.value
    
    const packet: Packet = { id, direction, label, arrived: false, lost: false }
    packets.value.push(packet)
    
    addLog(`Sending ${label}...`, direction === 'request' ? 'info' : 'warning')

    setTimeout(() => {
      if (isLost) {
        packet.lost = true
        addLog(`Packet ${label} lost in transit!`, 'error')
        setTimeout(() => {
          packets.value = packets.value.filter(p => p.id !== id)
          resolve(false)
        }, 500)
      } else {
        packet.arrived = true
        setTimeout(() => {
          addLog(`${label} received.`, 'success')
          packets.value = packets.value.filter(p => p.id !== id)
          resolve(true)
        }, 1000)
      }
    }, 100)
  })
}

const handleSimulate = async () => {
  if (simulating.value) return
  simulating.value = true
  logs.value = []
  
  addLog('Starting TCP 3-way handshake...', 'info')
  
  // SYN
  const syn = await sendPacket('request', 'SYN')
  if (!syn) {
    addLog('Handshake failed: SYN lost.', 'error')
    simulating.value = false
    return
  }
  
  // SYN-ACK
  const synAck = await sendPacket('response', 'SYN-ACK')
  if (!synAck) {
    addLog('Handshake failed: SYN-ACK lost.', 'error')
    simulating.value = false
    return
  }
  
  // ACK
  const ack = await sendPacket('request', 'ACK')
  if (!ack) {
    addLog('Handshake failed: ACK lost.', 'error')
    simulating.value = false
    return
  }
  
  addLog('Connection established.', 'success')
  currentSeq.value = 1
  currentAck.value = 1
  
  // Data Transfer
  for (let i = 1; i <= 5; i++) {
    const data = await sendPacket('request', `DATA (SEQ=${currentSeq.value})`)
    if (data) {
      const dack = await sendPacket('response', `ACK (ACK=${currentSeq.value + 1})`)
      if (dack) {
        currentSeq.value++
        currentAck.value++
        
        // Congestion Control: Success (AI)
        if (cwnd.value < ssthresh.value) {
           cwnd.value *= 2 // Slow Start
        } else {
           cwnd.value += 1 // Congestion Avoidance
        }
        addLog(`ACK received. cwnd updated to ${cwnd.value}`, 'success')
      } else {
        addLog('Data ACK lost. Entering Fast Recovery...', 'warning')
        // Congestion Control: Loss (MD)
        ssthresh.value = Math.max(Math.floor(cwnd.value / 2), 2)
        cwnd.value = 1
        i-- // Retransmit
      }
    } else {
      addLog('Data lost. Entering Fast Retransmit...', 'warning')
      ssthresh.value = Math.max(Math.floor(cwnd.value / 2), 2)
      cwnd.value = 1
      i--
    }
    cwndHistory.value.push(cwnd.value)
    if (cwndHistory.value.length > 20) cwndHistory.value.shift()
  }
  
  addLog('Simulation complete.', 'success')
  simulating.value = false
}

const handleReset = () => {
  packets.value = []
  logs.value = []
  simulating.value = false
  currentSeq.value = 0
  currentAck.value = 0
}
</script>

<style scoped>
.packet-enter-active,
.packet-leave-active {
  transition: all 0.5s ease;
}
.packet-enter-from {
  opacity: 0;
  scale: 0.5;
}
.packet-leave-to {
  opacity: 0;
  scale: 1.5;
}
</style>
