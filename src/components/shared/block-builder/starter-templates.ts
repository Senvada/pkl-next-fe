import { nanoid } from "nanoid";
import type { StarterTemplate } from "./types";

const makeDoc = (text: string) => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text }] }],
});

export const STARTER_TEMPLATES: StarterTemplate[] = [
  {
    id: "weekly-journal",
    title: "Jurnal PKL Mingguan",
    desc: "Struktur standar untuk mencatat kegiatan harian, dokumentasi foto, dan refleksi.",
    category: "article",
    blocks: [
      { id: nanoid(), type: "heading", data: { level: 1, content: "Laporan Kegiatan PKL - Minggu ke-...", align: "left" } },
      {
        id: nanoid(),
        type: "callout",
        data: {
          intent: "info",
          title: "Target Kompetensi & SOP",
          content: "Tuliskan target pekerjaan atau modul yang ditugaskan oleh pembimbing DU/DI pada minggu ini.",
        },
      },
      { id: nanoid(), type: "heading", data: { level: 2, content: "Aktivitas & Langkah Kerja", align: "left" } },
      {
        id: nanoid(),
        type: "columns",
        data: {
          ratio: "50-50",
          left: [{ id: nanoid(), type: "image", data: { url: "", caption: "Foto dokumentasi pengerjaan tugas", align: "center" } }],
          right: [{ id: nanoid(), type: "text", data: { content: makeDoc("Jelaskan langkah-langkah teknis secara rinci.") } }],
        },
      },
      {
        id: nanoid(),
        type: "callout",
        data: {
          intent: "tip",
          title: "Refleksi & Masukan Pembimbing",
          content: "Catat pembelajaran baru atau saran perbaikan dari mentor industri selama minggu ini.",
        },
      },
    ],
  },
  {
    id: "technical-troubleshooting",
    title: "Studi Kasus Teknis / Troubleshooting",
    desc: "Format khusus untuk mendokumentasikan perbaikan alat, bug kode, atau kendala lapangan.",
    category: "article",
    blocks: [
      { id: nanoid(), type: "heading", data: { level: 1, content: "Penanganan Kasus Teknis: [Nama Kasus]", align: "left" } },
      {
        id: nanoid(),
        type: "callout",
        data: {
          intent: "warning",
          title: "Gejala Masalah & Peringatan K3",
          content: "Deskripsikan kendala yang terjadi dan pastikan menerapkan prosedur keselamatan kerja.",
        },
      },
      { id: nanoid(), type: "heading", data: { level: 2, content: "Langkah Analisis & Solusi", align: "left" } },
      { id: nanoid(), type: "text", data: { content: makeDoc("Uraikan tahapan analisa permasalahan dan uji coba perbaikan.") } },
      {
        id: nanoid(),
        type: "callout",
        data: {
          intent: "tip",
          title: "Hasil Pengujian & Kesimpulan",
          content: "Hasil akhir setelah solusi diterapkan dan rekomendasi pencegahan ke depan.",
        },
      },
    ],
  },
  {
    id: "company-profile",
    title: "Profil & Budaya Industri Mitra",
    desc: "Format resmi untuk memperkenalkan profil DU/DI, divisi, dan fasilitas magang.",
    category: "company",
    blocks: [
      { id: nanoid(), type: "heading", data: { level: 1, content: "Profil & Lingkungan Kerja Mitra Industri", align: "left" } },
      { id: nanoid(), type: "text", data: { content: makeDoc("Deskripsikan bidang industri, produk utama, dan budaya kerja perusahaan.") } },
      {
        id: nanoid(),
        type: "callout",
        data: {
          intent: "info",
          title: "Fasilitas & Kompetensi Magang",
          content: "Informasi fasilitas laboratorium/kantor serta kualifikasi yang dicari dari peserta didik magang.",
        },
      },
    ],
  },
  {
    id: "company-facilities",
    title: "Fasilitas & Standar Kerja DU/DI",
    desc: "Dokumentasi fasilitas workshop/lab, perangkat kerja, dan standar keselamatan industri.",
    category: "company",
    blocks: [
      { id: nanoid(), type: "heading", data: { level: 1, content: "Fasilitas & Standar Kerja Industri", align: "left" } },
      {
        id: nanoid(),
        type: "columns",
        data: {
          ratio: "50-50",
          left: [{ id: nanoid(), type: "image", data: { url: "", caption: "Ruang kerja / workshop industri", align: "center" } }],
          right: [{ id: nanoid(), type: "text", data: { content: makeDoc("Deskripsi peralatan standar industri yang digunakan peserta.") } }],
        },
      },
      {
        id: nanoid(),
        type: "callout",
        data: {
          intent: "tip",
          title: "Standar K3 & Kedisiplinan",
          content: "Peserta magang diwajibkan mematuhi SOP keselamatan dan seragam kerja yang berlaku.",
        },
      },
    ],
  },
];
