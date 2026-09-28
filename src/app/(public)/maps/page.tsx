import type { Metadata } from "next";
import { COMPANIES, DEPARTMENTS } from "@/lib/mock-data";
import MapsClient from "./_components/maps-client";
import { Badge } from "@/components/ui/badge";
import { Map } from "lucide-react";

export const metadata: Metadata = {
  title: "Peta Interaktif Sebaran Tempat PKL | SMKN 6 Malang",
  description:
    "Eksplorasi peta interaktif lokasi tempat magang industri siswa SMKN 6 Malang. Cari perusahaan terdekat dari domisilimu dengan estimasi jarak akurat.",
};

export default function MapsPage() {
  return (
    <div className="py-24 mb-28 sm:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-10">
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
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Cari tempat magang yang strategis dan tidak terlalu jauh dari tempat tinggalmu. Klik marker pada peta untuk melihat kuota, profil, dan informasi detail perusahaan.
        </p>
      </div>

      {/* Interactive Map & Sidebar */}
      <MapsClient companies={COMPANIES} departments={DEPARTMENTS} />
    </div>
  );
}
