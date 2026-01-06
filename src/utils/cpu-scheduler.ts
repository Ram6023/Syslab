
import { Process, SchedulingResult, GanttEntry, SchedulingAlgorithm } from '../core/types';

export class CPUScheduler {
  static schedule(processes: Process[], algorithm: SchedulingAlgorithm, timeQuantum: number = 2): SchedulingResult {
    switch (algorithm) {
      case 'FCFS':
        return this.fcfs(processes);
      case 'SJF_NON_PREEMPTIVE':
        return this.sjfNonPreemptive(processes);
      case 'SJF_PREEMPTIVE':
        return this.sjfPreemptive(processes);
      case 'ROUND_ROBIN':
        return this.roundRobin(processes, timeQuantum);
      case 'PRIORITY_NON_PREEMPTIVE':
        return this.priorityNonPreemptive(processes);
      case 'PRIORITY_PREEMPTIVE':
        return this.priorityPreemptive(processes);
      default:
        return this.fcfs(processes);
    }
  }

  private static fcfs(processes: Process[]): SchedulingResult {
    const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const ganttChart: GanttEntry[] = [];
    let currentTime = 0;
    let contextSwitches = 0;

    sorted.forEach((process, index) => {
      if (currentTime < process.arrivalTime) {
        currentTime = process.arrivalTime;
      }

      process.startTime = currentTime;
      process.completionTime = currentTime + process.burstTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;

      ganttChart.push({
        processId: process.id,
        startTime: currentTime,
        endTime: process.completionTime,
      });

      currentTime = process.completionTime;
      if (index < sorted.length - 1) contextSwitches++;
    });

    return this.calculateMetrics(sorted, ganttChart, contextSwitches);
  }

