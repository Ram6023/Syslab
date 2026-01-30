import { NetworkSimulationResult } from '@/utils/network-simulator';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Packet } from '@/core/types';

export function NetworkVisualization({ result }: { result: NetworkSimulationResult }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && currentStep < result.packets.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
    if (isPlaying && currentStep >= result.packets.length) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, result.packets.length]);

  const displayedPackets = result.packets.slice(0, currentStep + 1);
  const currentState = result.states[Math.min(currentStep, result.states.length - 1)];

  const handleNext = () => {
    if (currentStep < result.packets.length - 1) {
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

  const getPacketColor = (packet: Packet) => {
    if (packet.isLost) return 'hsl(var(--terminal-red))';
    if (packet.isRetransmission) return 'hsl(var(--terminal-yellow))';
    switch (packet.type) {
      case 'SYN':
      case 'SYN-ACK':
        return 'hsl(var(--terminal-cyan))';
      case 'ACK':
        return 'hsl(var(--terminal-green))';
      case 'DATA':
        return 'hsl(var(--terminal-blue))';
      case 'FIN':
        return 'hsl(var(--terminal-magenta))';
      default:
        return 'hsl(var(--muted-foreground))';
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Packet Flow Animation</h3>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePlayPause}>
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentStep === 0}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-mono text-muted-foreground">
              Packet {currentStep + 1} / {result.packets.length}
            </span>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={currentStep >= result.packets.length - 1}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Network diagram */}
        <div className="relative h-64 mb-4 border border-border rounded bg-card/50">
          <div className="absolute left-10 top-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center font-mono font-bold">
              Client
            </div>
          </div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center font-mono font-bold">
              Server
            </div>
          </div>

          {/* Packet flow lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
              </marker>
            </defs>
            {displayedPackets.map((packet, index) => {
              const isClientToServer = ['SYN', 'ACK', 'DATA', 'FIN'].includes(packet.type);
              const startX = isClientToServer ? 10 : 90;
              const endX = isClientToServer ? 90 : 10;
              const y = 20 + (index % 8) * 10;
              const opacity = index === currentStep ? 1 : 0.3;
              const color = getPacketColor(packet);

              return (
                <g key={packet.id}>
                  <line
                    x1={`${startX}%`}
                    y1={`${y}%`}
                    x2={`${endX}%`}
                    y2={`${y}%`}
                    stroke={color}
                    strokeWidth="2"
                    opacity={opacity}
                    strokeDasharray={packet.isLost ? '5,5' : '0'}
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x={`${50}%`}
                    y={`${y - 2}%`}
                    textAnchor="middle"
                    fill={color}
                    fontSize="10"
                    fontFamily="monospace"
                    opacity={opacity}
                  >
                    {packet.type} {packet.sequenceNumber}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {currentState && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded border bg-card">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Connection State</div>
              <div className="text-sm font-mono font-semibold text-primary">{currentState.connectionState}</div>
            </div>
            <div className="p-3 rounded border bg-card">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Congestion Window</div>
              <div className="text-sm font-mono font-semibold text-info">{currentState.congestionWindow}</div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide">Packet Timeline</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {result.packets.map((packet, index) => {
            const isCurrent = index === currentStep;
            const color = getPacketColor(packet);
            return (
              <div
                key={packet.id}
                className={`p-2 rounded border transition-all duration-300 ${
                  isCurrent ? 'ring-2 ring-primary scale-105' : ''
                }`}
                style={{
                  borderColor: color,
                  backgroundColor: isCurrent ? color + '10' : 'transparent',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold" style={{ color }}>
                      {packet.type}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Seq: {packet.sequenceNumber}
                    </span>
                    {packet.ackNumber && (
                      <span className="text-xs font-mono text-muted-foreground">
                        ACK: {packet.ackNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {packet.isLost && (
                      <span className="text-xs text-[hsl(var(--terminal-red))]">LOST</span>
                    )}
                    {packet.isRetransmission && (
                      <span className="text-xs text-[hsl(var(--terminal-yellow))]">RETRANS</span>
                    )}
                    <span className="text-xs font-mono text-muted-foreground">t={packet.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
