import type { Metadata } from "next";
import HeroBanner from "./_components/hero-banner";
import StatsOverview from "./_components/stats-overview";
import FeaturedCompanies from "./_components/featured-companies";
import PklBenefits from "./_components/pkl-benefits";
import LatestArticles from "./_components/latest-articles";
import CtaBanner from "./_components/cta-banner";
import { getPublicStats, getPublicCompanies, getPublicArticles } from "@/services/public-api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beranda | Portal PKL SMKN 6 Malang",
  description:
    "Portal resmi Praktik Kerja Lapangan SMKN 6 Malang. Temukan mitra industri terbaik, panduan PKL terpadu, dan informasi kuota magang secara realtime.",
};

export default async function HomePage() {
  const [stats, companies, articles] = await Promise.all([
    getPublicStats(),
    getPublicCompanies({ limit: 4 }),
    getPublicArticles({ limit: 3 }),
  ]);

  return (
    <div className="flex flex-col">
      <HeroBanner />
      <StatsOverview stats={stats} />
      <FeaturedCompanies companies={companies} />
      <PklBenefits />
      <LatestArticles articles={articles} />
      <CtaBanner />
    </div>
  );
}
