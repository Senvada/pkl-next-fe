import * as React from "react";
import { Building2, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string | null;
  external?: boolean;
}

function InfoCard({ icon, label, value, href, external }: InfoCardProps) {
  const cardBody = (
    <div className="bg-white dark:bg-[#16212D] rounded-2xl shadow-lg border border-slate-200/80 dark:border-white/10 p-4.5 hover:shadow-xl transition-all duration-200 group h-full flex flex-col justify-center">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 mb-1.5">
        <span className="text-blue-600 dark:text-blue-400">{icon}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center justify-between gap-1">
        <span className="truncate">{value || "-"}</span>
        {external && <ExternalLink className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />}
      </p>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="no-underline block"
      >
        {cardBody}
      </a>
    );
  }

  return cardBody;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CompanyInfoCards({ company }: { company: any }) {
  const gmapsLink =
    company.gmaps_link ||
    (company.lat && company.lng
      ? `https://www.google.com/maps/search/?api=1&query=${company.lat},${company.lng}`
      : null);

  const email = company.email || company.contactEmail;
  const phone = company.phone_number || company.contactPhone;
  const address = company.address || "Malang, Jawa Timur";

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 -mt-8 relative z-10">
        <InfoCard
          icon={<Building2 className="size-4" />}
          label="Perusahaan"
          value={company.name}
        />
        <InfoCard
          icon={<Mail className="size-4" />}
          label="Email"
          value={email || "Tidak ada email"}
          href={email ? `mailto:${email}` : undefined}
        />
        <InfoCard
          icon={<Phone className="size-4" />}
          label="Telepon"
          value={phone || "Tidak ada telepon"}
          href={phone ? `tel:${phone}` : undefined}
        />
        <InfoCard
          icon={<MapPin className="size-4" />}
          label="Alamat"
          value={address}
          href={gmapsLink}
          external={Boolean(gmapsLink)}
        />
      </div>
    </div>
  );
}
