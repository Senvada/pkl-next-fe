"use client"

import * as React from "react"
import Image from "next/image"
import {
  Building2,
  Plus,
  Edit3,
  AlertCircle,
  Loader2,
  Upload,
  X,
  MapPin,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { usePresignCompanyImage } from "@/hooks/modules/company"
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types/company"
import type { Department } from "@/types/department"

interface CompanyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingCompany: Company | null
  departments: Department[]
  isSaving: boolean
  onSave: (args: {
    isEdit: boolean
    payload: CreateCompanyPayload | UpdateCompanyPayload
    name: string
  }) => Promise<void>
}

function CompanyFormContent({
  editingCompany,
  departments,
  isSaving,
  onClose,
  onSave,
}: {
  editingCompany: Company | null
  departments: Department[]
  isSaving: boolean
  onClose: () => void
  onSave: (args: {
    isEdit: boolean
    payload: CreateCompanyPayload | UpdateCompanyPayload
    name: string
  }) => Promise<void>
}) {
  const [name, setName] = React.useState(editingCompany ? editingCompany.name : "")
  const [email, setEmail] = React.useState(editingCompany?.email || "")
  const [phoneNumber, setPhoneNumber] = React.useState(
    editingCompany?.phone_number || ""
  )
  const [address, setAddress] = React.useState(editingCompany?.address || "")
  const [description, setDescription] = React.useState(
    editingCompany?.description || ""
  )
  const [imageUrl, setImageUrl] = React.useState(editingCompany?.image_url || "")
  const [gmapsLink, setGmapsLink] = React.useState(
    editingCompany?.gmaps_link || ""
  )
  const [lat, setLat] = React.useState(
    editingCompany?.lat != null ? String(editingCompany.lat) : ""
  )
  const [lng, setLng] = React.useState(
    editingCompany?.lng != null ? String(editingCompany.lng) : ""
  )
  const [status, setStatus] = React.useState<"active" | "inactive">(
    editingCompany?.status || "active"
  )
  const [selectedDeptIds, setSelectedDeptIds] = React.useState<string[]>(
    editingCompany?.departments?.map((d) => d.id) || []
  )

  const [formError, setFormError] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)

  const presignMutation = usePresignCompanyImage()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleDeptToggle = (deptId: string) => {
    setSelectedDeptIds((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    )
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setUploadError("Hanya file gambar (JPG, PNG, WebP, GIF) yang didukung.")
      return
    }

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 10 MB.")
      return
    }

    try {
      setIsUploading(true)
      const presign = await presignMutation.mutateAsync({
        content_type: file.type,
        file_size: file.size,
      })

      const uploadRes = await fetch(presign.upload_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      })

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file ke cloud storage.")
      }

      setImageUrl(presign.public_url)
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat upload gambar."
      )
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!name.trim()) {
      setFormError("Nama perusahaan wajib diisi.")
      return
    }

    const parsedLat = lat.trim() ? parseFloat(lat.trim()) : null
    const parsedLng = lng.trim() ? parseFloat(lng.trim()) : null

    if (lat.trim() && isNaN(Number(lat.trim()))) {
      setFormError("Latitude harus berupa angka desimal yang valid.")
      return
    }
    if (lng.trim() && isNaN(Number(lng.trim()))) {
      setFormError("Longitude harus berupa angka desimal yang valid.")
      return
    }

    const payload: CreateCompanyPayload | UpdateCompanyPayload = {
      name: name.trim(),
      email: email.trim() || null,
      phone_number: phoneNumber.trim() || null,
      address: address.trim() || null,
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
      gmaps_link: gmapsLink.trim() || null,
      lat: parsedLat,
      lng: parsedLng,
      status,
      department_ids: selectedDeptIds,
    }

    try {
      await onSave({
        isEdit: Boolean(editingCompany),
        payload,
        name: name.trim(),
      })
      onClose()
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Gagal menyimpan data perusahaan."
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
          <AlertCircle className="size-4 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="max-h-[68vh] overflow-y-auto px-1 space-y-4">
        {/* Section 1: Basic Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            1. Informasi Pokok Mitra
          </h4>

          {/* Name */}
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

          {/* Status & Contacts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

          {/* Address */}
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

          {/* Description */}
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
        </div>

        {/* Section 2: Logo / Image Upload */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            2. Foto Logo / Banner Industri
          </h4>

          {uploadError && (
            <div className="text-xs text-rose-500 font-medium">
              {uploadError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Image Preview */}
            <div className="relative size-20 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-slate-100 dark:bg-white/5 shrink-0 flex items-center justify-center">
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    title="Hapus gambar"
                  >
                    <X className="size-3" />
                  </button>
                </>
              ) : (
                <Building2 className="size-8 text-slate-400" />
              )}
            </div>

            {/* Upload Buttons and URL input */}
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 text-xs rounded-xl border-slate-200 dark:border-white/10"
                >
                  {isUploading ? (
                    <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                  ) : (
                    <Upload className="size-3.5 mr-1.5" />
                  )}
                  {isUploading ? "Mengunggah..." : "Unggah Gambar"}
                </Button>
                <span className="text-[11px] text-slate-400">
                  Maksimal 10 MB (PNG, JPG, WebP)
                </span>
              </div>

              <Input
                type="url"
                placeholder="Atau masukkan tautan URL gambar langsung..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="h-8.5 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Geolocation & Maps */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            3. Koordinat & Peta Lokasi (Leaflet / Google Maps)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="size-3 text-rose-500" />
                Latitude
              </label>
              <Input
                type="text"
                placeholder="-7.9825"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="h-9.5 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <MapPin className="size-3 text-sky-500" />
                Longitude
              </label>
              <Input
                type="text"
                placeholder="112.6308"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="h-9.5 text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Globe className="size-3 text-emerald-500" />
                Tautan Google Maps
              </label>
              <Input
                type="url"
                placeholder="https://maps.google.com/..."
                value={gmapsLink}
                onChange={(e) => setGmapsLink(e.target.value)}
                className="h-9.5 text-xs rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Departments Multi-Select */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              4. Jurusan yang Memiliki Relevansi / Diterima
            </h4>
            <span className="text-[11px] font-medium text-slate-400">
              {selectedDeptIds.length} jurusan dipilih
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {departments.map((dept) => {
              const checked = selectedDeptIds.includes(dept.id)
              return (
                <label
                  key={dept.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    checked
                      ? "border-blue-500/40 bg-blue-50/50 dark:bg-blue-900/20 text-slate-900 dark:text-white"
                      : "border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleDeptToggle(dept.id)}
                    className="size-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="font-semibold truncate">{dept.name}</span>
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ml-2"
                      style={{
                        backgroundColor: dept.color ? `${dept.color}20` : undefined,
                        color: dept.color || undefined,
                      }}
                    >
                      {dept.code}
                    </span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </div>

      <DialogFooter className="pt-3 border-t border-slate-100 dark:border-white/5 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={isSaving}
          className="h-9 rounded-xl border-slate-200 dark:border-white/10 text-xs"
        >
          Batal
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSaving || isUploading}
          className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm"
        >
          {isSaving ? (
            <Loader2 className="size-3.5 mr-1.5 animate-spin" />
          ) : editingCompany ? (
            <Edit3 className="size-3.5 mr-1.5" />
          ) : (
            <Plus className="size-3.5 mr-1.5" />
          )}
          {isSaving
            ? "Menyimpan..."
            : editingCompany
            ? "Simpan Perubahan"
            : "Tambah Mitra"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  editingCompany,
  departments,
  isSaving,
  onSave,
}: CompanyFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-hidden p-6 rounded-3xl border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#16212D]">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {editingCompany ? (
                <Edit3 className="size-5" />
              ) : (
                <Building2 className="size-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {editingCompany
                  ? `Edit Data Mitra: ${editingCompany.name}`
                  : "Tambah Mitra Industri Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                {editingCompany
                  ? "Perbarui informasi kontak, alamat, kuota, atau jurusan yang diterima."
                  : "Daftarkan perusahaan rekanan baru tempat Praktik Kerja Lapangan siswa."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {open && (
          <CompanyFormContent
            editingCompany={editingCompany}
            departments={departments}
            isSaving={isSaving}
            onClose={() => onOpenChange(false)}
            onSave={onSave}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
