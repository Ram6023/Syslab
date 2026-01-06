# Engineer's Control Panel - Systems Engineering Lab

## Project Overview
Single-page application providing interactive systems engineering simulators with visualization, metrics, and deterministic execution.

## Architecture

### Core Modules
1. **CPU Scheduling & Process Control**
   - FCFS, SJF (preemptive/non-preemptive), Round Robin
   - Gantt chart visualization
   - Metrics: waiting time, turnaround, CPU utilization

2. **Memory Management & Page Replacement**
   - FIFO, LRU, Optimal algorithms
   - Frame-by-frame visualization
   - Metrics: page faults, hit ratio

3. **Network Protocol & Packet Flow**
   - TCP-like connection lifecycle
   - Packet loss and retransmission
   - Metrics: throughput, retransmission rate

4. **Compiler Playground**
   - Lexer, parser, AST generation
   - Interpreter execution
   - Metrics: execution steps, errors

5. **Database Engine Internals**
   - In-memory key-value store
   - B-Tree indexing
   - Metrics: query latency, I/O count

### Shared Infrastructure
- Simulation Core: discrete event engine
- Metrics Engine: unified collection/export
- Visualization Layer: Canvas/SVG rendering

## Task Breakdown

### Phase 1: Foundation ✅
- [x] Design system and base layout
- [x] Shared simulation engine
- [x] Metrics framework
- [x] Visualization primitives

### Phase 2: CPU Scheduling Module ✅
- [x] Process data structures
- [x] Scheduling algorithms (FCFS, SJF, RR, Priority)
- [x] Gantt chart visualization
- [x] Metrics calculation

### Phase 3: Memory Management Module
- [ ] Page replacement algorithms
- [ ] Frame visualization
- [ ] Hit/fault tracking

### Phase 4: Network Protocol Module
- [ ] TCP state machine
- [ ] Packet flow animation
- [ ] Congestion control

### Phase 5: Compiler Module
- [ ] Lexer implementation
- [ ] Parser and AST
- [ ] Interpreter
- [ ] Execution trace

### Phase 6: Database Module
- [ ] B-Tree implementation
- [ ] Query engine
- [ ] WAL simulation

## File Structure
```
src/
├── core/
│   ├── simulation-engine.ts
│   ├── metrics-engine.ts
│   └── types.ts
├── components/
│   ├── shared/
│   │   ├── MetricsPanel.tsx
│   │   ├── ControlPanel.tsx
│   │   └── VisualizationCanvas.tsx
│   └── modules/
│       ├── CPUScheduler/
│       ├── MemoryManager/
│       ├── NetworkSimulator/
│       ├── CompilerPlayground/
│       └── DatabaseEngine/
├── utils/
│   ├── visualization.ts
│   └── algorithms.ts
└── App.tsx
```

## Current Status
**Phase:** CPU Scheduling Complete
**Progress:** 20%
**Next Task:** Memory Management Module
