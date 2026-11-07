"use client";

import Image from "next/image";
import { site } from "./site";
import { Reveal } from "./Reveal";

/**
 * The story — one strong editorial moment instead of a marketing section.
 * Short, specific, confident sentences; the photograph carries the rest.
 */
export function Story() {
  return (
    <section id="story" className="cv-auto bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-[76rem] px-5 sm:px-8">
        <Reveal className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ——— The words ——— */}
          <div className="lg:col-span-5 order-2 lg:order-1 lg:pt-4">
            <div className="flex items-center gap-4">
              <span aria-hidden className="block w-10 rule-strong" />
              <p className="label-micro text-bronze-deep">The library · {site.established}</p>
            </div>

            <h2 className="mt-6 font-display font-medium text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.08] tracking-[-0.008em] text-ink">
              Built for the long
              <br />
              afternoon of a <span className="italic font-normal">good book.</span>
            </h2>

            <p className="mt-6 text-[1rem] leading-[1.75] text-ink-soft max-w-[30rem]">
              Ayusan opened in {site.established} as a reading room for the
              neighbourhood — a place to study, work, and read without the noise
              of a café or the formality of an office. The shelves carry extra
              books for studies and learning, the lamps are warm, and the desks
              belong to whoever reserves them.
            </p>
            <p className="mt-4 text-[1rem] leading-[1.75] text-ink-soft max-w-[30rem]">
              That is the whole idea. It has not changed.
            </p>

            <blockquote className="mt-9 border-l-2 border-bronze pl-6">
              <p className="font-display italic text-[1.2rem] leading-[1.5] text-ink">
                A desk, a lamp, and the quiet to use them well.
              </p>
            </blockquote>
          </div>

          {/* ——— The photograph ——— */}
          <figure className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative border border-line bg-card p-2.5">
              <div className="relative aspect-[4/3] lg:aspect-[4/3.4] overflow-hidden">
                <Image
                  src="/images/reading-room/corner.jpg"
                  alt="A quiet corner of the library — a leather armchair beside a tall window, a stacked book and tea on the side table"
                  fill
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  quality={78}
                  loading="lazy"
                  className="object-cover img-tone"
                />
              </div>
              <figcaption className="pt-2.5 px-0.5 figcaption">
                fig. 06 — the corner by the tall window, late afternoon
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
