
import { Metric, MetricsSnapshot } from './types';

export class MetricsEngine {
  private snapshots: MetricsSnapshot[] = [];
  private currentMetrics: Map<string, Metric[]> = new Map();

  recordMetric(moduleName: string, metric: Metric): void {
    if (!this.currentMetrics.has(moduleName)) {
      this.currentMetrics.set(moduleName, []);
    }
    
    const metrics = this.currentMetrics.get(moduleName)!;
    const existingIndex = metrics.findIndex(m => m.name === metric.name);
    
    if (existingIndex >= 0) {
      metrics[existingIndex] = metric;
    } else {
      metrics.push(metric);
    }
  }

  snapshot(moduleName: string): void {
    const metrics = this.currentMetrics.get(moduleName) || [];
    this.snapshots.push({
      timestamp: Date.now(),
      moduleName,
      metrics: [...metrics],
    });
  }

  getMetrics(moduleName: string): Metric[] {
    return this.currentMetrics.get(moduleName) || [];
  }

  getAllSnapshots(): MetricsSnapshot[] {
    return [...this.snapshots];
  }

  getSnapshotsByModule(moduleName: string): MetricsSnapshot[] {
    return this.snapshots.filter(s => s.moduleName === moduleName);
  }

  exportToJSON(): string {
    return JSON.stringify({
      snapshots: this.snapshots,
      currentMetrics: Array.from(this.currentMetrics.entries()).map(([module, metrics]) => ({
        module,
        metrics,
      })),
    }, null, 2);
  }

  clear(moduleName?: string): void {
    if (moduleName) {
      this.currentMetrics.delete(moduleName);
      this.snapshots = this.snapshots.filter(s => s.moduleName !== moduleName);
    } else {
      this.currentMetrics.clear();
      this.snapshots = [];
    }
  }

  calculateAggregate(moduleName: string, metricName: string, operation: 'avg' | 'min' | 'max' | 'sum'): number {
    const snapshots = this.getSnapshotsByModule(moduleName);
    const values = snapshots
      .flatMap(s => s.metrics)
      .filter(m => m.name === metricName && typeof m.value === 'number')
      .map(m => m.value as number);

    if (values.length === 0) return 0;

    switch (operation) {
      case 'avg':
        return values.reduce((a, b) => a + b, 0) / values.length;
      case 'min':
        return Math.min(...values);
      case 'max':
        return Math.max(...values);
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      default:
        return 0;
    }
  }
}