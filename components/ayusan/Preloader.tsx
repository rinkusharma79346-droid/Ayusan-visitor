"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "./LogoMark";
import { isLowPerfDevice } from "./perf";

/**
 * Cinematic intro — the brand mark warms into existence like
 * morning light on paper, then releases the page. Low-end devices
 * get a shorter hold so the site becomes interactive sooner.
 */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const hold = reduce ? 400 : isLowPerfDevice() ? 700 : 1100;
    const t = setTimeout(() => setDone(true), hold);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden
            className="paper-grain absolute inset-0 opacity-60 mix-blend-multiply"
          />
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.86, filter: "blur(14px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <LogoMark size={110} />
          </motion.div>

          <motion.div
            className="relative mt-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <motion.p
              className="font-body text-[0.6rem] sm:text-xs tracking-[0.55em] uppercase text-gold pl-[0.55em]"
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{
                delay: 0.4,
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              Ayusan Library
            </motion.p>
          </motion.div>

          <motion.div
            className="relative mt-8 h-px w-40 bg-gold/20 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <motion.div
              className="h-full w-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #a87c1f, transparent)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.1, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
