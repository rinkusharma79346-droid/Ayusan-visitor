import type { Metadata, Viewport } from "next";
import "../public/fonts/fonts.css";
import "./globals.css";
import { PublicConfigProvider } from "@/lib/public-config";
export const dynamic = "force-dynamic";
const runtimeValue = (key: string) => process.env[key];

// Editorial display serif — used at large sizes only (matches the approved
// Figma/prototype design: "The Reading Room" concept).


// Contemporary functional sans — body, labels, controls.


const DEFAULT_SUPABASE_URL = "https://bbdvmgjwywhtlgckljwo.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_e7k2pFRqsClvzOKbsrljow_A_CEuumw";
const DEFAULT_TURNSTILE_SITE_KEY = "0x4AAAAAAFTlKHakRIfRugFJ";
const DEFAULT_SITE_ORIGIN = "https://ayusan-libraryx.ai.studio";

const SITE_URL =
  runtimeValue("AYUSAN_SITE_ORIGIN") ||
  runtimeValue("AYUSAN_PUBLIC_ORIGIN") ||
  runtimeValue("APP_URL") ||
  DEFAULT_SITE_ORIGIN;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ayusan Library | Room to read. Space to think.",
  description:
    "Ayusan Library: room to read, space to think. Explore a beautifully considered library and request a reading seat.",
  keywords: [
    "Ayusan Library",
    "reading room",
    "study space",
    "library",
    "reserve a seat",
    "study library Ayusan",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Ayusan Library | Room to read. Space to think.",
    description:
      "A quiet reading room in Ayusan. Request a reading seat — warm lamps, fast Wi-Fi, and extra books for studies and learning.",
    type: "website",
    url: SITE_URL,
    siteName: "Ayusan Library",
    images: [
      {
        url: "/images/reading-room/hero2.jpg",
        width: 1344,
        height: 768,
        alt: "The reading room at Ayusan Library — long tables, green lamps, morning light",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayusan Library | Room to read. Space to think.",
    description:
      "A quiet reading room in Ayusan. Request a reading seat — warm lamps, fast Wi-Fi, and extra books for studies and learning.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ec",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Do not publish placeholder addresses or telephone numbers as structured data.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Library",
  name: "Ayusan Library",
  description: "A quiet reading and study space with a registration request form.",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="font-body antialiased bg-paper text-ink">
        <PublicConfigProvider
          config={{
            supabaseUrl: runtimeValue("NEXT_PUBLIC_SUPABASE_URL") || DEFAULT_SUPABASE_URL,
            supabaseKey: runtimeValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY") || DEFAULT_SUPABASE_KEY,
            turnstileSiteKey: runtimeValue("NEXT_PUBLIC_TURNSTILE_SITE_KEY") || DEFAULT_TURNSTILE_SITE_KEY,
          }}
        >
          {children}
        </PublicConfigProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
