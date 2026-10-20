"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { FormDrawerSection } from "@/components/shared/form-drawer"

interface CompanyBasicInfoSectionProps {
  name: string
  setName: (v: string) => void
  status: "active" | "inactive"
  setStatus: (v: "active" | "inactive") => void
  email: string
  setEmail: (v: string) => void
  phoneNumber: string
  setPhoneNumber: (v: string) => void
  address: string
  setAddress: (v: string) => void
  description: string
  setDescription: (v: string) => void
}

export function CompanyBasicInfoSection({
  name,
  setName,
  status,
  setStatus,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  address,
  setAddress,
  description,
  setDescription,
}: CompanyBasicInfoSectionProps) {
  return (
    <FormDrawerSection
      step={1}
      title="Informasi Pokok Mitra"
      description="Nama resmi instansi atau perusahaan mitra serta kontak korespondensi."
    >
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Nama Industri / Perusahaan <span className="text-rose-500">*</span>
        </label>
        <Input
          type="text"
          required
          placeholder="Contoh: PT Telkom Akses / Studio Kreatif Malang"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9.5 text-xs rounded-xl"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Status Kerjasama
          </label>
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as "active" | "inactive")
            }
            className="w-full h-9.5 px-3 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="active">Aktif (Menerima PKL)</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No. Telepon / WhatsApp
          </label>
          <Input
            type="text"
            placeholder="08123456789 / (0341) 123456"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="h-9.5 text-xs rounded-xl"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Email Resmi Mitra
        </label>
        <Input
          type="email"
          placeholder="kontak@perusahaan.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-9.5 text-xs rounded-xl"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Alamat Lengkap Perusahaan
        </label>
        <textarea
          rows={2}
          placeholder="Jl. Raya Danau Ranau No. 1, Sawojajar, Kota Malang, Jawa Timur"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Deskripsi Singkat Profil Perusahaan
        </label>
        <textarea
          rows={2}
          placeholder="Jelaskan bidang usaha, fokus industri, serta lingkungan kerja praktik bagi siswa..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </FormDrawerSection>
  )
}
