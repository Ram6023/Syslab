import { Card } from '@/components/ui/card';
import { Token } from '@/core/types';

interface TokenViewerProps {
  tokens: Token[];
}

export function TokenViewer({ tokens }: TokenViewerProps) {
  const getTokenColor = (type: string) => {
    switch (type) {
      case 'KEYWORD':
        return 'text-[hsl(var(--terminal-cyan))]';
      case 'IDENTIFIER':
        return 'text-[hsl(var(--terminal-green))]';
      case 'NUMBER':
        return 'text-[hsl(var(--terminal-yellow))]';
      case 'OPERATOR':
        return 'text-[hsl(var(--terminal-blue))]';
      case 'DELIMITER':
        return 'text-[hsl(var(--terminal-magenta))]';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide mb-3">Token Stream</div>
        <div className="flex flex-wrap gap-2">
          {tokens.map((token, index) => (
            <div
              key={index}
              className={`px-3 py-1 rounded border font-mono text-sm ${getTokenColor(token.type)}`}
            >
              <span className="text-xs text-muted-foreground mr-1">{token.type}:</span>
              <span className="font-semibold">{token.value}</span>
              <span className="text-xs text-muted-foreground ml-2">
                ({token.line}:{token.column})
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
