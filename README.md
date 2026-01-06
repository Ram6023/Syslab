# Engineer's Control Panel

A comprehensive, single-page web application that integrates multiple core computer science systems simulators into one unified interface. Built with React, TypeScript, and a focus on correctness, determinism, metrics, and visualization.

## 🎯 Overview

This project provides an interactive systems engineering laboratory with five integrated modules:

1. **CPU Scheduling & Process Control** - Process scheduling algorithms with Gantt chart visualization
2. **Memory Management & Page Replacement** - Page replacement algorithms with frame-by-frame visualization
3. **Network Protocol & Packet Flow** - TCP-like connection lifecycle simulation with packet flow animation
4. **Compiler Playground** - Lexical analysis, parsing, AST generation, and execution tracing
5. **Database Engine Internals** - B-Tree indexing, query execution, and access pattern visualization

## 🏗️ Architecture

### Core Infrastructure

- **Simulation Engine** (`src/core/simulation-engine.ts`): Discrete event simulation engine with time-stepped execution
- **Metrics Engine** (`src/core/metrics-engine.ts`): Unified metrics collection and export system
- **Type System** (`src/core/types.ts`): Comprehensive TypeScript types for all modules

### Module Structure

Each module follows a consistent architecture:
- **Utility Class**: Core algorithm implementation (e.g., `cpu-scheduler.ts`, `memory-manager.ts`)
- **Main Component**: Module entry point with tabs for configuration, visualization, and metrics
- **Sub-components**: Specialized components for control panels, visualizations, and data display

### UI/UX Features

- **Custom Cursor**: Tailless custom cursor with hover and click states
- **Parallax Scrolling**: Subtle parallax background effects
- **Smooth Animations**: Fade-in, slide-up, scale-in animations throughout
- **Responsive Design**: Works on desktop and tablet devices
- **Engineering-First Design**: Clean, minimal UI focused on functionality

## 📦 Modules

### 1. CPU Scheduling & Process Control

**Algorithms Implemented:**
- FCFS (First Come First Served)
- SJF Non-Preemptive (Shortest Job First)
- SJF Preemptive
- Round Robin
- Priority Non-Preemptive
- Priority Preemptive

**Features:**
- User-defined processes with arrival time, burst time, and priority
- Adjustable time quantum for Round Robin
- Gantt chart timeline visualization
- Process state transitions
- Context switch markers
- Comprehensive metrics (waiting time, turnaround time, CPU utilization, throughput)

**Example Input:**
```
Process 1: Arrival=0, Burst=5, Priority=2
Process 2: Arrival=1, Burst=3, Priority=1
Process 3: Arrival=2, Burst=8, Priority=3
Process 4: Arrival=3, Burst=6, Priority=2
```

### 2. Memory Management & Page Replacement

**Algorithms Implemented:**
- FIFO (First In First Out)
- LRU (Least Recently Used)
- Optimal

**Features:**
- Configurable number of frames (1-10)
- Custom page reference string input
- Frame-by-frame memory state visualization
- Page hit/fault indicators
- Eviction reasoning per step
- Step-by-step playback with auto-play

**Example Input:**
```
Page Reference String: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1
Number of Frames: 3
Algorithm: LRU
```

### 3. Network Protocol & Packet Flow Simulator

**Features:**
- TCP-like 3-way handshake (SYN, SYN-ACK, ACK)
- Reliable data transfer simulation
- Configurable packet loss rate (0-100%)
- Artificial latency injection
- Retransmission logic with timeout
- Congestion window evolution (slow start, congestion avoidance)
- Connection termination (FIN, ACK)
- Packet flow animation between client and server
- Sequence numbers and ACK tracking

**Example Configuration:**
```
Data Size: 10 packets
Packet Loss Rate: 10%
Latency: 50ms
Window Size: 4
```

### 4. Compiler Playground

**Features:**
- Lexical analysis (tokenization)
- Syntax parsing (AST generation)
- Semantic validation
- Interpreter execution
- Step-by-step execution trace
- Variable state tracking
- Error reporting (lexical, syntax, semantic, runtime)

**Supported Language Features:**
- Variable assignment: `let x = 10;`
- Arithmetic operations: `+`, `-`, `*`, `/`
- Print statements: `print(x);`
- Expressions with parentheses

