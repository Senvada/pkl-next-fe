import type { Metadata } from "next";
import MapsClient from "./_components/maps-client";
import { Badge } from "@/components/ui/badge";
import { Map } from "lucide-react";
import { getPublicCompanyMaps, getPublicDepartments } from "@/services/public-api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Peta Interaktif Sebaran Tempat PKL | SMKN 6 Malang",
  description:
    "Eksplorasi peta interaktif lokasi tempat magang industri siswa SMKN 6 Malang. Cari perusahaan terdekat dari domisilimu dengan estimasi jarak akurat.",
};

export default async function MapsPage() {
  const [mapItems, departmentsData] = await Promise.all([
    getPublicCompanyMaps(),
    getPublicDepartments(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const displayCompanies = mapItems.length > 0 ? (mapItems as any) : [];
  const displayDepartments = departmentsData.length > 0 ? departmentsData : [];

  return (
    <div className="pt-28 pb-16 sm:pt-32 sm:pb-24 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-8">
        <Badge
          variant="outline"
          className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-3 px-3 py-1 text-xs font-semibold"
        >
          <Map className="size-3.5 mr-1" />
          Geolokasi Industri
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Peta Interaktif Sebaran Tempat PKL
        </h1>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Cari tempat magang yang strategis dan tidak terlalu jauh dari domisilimu. Klik klaster atau marker pada peta untuk melihat profil detail perusahaan.
        </p>
      </div>

      <MapsClient companies={displayCompanies} departments={displayDepartments} />
    </div>
  );
}
