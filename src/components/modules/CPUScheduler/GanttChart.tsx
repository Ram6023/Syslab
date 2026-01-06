
import { GanttEntry } from '@/core/types';
import { useMemo } from 'react';

interface GanttChartProps {
  ganttChart: GanttEntry[];
}

export function GanttChart({ ganttChart }: GanttChartProps) {
  const maxTime = useMemo(() => {
    return Math.max(...ganttChart.map(entry => entry.endTime));
  }, [ganttChart]);

  const colors = [
    'hsl(var(--terminal-green))',
    'hsl(var(--terminal-cyan))',
    'hsl(var(--terminal-yellow))',
    'hsl(var(--terminal-blue))',
    'hsl(var(--terminal-magenta))',
    'hsl(var(--accent))',
  ];

  const getColor = (processId: string) => {
    const index = parseInt(processId.replace(/\D/g, '')) - 1;
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      <div className="relative h-24 bg-background border border-border rounded overflow-hidden">
        <svg width="100%" height="100%" className="absolute inset-0">
          {ganttChart.map((entry, index) => {
            const x = (entry.startTime / maxTime) * 100;
            const width = ((entry.endTime - entry.startTime) / maxTime) * 100;
            const color = getColor(entry.processId);

            return (
              <g key={index}>
                <rect
                  x={`${x}%`}
                  y="20"
                  width={`${width}%`}
                  height="40"
                  fill={color}
                  opacity="0.8"
                  stroke={color}
                  strokeWidth="2"
                />
                <text
                  x={`${x + width / 2}%`}
                  y="45"
                  textAnchor="middle"
                  fill="hsl(var(--background))"
                  fontSize="12"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {entry.processId}
                </text>
                <text
                  x={`${x}%`}
                  y="75"
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {entry.startTime}
                </text>
                {index === ganttChart.length - 1 && (
                  <text
                    x={`${x + width}%`}
                    y="75"
                    textAnchor="middle"
                    fill="hsl(var(--muted-foreground))"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {entry.endTime}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap gap-3">
        {Array.from(new Set(ganttChart.map(e => e.processId))).map(processId => (
          <div key={processId} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: getColor(processId) }}
            />
            <span className="text-xs font-mono text-muted-foreground">{processId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}