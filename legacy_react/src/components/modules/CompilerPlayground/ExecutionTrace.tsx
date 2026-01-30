import { Card } from '@/components/ui/card';
import { ExecutionStep } from '@/core/types';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExecutionTraceProps {
  trace: ExecutionStep[];
}

export function ExecutionTrace({ trace }: ExecutionTraceProps) {
  const [currentStep, setCurrentStep] = useState(0);

  if (trace.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No execution trace available</p>
      </Card>
    );
  }

  const currentTrace = trace[currentStep];
  const variables = currentTrace?.state || {};

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide">Execution Trace</div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-mono text-muted-foreground">
              Step {currentStep + 1} / {trace.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(Math.min(trace.length - 1, currentStep + 1))}
              disabled={currentStep >= trace.length - 1}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {currentTrace && (
          <>
            <div className="p-3 rounded border bg-card">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Current Instruction</div>
              <div className="text-sm font-mono font-semibold text-primary">{currentTrace.instruction}</div>
            </div>

            <div className="p-3 rounded border bg-card">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Variable State</div>
              {Object.keys(variables).length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">{key}:</span>
                      <span className="text-sm font-mono font-semibold text-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">No variables defined</div>
              )}
            </div>
          </>
        )}

        <div className="space-y-1 max-h-64 overflow-y-auto">
          {trace.map((step, index) => (
            <div
              key={index}
              className={`p-2 rounded border text-xs font-mono transition-all duration-300 ${
                index === currentStep
                  ? 'ring-2 ring-primary bg-primary/10'
                  : 'bg-card/50'
              }`}
              onClick={() => setCurrentStep(index)}
            >
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Step {step.step}:</span>
                <span className="font-semibold">{step.instruction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
