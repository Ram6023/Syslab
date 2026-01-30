
import { Process } from '@/core/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

interface ProcessTableProps {
  processes: Process[];
  onUpdate?: (id: string, field: keyof Process, value: number) => void;
  onDelete?: (id: string) => void;
  readOnly?: boolean;
}

export function ProcessTable({ processes, onUpdate, onDelete, readOnly = false }: ProcessTableProps) {
  return (
    <Card className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Process</th>
              <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Arrival</th>
              <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Burst</th>
              <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Priority</th>
              {readOnly && (
                <>
                  <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Start</th>
                  <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Complete</th>
                  <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Waiting</th>
                  <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Turnaround</th>
                </>
              )}
              {!readOnly && <th className="text-left py-2 px-3 text-xs uppercase tracking-wide text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id} className="border-b border-border/50 hover:bg-secondary/50">
                <td className="py-2 px-3 font-mono font-semibold text-[hsl(var(--terminal-cyan))]">{process.id}</td>
                <td className="py-2 px-3">
                  {readOnly ? (
                    <span className="font-mono">{process.arrivalTime}</span>
                  ) : (
                    <Input
                      type="number"
                      min="0"
                      value={process.arrivalTime}
                      onChange={(e) => onUpdate?.(process.id, 'arrivalTime', parseInt(e.target.value) || 0)}
                      className="w-20 h-8 font-mono text-xs"
                    />
                  )}
                </td>
                <td className="py-2 px-3">
                  {readOnly ? (
                    <span className="font-mono">{process.burstTime}</span>
                  ) : (
                    <Input
                      type="number"
                      min="1"
                      value={process.burstTime}
                      onChange={(e) => onUpdate?.(process.id, 'burstTime', parseInt(e.target.value) || 1)}
                      className="w-20 h-8 font-mono text-xs"
                    />
                  )}
                </td>
                <td className="py-2 px-3">
                  {readOnly ? (
                    <span className="font-mono">{process.priority}</span>
                  ) : (
                    <Input
                      type="number"
                      min="1"
                      value={process.priority}
                      onChange={(e) => onUpdate?.(process.id, 'priority', parseInt(e.target.value) || 1)}
                      className="w-20 h-8 font-mono text-xs"
                    />
                  )}
                </td>
                {readOnly && (
                  <>
                    <td className="py-2 px-3 font-mono">{process.startTime ?? '-'}</td>
                    <td className="py-2 px-3 font-mono">{process.completionTime ?? '-'}</td>
                    <td className="py-2 px-3 font-mono text-[hsl(var(--warning))]">{process.waitingTime ?? '-'}</td>
                    <td className="py-2 px-3 font-mono text-[hsl(var(--success))]">{process.turnaroundTime ?? '-'}</td>
                  </>
                )}
                {!readOnly && (
                  <td className="py-2 px-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete?.(process.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}