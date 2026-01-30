<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-white/[0.02] pb-6">
      <div>
        <h2 class="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-primary via-white to-primary">
            DATA_STORAGE
        </h2>
        <p class="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground mt-1">
            B-Tree index traversal & structured data optimization
        </p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="handleReset" class="backdrop-blur-md">SYS.DEFRAG</Button>
        <Button variant="accent" @click="handleExecute" class="px-8 shadow-lg shadow-primary/20">FETCH_QUERY</Button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Query Editor & Stats -->
      <div class="lg:col-span-1 space-y-6">
        <Card>
          <template #header>
            <div class="flex items-center gap-2">
              <Search class="w-5 h-5 text-primary" />
              <span class="font-semibold uppercase tracking-wider text-sm">Query Planner</span>
            </div>
          </template>
          <div class="space-y-4">
             <div class="space-y-2">
                <label class="text-xs font-medium text-muted-foreground uppercase">SELECT Query</label>
                <div class="flex items-center gap-2 p-3 bg-black/40 border border-white/5 rounded-lg text-sm font-mono">
                   <span class="text-muted-foreground">SELECT * FROM data WHERE id =</span>
                   <input 
                    type="number" 
                    v-model.number="queryId" 
                    class="bg-transparent border-b border-primary w-12 text-center focus:outline-none"
                   />
                </div>
             </div>

             <div v-if="result" class="space-y-3 pt-4 border-t border-white/5 relative">
                <!-- Disk I/O Indicator -->
                <div class="absolute -top-1 right-0 flex items-center gap-1">
                   <span class="text-[8px] uppercase text-muted-foreground">Disk I/O</span>
                   <div class="w-1.5 h-1.5 rounded-full bg-accent" :class="{ 'animate-ping': simulating }"></div>
                </div>

                <div class="flex justify-between items-center group">
                   <span class="text-xs uppercase text-muted-foreground group-hover:text-primary transition-colors">Search Type</span>
                   <span class="text-xs font-black px-2 py-0.5 rounded bg-primary/20 text-primary neon-glow-primary">{{ result.executionPlan.type }}</span>
                </div>
                <div class="flex justify-between items-center group">
                   <span class="text-xs uppercase text-muted-foreground group-hover:text-primary transition-colors">Access Method</span>
                   <span class="text-xs font-black" :class="result.executionPlan.indexUsed ? 'text-primary' : 'text-destructive'">
                      {{ result.executionPlan.indexUsed ? 'INDEX SCAN' : 'FULL TABLE SCAN' }}
                   </span>
                </div>
                <div class="flex justify-between items-center group">
                   <span class="text-xs uppercase text-muted-foreground group-hover:text-primary transition-colors">Disk Cost</span>
                   <span class="text-xs font-black text-accent tabular-nums">{{ result.metrics.diskIO }} <span class="text-[8px] opacity-50">pages</span></span>
                </div>
             </div>
          </div>
        </Card>

        <Card class="flex-grow">
           <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Table2 class="w-5 h-5 text-accent" />
                <span class="font-semibold uppercase tracking-wider text-sm">Raw Table Storage</span>
              </div>
              <span class="text-[10px] text-muted-foreground font-mono">pages: {{ Math.ceil(tableData.length / 4) }}</span>
            </div>
          </template>
          <div class="max-h-[250px] overflow-y-auto scrollbar-thin pr-2">
             <div class="grid grid-cols-1 gap-1">
                <div v-for="item in tableData" :key="item.id" 
                  class="flex items-center justify-between px-3 py-2 bg-white/[0.02] border border-white/5 rounded-lg hover:bg-white/[0.05] hover:border-primary/30 transition-all group"
                  :class="{ 'border-primary/50 bg-primary/10': result && result.executionPlan.rowsMatched.includes(item.id) }"
                >
                   <div class="flex items-center gap-3">
                      <span class="text-[10px] font-mono text-muted-foreground w-4">#{{ item.id }}</span>
                      <span class="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{{ item.value }}</span>
                   </div>
                   <div v-if="result && result.executionPlan.rowsMatched.includes(item.id)" class="text-[8px] uppercase font-black text-primary">Found</div>
                </div>
             </div>
          </div>
        </Card>
      </div>

      <!-- B-Tree Visualization -->
      <Card class="lg:col-span-2">
        <template #header>
          <div class="flex items-center gap-2">
            <GitGraph class="w-5 h-5 text-primary" />
            <span class="font-semibold uppercase tracking-wider text-sm">B-Tree Index Structure</span>
          </div>
        </template>
        
        <div class="h-[400px] relative overflow-auto p-4 flex flex-col items-center">
           <!-- Tree Root -->
           <div v-if="treeData" class="space-y-12 flex flex-col items-center">
              <TreeNode :node="treeData" :highlight-id="queryId" />
           </div>
           
           <div v-if="!treeData" class="flex flex-col items-center justify-center h-full opacity-50">
              <Database class="w-12 h-12 mb-4" />
              <p>Execute a query to see index traversal</p>
           </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, GitGraph, Table2, Database } from 'lucide-vue-next'
import Card from '../../ui/Card.vue'
import Button from '../../ui/Button.vue'
import TreeNode from './TreeNode.vue'
import { DatabaseEngine as Engine } from '../../../utils/database-engine'

const queryId = ref(42)
const tableData = ref<any[]>([])
const treeData = ref<any>(null)
const result = ref<any>(null)
const simulating = ref(false)

const handleExecute = async () => {
    simulating.value = true
    await new Promise(r => setTimeout(r, 800)) // Simulate disk latency
    result.value = Engine.query(queryId.value)
    treeData.value = Engine.getBTreeStructure()
    simulating.value = false
}

const handleReset = () => {
    result.value = null
    queryId.value = 42
}

onMounted(() => {
    tableData.value = Engine.getTableData()
    treeData.value = Engine.getBTreeStructure()
})
</script>
