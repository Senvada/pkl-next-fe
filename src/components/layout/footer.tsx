import Link from "next/link";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import smkLogo from "@/assets/img/logo-smkn6malang.webp";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#16202B] text-slate-300">
      {/* Top Banner / Trust Indicator */}
      <div className="border-b border-white/5 bg-[#1B2735]/60 py-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-3 text-center md:text-left">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <GraduationCap className="size-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Sistem Informasi PKL Digital Terintegrasi
                </p>
                <p className="text-xs text-slate-400">
                  SMK Negeri 6 Kota Malang — Pusat Keunggulan Vokasi
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <ShieldCheck className="size-4" />
              Mitra Industri Terverifikasi Kurikulum Merdeka
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <Image
                src={smkLogo}
                alt="Logo SMKN 6 Malang"
                width={50}
                height={50}
                className="h-12 w-auto object-contain"
              />
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  SMKN 6 MALANG
                </h3>
                <p className="text-xs text-slate-400">
                  Praktik Kerja Lapangan Digital
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Platform resmi manajemen, pendataan, dan monitoring Praktik Kerja
              Lapangan (PKL) bagi siswa dan mitra industri untuk menciptakan
              kesiapan kerja nyata yang unggul.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://smkn6malang.sch.id"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/15"
              >
                Website Resmi Sekolah <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          {/* Nav Links: Navigasi */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-white hover:underline underline-offset-4"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition hover:text-white hover:underline underline-offset-4"
                >
                  Tentang PKL
                </Link>
              </li>
              <li>
                <Link
                  href="/companies"
                  className="transition hover:text-white hover:underline underline-offset-4"
                >
                  Daftar Perusahaan
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="transition hover:text-white hover:underline underline-offset-4"
                >
                  Artikel & Panduan
                </Link>
              </li>
              <li>
                <Link
                  href="/maps"
                  className="transition hover:text-white hover:underline underline-offset-4"
                >
                  Peta Lokasi Mitra
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Links: Program Vokasi */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Program Keahlian
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>Rekayasa Perangkat Lunak</li>
              <li>Teknik Komputer & Jaringan</li>
              <li>Desain Komunikasi Visual</li>
              <li>Animasi & Multimedia</li>
              <li>Teknik Mekatronika</li>
              <li>Sistem Informasi & Jaringan</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Kontak & Alamat
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 shrink-0 text-blue-400 mt-1" />
                <span>
                  Jl. Ki Ageng Gribig No. 28, Madyopuro, Kedungkandang, Kota Malang 65139
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-emerald-400" />
                <span>(0341) 722216</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-amber-400" />
                <span>info@smkn6malang.sch.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-white/5 bg-[#121922] py-4">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} SMKN 6 Malang. Seluruh hak cipta dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-slate-300">
              Kebijakan PKL
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Bantuan Siswa
            </Link>
            <Link href="/login" className="hover:text-slate-300">
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
