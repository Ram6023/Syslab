import { useCallback, useRef, useEffect } from 'react';

interface WavyGridBackgroundProps {
    backgroundColor?: string;
    gridColor?: string;
    gridSize?: number;
    gridOpacity?: number;
    waveAmplitude?: number;
    waveFrequency?: number;
    animationSpeed?: number;
    enableAnimation?: boolean;
    gridThickness?: number;
}

export function WavyGridBackground({
    backgroundColor = '#0a0a0f',
    gridColor = '#1a4d2e',
    gridSize = 40,
    gridOpacity = 0.3,
    waveAmplitude = 15,
    waveFrequency = 0.015,
    animationSpeed = 0.5,
    enableAnimation = true,
    gridThickness = 1.5,
}: WavyGridBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number>();
    const timeRef = useRef(0);

    const drawGrid = useCallback((canvas: HTMLCanvasElement, time: number = 0) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        const width = parent.clientWidth;
        const height = parent.clientHeight;

        if (width <= 0 || height <= 0) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = gridThickness;
        ctx.globalAlpha = gridOpacity;

        const effectiveGridSize = Math.max(gridSize, 20);

        // Draw vertical wavy lines
        for (let x = 0; x <= width; x += effectiveGridSize) {
            ctx.beginPath();
            for (let y = 0; y <= height; y += 2) {
                const waveX = x + Math.sin((y * waveFrequency) + time) * waveAmplitude;
                if (y === 0) {
                    ctx.moveTo(waveX, y);
                } else {
                    ctx.lineTo(waveX, y);
                }
            }
            ctx.stroke();
        }

        // Draw horizontal wavy lines
        for (let y = 0; y <= height; y += effectiveGridSize) {
            ctx.beginPath();
            for (let x = 0; x <= width; x += 2) {
                const waveY = y + Math.sin((x * waveFrequency) + time) * waveAmplitude;
                if (x === 0) {
                    ctx.moveTo(x, waveY);
                } else {
                    ctx.lineTo(x, waveY);
                }
            }
            ctx.stroke();
        }
    }, [gridSize, gridColor, gridThickness, gridOpacity, waveAmplitude, waveFrequency]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const animate = () => {
            if (enableAnimation) {
                timeRef.current += animationSpeed * 0.01;
            }
            drawGrid(canvas, timeRef.current);
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Initial draw
        drawGrid(canvas, timeRef.current);

        // Start animation
        if (enableAnimation) {
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        // Handle resize
        const handleResize = () => {
            drawGrid(canvas, timeRef.current);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [drawGrid, enableAnimation, animationSpeed]);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor,
                overflow: 'hidden',
                zIndex: 0,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
}
