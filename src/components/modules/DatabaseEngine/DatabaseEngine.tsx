import { useState, useEffect } from 'react';
import { DatabaseEngine as Engine, DatabaseRecord } from '@/utils/database-engine';
import { DatabaseResult } from '@/core/types';
import { MetricsEngine } from '@/core/metrics-engine';
import { MetricsPanel } from '@/components/shared/MetricsPanel';
import { IndexVisualization } from './IndexVisualization';
import { QueryPanel } from './QueryPanel';
import { DataTable } from './DataTable';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const metricsEngine = new MetricsEngine();
const dbEngine = new Engine();

export function DatabaseEngine() {
  const [result, setResult] = useState<DatabaseResult | null>(null);
  const [data, setData] = useState<DatabaseRecord[]>(dbEngine.getData());

  useEffect(() => {
    setData(dbEngine.getData());
  }, []);

  const handleQuery = (operation: 'SELECT' | 'PROJECT', condition?: { field: keyof DatabaseRecord; operator: string; value: string | number }) => {
    const queryResult = dbEngine.query(operation, condition);
    setResult(queryResult);

    // Record metrics
    metricsEngine.clear('database-engine');
    metricsEngine.recordMetric('database-engine', {
      name: 'Execution Time',
      value: queryResult.metrics.executionTime,
      unit: 'ms',
      category: 'performance',
    });
    metricsEngine.recordMetric('database-engine', {
      name: 'Disk Reads',
      value: queryResult.metrics.diskReads,
      unit: '',
      category: 'efficiency',
    });
    metricsEngine.recordMetric('database-engine', {
      name: 'Index Hits',
      value: queryResult.metrics.indexHits,
      unit: '',
      category: 'performance',
    });
    metricsEngine.recordMetric('database-engine', {
      name: 'Index Misses',
      value: queryResult.metrics.indexMisses,
      unit: '',
      category: 'error',
    });
    metricsEngine.recordMetric('database-engine', {
      name: 'Index Hit Ratio',
      value: queryResult.metrics.indexHits + queryResult.metrics.indexMisses > 0
        ? parseFloat(((queryResult.metrics.indexHits / (queryResult.metrics.indexHits + queryResult.metrics.indexMisses)) * 100).toFixed(2))
        : 0,
      unit: '%',
      category: 'efficiency',
    });
    metricsEngine.snapshot('database-engine');
  };

  const handleReset = () => {
    setResult(null);
    metricsEngine.clear('database-engine');
  };

  const handleExportMetrics = () => {
    const json = metricsEngine.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-engine-metrics.json';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Database Engine Internals</h2>
          <p className="text-sm text-muted-foreground">B-Tree indexing, query execution, and access patterns</p>
        </div>
      </div>

      <Tabs defaultValue="query" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="query">Query</TabsTrigger>
          <TabsTrigger value="index">Index</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="query" className="space-y-4">
          <QueryPanel onQuery={handleQuery} onReset={handleReset} />
          {result && (
            <Card className="p-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wide mb-2">Query Plan</div>
                <div className="p-3 rounded border bg-card">
                  <div className="font-mono text-sm">
                    <div className="text-primary font-semibold">{result.queryPlan.operation}</div>
                    <div className="text-xs text-muted-foreground mt-1">Cost: {result.queryPlan.cost}</div>
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-wide mt-4 mb-2">Results ({result.data.length} rows)</div>
                <DataTable data={result.data as DatabaseRecord[]} />
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="index" className="space-y-4">
          <IndexVisualization btree={dbEngine.getBTree()} />
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card className="p-4">
            <div className="text-xs font-semibold uppercase tracking-wide mb-3">Database Records</div>
            <DataTable data={data} />
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {result ? (
            <>
              <MetricsPanel metrics={metricsEngine.getMetrics('database-engine')} title="Database Metrics" />
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
              <p className="text-muted-foreground">Run a query to see metrics</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
