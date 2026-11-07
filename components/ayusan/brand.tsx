/**
 * Ayusan brand mark — a quiet, single-colour book-and-flame sigil.
 * Uses currentColor so it sits correctly on paper, green, or ink surfaces.
 * The wordmark lockup pairs the sigil with the Newsreader wordmark.
 */

export function AyusanMark({
  size = 28,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* open book */}
      <path
        d="M4 22.5V10.2c0-.6.5-1.1 1.1-1 3.4.5 7.3.4 9.7-1.4.1-.1.3-.1.4 0 2.4 1.8 6.3 1.9 9.7 1.4.6-.1 1.1.4 1.1 1v12.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16 8.4v14.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M4 22.5c3.6-.6 8.4-.5 12 1.6 3.6-2.1 8.4-2.2 12-1.6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* flame above the book */}
      <path
        d="M16 2.6c1.5 1.7 2.3 3 2.3 4.2 0 1.4-1 2.4-2.3 2.4s-2.3-1-2.3-2.4c0-1.2.8-2.5 2.3-4.2Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

export function AyusanLockup({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <AyusanMark size={compact ? 22 : 26} />
      <span className="flex flex-col leading-none">
        <span
          className="font-display font-medium text-ink"
          style={{ fontSize: compact ? "1.0625rem" : "1.1875rem", letterSpacing: "0.01em" }}
        >
          Ayusan&nbsp;Library
        </span>
        <span
          className="label-micro text-ink-mute mt-1 hidden sm:block"
          style={{ letterSpacing: "0.18em" }}
        >
          Reading room · Study space
        </span>
      </span>
    </span>
  );
}
