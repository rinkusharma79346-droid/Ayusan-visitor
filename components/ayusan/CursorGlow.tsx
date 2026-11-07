"use client";

import { useEffect, useState } from "react";
import { isLowPerfDevice } from "./perf";

/**
 * A soft wash of golden sunlight that follows the cursor —
 * like carrying a reading lamp across a bright hall.
 * Desktop / fine-pointer devices only, never on low-end hardware.
 * Moves via transform (compositor-only) so it never triggers layout.
 */
export function CursorGlow() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // The 620px gradient is a real paint cost — skip it on modest devices.
    if (!fine || reduce || isLowPerfDevice()) return;

    const enable = requestAnimationFrame(() => setEnabled(true));
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(enable);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5]"
      style={{
        transform: `translate3d(${pos?.x ?? -400}px, ${pos?.y ?? -400}px, 0) translate(-50%, -50%)`,
        willChange: "transform",
        width: "620px",
        height: "620px",
        background:
          "radial-gradient(circle, rgba(212,175,55,0.14) 0%, rgba(212,175,55,0.05) 34%, transparent 62%)",
        transition: "opacity 0.6s ease",
        opacity: pos ? 1 : 0,
      }}
    />
  );
}
