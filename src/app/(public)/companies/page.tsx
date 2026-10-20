import type { Metadata } from "next";
import CompaniesClient from "./_components/companies-client";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { getPublicCompanies } from "@/services/public-api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Direktori Perusahaan Mitra PKL | SMKN 6 Malang",
  description:
    "Eksplorasi daftar mitra industri resmi SMKN 6 Malang. Cek kuota lowongan magang, kriteria keahlian, dan kirim pengajuan langsung secara online.",
};

export default async function CompaniesPage() {
  const companies = await getPublicCompanies({ limit: 100 });

  return (
    <div className="py-24 sm:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-12">
        <Badge
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3 px-3 py-1 text-xs font-semibold"
        >
          <Building2 className="size-3.5 mr-1" />
          Katalog Mitra Industri
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Direktori Tempat Praktik Kerja Lapangan
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Pilih perusahaan mitra yang sesuai dengan program keahlianmu. Seluruh mitra telah melalui kurasi kelayakan tempat magang oleh Pokja Hubungan Industri SMKN 6 Malang.
        </p>
      </div>

      <CompaniesClient companies={companies} />
    </div>
  );
}
