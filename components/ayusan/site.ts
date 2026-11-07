/**
 * Site configuration — the single source of truth for business data.
 * Everything here is the library's own published information; swap values
 * here and the whole site follows. No claims are invented in components.
 *
 * Layout and copy structure follow the approved Figma prototype
 * ("Ayusan Library — Editorial Experience / Seat Reservation").
 */

export const site = {
  name: "Ayusan Library",
  tagline: "Room to read. Space to think.",
  city: "Ayusan",
  established: "2026",

  address: {
    line1: "12, Library Lane",
    city: "Ayusan",
    note: "Two minutes from the central square",
  },

  hours: {
    // Published opening hours.
    regular: { days: "Every day", time: "8:00 AM – 10:00 PM", note: "Including Sundays & holidays" },
    night: { days: "Night slot", time: "10:00 PM – 6:00 AM", note: "By arrangement, subject to availability" },
  },

  contact: {
    phone: "+91 6205 300 523",
    phoneHref: "tel:+916205300523",
    email: "hello@ayusanlibrary.in",
    emailHref: "mailto:hello@ayusanlibrary.in",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Ayusan+Library+12+Library+Lane",
  },
} as const;

/**
 * Reservation time windows — mirrors the API enum and the published hours,
 * presented in the prototype's "time window" label format.
 * The night slot (*) runs by arrangement, subject to availability.
 */
export const timeWindows = [
  { value: "day", label: "Day" },
  { value: "night", label: "Night" },
  { value: "both", label: "Day + Night (special)" },
] as const;

export type TimeWindowValue = (typeof timeWindows)[number]["value"];

export function windowLabel(value: string): string {
  return timeWindows.find((w) => w.value === value)?.label ?? value;
}

/** Reading-space preferences offered in the reservation form. */
export const spaceOptions = [
  { value: "any", label: "Any available quiet seat" },
  { value: "the-grand-hall", label: "The Grand Hall" },
  { value: "the-nooks", label: "The Nooks" },
  { value: "study-desks", label: "Study Desks" },
] as const;

export function spaceLabel(value: string): string {
  return spaceOptions.find((s) => s.value === value)?.label ?? value;
}

/** The rooms — names, catalogue indices, and one-line descriptions. */
export const spaces = [
  {
    index: "01",
    label: "THE GRAND HALL",
    name: "The Grand Hall",
    copy: "Quiet hours, open tables, room to settle in.",
  },
  {
    index: "02",
    label: "READING NOOKS",
    name: "The Nooks",
    copy: "For a book and a little breathing room.",
  },
  {
    index: "03",
    label: "STUDY DESKS",
    name: "Study Desks",
    copy: "For longer sessions and serious focus.",
  },
] as const;

/** Featured quotes from regular library users. */
export const testimonials = [
  {
    index: "01",
    space: "The Grand Hall",
    shift: "Morning Shift · 6:00 AM – 10:00 AM",
    quote:
      "Before finding Ayusan, my mornings at home were fractured by household noise. Four uninterrupted hours under the brass lamps in the Grand Hall helped me finish my civil-services mains preparation two months ahead of schedule.",
    author: "Aarav Deshmukh",
    role: "Public Policy Fellow & Civil Services Candidate",
    tenure: "Regular member · 8 months",
  },
  {
    index: "02",
    space: "Study Desks",
    shift: "Afternoon Shift · 2:00 PM – 6:00 PM",
    quote:
      "The dedicated study desks have the exact quiet cadence a researcher needs. Reliable Wi-Fi, deep timber tables with room for three reference volumes, and a staff that genuinely protects the silence of the room.",
    author: "Dr. Meera Krishnan",
    role: "Postdoctoral Historian, Archival Studies",
    tenure: "Regular member · 11 months",
  },
  {
    index: "03",
    space: "The Nooks",
    shift: "Evening Shift · 6:00 PM – 10:00 PM",
    quote:
      "After clinical rounds, the reading nooks give me a calm corner to review medical journals without café distractions. Knowing my seat is held when I reserve ahead makes every evening session effortless.",
    author: "Dr. Rohan Kulkarni",
    role: "Resident Physician, Internal Medicine",
    tenure: "Regular member · 6 months",
  },
] as const;

/** Navigation — quiet anchors following the editorial layout. */
export const nav = [
  { label: "Our spaces", href: "#spaces" },
  { label: "The library", href: "#about" },
  { label: "Reader notes", href: "#testimonials" },
  { label: "Plan a visit", href: "#visit" },
] as const;
