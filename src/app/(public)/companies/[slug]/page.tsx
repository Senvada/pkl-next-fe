import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { COMPANIES } from "@/lib/mock-data";
import CompanyHero from "./_components/company-hero";
import CompanyInfoTabs from "./_components/company-info-tabs";
import CompanySidebar from "./_components/company-sidebar";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return COMPANIES.map((company) => ({
    slug: company.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = COMPANIES.find((c) => c.slug === slug);

  if (!company) {
    return {
      title: "Perusahaan Tidak Ditemukan",
    };
  }

  return {
    title: `${company.name} | Tempat PKL SMKN 6 Malang`,
    description: company.description,
    openGraph: {
      title: `${company.name} — Mitra PKL Resmi`,
      description: company.shortDescription,
      images: [company.bannerImage],
    },
  };
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const company = COMPANIES.find((c) => c.slug === slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col pb-20">
      <CompanyHero company={company} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8">
            <CompanyInfoTabs company={company} />
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4 sticky top-24">
            <CompanySidebar company={company} />
          </div>
        </div>
      </div>
    </div>
  );
}
