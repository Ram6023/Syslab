<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/[0.02] pb-6">
      <div>
        <h2 class="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-warning via-white to-warning">
            CODE_LOGIC
        </h2>
        <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1">
            Lexical analysis & bytecode execution engine
        </p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="handleReset" class="backdrop-blur-md">SYS.CLEAR</Button>
        <Button variant="accent" @click="handleCompile" :disabled="compiling" class="px-8 shadow-lg shadow-warning/20">
          {{ compiling ? 'COMPILING...' : 'EXECUTE_KERNEL' }}
        </Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <!-- Editor -->
      <Card class="flex flex-col h-full bg-black/40 border-white/5">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Code2 class="w-5 h-5 text-warning" />
              <span class="font-semibold uppercase tracking-wider text-sm">Source Code Editor</span>
            </div>
            <div class="flex gap-2">
               <div class="px-2 py-0.5 rounded-full bg-warning/20 text-warning text-[8px] font-black uppercase">v2.0_STD</div>
            </div>
          </div>
        </template>
        <div class="flex-grow flex font-mono text-sm overflow-hidden min-h-[400px]">
           <!-- Gutter -->
           <div class="w-10 bg-black/60 text-right pr-2 py-4 text-white/20 select-none border-r border-white/5">
              <div v-for="i in 20" :key="i">{{ i }}</div>
           </div>
           <textarea 
            v-model="sourceCode"
            class="flex-grow p-4 bg-transparent outline-none focus:ring-0 resize-none"
            spellcheck="false"
            placeholder="// Enter your code here..."
           ></textarea>
        </div>
      </Card>

      <!-- Output / AST -->
      <div class="space-y-6 flex flex-col h-full">
        <Card class="flex-grow bg-black/60 border-primary/20">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Terminal class="w-5 h-5 text-primary" />
                <span class="font-semibold uppercase tracking-wider text-sm">Kernel Console</span>
              </div>
              <Activity class="w-4 h-4 text-primary animate-pulse" />
            </div>
          </template>
          <div class="p-6 font-mono text-sm h-[200px] overflow-y-auto scrollbar-thin">
            <div v-for="(line, i) in output" :key="i" class="mb-2 text-primary flex gap-3">
              <span class="opacity-30">[{{ i.toString().padStart(2, '0') }}]</span>
              <span class="text-primary-foreground font-bold">{{ line }}</span>
            </div>
            <div v-if="error" class="bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-destructive text-xs mt-2">
               <span class="font-black mr-2">FATAL_ERR:</span> {{ error }}
            </div>
            <div v-if="output.length === 0 && !error" class="text-white/10 italic text-center py-10">
               Awaiting execution signal...
            </div>
          </div>
        </Card>

        <Card>
          <template #header>
            <div class="flex items-center gap-2">
              <Cpu class="w-5 h-5 text-accent" />
              <span class="font-semibold uppercase tracking-wider text-sm">Lexical Buffer</span>
            </div>
          </template>
          <div class="p-4 grid grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto max-h-[150px] scrollbar-thin">
             <div 
              v-for="(token, i) in tokens" 
              :key="i"
              class="px-2 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[9px] font-mono hover:border-accent/50 transition-colors"
             >
                <span class="text-muted-foreground opacity-50">{{ token.type }}</span>
                <div class="text-accent font-bold truncate">{{ token.value }}</div>
             </div>
             <div v-if="tokens.length === 0" class="col-span-3 text-white/5 italic text-center text-xs p-4">
                No tokens in buffer
             </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Code2, Terminal, Cpu, Activity } from 'lucide-vue-next'
import Card from '../../ui/Card.vue'
import Button from '../../ui/Button.vue'
import { Compiler } from '../../../utils/compiler'

const sourceCode = ref('LET x = 10;\nLET y = 20;\nPRINT x + y;')
const compiling = ref(false)
const output = ref<string[]>([])
const tokens = ref<any[]>([])
const error = ref<string | null>(null)

const handleCompile = async () => {
  compiling.value = true
  output.value = []
  error.value = null
  tokens.value = []
  
  try {
    const result = Compiler.compile(sourceCode.value)
    output.value = result.output
    tokens.value = result.tokens
  } catch (err: any) {
    error.value = err.message || 'An unknown error occurred'
  } finally {
    compiling.value = false
  }
}

const handleReset = () => {
  sourceCode.value = 'LET x = 10;\nLET y = 20;\nPRINT x + y;'
  output.value = []
  tokens.value = []
  error.value = null
}
</script>
