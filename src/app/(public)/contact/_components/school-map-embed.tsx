export default function SchoolMapEmbed() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-[#16212D] shadow-sm dark:shadow-2xl">
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Peta Lokasi SMKN 6 Malang
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jalan Ki Ageng Gribig No. 28, Kedungkandang, Kota Malang
          </p>
        </div>
        <a
          href="https://maps.google.com/?q=SMK+Negeri+6+Malang"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Buka Google Maps
        </a>
      </div>
      <div className="relative h-72 sm:h-80 w-full">
        <iframe
          className="w-full h-full border-0 filter contrast-105"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7902.461018247536!2d112.67171!3d-7.975112000000001!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd62866628675a5%3A0xe475311940a81d11!2sSMK%20Negeri%206%20Kota%20Malang!5e0!3m2!1sid!2sid!4v1739247018494!5m2!1sid!2sid"
        />
      </div>
    </div>
  );
}
