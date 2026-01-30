import { useState } from 'react';
import { PageReplacementAlgorithm, MemoryResult } from '@/core/types';
import { MemoryManager as Manager } from '@/utils/memory-manager';
import { MetricsEngine } from '@/core/metrics-engine';
import { MetricsPanel } from '@/components/shared/MetricsPanel';
import { MemoryVisualization } from './MemoryVisualization';
import { ControlPanel } from './ControlPanel';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const metricsEngine = new MetricsEngine();

export function MemoryManager() {
  const [pageReferences, setPageReferences] = useState<number[]>([7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1]);
  const [numFrames, setNumFrames] = useState(3);
  const [algorithm, setAlgorithm] = useState<PageReplacementAlgorithm>('FIFO');
  const [result, setResult] = useState<MemoryResult | null>(null);

  const handleSimulate = () => {
    const simulationResult = Manager.simulate(pageReferences, numFrames, algorithm);
    setResult(simulationResult);

    // Record metrics
    metricsEngine.clear('memory-manager');
    metricsEngine.recordMetric('memory-manager', {
      name: 'Page Faults',
      value: simulationResult.metrics.pageFaults,
      unit: '',
      category: 'error',
    });
    metricsEngine.recordMetric('memory-manager', {
      name: 'Page Hits',
      value: simulationResult.metrics.pageHits,
      unit: '',
      category: 'performance',
    });
    metricsEngine.recordMetric('memory-manager', {
      name: 'Hit Ratio',
      value: parseFloat((simulationResult.metrics.hitRatio * 100).toFixed(2)),
      unit: '%',
      category: 'efficiency',
    });
    metricsEngine.recordMetric('memory-manager', {
      name: 'Fault Ratio',
      value: parseFloat((simulationResult.metrics.faultRatio * 100).toFixed(2)),
      unit: '%',
      category: 'error',
    });
    metricsEngine.snapshot('memory-manager');
  };

  const handleReset = () => {
    setResult(null);
    metricsEngine.clear('memory-manager');
  };

  const handleExportMetrics = () => {
    const json = metricsEngine.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'memory-manager-metrics.json';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Memory Management Simulator</h2>
          <p className="text-sm text-muted-foreground">Page replacement algorithms with frame-by-frame visualization</p>
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
            numFrames={numFrames}
            pageReferences={pageReferences}
            onAlgorithmChange={setAlgorithm}
            onNumFramesChange={setNumFrames}
            onPageReferencesChange={setPageReferences}
            onSimulate={handleSimulate}
            onReset={handleReset}
          />
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          {result ? (
            <MemoryVisualization
              result={result}
              numFrames={numFrames}
              pageReferences={pageReferences}
            />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Run the simulation to see visualization</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {result ? (
            <>
              <MetricsPanel metrics={metricsEngine.getMetrics('memory-manager')} title="Memory Metrics" />
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
              <p className="text-muted-foreground">Run the simulation to see metrics</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
