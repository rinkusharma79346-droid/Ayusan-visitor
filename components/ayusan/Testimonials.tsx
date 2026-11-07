"use client";

import { useState } from "react";
import { testimonials } from "./site";
import { useReserve } from "./ReserveContext";

const SPACE_FILTERS = [
  "All spaces",
  "The Grand Hall",
  "Study Desks",
  "The Nooks",
] as const;

type SpaceFilter = (typeof SPACE_FILTERS)[number];

/**
 * Testimonials — featured notes and reflections from regular library readers.
 * Follows "The Reading Room" editorial catalogue language: numbered entries,
 * warm archival surfaces, hairline borders, and quiet unboxed metadata.
 */
export function Testimonials() {
  const { openReserve } = useReserve();
  const [activeSpace, setActiveSpace] = useState<SpaceFilter>("All spaces");

  const visibleTestimonials =
    activeSpace === "All spaces"
      ? testimonials
      : testimonials.filter((item) => item.space === activeSpace);

  return (
    <section
      className="content-section testimonials-section"
      id="testimonials"
      aria-labelledby="testimonialsHeading"
    >
      <div className="section-heading">
        <div>
          <span className="eyebrow">02 &nbsp;/&nbsp; REGULAR READERS</span>
          <h2 id="testimonialsHeading">
            Notes from the
            <br />
            reading tables.
          </h2>
        </div>
        <p>
          Scholars, examination candidates, and evening readers share how a
          dependable, quiet seat changed the rhythm of their daily work.
        </p>
      </div>

      <div
        className="testimonials-toolbar"
        role="group"
        aria-label="Filter reader notes by library space"
      >
        <div className="testimonials-filters">
          {SPACE_FILTERS.map((filter) => {
            const isActive = activeSpace === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveSpace(filter)}
                aria-pressed={isActive}
                className={`testimonial-filter-btn${isActive ? " active" : ""}`}
              >
                {filter}
              </button>
            );
          })}
        </div>
        <span className="testimonials-count">
          Showing {visibleTestimonials.length} of {testimonials.length} reader{" "}
          {visibleTestimonials.length === 1 ? "note" : "notes"}
        </span>
      </div>

      <div className="testimonials-grid">
        {visibleTestimonials.map((item) => (
          <article className="testimonial-card" key={item.index}>
            <div className="testimonial-meta">
              <span>{item.index}</span>
              <span aria-hidden="true">/</span>
              <span>{item.space.toUpperCase()}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{item.shift}</span>
            </div>

            <blockquote className="testimonial-quote">
              <p>&ldquo;{item.quote}&rdquo;</p>
            </blockquote>

            <footer className="testimonial-footer">
              <div className="testimonial-author">
                <strong>{item.author}</strong>
                <span>{item.role}</span>
                <span className="testimonial-tenure">{item.tenure}</span>
              </div>
              <button
                type="button"
                className="testimonial-reserve-link"
                onClick={openReserve}
              >
                Reserve a seat &rarr;
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
}
