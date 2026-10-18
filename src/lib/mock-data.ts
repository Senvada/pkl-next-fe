export interface Department {
  id: string;
  name: string;
  code: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string;
  bannerImage: string;
  category: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  shortDescription: string;
  departments: string[]; // department codes
  openQuota: number;
  totalQuota: number;
  rating?: number;
  reviewCount?: number;
  contactEmail: string;
  contactPhone: string;
  website: string;
  facilities: string[];
  requirements: string[];
  workDays: string;
  workHours: string;
  featured?: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: "Panduan" | "Berita" | "Tips Kerja" | "Prestasi";
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export interface PKLStep {
  step: number;
  title: string;
  description: string;
  iconName: string;
  details: string[];
}

export const DEPARTMENTS: Department[] = [
  {
    id: "dep-1",
    name: "Rekayasa Perangkat Lunak",
    code: "RPL",
    color: "#3B82F6",
    badgeBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    badgeText: "text-blue-600",
    description: "Pengembangan web modern, aplikasi mobile, backend service, dan rekayasa software teruji.",
  },
  {
    id: "dep-2",
    name: "Teknik Komputer & Jaringan",
    code: "TKJ",
    color: "#10B981",
    badgeBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    badgeText: "text-emerald-600",
    description: "Infrastruktur jaringan komputer, cloud computing, server administration, dan keamanan siber.",
  },
  {
    id: "dep-3",
    name: "Desain Komunikasi Visual",
    code: "DKV",
    color: "#F59E0B",
    badgeBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    badgeText: "text-amber-600",
    description: "Desain grafis, branding identitas visual, UI/UX design, dan media periklanan digital.",
  },
  {
    id: "dep-4",
    name: "Animasi & Multimedia",
    code: "ANM",
    color: "#8B5CF6",
    badgeBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    badgeText: "text-purple-600",
    description: "Produksi animasi 2D/3D, motion graphic, asset modeling, dan visual effects.",
  },
  {
    id: "dep-5",
    name: "Teknik Mekatronika",
    code: "TMK",
    color: "#EF4444",
    badgeBg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    badgeText: "text-rose-600",
    description: "Integrasi sistem otomasi industri, PLC, mikrokontroler, dan robotika modern.",
  },
  {
    id: "dep-6",
    name: "Sistem Informasi & Jaringan",
    code: "SIJA",
    color: "#06B6D4",
    badgeBg: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    badgeText: "text-cyan-600",
    description: "Penerapan sistem IoT terdistribusi, edge computing, dan infrastruktur sistem informasi enterprise.",
  },
];

export const COMPANIES: Company[] = [
  {
    id: "comp-1",
    name: "PT Nusantara Teknologi Terpadu",
    slug: "pt-nusantara-teknologi-terpadu",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80",
    category: "Software House & Cloud",
    city: "Kota Malang",
    address: "Jl. Soekarno Hatta No. 45, Lowokwaru, Kota Malang",
    lat: -7.9467,
    lng: 112.6158,
    description:
      "Perusahaan teknologi pengembang solusi SaaS enterprise, aplikasi mobile, dan integrasi cloud infrastructure untuk klien nasional dan multinasional.",
    shortDescription: "Pengembangan aplikasi web SaaS enterprise, microservices, dan mobile native.",
    departments: ["RPL", "TKJ", "SIJA"],
    openQuota: 4,
    totalQuota: 8,
    rating: 4.9,
    reviewCount: 28,
    contactEmail: "hr@nusantaratech.id",
    contactPhone: "+62 341 556789",
    website: "https://nusantaratech.id",
    facilities: [
      "Workstation Core i7 & Dual Monitor",
      "Mentoring 1-on-1 dari Senior Engineer",
      "Uang saku bulanan & makan siang",
      "Sertifikat Industri Resmi",
      "Free coffee & lounge",
    ],
    requirements: [
      "Menguasai dasar JavaScript / TypeScript / Go",
      "Memahami konsep RESTful API dan Git workflow",
      "Mampu bekerja sama dalam tim agile",
      "Disiplin dan memiliki kemauan belajar yang tinggi",
    ],
    workDays: "Senin - Jumat",
    workHours: "08:30 - 16:30 WIB",
    featured: true,
  },
  {
    id: "comp-2",
    name: "Kreativa Creative Studio",
    slug: "kreativa-creative-studio",
    logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&auto=format&fit=crop&q=80",
    category: "Digital Agency & Design",
    city: "Kota Malang",
    address: "Jl. Ijen No. 12, Klojen, Kota Malang",
    lat: -7.9715,
    lng: 112.6231,
    description:
      "Studio kreatif berfokus pada visual identity, motion graphics, UI/UX product design, serta kampanye branding digital terdepan di Indonesia.",
    shortDescription: "Branding visual, UI/UX design, dan motion graphic komersial.",
    departments: ["DKV", "ANM"],
    openQuota: 2,
    totalQuota: 5,
    rating: 4.8,
    reviewCount: 19,
    contactEmail: "career@kreativastudio.com",
    contactPhone: "+62 341 445210",
    website: "https://kreativastudio.com",
    facilities: [
      "Apple Mac Mini / Wacom Drawing Tablet",
      "Akses penuh ke Figma Enterprise & Adobe CC",
      "Portofolio project nyata untuk brand nasional",
      "Uang saku dan insentif hasil project",
    ],
    requirements: [
      "Menguasai Figma, Illustrator, atau After Effects",
      "Memiliki portofolio karya kreatif sebelumnya",
      "Mampu mengeksplorasi tren tipografi & komposisi visual",
    ],
    workDays: "Senin - Jumat",
    workHours: "09:00 - 17:00 WIB",
    featured: true,
  },
  {
    id: "comp-3",
    name: "PT Solusi Jaringan Indonesia",
    slug: "pt-solusi-jaringan-indonesia",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80",
    category: "Network Infrastructure & ISP",
    city: "Kota Malang",
    address: "Kawasan Industri Karanglo Blok C-3, Singosari, Malang",
    lat: -7.9056,
    lng: 112.6482,
    description:
      "Penyedia infrastruktur jaringan data center, fiber optik, dan managed service router enterprise untuk korporasi, institusi pendidikan, dan pemerintahan.",
    shortDescription: "Implementasi router Mikrotik/Cisco, data center, dan fiber optic.",
    departments: ["TKJ", "SIJA"],
    openQuota: 5,
    totalQuota: 6,
    rating: 4.7,
    reviewCount: 15,
    contactEmail: "recruitment@solusijaringan.co.id",
    contactPhone: "+62 341 789123",
    website: "https://solusijaringan.co.id",
    facilities: [
      "Lab praktikum Mikrotik & Cisco Certified",
      "Alat ukur fiber optik (OTDR, Splicer) lengkap",
      "Sertifikat kompetensi jaringan industri",
      "Asuransi kerja & uang transport",
    ],
    requirements: [
      "Menguasai konsep Subnetting, Routing Statis/Dinamis",
      "Mengenal konfigurasi Mikrotik RouterOS",
      "Siap mengikuti praktek lapangan terarah",
    ],
    workDays: "Senin - Sabtu",
    workHours: "08:00 - 16:00 WIB",
    featured: false,
  },
  {
    id: "comp-4",
    name: "Otoma Mitra Industri",
    slug: "otoma-mitra-industri",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
    category: "Industrial Automation",
    city: "Kabupaten Malang",
    address: "Jl. Raya Surabaya-Malang KM 42, Lawang, Malang",
    lat: -7.8384,
    lng: 112.6987,
    description:
      "Perusahaan perakitan mesin otomatisasi, panel kontrol industri, programmable logic controller (PLC), dan integrasi SCADA pabrikasi modern.",
    shortDescription: "Pemrograman PLC, perakitan panel otomatisasi, dan sensorik industri.",
    departments: ["TMK"],
    openQuota: 3,
    totalQuota: 4,
    rating: 4.9,
    reviewCount: 12,
    contactEmail: "info@otomaindustri.com",
    contactPhone: "+62 341 426800",
    website: "https://otomaindustri.com",
    facilities: [
      "Alat Pelindung Diri (APD) standar industri lengkap",
      "Workshop berpendingin dengan tools berstandar ISO",
      "Bimbingan sertifikasi teknisi otomasi",
      "Makan siang disediakan",
    ],
    requirements: [
      "Memahami diagram kelistrikan dan wiring panel",
      "Dasar pemrograman PLC (Omron/Siemens) menjadi nilai plus",
      "Memiliki kepatuhan ketat terhadap SOP K3",
    ],
    workDays: "Senin - Jumat",
    workHours: "08:00 - 16:30 WIB",
    featured: false,
  },
  {
    id: "comp-5",
    name: "Animazone Media Animation",
    slug: "animazone-media-animation",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80",
    category: "Animation & VFX Studio",
    city: "Kota Malang",
    address: "Jl. Candi Mendut No. 8, Mojolangu, Kota Malang",
    lat: -7.9392,
    lng: 112.6322,
    description:
      "Studio animasi yang memproduksi serial animasi edukasi anak, konten 3D untuk game developer luar negeri, dan iklan animasi komersial.",
    shortDescription: "Produksi serial animasi 3D, rigging karakter, dan visual effects.",
    departments: ["ANM", "DKV"],
    openQuota: 3,
    totalQuota: 5,
    rating: 4.8,
    reviewCount: 22,
    contactEmail: "studio@animazone.id",
    contactPhone: "+62 341 401889",
    website: "https://animazone.id",
    facilities: [
      "Workstation Blender & Maya dengan GPU RTX 4070",
      "Mentoring pembuatan karakter & animasi gerakan nyata",
      "Kredit nama di film serial animasi resmi",
      "Suasana studio santai dan kreatif",
    ],
    requirements: [
      "Menguasai dasar software Blender atau Maya",
      "Paham 12 prinsip dasar animasi",
      "Melampirkan showreel atau portofolio animasi",
    ],
    workDays: "Senin - Jumat",
    workHours: "09:00 - 17:30 WIB",
    featured: true,
  },
  {
    id: "comp-6",
    name: "Inova Digital Solusindo",
    slug: "inova-digital-solusindo",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    bannerImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80",
    category: "Web & Mobile Development",
    city: "Kota Malang",
    address: "Jl. Veteran No. 18, Ketawanggede, Kota Malang",
    lat: -7.9575,
    lng: 112.6178,
    description:
      "Solusi software rumah sakit, sistem e-learning universitas, dan platform fintech terintegrasi dengan standar keamanan tinggi.",
    shortDescription: "Solusi web ERP, sistem fintech, dan frontend Next.js / React.",
    departments: ["RPL", "DKV"],
    openQuota: 4,
    totalQuota: 6,
    rating: 4.9,
    reviewCount: 31,
    contactEmail: "contact@inovadigital.com",
    contactPhone: "+62 341 559922",
    website: "https://inovadigital.com",
    facilities: [
      "Flexible working arrangement (Hybrid)",
      "Tech stack modern (React/Next.js, Golang, PostgreSQL)",
      "Ruang kerja nyaman dekat pusat kota",
      "Insentif bulanan menarik",
    ],
    requirements: [
      "Memahami HTML5, CSS3, Tailwind CSS, dan React",
      "Mampu menerjemahkan desain Figma ke kode UI",
      "Mempunyai komitmen kehadiran selama masa PKL",
    ],
    workDays: "Senin - Jumat",
    workHours: "08:30 - 16:30 WIB",
    featured: true,
  },
];

export const ARTICLES: Article[] = [
  {
    id: "art-1",
    title: "Panduan Lengkap Memilih Tempat PKL yang Sesuai dengan Passion dan Jurusanmu",
    slug: "panduan-lengkap-memilih-tempat-pkl",
    category: "Panduan",
    coverImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
    excerpt:
      "Temukan langkah strategis memilih mitra industri yang relevan, tips meneliti reputasi perusahaan, dan persiapan berkas administratif PKL.",
    publishedAt: "25 September 2026",
    readTime: "5 menit baca",
    author: {
      name: "Drs. Budi Santoso, M.Pd",
      role: "Ketua Pokja Hubin & Kerjasama Industri",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    },
    tags: ["Panduan PKL", "Tips Karir", "SMKN 6 Malang"],
    featured: true,
    content: [
      "Praktik Kerja Lapangan (PKL) adalah momentum paling berharga bagi siswa SMK untuk merasakan dinamika dunia kerja sesungguhnya. Namun, salah satu kesalahan yang paling sering terjadi adalah memilih tempat magang hanya karena ikut-ikutan teman atau sekadar mencari lokasi yang paling dekat dari rumah.",
      "Langkah pertama yang harus kamu lakukan adalah menyelaraskan kompetensi keahlian jurusan dengan profil bisnis perusahaan tujuan. Siswa RPL misalnya, perlu memastikan perusahaan tersebut memang memiliki divisi rekayasa perangkat lunak aktif dan bukan sekadar divisi input data administratif.",
      "Selain itu, perhatikan ketersediaan mentor industri. Perusahaan yang baik akan menugaskan mentor teknis yang membimbing pekerjaan harian, mereview kode atau desain, serta memberikan masukan konstruktif atas perkembangan performamu selama 6 bulan masa magang.",
      "Siapkan berkas portofolio digital yang menarik. Daripada hanya mengirimkan CV dalam bentuk teks kering, lampirkan tautan GitHub, repositori proyek, atau tautan Behance/Dribbble yang menampilkan hasil karya terbaik yang pernah kamu kerjakan di sekolah.",
    ],
  },
  {
    id: "art-2",
    title: "10 Etika Profesional di Dunia Kerja yang Wajib Diterapkan Siswa Selama Magang",
    slug: "10-etika-profesional-di-dunia-kerja-pkl",
    category: "Tips Kerja",
    coverImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80",
    excerpt:
      "Kunci sukses PKL bukan hanya kemampuan teknis, tetapi sikap kerja (attitude), komunikasi santun, dan ketepatan waktu yang konsisten.",
    publishedAt: "18 September 2026",
    readTime: "4 menit baca",
    author: {
      name: "Siti Nurhaliza, S.ST",
      role: "Koordinator Bimbingan Konseling & Karir",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    tags: ["Etika Kerja", "Soft Skills", "Dunia Industri"],
    featured: false,
    content: [
      "Di lingkungan kerja nyata, keahlian teknis (hard skills) hanya menyumbang sekitar 30% dari penilaian keberhasilan seseorang. Selebihnya ditentukan oleh kedewasaan bersikap, etika komunikasi, dan kecerdasan emosional dalam berinteraksi dengan rekan kerja.",
      "Ketaatan terhadap waktu (punctuality) adalah cerminan pertama integritasmu. Selalu hadir 15 menit sebelum jam kerja dimulai dan pastikan setiap tugas diselesaikan sebelum tenggat waktu yang disepakati bersama mentor.",
      "Jangan ragu untuk bertanya ketika menghadapi hambatan teknis. Namun, tunjukkan bahwa kamu telah mencoba mencari solusi secara mandiri terlebih dahulu sebelum menginterupsi waktu rekan kerja yang lain.",
      "Pelihara kerahasiaan data internal perusahaan. Siswa PKL terikat perjanjian non-disclosure (NDA) tidak tertulis untuk tidak mempublikasikan kode rahasia, data pelanggan, atau dokumen internal perusahaan ke media sosial umum.",
    ],
  },
  {
    id: "art-3",
    title: "SMKN 6 Malang Perluas Kerjasama Industri Digital dengan 25 Perusahaan Baru",
    slug: "smkn-6-malang-perluas-kerjasama-industri-digital",
    category: "Berita",
    coverImage: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80",
    excerpt:
      "Penandatanganan nota kesepahaman (MoU) serentak memperluas peluang penyerapan siswa magang di bidang Artificial Intelligence, Cloud, dan Game Dev.",
    publishedAt: "12 September 2026",
    readTime: "3 menit baca",
    author: {
      name: "Humas SMKN 6 Malang",
      role: "Divisi Publikasi & Media",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    },
    tags: ["Berita Sekolah", "Kerjasama Industri", "MoU"],
    featured: false,
    content: [
      "Sebagai komitmen mewujudkan SMK Pusat Keunggulan yang adaptif terhadap revolusi industri 4.0, SMKN 6 Malang resmi menandatangani kemitraan strategis dengan 25 perusahaan teknologi terkemuka.",
      "Kepala Sekolah menyampaikan bahwa kerjasama ini mencakup sinkronisasi kurikulum berbasis industri, program magang intensif 6 bulan, guru tamu bersertifikasi, serta prioritas rekrutmen langsung bagi lulusan terbaik.",
      "Dengan adanya perluasan mitra ini, seluruh siswa kini memiliki akses ke lebih dari 120 pilihan perusahaan terakreditasi yang tersebar di wilayah Malang Raya, Surabaya, hingga program magang remote di Jakarta.",
    ],
  },
  {
    id: "art-4",
    title: "Cara Efektif Menyusun Laporan PKL Digital Menggunakan Format Baku Sekolah",
    slug: "cara-efektif-menyusun-laporan-pkl-digital",
    category: "Panduan",
    coverImage: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=1200&auto=format&fit=crop&q=80",
    excerpt:
      "Format sistematis penyusunan bab demi bab laporan PKL, dokumentasi foto kegiatan industri, dan lampiran penilaian pembimbing.",
    publishedAt: "05 September 2026",
    readTime: "6 menit baca",
    author: {
      name: "Tim Kurikulum SMKN 6 Malang",
      role: "Penyusun Standar Penilaian PKL",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    },
    tags: ["Laporan PKL", "Dokumentasi", "Ujian Akhir"],
    featured: false,
    content: [
      "Penyusunan laporan tidak boleh ditunda hingga minggu-minggu terakhir magang. Kunci menghasilkan laporan yang runut dan berbobot adalah mendokumentasikan logbook harian secara konsisten melalui portal digital PKL.",
      "Setiap aktivitas penting hendaknya disertai foto dokumentasi kerja, diagram sistem yang dikembangkan, atau penjelasan masalah teknis beserta solusi implementatif yang diterapkan.",
      "Pastikan laporan telah melalui proses review dan ditandatangani oleh mentor industri sebelum diajukan ke guru pembimbing sekolah untuk persiapan sidang pertanggungjawaban PKL.",
    ],
  },
];

export const PKL_WORKFLOW: PKLStep[] = [
  {
    step: 1,
    title: "Pembekalan & Orientasi",
    description: "Sosialisasi tata tertib, etika industri, pengenalan platform digital, dan pembagian kuota per jurusan.",
    iconName: "Compass",
    details: [
      "Pengarahan langsung dari Wakil Kepala Sekolah Hubin",
      "Workshop soft skills & kesiapan mental dunia kerja",
      "Penyusunan CV & portofolio digital terverifikasi",
    ],
  },
  {
    step: 2,
    title: "Eksplorasi & Pengajuan Mitra",
    description: "Siswa memilih lowongan tempat PKL yang tersedia sesuai keahlian dan mengajukan persetujuan sekolah.",
    iconName: "Search",
    details: [
      "Penelusuran direktori perusahaan mitra di portal PKL",
      "Pengajuan surat pengantar resmi secara digital",
      "Proses wawancara & konfirmasi penerimaan oleh industri",
    ],
  },
  {
    step: 3,
    title: "Pelaksanaan Magang (6 Bulan)",
    description: "Praktik nyata di perusahaan dengan pengisian presensi dan jurnal kegiatan harian secara realtime.",
    iconName: "Briefcase",
    details: [
      "Integrasi kerja dengan tim dan mentor perusahaan",
      "Pengisian logbook digital mingguan yang dipantau guru",
      "Penyelesaian project industri nyata",
    ],
  },
  {
    step: 4,
    title: "Monitoring & Evaluasi",
    description: "Kunjungan supervisi berkala dari guru pembimbing sekolah ke lokasi industri mitra.",
    iconName: "CheckCircle2",
    details: [
      "Pemeriksaan kemajuan kompetensi siswa di tempat kerja",
      "Konsultasi dua arah antara guru dan mentor industri",
      "Penilaian performa kerja tengah periode",
    ],
  },
  {
    step: 5,
    title: "Sidang & Sertifikasi Industri",
    description: "Pemaparan laporan akhir di hadapan penguji dan penerbitan sertifikat kompetensi resmi dari mitra.",
    iconName: "Award",
    details: [
      "Penyusunan draf laporan akhir berstandar baku",
      "Presentasi sidang evaluasi di sekolah",
      "Penerbitan sertifikat resmi yang diakui BNSP & Industri",
    ],
  },
];

export const STATS = [
  { label: "Mitra Industri Aktif", value: "120+", desc: "Perusahaan bonafide di berbagai sektor" },
  { label: "Siswa Tersalurkan", value: "850+", desc: "Tiap tahunnya dengan evaluasi tinggi" },
  { label: "Jurusan Kejuruan", value: "6 Jurusan", desc: "Berstandar kurikulum industri modern" },
  { label: "Tingkat Rekrutmen Langsung", value: "35%", desc: "Ditarik bekerja sebelum lulus sekolah" },
];

export const FAQS = [
  {
    q: "Berapa lama durasi pelaksanaan PKL di SMKN 6 Malang?",
    a: "Durasi pelaksanaan PKL standar adalah 6 bulan (satu semester penuh), memberikan waktu yang cukup bagi siswa untuk beradaptasi, menguasai alur kerja, dan menyelesaikan proyek industri nyata.",
  },
  {
    q: "Apakah siswa boleh memilih tempat PKL di luar daftar mitra yang tersedia?",
    a: "Boleh, dengan syarat mengajukan permohonan ke Pokja Hubin untuk verifikasi kelayakan perusahaan, ketersediaan mentor teknis, dan kesesuaian bidang dengan kompetensi keahlian jurusan.",
  },
  {
    q: "Bagaimana sistem penilaian PKL dilakukan?",
    a: "Penilaian bersifat komprehensif: 60% dari pembimbing industri (kedisiplinan, inisiatif, etika, dan hasil kerja teknis), 20% dari keaktifan logbook digital dan bimbingan guru, serta 20% dari sidang laporan akhir.",
  },
  {
    q: "Apakah seluruh proses administrasi surat-menyurat sudah berbasis digital?",
    a: "Ya! Melalui portal PKL digital ini, siswa dapat mengunduh surat pengantar resmi, surat tugas, buku panduan, hingga mengunggah berkas laporan tanpa perlu cetak manual.",
  },
];
