import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactInfoCards() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-5 flex items-start gap-4 shadow-xs dark:shadow-none">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
          <MapPin className="size-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Alamat Kampus</h4>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Jl. Ki Ageng Gribig No. 28, Madyopuro, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-5 flex items-start gap-4 shadow-xs dark:shadow-none">
        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
          <Phone className="size-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Layanan Telepon & WhatsApp</h4>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Telepon: (0341) 722216
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pokja Hubin: +62 812-3456-7890 (Hari Kerja)
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-5 flex items-start gap-4 shadow-xs dark:shadow-none">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <Mail className="size-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Email Resmi</h4>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">info@smkn6malang.sch.id</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">hubin@smkn6malang.sch.id</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] p-5 flex items-start gap-4 shadow-xs dark:shadow-none">
        <div className="flex size-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5">
          <Clock className="size-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Jam Layanan Pelayanan Siswa</h4>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">Senin - Kamis: 07:00 - 15:30 WIB</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">Jumat: 07:00 - 15:00 WIB</p>
        </div>
      </div>
    </div>
  );
}
