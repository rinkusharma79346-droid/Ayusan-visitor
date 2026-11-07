"use client";

import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { LogoMark } from "./LogoMark";
import { useReserve } from "./ReserveContext";

const perks = [
  "No fee to reserve — your first visit is on us",
  "Seat held under your name for the whole slot",
  "Full access to shelves, café corner & Wi-Fi",
  "Change or cancel anytime with one message",
];

/**
 * The closing invitation — no form fields on the page anymore.
 * One golden button opens the reservation popup.
 */
export function CtaBand() {
  const { openReserve } = useReserve();

  return (
    <section
      id="reserve"
      className="cv-auto relative py-24 sm:py-32 overflow-hidden bg-cream-deep/50 border-t border-line"
    >
      {/* warm afternoon light behind the invitation */}
      <div
        aria-hidden
        className="absolute left-1/2 top-[4%] -translate-x-1/2 w-[min(760px,92vw)] h-[520px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 46% at 50% 30%, rgba(212,175,55,0.16), transparent 72%)",
        }}
      />
      {/* paper grain */}
      <div
        aria-hidden
        className="paper-grain absolute inset-0 opacity-60 mix-blend-multiply"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid lg:grid-cols-[1fr_minmax(0,460px)] gap-14 lg:gap-20 items-center">
          {/* Invitation copy */}
          <div>
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="hairline w-8" />
                <span className="font-body text-[0.62rem] tracking-[0.42em] uppercase text-gold">
                  Reserve your seat
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <h2 className="mt-6 font-display font-bold text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.16] text-ivory">
                Your chair is chosen.
                <br />
                <span className="gold-text italic">The lamp is lit.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.22}>
              <p className="mt-6 max-w-lg font-body font-light text-sand leading-[1.9] text-[0.92rem] sm:text-[0.95rem]">
                Tell us when you&rsquo;d like to arrive and how you like to read
                — we&rsquo;ll prepare a seat to match. It takes less than a
                minute, and costs nothing but the intention to begin.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <ul className="mt-9 space-y-4 max-w-lg">
                {perks.map((p) => (
                  <li key={p} className="flex items-start gap-3.5">
                    <span className="mt-[3px] flex items-center justify-center w-5 h-5 rounded-full border border-gold/40 bg-gold/[0.1] shrink-0">
                      <span className="block w-1.5 h-1.5 rotate-45 bg-gold" />
                    </span>
                    <span className="font-body font-light text-ivory-dim text-[0.86rem] leading-[1.7]">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* The invitation card */}
          <Reveal delay={0.15}>
            <div className="relative rounded-[4px] border border-line bg-cream-card shadow-[0_40px_110px_-40px_rgba(110,85,30,0.45)] overflow-hidden gold-frame">
              <div className="hairline absolute top-0 inset-x-0" />
              <span className="absolute top-4 left-4 w-6 h-6 border-t border-l border-gold/40 pointer-events-none" />
              <span className="absolute top-4 right-4 w-6 h-6 border-t border-r border-gold/40 pointer-events-none" />
              <span className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-gold/40 pointer-events-none" />
              <span className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-gold/40 pointer-events-none" />

              <div className="p-8 sm:p-10 text-center">
                <div className="flex justify-center">
                  <LogoMark size={62} />
                </div>

                <p className="mt-6 font-body text-[0.6rem] tracking-[0.42em] uppercase text-gold">
                  One minute. Zero cost.
                </p>
                <h3 className="mt-3 font-display font-bold text-[1.7rem] text-ivory leading-snug">
                  Reserve your seat
                  <span className="gold-text italic"> now.</span>
                </h3>

                <motion.button
                  onClick={openReserve}
                  className="btn-shine group relative mt-8 font-body text-[0.78rem] font-semibold tracking-[0.22em] uppercase text-ink bg-gradient-to-b from-gold-light via-gold to-gold-dark rounded-full px-10 py-[18px] shadow-[0_14px_48px_-12px_rgba(168,124,31,0.65)] w-full sm:w-auto"
                  whileHover={{
                    scale: 1.035,
                    boxShadow: "0 20px 60px -12px rgba(168,124,31,0.75)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  Reserve a Seat
                </motion.button>

                <p className="mt-5 font-body text-[0.68rem] font-light text-sand/80 leading-relaxed">
                  Opens a little form right here — no scrolling, no hunting.
                  Fill it in under a minute.
                </p>

                <div className="mt-8 pt-7 border-t border-line flex items-center justify-center gap-5">
                  <div className="text-left">
                    <p className="font-body text-[0.6rem] tracking-[0.34em] uppercase text-sand">
                      Open every day
                    </p>
                    <p className="mt-1 font-display text-ivory text-lg">
                      8:00 AM — 10:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
