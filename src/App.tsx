
import { useState } from 'react'
import { CPUScheduler } from './components/modules/CPUScheduler/CPUScheduler'
import { MemoryManager } from './components/modules/MemoryManager/MemoryManager'
import { NetworkSimulator } from './components/modules/NetworkSimulator/NetworkSimulator'
import { CompilerPlayground } from './components/modules/CompilerPlayground/CompilerPlayground'
import { DatabaseEngine } from './components/modules/DatabaseEngine/DatabaseEngine'
import { SmoothCursor } from './components/ui/smooth-cursor'
import { Boxes } from './components/ui/background-boxes'
import { ParallaxSection } from './components/shared/ParallaxSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Cpu, HardDrive, Network, Code, Database, Sparkles, Zap, Layers } from 'lucide-react'
import { motion } from 'framer-motion'

function App() {
  const [tabValue, setTabValue] = useState('cpu')
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden cursor-none">
      <SmoothCursor />

      {/* Interactive Background Boxes with 3D perspective */}
      <div className="fixed inset-0 w-full h-full overflow-hidden bg-background z-0">
        <div className="absolute inset-0 w-full h-full bg-background z-20 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
        <Boxes />
      </div>

      {/* Premium gradient overlays for depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none z-[1]"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-background/95 via-background/50 to-background/95 pointer-events-none z-[1]"></div>

      <div className="relative z-10">
        <ParallaxSection speed={0.3}>
          <motion.header
            className="relative px-6 pt-20 pb-16 border-b border-border/30 glass-strong"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Sparkles className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                </motion.div>
                <div>
                  <motion.h1
                    className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    SysLab
                  </motion.h1>
                  <motion.p
                    className="text-muted-foreground text-xl flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Zap className="w-5 h-5 text-accent drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                    From Scheduling to Storage: Systems, Explained
                  </motion.p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <motion.div
                  className="relative overflow-hidden rounded-xl border border-border/50 glass cursor-pointer group"
                  onClick={() => setTabValue('cpu')}
                  role="button"
                  data-interactive
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80" alt="CPU scheduling" className="w-full h-40 object-cover opacity-50 group-hover:opacity-70 transition-opacity" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
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
                  <img src="https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80" alt="Memory management" className="w-full h-40 object-cover opacity-50 group-hover:opacity-70 transition-opacity" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-sm font-semibold text-foreground flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-accent" />
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
                  <img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80" alt="Network simulation" className="w-full h-40 object-cover opacity-50 group-hover:opacity-70 transition-opacity" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Network className="w-4 h-4 text-info" />
                    Network Simulation
                  </div>
                </motion.div>
              </div>
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