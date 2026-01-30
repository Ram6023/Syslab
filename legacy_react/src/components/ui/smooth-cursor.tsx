"use client";

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, SpringConfig } from "framer-motion"
import { Cog } from "lucide-react"

interface SmoothCursorProps {
  cursor?: React.ReactNode;
  springConfig?: SpringConfig;
}

const defaultSpringConfig: SpringConfig = {
  damping: 45,
  stiffness: 400,
  mass: 1,
  restDelta: 0.001,
};

const DefaultCursorSVG = () => (
  <div className="relative w-7 h-7 text-primary">
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" className="opacity-70" />
      <circle cx="14" cy="14" r="6" fill="currentColor" className="opacity-20" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center text-accent">
      <Cog className="w-3.5 h-3.5" />
    </div>
  </div>
)

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = defaultSpringConfig,
}: SmoothCursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 14)
      cursorY.set(e.clientY - 14)
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    // Add hover detection for interactive elements
    const interactiveElements = document.querySelectorAll(
      "button, a, input, select, textarea, [role='button'], [data-interactive]"
    )
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [cursorX, cursorY, isVisible])

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: springX,
        y: springY,
      }}
      animate={{
        scale: isClicking ? 0.85 : isHovering ? 1.6 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      <div
        className={`transition-colors duration-200 ${
          isHovering ? "text-primary" : "text-foreground"
        } ${isClicking ? "text-accent" : ""}`}
      >
        {cursor}
      </div>
    </motion.div>
  );
}

