import type { Metadata } from "next";
import HeroBanner from "./_components/hero-banner";
import StatsOverview from "./_components/stats-overview";
import FeaturedCompanies from "./_components/featured-companies";
import PklBenefits from "./_components/pkl-benefits";
import LatestArticles from "./_components/latest-articles";
import CtaBanner from "./_components/cta-banner";

export const metadata: Metadata = {
  title: "Beranda | Portal PKL SMKN 6 Malang",
  description:
    "Portal resmi Praktik Kerja Lapangan SMKN 6 Malang. Temukan mitra industri terbaik, panduan PKL terpadu, dan informasi kuota magang secara realtime.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroBanner />
      <StatsOverview />
      <FeaturedCompanies />
      <PklBenefits />
      <LatestArticles />
      <CtaBanner />
    </div>
  );
}
