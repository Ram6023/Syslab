
import { SimulationEvent, SimulationState } from './types';

export class SimulationEngine {
  private state: SimulationState;
  private eventQueue: SimulationEvent[];
  private callbacks: Map<string, (event: SimulationEvent) => void>;
  private intervalId: number | null = null;

  constructor() {
    this.state = {
      currentTime: 0,
      events: [],
      isRunning: false,
      isPaused: false,
      speed: 1,
    };
    this.eventQueue = [];
    this.callbacks = new Map();
  }

  scheduleEvent(event: SimulationEvent): void {
    this.eventQueue.push(event);
    this.eventQueue.sort((a, b) => a.time - b.time);
  }

  on(eventType: string, callback: (event: SimulationEvent) => void): void {
    this.callbacks.set(eventType, callback);
  }

  off(eventType: string): void {
    this.callbacks.delete(eventType);
  }

  start(): void {
    if (this.state.isRunning) return;
    
    this.state.isRunning = true;
    this.state.isPaused = false;
    
    this.intervalId = window.setInterval(() => {
      this.tick();
    }, 100 / this.state.speed);
  }

  pause(): void {
    this.state.isPaused = true;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resume(): void {
    if (!this.state.isPaused) return;
    this.state.isPaused = false;
    this.start();
  }

  stop(): void {
    this.state.isRunning = false;
    this.state.isPaused = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset(): void {
    this.stop();
    this.state.currentTime = 0;
    this.state.events = [];
    this.eventQueue = [];
  }

  setSpeed(speed: number): void {
    this.state.speed = speed;
    if (this.state.isRunning && !this.state.isPaused) {
      this.stop();
      this.start();
    }
  }

  private tick(): void {
    if (this.state.isPaused || !this.state.isRunning) return;

    while (this.eventQueue.length > 0 && this.eventQueue[0].time <= this.state.currentTime) {
      const event = this.eventQueue.shift()!;
      this.state.events.push(event);
      
      const callback = this.callbacks.get(event.type);
      if (callback) {
        callback(event);
      }
    }

    this.state.currentTime += 0.1;

    if (this.eventQueue.length === 0) {
      this.stop();
    }
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  getCurrentTime(): number {
    return this.state.currentTime;
  }

  isRunning(): boolean {
    return this.state.isRunning;
  }
}