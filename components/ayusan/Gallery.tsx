"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "./Marquee";
import { Reveal } from "./Reveal";

const spaces = [
  {
    src: "/images/library-hall.jpg",
    alt: "The grand reading hall of Ayusan Library with warm lamps",
    caption: "The Grand Hall",
    sub: "Silent reading, tall shelves",
    className: "md:col-span-2 md:row-span-2 aspect-[16/10] md:aspect-auto",
  },
  {
    src: "/images/reading-nook.jpg",
    alt: "A cosy reading nook lit by a single brass lamp",
    caption: "The Nooks",
    sub: "One lamp, one book",
    className: "aspect-[3/4]",
  },
  {
    src: "/images/study-desk.jpg",
    alt: "A study desk with open books and golden lamp glow",
    caption: "The Study Desks",
    sub: "For long, deep work",
    className: "aspect-[3/4]",
  },
];

export function Gallery() {
  return (
    <section
      id="spaces"
      className="cv-auto relative py-24 sm:py-32 overflow-hidden bg-cream"
    >
      <div
        aria-hidden
        className="absolute -right-52 top-24 w-[560px] h-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.1), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Spaces that inspire"
          title="Rooms you&rsquo;ll want to"
          accent="linger in."
          copy="Each space at Ayusan has its own light, its own silence, its own way of holding your attention. Find the one that feels like yours — then make it yours."
        />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-5 md:auto-rows-[240px]">
          {spaces.map((s, i) => (
            <motion.figure
              key={s.caption}
              className={`group relative overflow-hidden rounded-[3px] border border-line bg-cream-card shadow-[0_22px_60px_-30px_rgba(110,85,30,0.5)] ${s.className}`}
              initial={{ opacity: 0, y: 44, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{
                delay: 0.12 * i,
                duration: 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                sizes="(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 33vw"
                className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              {/* shade + hover wash */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#191307]/85 via-[#191307]/12 to-transparent" />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/[0.1] transition-colors duration-700" />

              <figcaption className="absolute bottom-0 inset-x-0 p-6 flex items-end justify-between">
                <div>
                  <p className="font-display font-semibold text-xl text-[#f7f1e3] group-hover:text-gold-light transition-colors duration-500">
                    {s.caption}
                  </p>
                  <p className="mt-1 font-body text-[0.6rem] tracking-[0.3em] uppercase text-[#c9c2b2] group-hover:text-gold-light/90 transition-colors duration-500">
                    {s.sub}
                  </p>
                </div>
                <span className="font-quote italic text-gold-light/80 text-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </figcaption>

              {/* frame corners */}
              <span className="absolute top-3.5 left-3.5 w-6 h-6 border-t border-l border-gold-light/0 group-hover:border-gold-light/70 transition-all duration-700" />
              <span className="absolute bottom-3.5 right-3.5 w-6 h-6 border-b border-r border-gold-light/0 group-hover:border-gold-light/70 transition-all duration-700" />
            </motion.figure>
          ))}

          {/* Text tile — full-width editorial quote band below the mosaic */}
          <Reveal delay={0.35} className="h-full md:col-span-3">
            <div className="relative h-full min-h-[200px] rounded-[3px] border border-gold/30 bg-gradient-to-br from-cream-card to-cream-deep p-8 flex flex-col justify-between overflow-hidden gold-frame shadow-[0_22px_60px_-30px_rgba(110,85,30,0.45)]">
              <div
                aria-hidden
                className="absolute -top-16 -right-16 w-44 h-44 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(212,175,55,0.22), transparent 65%)",
                }}
              />
              <p className="font-body text-[0.62rem] tracking-[0.4em] uppercase text-gold">
                A ritual, not a routine
              </p>
              <blockquote className="font-quote italic text-2xl sm:text-[1.7rem] leading-[1.5] text-ivory">
                &ldquo;You walk in, and the world politely lowers its
                voice.&rdquo;
              </blockquote>
              <p className="font-body text-[0.62rem] tracking-[0.3em] uppercase text-sand">
                — a reader, evening slot, window bay
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
