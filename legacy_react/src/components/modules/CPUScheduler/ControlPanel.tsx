
import { SchedulingAlgorithm } from '@/core/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw, Plus } from 'lucide-react';

interface ControlPanelProps {
  algorithm: SchedulingAlgorithm;
  timeQuantum: number;
  onAlgorithmChange: (algorithm: SchedulingAlgorithm) => void;
  onTimeQuantumChange: (quantum: number) => void;
  onSchedule: () => void;
  onReset: () => void;
  onAddProcess: () => void;
}

export function ControlPanel({
  algorithm,
  timeQuantum,
  onAlgorithmChange,
  onTimeQuantumChange,
  onSchedule,
  onReset,
  onAddProcess,
}: ControlPanelProps) {
  return (
    <Card className="p-4 control-panel">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="algorithm" className="text-xs uppercase tracking-wide">Algorithm</Label>
          <Select value={algorithm} onValueChange={(v) => onAlgorithmChange(v as SchedulingAlgorithm)}>
            <SelectTrigger id="algorithm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FCFS">FCFS</SelectItem>
              <SelectItem value="SJF_NON_PREEMPTIVE">SJF (Non-Preemptive)</SelectItem>
              <SelectItem value="SJF_PREEMPTIVE">SJF (Preemptive)</SelectItem>
              <SelectItem value="ROUND_ROBIN">Round Robin</SelectItem>
              <SelectItem value="PRIORITY_NON_PREEMPTIVE">Priority (Non-Preemptive)</SelectItem>
              <SelectItem value="PRIORITY_PREEMPTIVE">Priority (Preemptive)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantum" className="text-xs uppercase tracking-wide">
            Time Quantum {algorithm !== 'ROUND_ROBIN' && '(N/A)'}
          </Label>
          <Input
            id="quantum"
            type="number"
            min="1"
            value={timeQuantum}
            onChange={(e) => onTimeQuantumChange(parseInt(e.target.value) || 1)}
            disabled={algorithm !== 'ROUND_ROBIN'}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide">Actions</Label>
          <div className="flex gap-2">
            <Button onClick={onSchedule} className="flex-1" size="sm">
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
            <Button onClick={onReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button onClick={onAddProcess} variant="outline" size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}