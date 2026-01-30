
import { Metric } from '@/core/types';
import { Card } from '@/components/ui/card';

interface MetricsPanelProps {
  metrics: Metric[];
  title?: string;
}

export function MetricsPanel({ metrics, title = 'Metrics' }: MetricsPanelProps) {
  const getCategoryColor = (category: Metric['category']) => {
    switch (category) {
      case 'performance':
        return 'text-[hsl(var(--metric-positive))]';
      case 'efficiency':
        return 'text-[hsl(var(--info))]';
      case 'utilization':
        return 'text-[hsl(var(--warning))]';
      case 'error':
        return 'text-[hsl(var(--metric-negative))]';
      default:
        return 'text-[hsl(var(--metric-neutral))]';
    }
  };

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-semibold mb-3 text-foreground uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {metric.name}
            </div>
            <div className={`text-lg font-bold font-mono ${getCategoryColor(metric.category)}`}>
              {metric.value}
              {metric.unit && <span className="text-sm ml-1">{metric.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}