
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
    'hsl(var(--viz-running))',     // neon green
    'hsl(var(--viz-ready))',       // cyan
    'hsl(var(--viz-waiting))',     // yellow/amber
    'hsl(var(--info))',            // blue
    'hsl(var(--accent))',          // cyan accent
    'hsl(var(--primary))',         // primary green
  ];

  const getColor = (processId: string) => {
    const index = parseInt(processId.replace(/\D/g, '')) - 1;
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-4">
      <div className="relative h-32 bg-card/50 border border-border rounded-lg overflow-hidden backdrop-blur-sm">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Grid lines for time reference */}
          {Array.from({ length: Math.ceil(maxTime / 5) + 1 }).map((_, i) => {
            const x = (i * 5 / maxTime) * 100;
            return (
              <line
                key={`grid-${i}`}
                x1={`${x}%`}
                y1="0"
                x2={`${x}%`}
                y2="100%"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="2,2"
              />
            );
          })}

          {ganttChart.map((entry, index) => {
            const x = (entry.startTime / maxTime) * 100;
            const width = ((entry.endTime - entry.startTime) / maxTime) * 100;
            const color = getColor(entry.processId);

            return (
              <g key={index}>
                <rect
                  x={`${x}%`}
                  y="30"
                  width={`${width}%`}
                  height="50"
                  fill={color}
                  opacity="0.9"
                  stroke={color}
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x={`${x + width / 2}%`}
                  y="60"
                  textAnchor="middle"
                  fill="hsl(var(--background))"
                  fontSize="14"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {entry.processId}
                </text>
                <text
                  x={`${x}%`}
                  y="20"
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="500"
                >
                  {entry.startTime}
                </text>
                {index === ganttChart.length - 1 && (
                  <text
                    x={`${x + width}%`}
                    y="20"
                    textAnchor="middle"
                    fill="hsl(var(--foreground))"
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="500"
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
              className="w-4 h-4 rounded border border-border"
              style={{ backgroundColor: getColor(processId) }}
            />
            <span className="text-xs font-mono text-foreground font-medium">{processId}</span>
          </div>
        ))}
      </div>
    </div>
  );
}