"use client";

import { motion } from "framer-motion";

/**
 * Ayusan Library brand mark — open book with a rising flame,
 * crisp vector art in brand golds, tuned for the cream canvas.
 */
export function LogoMark({
  size = 44,
  className = "",
  animate = true,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={`glow-soft ${className}`}
      role="img"
      aria-label="Ayusan Library logo — an open book with a golden flame"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="45%" stopColor="#a87c1f" />
          <stop offset="100%" stopColor="#7e5c14" />
        </linearGradient>
        <radialGradient id="haloGrad" cx="0.5" cy="0.42" r="0.62">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.3" />
          <stop offset="60%" stopColor="#d4af37" stopOpacity="0.09" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* soft sunlight halo */}
      {animate && (
        <motion.circle
          cx="32"
          cy="28"
          r="30"
          fill="url(#haloGrad)"
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.96, 1.05, 0.96] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "32px 28px" }}
        />
      )}

      {/* Flame — rises from the spine of the book */}
      {animate ? (
        <g className="animate-flame">
          <path
            d="M32 7 C38 12.8 39.2 17.8 32 23 C24.8 17.8 26 12.8 32 7 Z"
            fill="url(#goldGrad)"
          />
          <path
            d="M32 12.5 C34.8 15.8 35.2 18.4 32 20.6 C28.8 18.4 29.2 15.8 32 12.5 Z"
            fill="#fffdf0"
            opacity="0.9"
          />
        </g>
      ) : (
        <path
          d="M32 7 C38 12.8 39.2 17.8 32 23 C24.8 17.8 26 12.8 32 7 Z"
          fill="url(#goldGrad)"
        />
      )}

      {/* Open book — fanned pages in a wide V */}
      <g
        stroke="url(#goldGrad)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M32 31 C27 27.5 20 27 12 29 L12 47 C20 45 27 45.5 32 49" />
        <path d="M32 31 C37 27.5 44 27 52 29 L52 47 C44 45 37 45.5 32 49" />
        <path d="M32 37 C28.2 34.6 23.4 34.1 17.5 35.2" opacity="0.55" strokeWidth="2" />
        <path d="M32 37 C35.8 34.6 40.6 34.1 46.5 35.2" opacity="0.55" strokeWidth="2" />
      </g>
    </svg>
  );
}

/** Full lockup: mark + AYUSAN / — LIBRARY — wordmark */
export function LogoLockup({
  size = 44,
  compact = false,
}: {
  size?: number;
  compact?: boolean;
}) {
  return (
    <span className="flex items-center gap-3 select-none">
      <LogoMark size={size} />
      <span className="flex flex-col leading-none">
        <span
          className="font-display font-bold tracking-[0.14em] gold-text"
          style={{ fontSize: compact ? "1.15rem" : "1.3rem" }}
        >
          AYUSAN
        </span>
        <span className="flex items-center gap-2 mt-1.5">
          <span className="hairline w-6 sm:w-8" />
          <span
            className="font-body text-gold tracking-[0.42em] uppercase"
            style={{ fontSize: "0.55rem", fontWeight: 500 }}
          >
            Library
          </span>
          <span className="hairline w-6 sm:w-8" />
        </span>
      </span>
    </span>
  );
}
