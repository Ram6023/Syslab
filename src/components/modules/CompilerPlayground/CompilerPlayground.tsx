import { useState } from 'react';
import { Compiler } from '@/utils/compiler';
import { CompilerResult } from '@/core/types';
import { MetricsEngine } from '@/core/metrics-engine';
import { MetricsPanel } from '@/components/shared/MetricsPanel';
import { CodeEditor } from './CodeEditor';
import { TokenViewer } from './TokenViewer';
import { ASTViewer } from './ASTViewer';
import { ExecutionTrace } from './ExecutionTrace';
import { ControlPanel } from './ControlPanel';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const metricsEngine = new MetricsEngine();

const defaultCode = `let x = 10;
let y = 20;
let z = x + y;
print(z);
print(x * y);`;

export function CompilerPlayground() {
  const [code, setCode] = useState(defaultCode);
  const [result, setResult] = useState<CompilerResult | null>(null);

  const handleCompile = () => {
    const compileResult = Compiler.compile(code);
    setResult(compileResult);

    // Record metrics
    metricsEngine.clear('compiler');
    metricsEngine.recordMetric('compiler', {
      name: 'Tokens',
      value: compileResult.tokens.length,
      unit: '',
      category: 'performance',
    });
    metricsEngine.recordMetric('compiler', {
      name: 'Errors',
      value: compileResult.errors.length,
      unit: '',
      category: 'error',
    });
    metricsEngine.recordMetric('compiler', {
      name: 'Execution Steps',
      value: compileResult.executionTrace?.length || 0,
      unit: '',
      category: 'performance',
    });
    metricsEngine.recordMetric('compiler', {
      name: 'Syntax Errors',
      value: compileResult.errors.filter(e => e.type === 'syntax').length,
      unit: '',
      category: 'error',
    });
    metricsEngine.recordMetric('compiler', {
      name: 'Semantic Errors',
      value: compileResult.errors.filter(e => e.type === 'semantic' || e.type === 'runtime').length,
      unit: '',
      category: 'error',
    });
    metricsEngine.snapshot('compiler');
  };

  const handleReset = () => {
    setResult(null);
    metricsEngine.clear('compiler');
  };

  const handleExportMetrics = () => {
    const json = metricsEngine.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'compiler-metrics.json';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Compiler Playground</h2>
          <p className="text-sm text-muted-foreground">Lexical analysis, parsing, and execution tracing</p>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="ast">AST</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <ControlPanel onCompile={handleCompile} onReset={handleReset} />
          <CodeEditor code={code} onCodeChange={setCode} errors={result?.errors || []} />
        </TabsContent>

        <TabsContent value="tokens" className="space-y-4">
          {result ? (
            <TokenViewer tokens={result.tokens} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Compile code to see tokens</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ast" className="space-y-4">
          {result ? (
            <ASTViewer ast={result.ast} errors={result.errors} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Compile code to see AST</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          {result ? (
            <ExecutionTrace trace={result.executionTrace || []} />
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Compile code to see execution trace</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {result ? (
            <>
              <MetricsPanel metrics={metricsEngine.getMetrics('compiler')} title="Compiler Metrics" />
              <div className="flex justify-end">
                <button
                  onClick={handleExportMetrics}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 text-sm font-medium"
                >
                  Export Metrics (JSON)
                </button>
              </div>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Compile code to see metrics</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
