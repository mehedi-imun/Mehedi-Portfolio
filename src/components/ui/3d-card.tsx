"use client";

import { useReducedMotion } from "motion/react";
import { createContext, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * Pure CSS 3D -- perspective plus preserve-3d, driven by pointer position.
 * Deliberately not WebGL: this runs on every project card, and the hero scene
 * is already paying that cost once. Disabled under prefers-reduced-motion,
 * where a tilting surface is exactly the wrong thing to ship.
 */

const MouseEnterContext = createContext<boolean>(false);

export function CardContainer({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isEntered, setIsEntered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || prefersReducedMotion) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = (event.clientX - left - width / 2) / 22;
    const y = (event.clientY - top - height / 2) / 22;
    ref.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
  };

  const reset = () => {
    setIsEntered(false);
    if (ref.current) ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };

  return (
    <MouseEnterContext.Provider value={isEntered}>
      <div
        className={cn("flex items-center justify-center", containerClassName)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={ref}
          onMouseEnter={() => setIsEntered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={reset}
          className={cn(
            "relative flex items-center justify-center transition-transform duration-200 ease-linear",
            className
          )}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("[&>*]:[transform-style:preserve-3d]", className)}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

export function CardItem({
  children,
  className,
  translateZ = 0,
}: {
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
}) {
  const isEntered = useContext(MouseEnterContext);
  const prefersReducedMotion = useReducedMotion();
  const lift = isEntered && !prefersReducedMotion ? translateZ : 0;

  return (
    <div
      className={cn("transition-transform duration-200 ease-linear", className)}
      style={{ transform: `translateZ(${lift}px)` }}
    >
      {children}
    </div>
  );
}
