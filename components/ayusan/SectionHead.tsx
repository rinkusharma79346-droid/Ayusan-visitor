"use client";

import { Reveal } from "./Reveal";

/**
 * Shared section header — the bibliographic index motif used sparingly:
 * a chapter number, a fine rule, a small-caps label, and a Newsreader
 * headline. One per section, no repetition inside sections.
 */
export function SectionHead({
  index,
  label,
  title,
  intro,
  onGreen = false,
  className = "",
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: string;
  onGreen?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className={`block w-10 ${onGreen ? "rule-on-green" : "rule-strong"}`}
        />
        <p className={`label-micro ${onGreen ? "text-bronze-on-green" : "text-bronze-deep"}`}>
          {label} · {index}
        </p>
      </div>
      <h2
        className={`mt-6 font-display font-medium text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] tracking-[-0.008em] ${
          onGreen ? "text-on-green" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-5 max-w-[36rem] text-[1rem] leading-[1.7] ${
            onGreen ? "text-mute-on-green" : "text-ink-soft"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
