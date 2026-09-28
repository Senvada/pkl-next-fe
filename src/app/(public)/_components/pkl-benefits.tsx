import {
  FileText,
  Clock,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Laptop,
} from "lucide-react";

const benefits = [
  {
    icon: Laptop,
    title: "Sinkronisasi Industri Terkini",
    description:
      "Mitra industri menerapkan teknologi dan workflow modern yang relevan dengan kebutuhan dunia kerja saat ini.",
  },
  {
    icon: Clock,
    title: "Transparansi Kuota Realtime",
    description:
      "Informasi ketersediaan lowongan dan status penerimaan siswa disajikan secara terbuka tanpa tumpang tindih.",
  },
  {
    icon: FileText,
    title: "Logbook & Jurnal Digital",
    description:
      "Dokumentasi kegiatan dan presensi harian tercatat secara terpusat untuk mempermudah monitoring guru pembimbing.",
  },
  {
    icon: ShieldCheck,
    title: "Sertifikasi Resmi Terakreditasi",
    description:
      "Sertifikat magang berstandar industri dan BNSP yang menjadi nilai tambah besar saat melamar kerja setelah lulus.",
  },
  {
    icon: MapPin,
    title: "Peta Sebaran Interaktif",
    description:
      "Jelajahi lokasi mitra terdekat dari tempat tinggalmu untuk menghemat biaya operasional dan akomodasi magang.",
  },
  {
    icon: TrendingUp,
    title: "Peluang Kerja Langsung",
    description:
      "Lebih dari 35% siswa berkinerja tinggi langsung direkrut sebagai staf tetap atau kontrak sebelum kelulusan sekolah.",
  },
];

export default function PklBenefits() {
  return (
    <section className="py-16 sm:py-24 bg-slate-100/70 dark:bg-[#121A24] border-y border-slate-200/80 dark:border-white/5 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Keunggulan Sistem
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Mengapa PKL Berbasis Digital Ini Berbeda?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Menggabungkan kesiapan kompetensi siswa SMKN 6 Malang dengan standar profesionalisme mitra industri nasional.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group rounded-2xl border border-slate-200/80 bg-white dark:border-white/5 dark:bg-[#17222E]/80 p-6 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-50 dark:hover:bg-[#1A2633] shadow-xs dark:shadow-none"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
