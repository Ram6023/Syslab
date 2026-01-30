import { DatabaseRecord } from '@/utils/database-engine';
import { Card } from '@/components/ui/card';

interface DataTableProps {
  data: DatabaseRecord[];
}

export function DataTable({ data }: DataTableProps) {
  if (data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No data available</p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">ID</th>
            <th className="text-left p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</th>
            <th className="text-left p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Value</th>
            <th className="text-left p-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record, index) => (
            <tr
              key={record.id}
              className={`border-b border-border transition-colors duration-200 ${
                index % 2 === 0 ? 'bg-card/50' : 'bg-background'
              } hover:bg-primary/10`}
            >
              <td className="p-2 font-mono text-sm">{record.id}</td>
              <td className="p-2 font-mono text-sm">{record.name}</td>
              <td className="p-2 font-mono text-sm">{record.value}</td>
              <td className="p-2 font-mono text-sm">{record.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