  private static sjfNonPreemptive(processes: Process[]): SchedulingResult {
    const remaining = [...processes];
    const ganttChart: GanttEntry[] = [];
    let currentTime = 0;
    let contextSwitches = 0;
    const completed: Process[] = [];

    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrivalTime <= currentTime);
      
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrivalTime));
        continue;
      }

      available.sort((a, b) => a.burstTime - b.burstTime);
      const process = available[0];
      
      process.startTime = currentTime;
      process.completionTime = currentTime + process.burstTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;

      ganttChart.push({
        processId: process.id,
        startTime: currentTime,
        endTime: process.completionTime,
      });

      currentTime = process.completionTime;
      remaining.splice(remaining.indexOf(process), 1);
      completed.push(process);
      if (remaining.length > 0) contextSwitches++;
    }

    return this.calculateMetrics(completed, ganttChart, contextSwitches);
  }

  private static sjfPreemptive(processes: Process[]): SchedulingResult {
    const workingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    const ganttChart: GanttEntry[] = [];
    let currentTime = 0;
    let contextSwitches = 0;
    let lastProcessId: string | null = null;
    const completed: Process[] = [];

    while (workingProcesses.some(p => p.remainingTime > 0)) {
      const available = workingProcesses.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
      
      if (available.length === 0) {
        currentTime++;
        continue;
      }

      available.sort((a, b) => a.remainingTime - b.remainingTime);
      const process = available[0];

      if (lastProcessId !== null && lastProcessId !== process.id) {
        contextSwitches++;
      }

      if (process.startTime === undefined) {
        process.startTime = currentTime;
      }

      const startTime = currentTime;
      process.remainingTime--;
      currentTime++;

      if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === process.id) {
        ganttChart[ganttChart.length - 1].endTime = currentTime;
      } else {
        ganttChart.push({
          processId: process.id,
          startTime,
          endTime: currentTime,
        });
      }

      if (process.remainingTime === 0) {
        process.completionTime = currentTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
        completed.push(process);
      }

      lastProcessId = process.id;
    }

    return this.calculateMetrics(completed, ganttChart, contextSwitches);
  }

  private static roundRobin(processes: Process[], timeQuantum: number): SchedulingResult {
    const queue: Process[] = [];
    const workingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    const ganttChart: GanttEntry[] = [];
    let currentTime = 0;
    let contextSwitches = 0;
    const completed: Process[] = [];

    workingProcesses.sort((a, b) => a.arrivalTime - b.arrivalTime);
    let index = 0;

    while (completed.length < processes.length) {
      while (index < workingProcesses.length && workingProcesses[index].arrivalTime <= currentTime) {
        if (workingProcesses[index].remainingTime > 0 && !queue.includes(workingProcesses[index])) {
          queue.push(workingProcesses[index]);
        }
        index++;
      }

      if (queue.length === 0) {
        currentTime++;
        continue;
      }

      const process = queue.shift()!;
      
      if (process.startTime === undefined) {
        process.startTime = currentTime;
      }

      const executeTime = Math.min(timeQuantum, process.remainingTime);
      const startTime = currentTime;
      
      process.remainingTime -= executeTime;
      currentTime += executeTime;

      ganttChart.push({
        processId: process.id,
        startTime,
        endTime: currentTime,
      });

      while (index < workingProcesses.length && workingProcesses[index].arrivalTime <= currentTime) {
        if (workingProcesses[index].remainingTime > 0 && !queue.includes(workingProcesses[index])) {
          queue.push(workingProcesses[index]);
        }
        index++;
      }

      if (process.remainingTime > 0) {
        queue.push(process);
        contextSwitches++;
      } else {
        process.completionTime = currentTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
        completed.push(process);
        if (queue.length > 0) contextSwitches++;
      }
    }

    return this.calculateMetrics(completed, ganttChart, contextSwitches);
  }

  private static priorityNonPreemptive(processes: Process[]): SchedulingResult {
    const remaining = [...processes];
    const ganttChart: GanttEntry[] = [];
    let currentTime = 0;
    let contextSwitches = 0;
    const completed: Process[] = [];

    while (remaining.length > 0) {
      const available = remaining.filter(p => p.arrivalTime <= currentTime);
      
      if (available.length === 0) {
        currentTime = Math.min(...remaining.map(p => p.arrivalTime));
        continue;
      }

      available.sort((a, b) => a.priority - b.priority);
      const process = available[0];
      
      process.startTime = currentTime;
      process.completionTime = currentTime + process.burstTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;

      ganttChart.push({
        processId: process.id,
        startTime: currentTime,
        endTime: process.completionTime,
      });

      currentTime = process.completionTime;
      remaining.splice(remaining.indexOf(process), 1);
      completed.push(process);
      if (remaining.length > 0) contextSwitches++;
    }

    return this.calculateMetrics(completed, ganttChart, contextSwitches);
  }

  private static priorityPreemptive(processes: Process[]): SchedulingResult {
    const workingProcesses = processes.map(p => ({ ...p, remainingTime: p.burstTime }));
    const ganttChart: GanttEntry[] = [];
    let currentTime = 0;
    let contextSwitches = 0;
    let lastProcessId: string | null = null;
    const completed: Process[] = [];

    while (workingProcesses.some(p => p.remainingTime > 0)) {
      const available = workingProcesses.filter(p => p.arrivalTime <= currentTime && p.remainingTime > 0);
      
      if (available.length === 0) {
        currentTime++;
        continue;
      }

      available.sort((a, b) => a.priority - b.priority);
      const process = available[0];

      if (lastProcessId !== null && lastProcessId !== process.id) {
        contextSwitches++;
      }

      if (process.startTime === undefined) {
        process.startTime = currentTime;
      }

      const startTime = currentTime;
      process.remainingTime--;
      currentTime++;

      if (ganttChart.length > 0 && ganttChart[ganttChart.length - 1].processId === process.id) {
        ganttChart[ganttChart.length - 1].endTime = currentTime;
      } else {
        ganttChart.push({
          processId: process.id,
          startTime,
          endTime: currentTime,
        });
      }

      if (process.remainingTime === 0) {
        process.completionTime = currentTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;
        process.waitingTime = process.turnaroundTime - process.burstTime;
        completed.push(process);
      }

      lastProcessId = process.id;
    }

    return this.calculateMetrics(completed, ganttChart, contextSwitches);
  }

  private static calculateMetrics(processes: Process[], ganttChart: GanttEntry[], contextSwitches: number): SchedulingResult {
    const avgWaitingTime = processes.reduce((sum, p) => sum + (p.waitingTime || 0), 0) / processes.length;
    const avgTurnaroundTime = processes.reduce((sum, p) => sum + (p.turnaroundTime || 0), 0) / processes.length;
    
    const totalTime = Math.max(...processes.map(p => p.completionTime || 0));
    const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
    const cpuUtilization = (totalBurstTime / totalTime) * 100;
    const throughput = processes.length / totalTime;

    return {
      ganttChart,
      processes,
      metrics: {
        avgWaitingTime: parseFloat(avgWaitingTime.toFixed(2)),
        avgTurnaroundTime: parseFloat(avgTurnaroundTime.toFixed(2)),
        cpuUtilization: parseFloat(cpuUtilization.toFixed(2)),
        contextSwitches,
        throughput: parseFloat(throughput.toFixed(4)),
      },
    };
  }
}