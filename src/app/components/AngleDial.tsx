"use client";

import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export type AngleDialProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function AngleDial({ value, onChange }: AngleDialProps) {
  const dialRef = useRef<HTMLDivElement>(null);

  const updateAngle = (
    event: PointerEvent | ReactPointerEvent<HTMLDivElement>
  ) => {
    const rect = dialRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const angle = Math.atan2(dx, -dy) * (180 / Math.PI);
    const clamped = Math.max(0, Math.min(90, angle));
    onChange(clamped);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateAngle(event);

    const handleMove = (moveEvent: PointerEvent) => updateAngle(moveEvent);
    const handleUp = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
  };

  const rotation = (value / 90) * 90;

  return (
    <div 
      className="relative w-[120px] h-[120px] rounded-full bg-background/60 border border-primary/10 grid place-items-center cursor-pointer shadow-sm touch-none select-none hover:bg-background/80 transition-colors backdrop-blur-sm" 
      ref={dialRef} 
      onPointerDown={handlePointerDown}
    >
      <div className="absolute inset-[10px] rounded-full border-2 border-dashed border-accent/60 pointer-events-none" />
      <div className="absolute w-full h-full grid place-items-center origin-center pointer-events-none" style={{ transform: `rotate(${rotation}deg)` }}>
        <span className="w-[10px] h-[36px] bg-accent rounded-full -translate-y-8 shadow-sm" />
      </div>
      <div className="text-center pointer-events-none z-10">
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Angle</div>
        <div className="text-lg font-semibold tabular-nums">{Math.round(value)} deg</div>
      </div>
    </div>
  );
}

