"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  // DRASTICALLY reduced grid size for performance: 30 rows x 20 cols = 600 elements (vs 15,000)
  const rows = new Array(30).fill(1);
  const cols = new Array(20).fill(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  // Enhanced vibrant color palette with neon/cyber theme
  const colors = [
    "rgb(34 197 94)",   // neon green (primary)
    "rgb(6 182 212)",   // cyan (accent)
    "rgb(168 85 247)",  // purple
    "rgb(236 72 153)",  // pink
    "rgb(251 146 60)",  // orange
    "rgb(59 130 246)",  // blue
    "rgb(245 158 11)",  // amber
    "rgb(139 92 246)",  // violet
    "rgb(20 184 166)",  // teal
  ];

  const getRandomColor = useCallback(() => {
    return colors[Math.floor(Math.random() * colors.length)];
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute left-1/4 p-4 -top-1/4 flex -translate-x-1/2 -translate-y-1/2 w-full h-full z-0",
        className
      )}
      {...rest}
    >
      {rows.map((_, i) => (
        <div
          key={`row-${i}`}
          className="w-24 h-16 border-l border-slate-700/30 relative flex-shrink-0"
        >
          {cols.map((_, j) => {
            const boxId = `${i}-${j}`;
            const isHovered = hoveredBox === boxId;

            return (
              <motion.div
                key={`col-${j}`}
                className="w-24 h-16 border-r border-t border-slate-700/30 relative group"
                style={{
                  backgroundColor: "transparent",
                }}
                onMouseEnter={() => setHoveredBox(boxId)}
                onMouseLeave={() => setHoveredBox(null)}
                animate={{
                  backgroundColor: isHovered ? getRandomColor() : "transparent",
                  opacity: isHovered ? 1 : 0.3,
                  scale: isHovered ? 1.05 : 1,
                }}
                transition={{
                  duration: isHovered ? 0.1 : 0.8,
                  ease: "easeOut",
                }}
              >
                {j % 3 === 0 && i % 3 === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="absolute h-8 w-12 -top-[16px] -left-[24px] text-slate-700/30 stroke-[1px] pointer-events-none group-hover:text-slate-500/50 transition-colors duration-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m6-6H6"
                    />
                  </svg>
                ) : null}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);