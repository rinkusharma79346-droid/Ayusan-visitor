"use client";

import { useMemo } from "react";

/** Deterministic PRNG so SSR and client render identical particles. */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Golden dust motes drifting upward through a beam of sunlight —
 * the quiet air of a bright reading hall.
 */
export function DustParticles({ count = 26 }: { count?: number }) {
  // Always rendered (deterministic seed → SSR/client parity). On low-end
  // devices the [data-perf="low"] CSS guard sets display:none, which fully
  // stops the animation + paint cost.
  const particles = useMemo(() => {
    const rand = mulberry32(1962); // fixed seed → SSR/client parity
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      size: 1.5 + rand() * 3.5,
      duration: 14 + rand() * 16,
      delay: -rand() * 30,
      opacity: 0.22 + rand() * 0.33,
      drift: (rand() - 0.5) * 160,
      blur: rand() > 0.6,
    }));
  }, [count]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="dust-particle absolute bottom-[-4vh] rounded-full"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.blur ? "#d4af37" : "#a87c1f",
              boxShadow: `0 0 ${p.size * 3}px rgba(168,124,31,${p.opacity})`,
              filter: p.blur ? "blur(1px)" : "none",
              "--dust-duration": `${p.duration}s`,
              "--dust-delay": `${p.delay}s`,
              "--dust-x": `${p.drift}px`,
              "--dust-opacity": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
