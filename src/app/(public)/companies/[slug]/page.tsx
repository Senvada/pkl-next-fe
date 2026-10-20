import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicCompanyBySlug } from "@/services/public-api";
import { COMPANIES } from "@/lib/mock-data";
import CompanyHero from "./_components/company-hero";
import CompanyInfoCards from "./_components/company-info-cards";
import CompanyContentBody from "./_components/company-content-body";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const rawCompany = (await getPublicCompanyBySlug(slug)) ||  COMPANIES.find((c) => c.slug === slug);

  if (!rawCompany) {
    return { title: "Perusahaan Tidak Ditemukan" };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const company = rawCompany as any;
  const image = company.image_url || company.logo || company.bannerImage;

  return {
    title: `${company.name} | Tempat PKL SMKN 6 Malang`,
    description: company.description || "Mitra resmi PKL SMKN 6 Malang",
    openGraph: {
      title: `${company.name} — Mitra PKL Resmi`,
      description: company.description || "Mitra resmi PKL SMKN 6 Malang",
      images: image ? [image] : [],
    },
  };
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const company = (await getPublicCompanyBySlug(slug)) || COMPANIES.find((c) => c.slug === slug);

  if (!company) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-slate-50/50 dark:bg-[#0B1120] pb-24">
      <CompanyHero company={company} />
      <CompanyInfoCards company={company} />
      <CompanyContentBody company={company} />
    </article>
  );
}
