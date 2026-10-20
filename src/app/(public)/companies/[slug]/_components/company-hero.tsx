import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Building2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CompanyHero({ company }: { company: any }) {
  const banner = company.image_url || company.bannerImage || company.logo || company.image;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const departments: any[] = company.departments || [];

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden bg-slate-900">
      {banner ? (
        <Image
          src={banner}
          alt={company.name}
          fill
          priority
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 size-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
          <Building2 className="size-24 text-slate-700/50" />
        </div>
      )}

      {/* Dark Gradient Overlay matching old style */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

      {/* Back Button matching old style */}
      <Link
        href="/companies"
        className="absolute top-20 sm:top-24 left-4 sm:left-8 z-10 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/15 backdrop-blur-md text-white text-xs sm:text-sm font-medium hover:bg-white/25 transition-all border border-white/20 shadow-lg cursor-pointer"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </Link>

      {/* Title & Department Tags Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-16">
        <div className="max-w-5xl mx-auto">
          {departments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {departments.map((dept: { id?: string; code?: string; name?: string } | string) => {
                const name = typeof dept === "string" ? dept : (dept.name || dept.code || "PKL");
                const key = typeof dept === "string" ? dept : (dept.id || dept.code || name);
                return (
                  <span
                    key={key}
                    className="inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-md text-white rounded-full border border-white/20"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-sm">
            {company.name}
          </h1>
        </div>
      </div>
    </div>
  );
}
