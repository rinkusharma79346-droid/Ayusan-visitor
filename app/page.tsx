import { ReserveProvider } from "@/components/ayusan/ReserveContext";
import { ReserveModal } from "@/components/ayusan/ReserveModal";
import { Header } from "@/components/ayusan/Header";
import { Hero } from "@/components/ayusan/Hero";
import { Ribbon } from "@/components/ayusan/Ribbon";
import { Spaces } from "@/components/ayusan/Spaces";
import { Testimonials } from "@/components/ayusan/Testimonials";
import { BookingBanner } from "@/components/ayusan/BookingBanner";
import { Footer } from "@/components/ayusan/Footer";

/**
 * Ayusan Library — "The Reading Room" editorial experience.
 * Page structure per the approved Figma prototype: header, split hero,
 * ribbon, spaces, testimonials, booking banner, footer, and the reservation dialog.
 */
export default function Home() {
  return (
    <ReserveProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Ribbon />
        <Spaces />
        <Testimonials />
        <BookingBanner />
      </main>
      <Footer />
      <ReserveModal />
    </ReserveProvider>
  );
}
