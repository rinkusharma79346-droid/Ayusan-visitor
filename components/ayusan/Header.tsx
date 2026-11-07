"use client";

import { useState } from "react";
import { useReserve } from "./ReserveContext";
import { nav } from "./site";

/**
 * Site header — brand lockup, three anchor links, and the primary
 * "Reserve a seat" action. Below 720px the nav collapses into a
 * drop-down panel under the header.
 */
export function Header() {
  const { openReserve } = useReserve();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header" id="home">
      <a href="#home" className="brand" aria-label="Ayusan Library home">
        <span className="brand-mark" aria-hidden="true">
          A
        </span>
        <span>
          <span className="brand-title" style={{ display: "block" }}>
            AYUSAN
          </span>
          <span className="brand-subtitle" style={{ display: "block" }}>
            L I B R A R Y
          </span>
        </span>
      </a>
      <button
        className="menu-btn"
        aria-expanded={menuOpen}
        aria-controls="siteNav"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMenuOpen((v) => !v)}
      >
        &#9776;
      </button>
      <nav
        className={`site-nav${menuOpen ? " show" : ""}`}
        id="siteNav"
        aria-label="Primary"
      >
        {nav.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}
        <button
          className="nav-button"
          type="button"
          onClick={() => {
            setMenuOpen(false);
            openReserve();
          }}
        >
          Reserve a seat &rarr;
        </button>
      </nav>
    </header>
  );
}
