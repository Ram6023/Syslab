import { PageReplacementAlgorithm } from '@/core/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  algorithm: PageReplacementAlgorithm;
  numFrames: number;
  pageReferences: number[];
  onAlgorithmChange: (algorithm: PageReplacementAlgorithm) => void;
  onNumFramesChange: (frames: number) => void;
  onPageReferencesChange: (references: number[]) => void;
  onSimulate: () => void;
  onReset: () => void;
}

export function ControlPanel({
  algorithm,
  numFrames,
  pageReferences,
  onAlgorithmChange,
  onNumFramesChange,
  onPageReferencesChange,
  onSimulate,
  onReset,
}: ControlPanelProps) {
  const handlePageRefChange = (value: string) => {
    const refs = value
      .split(/[,\s]+/)
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));
    onPageReferencesChange(refs);
  };

  return (
    <Card className="p-4 control-panel">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="algorithm" className="text-xs uppercase tracking-wide">Algorithm</Label>
          <Select value={algorithm} onValueChange={(v) => onAlgorithmChange(v as PageReplacementAlgorithm)}>
            <SelectTrigger id="algorithm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="FIFO">FIFO</SelectItem>
              <SelectItem value="LRU">LRU (Least Recently Used)</SelectItem>
              <SelectItem value="OPTIMAL">Optimal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frames" className="text-xs uppercase tracking-wide">Number of Frames</Label>
          <Input
            id="frames"
            type="number"
            min="1"
            max="10"
            value={numFrames}
            onChange={(e) => onNumFramesChange(parseInt(e.target.value) || 1)}
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide">Actions</Label>
          <div className="flex gap-2">
            <Button onClick={onSimulate} className="flex-1" size="sm">
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
            <Button onClick={onReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="pageRefs" className="text-xs uppercase tracking-wide">Page Reference String</Label>
        <Input
          id="pageRefs"
          value={pageReferences.join(', ')}
          onChange={(e) => handlePageRefChange(e.target.value)}
          placeholder="7, 0, 1, 2, 0, 3, 0, 4, 2, 3..."
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">Enter comma or space-separated page numbers</p>
      </div>
    </Card>
  );
}
