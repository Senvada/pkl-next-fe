import type { Metadata } from "next";
import ContactForm from "./_components/contact-form";
import ContactInfoCards from "./_components/contact-info-cards";
import SchoolMapEmbed from "./_components/school-map-embed";
import { Badge } from "@/components/ui/badge";
import { PhoneCall } from "lucide-react";

export const metadata: Metadata = {
  title: "Kontak & Layanan PKL | SMKN 6 Malang",
  description:
    "Hubungi Pokja Hubungan Industri SMKN 6 Malang untuk konsultasi magang, konfirmasi kuota, atau kendala administratif pelaksanaan PKL.",
};

export default function ContactPage() {
  return (
    <div className="py-24 sm:py-32 container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 px-3 py-1 text-xs font-semibold"
        >
          <PhoneCall className="size-3.5 mr-1" />
          Layanan & Bantuan
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Butuh Bantuan? Hubungi Kami
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300">
          Tim Hubungan Industri dan Guru Pembimbing siap membantu kendala administrasi, pemilihan mitra, atau proses pengesahan berkas PKL.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        {/* Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>

        {/* Contact Info */}
        <div className="lg:col-span-5">
          <ContactInfoCards />
        </div>
      </div>

      {/* Map Embed */}
      <SchoolMapEmbed />
    </div>
  );
}
