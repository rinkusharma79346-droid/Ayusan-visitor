"use client";

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { LogoLockup } from "./LogoMark";
import { useReserve } from "./ReserveContext";
import { isLowPerfDevice } from "./perf";

const links = [
  { label: "Story", href: "#story" },
  { label: "Offerings", href: "#offerings" },
  { label: "Spaces", href: "#spaces" },
  { label: "Visit", href: "#visit" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { openReserve } = useReserve();
  // Low-end devices see a shorter preloader — arrive sooner as well.
  const NAV_DELAY = isLowPerfDevice() ? 0.55 : 1.55;

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: NAV_DELAY, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`nav-surface transition-all duration-500 ${
            scrolled
              ? "scrolled bg-cream/85 backdrop-blur-xl border-b border-line shadow-[0_12px_44px_-22px_rgba(110,85,30,0.4)]"
              : "bg-transparent border-b border-transparent"
          }`}
        >
          <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-[76px] flex items-center justify-between">
            <a
              href="#top"
              aria-label="Ayusan Library — back to top"
              className="py-2"
            >
              <LogoLockup size={40} compact={scrolled} />
            </a>

            {/* Desktop links — hidden below lg: they genuinely don't fit 768–1023px */}
            <div className="hidden lg:flex items-center gap-9">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative font-body text-[0.72rem] tracking-[0.26em] uppercase text-ivory-dim hover:text-gold-dark transition-colors duration-300 group py-2"
                >
                  {l.label}
                  <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-gradient-to-r from-gold to-gold-dark transition-all duration-500 group-hover:w-full" />
                </a>
              ))}
              <span aria-hidden className="hairline w-6 hidden xl:block" />
              <button
                onClick={openReserve}
                className="btn-shine font-body text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-ink bg-gradient-to-b from-gold-light via-gold to-gold-dark rounded-full px-6 py-3 transition-all duration-500 hover:shadow-[0_14px_38px_-10px_rgba(168,124,31,0.6)] cursor-pointer"
              >
                Reserve a Seat
              </button>
            </div>

            {/* Mobile trigger */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="lg:hidden relative w-11 h-11 flex flex-col items-center justify-center gap-[6px] rounded-full border border-line bg-cream-card/60 backdrop-blur"
            >
              <motion.span
                animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                className="block w-4 h-px bg-gold"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                className="block w-4 h-px bg-gold"
              />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-cream/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div
              aria-hidden
              className="absolute inset-0 paper-grain opacity-50 mix-blend-multiply pointer-events-none"
            />
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-3xl text-ivory hover:text-gold-dark transition-colors"
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i + 0.1, duration: 0.5 }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.button
              onClick={() => {
                setOpen(false);
                openReserve();
              }}
              className="btn-shine mt-4 font-body text-xs font-semibold tracking-[0.2em] uppercase text-ink bg-gradient-to-b from-gold-light via-gold to-gold-dark rounded-full px-8 py-4 shadow-[0_14px_40px_-10px_rgba(168,124,31,0.55)] cursor-pointer"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              Reserve a Seat
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
