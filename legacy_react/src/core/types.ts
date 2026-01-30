
// Core simulation types

export interface SimulationEvent {
  time: number;
  type: string;
  data: unknown;
}

export interface SimulationState {
  currentTime: number;
  events: SimulationEvent[];
  isRunning: boolean;
  isPaused: boolean;
  speed: number;
}

export interface Metric {
  name: string;
  value: number | string;
  unit?: string;
  category: 'performance' | 'efficiency' | 'utilization' | 'error';
}

export interface MetricsSnapshot {
  timestamp: number;
  moduleName: string;
  metrics: Metric[];
}

// CPU Scheduling types
export interface Process {
  id: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  remainingTime: number;
  startTime?: number;
  completionTime?: number;
  waitingTime?: number;
  turnaroundTime?: number;
  state: 'new' | 'ready' | 'running' | 'waiting' | 'terminated';
}

export interface SchedulingResult {
  ganttChart: GanttEntry[];
  processes: Process[];
  metrics: {
    avgWaitingTime: number;
    avgTurnaroundTime: number;
    cpuUtilization: number;
    contextSwitches: number;
    throughput: number;
  };
}

export interface GanttEntry {
  processId: string;
  startTime: number;
  endTime: number;
  isContextSwitch?: boolean;
}

export type SchedulingAlgorithm = 'FCFS' | 'SJF_NON_PREEMPTIVE' | 'SJF_PREEMPTIVE' | 'ROUND_ROBIN' | 'PRIORITY_NON_PREEMPTIVE' | 'PRIORITY_PREEMPTIVE';

// Memory Management types
export interface PageFrame {
  pageNumber: number | null;
  lastUsed: number;
  loadTime: number;
}

export interface PageReferenceEvent {
  time: number;
  pageNumber: number;
  isHit: boolean;
  isFault: boolean;
  evictedPage?: number;
  frameIndex?: number;
  reason?: string;
}

export interface MemoryResult {
  events: PageReferenceEvent[];
  metrics: {
    pageFaults: number;
    pageHits: number;
    hitRatio: number;
    faultRatio: number;
  };
}

export type PageReplacementAlgorithm = 'FIFO' | 'LRU' | 'OPTIMAL';

// Network types
export interface Packet {
  id: string;
  sequenceNumber: number;
  ackNumber?: number;
  type: 'SYN' | 'SYN-ACK' | 'ACK' | 'DATA' | 'FIN';
  data?: string;
  timestamp: number;
  isLost?: boolean;
  isRetransmission?: boolean;
}

export interface NetworkState {
  connectionState: 'CLOSED' | 'SYN_SENT' | 'SYN_RECEIVED' | 'ESTABLISHED' | 'FIN_WAIT' | 'CLOSE_WAIT' | 'CLOSING' | 'TIME_WAIT';
  sentPackets: Packet[];
  receivedPackets: Packet[];
  congestionWindow: number;
  ssthresh: number;
}

// Compiler types
export interface Token {
  type: string;
  value: string;
  line: number;
  column: number;
}

export interface ASTNode {
  type: string;
  value?: string | number;
  children?: ASTNode[];
  line?: number;
  column?: number;
}

export interface CompilerResult {
  tokens: Token[];
  ast: ASTNode | null;
  errors: CompilerError[];
  executionTrace?: ExecutionStep[];
}

export interface CompilerError {
  type: 'lexical' | 'syntax' | 'semantic' | 'runtime';
  message: string;
  line: number;
  column: number;
}

export interface ExecutionStep {
  step: number;
  instruction: string;
  state: Record<string, number>;
}

// Database types
export interface BTreeNode {
  keys: number[];
  children: BTreeNode[];
  isLeaf: boolean;
  values?: unknown[];
}

export interface QueryPlan {
  operation: string;
  cost: number;
  children?: QueryPlan[];
}

export interface DatabaseResult {
  data: unknown[];
  queryPlan: QueryPlan;
  metrics: {
    executionTime: number;
    diskReads: number;
    indexHits: number;
    indexMisses: number;
  };
}