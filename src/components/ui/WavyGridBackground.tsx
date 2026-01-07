"use client";
import React from "react";
import { Boxes } from "./background-boxes";
import { cn } from "@/lib/utils";

interface WavyGridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  mask?: boolean;
}

export const WavyGridBackground: React.FC<WavyGridBackgroundProps> = ({
  children,
  className,
  mask = true,
}) => {
  return (
    <div className={cn("relative w-full h-full min-h-screen overflow-hidden", className)}>
      {/* Interactive Background Boxes with 3D perspective - Full Page Coverage */}
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        {/* Radial gradient mask for smooth edges */}
        {mask && (
          <div className="absolute inset-0 w-full h-full z-20 [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)] pointer-events-none" />
        )}
        {/* Full page boxes background */}
        <div className="absolute inset-0 w-full h-full z-10">
          <Boxes />
        </div>
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};