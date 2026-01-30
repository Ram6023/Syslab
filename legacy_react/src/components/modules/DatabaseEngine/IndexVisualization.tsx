import { Card } from '@/components/ui/card';
import { BTreeNode } from '@/core/types';

interface IndexVisualizationProps {
  btree: BTreeNode | null;
}

export function IndexVisualization({ btree }: IndexVisualizationProps) {
  const renderNode = (node: BTreeNode | null, depth: number = 0): JSX.Element | null => {
    if (!node || node.keys.length === 0) return null;

    const indent = depth * 40;
    const isLeaf = node.isLeaf;

    return (
      <div key={Math.random()} className="relative" style={{ marginLeft: `${indent}px` }}>
        <div
          className={`inline-block px-4 py-2 rounded border font-mono text-sm transition-all duration-300 ${
            isLeaf
              ? 'bg-[hsl(var(--terminal-green))]/20 border-[hsl(var(--terminal-green))]'
              : 'bg-[hsl(var(--terminal-blue))]/20 border-[hsl(var(--terminal-blue))]'
          }`}
        >
          <div className="text-xs text-muted-foreground mb-1">{isLeaf ? 'Leaf' : 'Internal'}</div>
          <div className="flex gap-2">
            {node.keys.map((key, index) => (
              <span key={index} className="font-bold text-primary">
                {key}
              </span>
            ))}
          </div>
        </div>
        {node.children && node.children.length > 0 && (
          <div className="mt-2">
            {node.children.map((child, index) => (
              <div key={index}>{renderNode(child, depth + 1)}</div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (!btree) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No index available</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide mb-3">B-Tree Index Structure</div>
        <div className="p-4 bg-background rounded border border-border overflow-auto min-h-[300px]">
          {renderNode(btree)}
        </div>
        <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-[hsl(var(--terminal-blue))]/20 border-[hsl(var(--terminal-blue))]"></div>
            <span>Internal Node</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border bg-[hsl(var(--terminal-green))]/20 border-[hsl(var(--terminal-green))]"></div>
            <span>Leaf Node</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
