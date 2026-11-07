"use client";

import { useReserve } from "./ReserveContext";

/**
 * Booking banner — the final invitation before the footer.
 * Opens the reservation dialog.
 */
export function BookingBanner() {
  const { openReserve } = useReserve();

  return (
    <section className="booking-banner" id="visit">
      <div>
        <span className="eyebrow">03 &nbsp;/&nbsp; YOUR NEXT CHAPTER</span>
        <h2>A good day starts here.</h2>
        <p>
          Tell us when you would like to visit. We will check availability and
          get back to you about your seat.
        </p>
      </div>
      <button type="button" className="btn" onClick={openReserve}>
        Request a seat <span className="arrow">&rarr;</span>
      </button>
    </section>
  );
}
