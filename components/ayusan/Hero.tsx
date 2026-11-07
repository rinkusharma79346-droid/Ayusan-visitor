"use client";

import type { CSSProperties } from "react";
import { useReserve } from "./ReserveContext";
import { site } from "./site";

/* ————— Deterministic book generation for the shelf illustration ————— */
const BOOK_PALETTE = [
  "#b5a47a",
  "#364e3e",
  "#b58d59",
  "#e0caa0",
  "#7c6548",
  "#d2d2b7",
  "#546956",
  "#d1b88c",
  "#3f5d4c",
];

function bookStyle(i: number): CSSProperties {
  return {
    "--h": String((i * 17 + 29) % 48),
    "--book": BOOK_PALETTE[(i * 3 + Math.floor(i / 3)) % BOOK_PALETTE.length],
  } as CSSProperties;
}

const BOOKS = Array.from({ length: 34 }, (_, i) => (
  <div key={i} className="book" style={bookStyle(i)} />
));

/**
 * Hero — editorial split: copy on the left, an illustrative CSS scene
 * (arched bookshelves, reading table, warm lamp) on the right.
 */
export function Hero() {
  const { openReserve } = useReserve();

  return (
    <section className="hero" aria-labelledby="heroTitle">
      <div className="hero-copy">
        <span className="eyebrow">
          THE READING ROOM &nbsp;/&nbsp; EST. {site.established}
        </span>
        <h1 id="heroTitle">
          Room to read.
          <br />
          <em>Space to think.</em>
        </h1>
        <p className="hero-description">
          For a few good hours, leave the noise behind. A thoughtfully
          designed place to study, read, and settle into your best work.
        </p>
        <div className="hero-actions">
          <button className="btn" type="button" onClick={openReserve}>
            Reserve a seat <span className="arrow">&rarr;</span>
          </button>
          <a href="#spaces" className="btn secondary">
            Explore the spaces <span className="arrow">&darr;</span>
          </a>
        </div>
        <div className="hero-footer">
          <span>
            <strong>Quiet, considered spaces</strong> For work &amp; reading
          </span>
          <span>
            <strong>Simple reservation</strong> Request a visit in minutes
          </span>
        </div>
      </div>
      <div
        className="scene"
        role="img"
        aria-label="Illustrative rendering of arched bookshelves with warm wooden reading furniture"
      >
        <span className="scene-number" aria-hidden="true">
          01 / 03
        </span>
        <div className="arch" aria-hidden="true">
          <div className="bookshelf">
            <div className="shelf">{BOOKS}</div>
            <div className="shelf">{BOOKS}</div>
            <div className="shelf">{BOOKS}</div>
          </div>
        </div>
        <div className="table" aria-hidden="true" />
        <div className="lamp" aria-hidden="true" />
        <span className="scene-note" aria-hidden="true">
          AYUSAN &nbsp;/&nbsp; THE GRAND HALL
        </span>
        <span className="illustrative" aria-hidden="true">
          Conceptual illustration
        </span>
      </div>
    </section>
  );
}