**Example Code:**
```javascript
let x = 10;
let y = 20;
let z = x + y;
print(z);
print(x * y);
```

### 5. Database Engine Internals

**Features:**
- In-memory key-value store
- B-Tree index on ID field
- Query engine with SELECT and PROJECT operations
- Query execution plan visualization
- Index hit/miss tracking
- Disk I/O simulation
- Query latency measurement

**Supported Queries:**
- SELECT with conditions: `SELECT WHERE id = 1`
- SELECT with operators: `=`, `>`, `<`, `>=`, `<=`
- PROJECT: Returns all records

**Example Query:**
```
Operation: SELECT
Field: value
Operator: >
Value: 200
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The application runs on `http://localhost:5173` (or the next available port) in development mode.

## 📊 Metrics & Export

All modules support metrics collection and export:

- **Real-time Metrics**: Displayed in dedicated metrics tabs
- **JSON Export**: Export metrics snapshots for analysis
- **Category-based Metrics**: Performance, efficiency, utilization, and error metrics

## 🎨 Design Philosophy

This project prioritizes:

1. **Correctness**: Algorithms are implemented correctly and deterministically
2. **Visualization**: Every algorithm is observable with step-by-step execution
3. **Metrics**: Comprehensive metrics collection for analysis
4. **Modularity**: Easy to add new tools and modules
5. **Engineering Focus**: Clean, functional UI over visual fluff

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom engineering theme
- **UI Components**: Radix UI primitives (shadcn/ui)
- **Icons**: Lucide React
- **State Management**: React hooks (useState, useEffect)

## 📁 Project Structure

```
src/
├── components/
│   ├── modules/
│   │   ├── CPUScheduler/
│   │   ├── MemoryManager/
│   │   ├── NetworkSimulator/
│   │   ├── CompilerPlayground/
│   │   └── DatabaseEngine/
│   ├── shared/
│   │   ├── CustomCursor.tsx
│   │   └── MetricsPanel.tsx
│   └── ui/              # shadcn/ui components
├── core/
│   ├── simulation-engine.ts
│   ├── metrics-engine.ts
│   └── types.ts
├── utils/
│   ├── cpu-scheduler.ts
│   ├── memory-manager.ts
│   ├── network-simulator.ts
│   ├── compiler.ts
│   └── database-engine.ts
├── App.tsx
└── main.tsx
```

## 🔬 Algorithm Details

### CPU Scheduling

All algorithms are deterministic and handle edge cases:
- Idle time when no processes are ready
- Context switches between processes
- Preemption logic for preemptive algorithms
- Time quantum enforcement for Round Robin

### Memory Management

Page replacement algorithms track:
- Frame occupancy state
- Last used time (for LRU)
- Future reference distance (for Optimal)
- Eviction decisions with reasoning

### Network Simulation

TCP-like behavior includes:
- Sequence number management
- ACK handling
- Retransmission on timeout
- Congestion control (slow start, congestion avoidance)
- Connection state machine

### Compiler

Three-phase compilation:
1. **Lexical Analysis**: Tokenizes source code
2. **Parsing**: Builds Abstract Syntax Tree
3. **Execution**: Interprets AST with step-by-step tracing

### Database Engine

Query optimization:
- Index usage for ID lookups
- Full table scan for other fields
- Cost-based query planning
- Access pattern tracking

## 🎯 Future Enhancements

Potential additions:
- More scheduling algorithms (Multilevel Queue, Multilevel Feedback Queue)
- Additional page replacement algorithms (Clock, Second Chance)
- More network protocols (UDP simulation, HTTP)
- Extended compiler features (functions, loops, conditionals)
- More database operations (JOIN, GROUP BY, aggregation)
- Export visualizations as images
- Comparison mode (run multiple algorithms side-by-side)

## 📝 License

This project is open source and available for educational and research purposes.

## 🙏 Acknowledgments

Built as a comprehensive systems engineering educational tool, emphasizing correctness and visualization over visual effects.

---

**Note**: This is an engineering-focused tool. Every design decision prioritizes correctness, determinism, and observability over visual aesthetics.
