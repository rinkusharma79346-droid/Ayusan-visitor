"use client";

import { SectionHead } from "./SectionHead";
import { Reveal, Stagger, StaggerItem } from "./Reveal";
import { useReserve } from "./ReserveContext";

/**
 * How a reservation actually works — the honest three steps. Slim, factual,
 * and the last nudge before the FAQ.
 */
export function HowItWorks() {
  const { openReserve } = useReserve();
  const steps = [
    {
      n: "01",
      title: "Send your request",
      copy: "Name, date, and the slot you want. It takes about a minute, and nothing is charged online.",
    },
    {
      n: "02",
      title: "We confirm by phone",
      copy: "A real person from the desk calls to confirm your seat and answer anything — that is why the phone number is required.",
    },
    {
      n: "03",
      title: "Arrive with your reference",
      copy: "Your AYL reference code is kept at the front desk. Show it, sit down, and get to work.",
    },
  ];

  return (
    <section
      aria-label="How reserving works"
      className="cv-auto bg-paper-deep border-y border-line py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[76rem] px-5 sm:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <SectionHead
            className="lg:col-span-4"
            index="04"
            label="Reserving"
            title={
              <>
                Three steps,
                <br />
                no <span className="italic font-normal">friction.</span>
              </>
            }
          />

          <Stagger className="lg:col-span-8 grid sm:grid-cols-3 gap-x-8" gap={0.08}>
            {steps.map((s) => (
              <StaggerItem key={s.n}>
                <div className="border-t border-line-strong pt-5 pb-2">
                  <p className="font-display text-[1.6rem] text-bronze leading-none tabular-nums">
                    {s.n}
                  </p>
                  <h3 className="mt-4 font-display font-medium text-[1.0625rem] text-ink leading-snug">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-[1.65] text-ink-soft">
                    {s.copy}
                  </p>
                </div>
              </StaggerItem>
            ))}
            <div className="sm:col-span-3 mt-2">
              <button
                onClick={openReserve}
                className="inline-flex items-center justify-center h-12 px-7 rounded-[2px] bg-green text-on-green label-micro hover:bg-green-deep transition-colors duration-200 cursor-pointer"
              >
                Reserve a seat
              </button>
            </div>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
