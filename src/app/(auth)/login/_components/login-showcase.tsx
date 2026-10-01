import Image from "next/image";
import { Sparkles, ClipboardCheck, Building, Award, CheckCircle2 } from "lucide-react";
import LogoSmk from "@/assets/img/logo-smkn6malang.webp";
import SenvadaLogo from "@/assets/img/H-Res/SenvadaLogo.webp";

export default function LoginShowcase() {
  return (
    <div className="relative hidden lg:flex flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-blue-700 via-indigo-900 to-slate-950 p-8 xl:p-10 text-white shadow-2xl">
      {/* Ambient background blur elements */}
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-blue-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

      {/* Top Header & Badge */}
      <div className="relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/20 px-3.5 py-1.5 text-xs font-semibold text-blue-200 backdrop-blur-md">
          <Sparkles className="size-3.5 text-blue-300 animate-pulse" />
          <span>Sistem Informasi Praktik Kerja Lapangan</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-snug">
            Kelola Masa PKL Lebih Rapi, Terarah, dan{" "}
            <span className="bg-linear-to-r from-sky-300 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
              Transparan
            </span>
          </h2>
          <p className="text-sm leading-relaxed text-blue-100/90 italic">
            &ldquo;Semoga masa PKL-mu nggak cuma banyak kerja, tapi juga{" "}
            <strong className="text-white font-semibold not-italic">Banyak Cerita!</strong>&rdquo;
          </p>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="relative z-10 my-8 space-y-3.5">
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md transition-colors hover:bg-white/10">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-blue-300">
            <ClipboardCheck className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Jurnal &amp; Presensi Digital</h4>
            <p className="text-[11px] text-blue-100/75 leading-relaxed">
              Catat riwayat tugas harian dan konfirmasi kehadiran langsung bersama mentor.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md transition-colors hover:bg-white/10">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300">
            <Building className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Monitoring Mitra Industri</h4>
            <p className="text-[11px] text-blue-100/75 leading-relaxed">
              Pantau kuota, persetujuan penempatan, dan komunikasi bersama pembimbing DUDI.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-md transition-colors hover:bg-white/10">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
            <Award className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Evaluasi &amp; Nilai Terintegrasi</h4>
            <p className="text-[11px] text-blue-100/75 leading-relaxed">
              Rubrik penilaian kompetensi keahlian dan penerbitan sertifikat resmi magang.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Identity & Partnership */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-5">
        <div className="flex items-center gap-3">
          <Image
            src={LogoSmk}
            alt="SMKN 6 Malang"
            width={34}
            height={34}
            className="h-8.5 w-auto object-contain drop-shadow"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white">SMKN 6 Malang</span>
              <CheckCircle2 className="size-3.5 text-blue-300" />
            </div>
            <span className="text-[10px] text-blue-200/80">
              SMK Pusat Keunggulan
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-85">
          <span className="text-[10px] text-blue-200/60 font-medium">Powered by</span>
          <Image
            src={SenvadaLogo}
            alt="Senvada"
            width={70}
            height={20}
            className="h-5 w-auto object-contain brightness-0 invert"
          />
        </div>
      </div>
    </div>
  );
}
