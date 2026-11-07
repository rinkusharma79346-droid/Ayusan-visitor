"use client";

import { Reveal } from "./Reveal";

const phrases = [
  "Read deeply",
  "•",
  "Dream quietly",
  "•",
  "Focus fully",
  "•",
  "Grow endlessly",
  "•",
  "A room of one's own",
  "•",
  "Where silence speaks volumes",
  "•",
];

export function Marquee() {
  const row = [...phrases, ...phrases];
  return (
    <section
      aria-hidden
      className="relative overflow-hidden py-7 border-b border-line bg-cream"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-40 z-10 bg-gradient-to-r from-cream to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-40 z-10 bg-gradient-to-l from-cream to-transparent" />
      <div className="flex w-max animate-marquee">
        {row.map((p, i) => (
          <span
            key={i}
            className={`mx-7 font-quote text-lg sm:text-xl italic whitespace-nowrap ${
              p === "•" ? "text-gold/70" : "text-sand"
            }`}
          >
            {p}
          </span>
        ))}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  copy,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  copy?: string;
  align?: "center" | "left";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      <Reveal>
        <div
          className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}
        >
          <span className="hairline w-8" />
          <span className="font-body text-[0.62rem] tracking-[0.42em] uppercase text-gold-dark">
            {eyebrow}
          </span>
          <span className="hairline w-8" />
        </div>
      </Reveal>
      <Reveal delay={0.12}>
        <h2 className="mt-6 font-display font-bold text-[clamp(1.9rem,4.6vw,3.1rem)] leading-[1.15] text-ivory">
          {title} {accent && <span className="gold-text italic">{accent}</span>}
        </h2>
      </Reveal>
      {copy && (
        <Reveal delay={0.24}>
          <p
            className={`mt-6 font-body font-light text-sand leading-[1.9] text-[0.92rem] sm:text-[0.95rem] ${
              centered ? "" : ""
            }`}
          >
            {copy}
          </p>
        </Reveal>
      )}
    </div>
  );
}
