
import { useState } from 'react';
import { Process, SchedulingAlgorithm, SchedulingResult } from '@/core/types';
import { CPUScheduler as Scheduler } from '@/utils/cpu-scheduler';
import { MetricsEngine } from '@/core/metrics-engine';
import { MetricsPanel } from '@/components/shared/MetricsPanel';
import { GanttChart } from './GanttChart';
import { ProcessTable } from './ProcessTable';
import { ControlPanel } from './ControlPanel';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const metricsEngine = new MetricsEngine();

export function CPUScheduler() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2, remainingTime: 5, state: 'new' },
    { id: 'P2', arrivalTime: 1, burstTime: 3, priority: 1, remainingTime: 3, state: 'new' },
    { id: 'P3', arrivalTime: 2, burstTime: 8, priority: 3, remainingTime: 8, state: 'new' },
    { id: 'P4', arrivalTime: 3, burstTime: 6, priority: 2, remainingTime: 6, state: 'new' },
  ]);
  
  const [algorithm, setAlgorithm] = useState<SchedulingAlgorithm>('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState<SchedulingResult | null>(null);

  const handleSchedule = () => {
    const schedulingResult = Scheduler.schedule(processes, algorithm, timeQuantum);
    setResult(schedulingResult);

    // Record metrics
    metricsEngine.clear('cpu-scheduler');
    metricsEngine.recordMetric('cpu-scheduler', {
      name: 'Avg Waiting Time',
      value: schedulingResult.metrics.avgWaitingTime,
      unit: 'ms',
      category: 'performance',
    });
    metricsEngine.recordMetric('cpu-scheduler', {
      name: 'Avg Turnaround Time',
      value: schedulingResult.metrics.avgTurnaroundTime,
      unit: 'ms',
      category: 'performance',
    });
    metricsEngine.recordMetric('cpu-scheduler', {
      name: 'CPU Utilization',
      value: schedulingResult.metrics.cpuUtilization,
      unit: '%',
      category: 'utilization',
    });
    metricsEngine.recordMetric('cpu-scheduler', {
      name: 'Context Switches',
      value: schedulingResult.metrics.contextSwitches,
      unit: '',
      category: 'efficiency',
    });
    metricsEngine.recordMetric('cpu-scheduler', {
      name: 'Throughput',
      value: schedulingResult.metrics.throughput,
      unit: 'proc/ms',
      category: 'efficiency',
    });
    metricsEngine.snapshot('cpu-scheduler');
  };

  const handleAddProcess = () => {
    const newId = `P${processes.length + 1}`;
    setProcesses([
      ...processes,
      { id: newId, arrivalTime: 0, burstTime: 5, priority: 1, remainingTime: 5, state: 'new' },
    ]);
  };

  const handleUpdateProcess = (id: string, field: keyof Process, value: number) => {
    setProcesses(processes.map(p => 
      p.id === id ? { ...p, [field]: value, remainingTime: field === 'burstTime' ? value : p.remainingTime } : p
    ));
  };

  const handleDeleteProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const handleReset = () => {
    setResult(null);
    metricsEngine.clear('cpu-scheduler');
  };

  const handleExportMetrics = () => {
    const json = metricsEngine.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cpu-scheduler-metrics.json';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">CPU Scheduling Simulator</h2>
          <p className="text-sm text-muted-foreground">Process scheduling algorithms with visualization</p>
        </div>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <ControlPanel
            algorithm={algorithm}
            timeQuantum={timeQuantum}
            onAlgorithmChange={setAlgorithm}
            onTimeQuantumChange={setTimeQuantum}
            onSchedule={handleSchedule}
            onReset={handleReset}
            onAddProcess={handleAddProcess}
          />
          
          <ProcessTable
            processes={processes}
            onUpdate={handleUpdateProcess}
            onDelete={handleDeleteProcess}
          />
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          {result ? (
            <>
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Gantt Chart</h3>
                <GanttChart ganttChart={result.ganttChart} />
              </Card>
              
              <Card className="p-4">
                <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Process Timeline</h3>
                <ProcessTable processes={result.processes} readOnly />
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Run the scheduler to see visualization</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {result ? (
            <>
              <MetricsPanel metrics={metricsEngine.getMetrics('cpu-scheduler')} title="Scheduling Metrics" />
              <div className="flex justify-end">
                <button
                  onClick={handleExportMetrics}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm font-medium"
                >
                  Export Metrics (JSON)
                </button>
              </div>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Run the scheduler to see metrics</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}