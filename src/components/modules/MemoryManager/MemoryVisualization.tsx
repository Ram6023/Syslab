import { MemoryResult } from '@/core/types';
import { Card } from '@/components/ui/card';
import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MemoryVisualizationProps {
  result: MemoryResult;
  numFrames: number;
  pageReferences: number[];
}

export function MemoryVisualization({ result, numFrames, pageReferences }: MemoryVisualizationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const frameStates = useMemo(() => {
    const states: Array<Array<number | null>> = [];
    const frames: Array<number | null> = Array(numFrames).fill(null);

    for (let i = 0; i <= result.events.length; i++) {
      if (i > 0) {
        const event = result.events[i - 1];
        if (event.isFault && event.frameIndex !== undefined) {
          // Use the frameIndex from the event
          frames[event.frameIndex] = event.pageNumber;
        }
      }
      states.push([...frames]);
    }

    return states;
  }, [result, numFrames]);

  const currentFrames = frameStates[currentStep] || Array(numFrames).fill(null);
  const currentEvent = currentStep > 0 ? result.events[currentStep - 1] : null;

  const handleNext = () => {
    if (currentStep < result.events.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Auto-play logic
  useEffect(() => {
    if (isPlaying && currentStep < result.events.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (isPlaying && currentStep >= result.events.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, result.events.length]);

  const colors = [
    'hsl(var(--terminal-green))',
    'hsl(var(--terminal-cyan))',
    'hsl(var(--terminal-yellow))',
    'hsl(var(--terminal-blue))',
    'hsl(var(--terminal-magenta))',
    'hsl(var(--accent))',
  ];

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Frame State Visualization</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentStep === 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-mono text-muted-foreground">
              Step {currentStep} / {result.events.length}
            </span>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={currentStep >= result.events.length}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          {currentFrames.map((page, index) => (
            <div key={index} className="space-y-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Frame {index + 1}</div>
              <div
                className="h-16 rounded border-2 flex items-center justify-center font-mono text-lg font-bold transition-all duration-300"
                style={{
                  backgroundColor: page !== null ? colors[page % colors.length] + '20' : 'transparent',
                  borderColor: page !== null ? colors[page % colors.length] : 'hsl(var(--border))',
                  color: page !== null ? colors[page % colors.length] : 'hsl(var(--muted-foreground))',
                }}
              >
                {page !== null ? page : '—'}
              </div>
            </div>
          ))}
        </div>

        {currentEvent && (
          <div className="mt-4 p-3 rounded border bg-card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-muted-foreground">Time: {currentEvent.time}</span>
              <span className="text-xs font-mono text-muted-foreground">Page: {currentEvent.pageNumber}</span>
            </div>
            <div className={`text-sm font-semibold ${currentEvent.isHit ? 'text-[hsl(var(--terminal-green))]' : 'text-[hsl(var(--terminal-red))]'}`}>
              {currentEvent.isHit ? '✓ Page Hit' : '✗ Page Fault'}
            </div>
            {currentEvent.reason && (
              <div className="text-xs text-muted-foreground mt-1">{currentEvent.reason}</div>
            )}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Page Reference Timeline</h3>
        <div className="flex flex-wrap gap-2">
          {pageReferences.map((page, index) => {
            const event = result.events[index];
            const isCurrent = index === currentStep - 1;
            return (
              <div
                key={index}
                className={`px-3 py-1 rounded font-mono text-sm transition-all duration-300 ${
                  isCurrent
                    ? 'scale-110 ring-2 ring-primary'
                    : ''
                } ${
                  event?.isHit
                    ? 'bg-[hsl(var(--terminal-green))]/20 text-[hsl(var(--terminal-green))]'
                    : 'bg-[hsl(var(--terminal-red))]/20 text-[hsl(var(--terminal-red))]'
                }`}
              >
                {page}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
