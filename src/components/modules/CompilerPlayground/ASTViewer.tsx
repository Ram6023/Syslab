import { Card } from '@/components/ui/card';
import { ASTNode, CompilerError } from '@/core/types';

interface ASTViewerProps {
  ast: ASTNode | null;
  errors: CompilerError[];
}

export function ASTViewer({ ast, errors }: ASTViewerProps) {
  const renderNode = (node: ASTNode, depth: number = 0): JSX.Element => {
    const indent = depth * 20;
    const color = node.type === 'PROGRAM' 
      ? 'text-[hsl(var(--terminal-cyan))]'
      : node.type === 'BINARY_OP'
      ? 'text-[hsl(var(--terminal-blue))]'
      : node.type === 'ASSIGNMENT'
      ? 'text-[hsl(var(--terminal-green))]'
      : node.type === 'PRINT'
      ? 'text-[hsl(var(--terminal-yellow))]'
      : 'text-foreground';

    return (
      <div key={Math.random()} className="font-mono text-sm" style={{ marginLeft: `${indent}px` }}>
        <div className={`${color} font-semibold`}>
          {node.type}
          {node.value !== undefined && (
            <span className="text-muted-foreground ml-2">: {String(node.value)}</span>
          )}
        </div>
        {node.children && node.children.map((child, index) => (
          <div key={index}>{renderNode(child, depth + 1)}</div>
        ))}
      </div>
    );
  };

  if (errors.length > 0) {
    return (
      <Card className="p-4">
        <div className="text-muted-foreground">
          <div className="text-sm font-semibold mb-2 text-[hsl(var(--terminal-red))]">Parse Errors:</div>
          {errors.map((error, index) => (
            <div key={index} className="text-xs mb-1">
              {error.type.toUpperCase()}: {error.message} (Line {error.line}:{error.column})
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!ast) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No AST generated</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide mb-3">Abstract Syntax Tree</div>
        <div className="p-4 bg-background rounded border border-border overflow-auto">
          {renderNode(ast)}
        </div>
      </div>
    </Card>
  );
}
