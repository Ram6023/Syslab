import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ControlPanelProps {
  dataSize: number;
  packetLossRate: number;
  latency: number;
  windowSize: number;
  onDataSizeChange: (size: number) => void;
  onPacketLossRateChange: (rate: number) => void;
  onLatencyChange: (latency: number) => void;
  onWindowSizeChange: (size: number) => void;
  onSimulate: () => void;
  onReset: () => void;
}

export function ControlPanel({
  dataSize,
  packetLossRate,
  latency,
  windowSize,
  onDataSizeChange,
  onPacketLossRateChange,
  onLatencyChange,
  onWindowSizeChange,
  onSimulate,
  onReset,
}: ControlPanelProps) {
  return (
    <Card className="p-4 control-panel">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataSize" className="text-xs uppercase tracking-wide">Data Size (packets)</Label>
          <Input
            id="dataSize"
            type="number"
            min="1"
            max="50"
            value={dataSize}
            onChange={(e) => onDataSizeChange(parseInt(e.target.value) || 1)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="windowSize" className="text-xs uppercase tracking-wide">Window Size</Label>
          <Input
            id="windowSize"
            type="number"
            min="1"
            max="10"
            value={windowSize}
            onChange={(e) => onWindowSizeChange(parseInt(e.target.value) || 1)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="packetLoss" className="text-xs uppercase tracking-wide">
            Packet Loss Rate: {(packetLossRate * 100).toFixed(1)}%
          </Label>
          <Slider
            id="packetLoss"
            min={0}
            max={1}
            step={0.01}
            value={[packetLossRate]}
            onValueChange={(values) => onPacketLossRateChange(values[0])}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="latency" className="text-xs uppercase tracking-wide">Latency: {latency}ms</Label>
          <Slider
            id="latency"
            min={0}
            max={200}
            step={10}
            value={[latency]}
            onValueChange={(values) => onLatencyChange(values[0])}
            className="w-full"
          />
        </div>

        <div className="md:col-span-2 flex gap-2 justify-end">
          <Button onClick={onSimulate} className="flex-1 md:flex-initial" size="sm">
            <Play className="w-4 h-4 mr-1" />
            Run Simulation
          </Button>
          <Button onClick={onReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
