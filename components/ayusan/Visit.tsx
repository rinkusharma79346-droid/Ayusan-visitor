"use client";

import { MapPin, Phone, Mail, ArrowUpRight } from "lucide-react";
import { site } from "./site";
import { SectionHead } from "./SectionHead";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { useReserve } from "./ReserveContext";

/**
 * Visit — the practical block: address, hours, contacts, and directions
 * that work on mobile (tap-to-call, mailto, maps link).
 */
export function Visit() {
  const { openReserve } = useReserve();

  return (
    <section id="visit" className="cv-auto bg-paper-deep border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-[76rem] px-5 sm:px-8">
        <SectionHead
          index="06"
          label="Visit"
          title={
            <>
              The door is open
              <br />
              every <span className="italic font-normal">day.</span>
            </>
          }
          intro="Come past the central square and follow the lane — the reading room is on your right."
        />

        <div className="mt-12 sm:mt-16 grid lg:grid-cols-12 gap-10 lg:gap-14">
          {/* ——— Address & contact ——— */}
          <Stagger className="lg:col-span-5" gap={0.06}>
            <div className="border-t border-line-strong">
              <StaggerItem>
                <div className="py-7 border-b border-line">
                  <p className="label-micro text-ink-mute flex items-center gap-2">
                    <MapPin size={13} strokeWidth={1.75} aria-hidden className="text-bronze-deep" />
                    Address
                  </p>
                  <p className="mt-3 font-display font-medium text-[1.45rem] leading-snug text-ink">
                    {site.address.line1},
                    <br />
                    {site.address.city}
                  </p>
                  <p className="mt-1.5 text-[0.875rem] text-ink-mute">{site.address.note}</p>
                  <a
                    href={site.contact.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[0.9375rem] text-bronze-deep hover:text-ink transition-colors duration-200"
                  >
                    Open in Google Maps
                    <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
                  </a>
                </div>
              </StaggerItem>

              <StaggerItem>
                <a
                  href={site.contact.phoneHref}
                  className="flex items-center justify-between py-6 border-b border-line group"
                >
                  <span className="flex items-center gap-4">
                    <Phone size={15} strokeWidth={1.75} aria-hidden className="text-bronze-deep" />
                    <span>
                      <span className="label-micro text-ink-mute block">Phone</span>
                      <span className="mt-1.5 font-display text-[1.15rem] text-ink block group-hover:text-bronze-deep transition-colors duration-200">
                        {site.contact.phone}
                      </span>
                    </span>
                  </span>
                  <span className="label-micro text-ink-mute group-hover:text-bronze-deep transition-colors duration-200">
                    Tap to call
                  </span>
                </a>
              </StaggerItem>

              <StaggerItem>
                <a
                  href={site.contact.emailHref}
                  className="flex items-center justify-between py-6 border-b border-line group"
                >
                  <span className="flex items-center gap-4">
                    <Mail size={15} strokeWidth={1.75} aria-hidden className="text-bronze-deep" />
                    <span>
                      <span className="label-micro text-ink-mute block">Email</span>
                      <span className="mt-1.5 font-display text-[1.15rem] text-ink block group-hover:text-bronze-deep transition-colors duration-200">
                        {site.contact.email}
                      </span>
                    </span>
                  </span>
                  <span className="label-micro text-ink-mute group-hover:text-bronze-deep transition-colors duration-200">
                    Tap to write
                  </span>
                </a>
              </StaggerItem>
            </div>
          </Stagger>

          {/* ——— Hours ——— */}
          <Reveal className="lg:col-span-7">
            <div className="border border-line bg-card p-7 sm:p-9 h-full flex flex-col">
              <p className="label-micro text-bronze-deep">Opening hours</p>
              <table className="mt-5 w-full text-left">
                <caption className="sr-only">Ayusan Library opening hours</caption>
                <tbody>
                  {[
                    {
                      days: site.hours.regular.days,
                      time: site.hours.regular.time,
                      note: site.hours.regular.note,
                    },
                    {
                      days: site.hours.night.days,
                      time: site.hours.night.time,
                      note: site.hours.night.note,
                    },
                  ].map((row) => (
                    <tr key={row.days} className="border-t border-line">
                      <th scope="row" className="py-4 pr-4 align-top font-body text-[0.9375rem] font-semibold text-ink w-[9.5rem]">
                        {row.days}
                      </th>
                      <td className="py-4 align-top font-display text-[1.125rem] text-ink">
                        {row.time}
                      </td>
                      <td className="py-4 pl-4 align-top text-[0.8125rem] text-ink-mute w-[12rem] hidden sm:table-cell">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-auto pt-8">
                <p className="text-[0.875rem] leading-[1.7] text-ink-soft max-w-[30rem]">
                  On arrival, show your reference code at the front desk — your
                  seat is kept under your name. Walk-ins are welcome whenever a
                  desk is free.
                </p>
                <button
                  onClick={openReserve}
                  className="mt-6 inline-flex items-center justify-center h-12 px-7 rounded-[2px] bg-green text-on-green label-micro hover:bg-green-deep transition-colors duration-200 cursor-pointer"
                >
                  Reserve a seat
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
