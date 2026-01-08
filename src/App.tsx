
import { useState } from 'react'
import { CPUScheduler } from './components/modules/CPUScheduler/CPUScheduler'
import { MemoryManager } from './components/modules/MemoryManager/MemoryManager'
import { NetworkSimulator } from './components/modules/NetworkSimulator/NetworkSimulator'
import { CompilerPlayground } from './components/modules/CompilerPlayground/CompilerPlayground'
import { DatabaseEngine } from './components/modules/DatabaseEngine/DatabaseEngine'
import { SmoothCursor } from './components/ui/smooth-cursor'
import { ParallaxSection } from './components/shared/ParallaxSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Cpu, HardDrive, Network, Code, Database, Zap, Layers } from 'lucide-react'
import { motion } from 'framer-motion'

function App() {
  const [tabValue, setTabValue] = useState('cpu')
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden cursor-none">
      <SmoothCursor />

      {/* Simple gradient background - no grid */}
      <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-background via-background to-background/95 z-0" />

      <div className="relative z-10">
        <ParallaxSection speed={0.3}>
          <motion.header
            className="relative px-6 py-8 min-h-screen flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center justify-center gap-2 mb-4">
                <motion.div
                  className="relative rounded-xl overflow-hidden"
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ transition: "all 0.3s ease" }}
                >
                  <img
                    src="/syslab-text-logo.png"
                    alt="SysLab Logo"
                    className="w-96 md:w-[500px] lg:w-[800px] h-auto object-contain drop-shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:drop-shadow-[0_0_45px_rgba(34,197,94,0.8)] transition-all duration-300"
                  />
                </motion.div>
                <motion.p
                  className="text-muted-foreground text-base md:text-lg flex items-center gap-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Zap className="w-5 h-5 text-accent drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  From Scheduling to Storage: Systems, Explained
                </motion.p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-5xl mx-auto">
                <motion.div
                  className="relative overflow-hidden rounded-xl border border-border/50 glass cursor-pointer group"
                  onClick={() => setTabValue('cpu')}
                  role="button"
                  data-interactive
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80" alt="CPU scheduling" className="w-full h-52 md:h-64 lg:h-72 object-cover opacity-50 group-hover:opacity-70 transition-opacity" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 text-lg md:text-xl font-bold text-foreground flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-primary" />
                    CPU Scheduling
                  </div>
                </motion.div>
                <motion.div
                  className="relative overflow-hidden rounded-xl border border-border/50 glass cursor-pointer group"
                  onClick={() => setTabValue('memory')}
                  role="button"
                  data-interactive
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src="https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80" alt="Memory management" className="w-full h-52 md:h-64 lg:h-72 object-cover opacity-50 group-hover:opacity-70 transition-opacity" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 text-lg md:text-xl font-bold text-foreground flex items-center gap-3">
                    <HardDrive className="w-6 h-6 text-accent" />
                    Memory Management
                  </div>
                </motion.div>
                <motion.div
                  className="relative overflow-hidden rounded-xl border border-border/50 glass cursor-pointer group"
                  onClick={() => setTabValue('network')}
                  role="button"
                  data-interactive
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" alt="Network simulation" className="w-full h-52 md:h-64 lg:h-72 object-cover opacity-50 group-hover:opacity-70 transition-opacity" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 text-lg md:text-xl font-bold text-foreground flex items-center gap-3">
                    <Network className="w-6 h-6 text-info" />
                    Network Simulation
                  </div>
                </motion.div>
              </div>

              {/* Scroll to Explore Indicator */}
              <motion.div
                className="flex flex-col items-center gap-2 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Scroll to Explore</p>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  </svg>
                </motion.div>
              </motion.div>
            </div>
          </motion.header>
        </ParallaxSection>

        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={tabValue} onValueChange={setTabValue} className="w-full">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <TabsList className="grid w-full grid-cols-5 mb-8 p-1.5 glass-strong rounded-xl shadow-lg">
                  <TabsTrigger
                    value="cpu"
                    className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 rounded-lg py-3 font-medium"
                    data-interactive
                  >
                    <Cpu className="w-4 h-4" />
                    <span className="hidden sm:inline">CPU</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="memory"
                    className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent/20 data-[state=active]:to-accent/10 data-[state=active]:text-accent data-[state=active]:shadow-lg data-[state=active]:shadow-accent/20 rounded-lg py-3 font-medium"
                    data-interactive
                  >
                    <HardDrive className="w-4 h-4" />
                    <span className="hidden sm:inline">Memory</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="network"
                    className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-info/20 data-[state=active]:to-info/10 data-[state=active]:text-info data-[state=active]:shadow-lg data-[state=active]:shadow-info/20 rounded-lg py-3 font-medium"
                    data-interactive
                  >
                    <Network className="w-4 h-4" />
                    <span className="hidden sm:inline">Network</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="compiler"
                    className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-warning/20 data-[state=active]:to-warning/10 data-[state=active]:text-warning data-[state=active]:shadow-lg data-[state=active]:shadow-warning/20 rounded-lg py-3 font-medium"
                    data-interactive
                  >
                    <Code className="w-4 h-4" />
                    <span className="hidden sm:inline">Compiler</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="database"
                    className="flex items-center gap-2 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-accent/10 data-[state=active]:text-primary data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 rounded-lg py-3 font-medium"
                    data-interactive
                  >
                    <Database className="w-4 h-4" />
                    <span className="hidden sm:inline">Database</span>
                  </TabsTrigger>
                </TabsList>
              </motion.div>

              <TabsContent value="cpu" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CPUScheduler />
                </motion.div>
              </TabsContent>

              <TabsContent value="memory" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <MemoryManager />
                </motion.div>
              </TabsContent>

              <TabsContent value="network" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <NetworkSimulator />
                </motion.div>
              </TabsContent>

              <TabsContent value="compiler" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <CompilerPlayground />
                </motion.div>
              </TabsContent>

              <TabsContent value="database" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <DatabaseEngine />
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <ParallaxSection speed={0.1}>
          <motion.footer
            className="mt-16 px-6 py-8 border-t border-border/50 backdrop-blur-sm bg-background/30"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="max-w-7xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Layers className="w-4 h-4" />
                <span className="text-sm">SysLab — From Scheduling to Storage: Systems, Explained</span>
              </div>
            </div>
          </motion.footer>
        </ParallaxSection>
      </div>
    </div>
  );
}

export default App;