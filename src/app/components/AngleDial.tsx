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
    <div className="dial" ref={dialRef} onPointerDown={handlePointerDown}>
      <div className="dial__ring" />
      <div className="dial__indicator" style={{ transform: `rotate(${rotation}deg)` }}>
        <span className="dial__handle" />
      </div>
      <div className="dial__readout">
        <div className="dial__label">Angle</div>
        <div className="dial__value">{Math.round(value)} deg</div>
      </div>
    </div>
  );
}
