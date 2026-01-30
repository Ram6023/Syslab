import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  onCompile: () => void;
  onReset: () => void;
}

export function ControlPanel({ onCompile, onReset }: ControlPanelProps) {
  return (
    <Card className="p-4 control-panel">
      <div className="flex items-center justify-end gap-2">
        <Button onClick={onCompile} size="sm">
          <Play className="w-4 h-4 mr-1" />
          Compile & Run
        </Button>
        <Button onClick={onReset} variant="outline" size="sm">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
