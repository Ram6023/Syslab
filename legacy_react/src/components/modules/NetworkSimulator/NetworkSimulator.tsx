import { useState } from 'react';
import { NetworkSimulator as Simulator, NetworkSimulationResult } from '@/utils/network-simulator';
import { MetricsEngine } from '@/core/metrics-engine';
import { MetricsPanel } from '@/components/shared/MetricsPanel';
import { NetworkVisualization } from './NetworkVisualization';
import { ControlPanel } from './ControlPanel';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const metricsEngine = new MetricsEngine();

export function NetworkSimulator() {
  const [dataSize, setDataSize] = useState(10);
  const [packetLossRate, setPacketLossRate] = useState(0.1);
  const [latency, setLatency] = useState(50);
  const [windowSize, setWindowSize] = useState(4);
  const [result, setResult] = useState<NetworkSimulationResult | null>(null);

  const handleSimulate = () => {
    const simulationResult = Simulator.simulate(dataSize, packetLossRate, latency, windowSize);
    setResult(simulationResult);

    // Record metrics
    metricsEngine.clear('network-simulator');
    metricsEngine.recordMetric('network-simulator', {
      name: 'Throughput',
      value: simulationResult.metrics.throughput,
      unit: 'packets/ms',
      category: 'performance',
    });
    metricsEngine.recordMetric('network-simulator', {
      name: 'Retransmission Rate',
      value: simulationResult.metrics.retransmissionRate,
      unit: '%',
      category: 'error',
    });
    metricsEngine.recordMetric('network-simulator', {
      name: 'Effective Bandwidth',
      value: simulationResult.metrics.effectiveBandwidth,
      unit: 'packets/s',
      category: 'efficiency',
    });
    metricsEngine.recordMetric('network-simulator', {
      name: 'Lost Packets',
      value: simulationResult.metrics.lostPackets,
      unit: '',
      category: 'error',
    });
    metricsEngine.recordMetric('network-simulator', {
      name: 'Total Packets',
      value: simulationResult.metrics.totalPackets,
      unit: '',
      category: 'performance',
    });
    metricsEngine.snapshot('network-simulator');
  };

  const handleReset = () => {
    setResult(null);
    metricsEngine.clear('network-simulator');
  };

  const handleExportMetrics = () => {
    const json = metricsEngine.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'network-simulator-metrics.json';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Network Protocol Simulator</h2>
          <p className="text-sm text-muted-foreground">TCP-like connection lifecycle with packet flow visualization</p>
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
            dataSize={dataSize}
            packetLossRate={packetLossRate}
            latency={latency}
            windowSize={windowSize}
            onDataSizeChange={setDataSize}
            onPacketLossRateChange={setPacketLossRate}
            onLatencyChange={setLatency}
            onWindowSizeChange={setWindowSize}
            onSimulate={handleSimulate}
            onReset={handleReset}
          />
        </TabsContent>

        <TabsContent value="visualization" className="space-y-4">
          {result ? (
            <NetworkVisualization result={result} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Run the simulation to see visualization</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {result ? (
            <>
              <MetricsPanel metrics={metricsEngine.getMetrics('network-simulator')} title="Network Metrics" />
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
