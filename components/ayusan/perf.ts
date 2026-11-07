/**
 * Lightweight capability probe for low-end devices.
 *
 * The site is fully usable everywhere, but a few purely decorative effects
 * (backdrop blur, blend-mode grain, shimmer text, floating dust, cursor
 * glow) cost real GPU time on modest hardware. `isLowPerfDevice()` lets
 * components skip those, and `markLowPerf()` tags <html data-perf="low">
 * so plain CSS can neutralise the rest — no layout or colour changes.
 */

let cached: boolean | null = null;

export function isLowPerfDevice(): boolean {
  // Safe on the server / during hydration: assume a capable device.
  if (typeof window === "undefined") return false;
  if (cached !== null) return cached;
  try {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency || 8;
    const mem = nav.deviceMemory || 8; // Chrome-only, in GB
    const smallScreen = window.innerWidth < 640;
    cached = cores <= 4 || mem <= 3 || (smallScreen && cores <= 6);
  } catch {
    cached = false;
  }
  return cached;
}

/** Tag <html data-perf="low"> once — CSS guards key off this attribute. */
export function markLowPerf(): void {
  if (isLowPerfDevice()) {
    document.documentElement.setAttribute("data-perf", "low");
  }
}
