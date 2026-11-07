"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const dur = reduce ? 0 : 1900;
    let raf = 0;
    const tick = (now: number) => {
      const p = dur === 0 ? 1 : Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

type Stat =
  | { kind: "text"; headline: string; label: string }
  | { kind: "count"; value: number; suffix: string; label: string };

// No invented mega-numbers — the first tile simply states what we offer.
const stats: Stat[] = [
  {
    kind: "text",
    headline: "Extra books",
    label: "for studies & learning available",
  },
  { kind: "count", value: 180, suffix: "+", label: "Quiet seats available" },
  { kind: "count", value: 14, suffix: " hrs", label: "Open every single day" },
  { kind: "count", value: 100, suffix: "%", label: "Devotion to your focus" },
];

export function StatsBar() {
  return (
    <section aria-label="Library in numbers" className="relative border-y border-line bg-cream-deep/60">
      <div
        aria-hidden
        className="absolute inset-0 paper-grain opacity-50 mix-blend-multiply pointer-events-none"
      />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`py-10 sm:py-12 px-4 flex flex-col items-center text-center ${
                i > 0 ? "border-l border-line/70" : ""
              } ${i > 1 ? "border-t md:border-t-0 border-line/70" : ""} ${
                i === 2 ? "border-l-0 md:border-l" : ""
              }`}
            >
              <span className="font-display font-bold text-3xl sm:text-4xl gold-text">
                {s.kind === "count" ? (
                  <CountUp to={s.value} suffix={s.suffix} />
                ) : (
                  s.headline
                )}
              </span>
              <span className="mt-3 font-body text-[0.62rem] sm:text-[0.66rem] tracking-[0.24em] uppercase text-sand">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
