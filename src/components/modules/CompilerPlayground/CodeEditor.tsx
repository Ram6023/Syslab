import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { CompilerError } from '@/core/types';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  errors: CompilerError[];
}

export function CodeEditor({ code, onCodeChange, errors }: CodeEditorProps) {
  const errorLines = new Set(errors.map(e => e.line));

  return (
    <Card className="p-4">
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase tracking-wide">Source Code</div>
        <div className="relative">
          <Textarea
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="font-mono text-sm min-h-[400px] resize-none"
            style={{
              tabSize: 2,
            }}
          />
          {errors.length > 0 && (
            <div className="mt-2 space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="text-xs text-[hsl(var(--terminal-red))]">
                  Line {error.line}:{error.column} - {error.type.toUpperCase()}: {error.message}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
