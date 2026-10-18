"use client"

import * as React from "react"
import Image from "next/image"
import {
  Building2,
  Edit3,
  AlertCircle,
  Upload,
  X,
  MapPin,
  Globe,
  Save,
  Sparkles,
  Check,
  Loader2,
  Crop,
  Eye,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ImageCropperModal } from "@/components/shared/image-cropper-modal"
import {
  FormDrawer,
  FormDrawerHeader,
  FormDrawerBody,
  FormDrawerSection,
  FormDrawerFooter,
} from "@/components/shared/form-drawer"
import {
  usePresignCompanyImage,
  useResolveGoogleMaps,
} from "@/hooks/modules/company"
import type {
  Company,
  CreateCompanyPayload,
  UpdateCompanyPayload,
} from "@/types/company"
import type { Department } from "@/types/department"

interface CompanyFormDrawerProps {
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

function CompanyFormDrawerContent({
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

  // Cropper states
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null)
  const [isCropperOpen, setIsCropperOpen] = React.useState(false)
  const [rawSelectedFileSrc, setRawSelectedFileSrc] = React.useState<string | null>(null)

  const selectedDepts = React.useMemo(() => {
    return departments.filter((d) => selectedDeptIds.includes(d.id))
  }, [departments, selectedDeptIds])

  const presignMutation = usePresignCompanyImage()
  const resolveMapsMutation = useResolveGoogleMaps()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const [resolveNotice, setResolveNotice] = React.useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [lastResolvedLink, setLastResolvedLink] = React.useState<string>(
    editingCompany?.gmaps_link || ""
  )

  const handleResolveMaps = async () => {
    if (!gmapsLink.trim()) {
      setResolveNotice({
        type: "error",
        message: "Masukkan tautan Google Maps terlebih dahulu.",
      })
      return
    }

    setResolveNotice(null)
    try {
      const res = await resolveMapsMutation.mutateAsync({
        url: gmapsLink.trim(),
      })
      setLat(String(res.lat))
      setLng(String(res.lng))
      setLastResolvedLink(gmapsLink.trim())
      setResolveNotice({
        type: "success",
        message: `Koordinat berhasil didapatkan: (${res.lat}, ${res.lng})`,
      })
    } catch (err) {
      setResolveNotice({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Gagal mendeteksi koordinat dari tautan Google Maps. Pastikan URL valid.",
      })
    }
  }

  const handleDeptToggle = (deptId: string) => {
    setSelectedDeptIds((prev) =>
      prev.includes(deptId) ? prev.filter((id) => id !== deptId) : [...prev, deptId]
    )
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!validTypes.includes(file.type)) {
      setUploadError("Hanya file gambar (JPG, PNG, WebP, GIF) yang didukung.")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Ukuran file maksimal 10 MB.")
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setRawSelectedFileSrc(objectUrl)
    setCropImageSrc(objectUrl)
    setIsCropperOpen(true)

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleCropComplete = async ({
    file,
    url,
  }: {
    file: File
    url: string
  }) => {
    setUploadError(null)
    setIsUploading(true)
    // Display cropped image optimistically for preview
    setImageUrl(url)

    try {
      const presign = await presignMutation.mutateAsync({
        company_id: editingCompany?.id,
        content_type: file.type || "image/webp",
        file_size: file.size,
      })

      const uploadRes = await fetch(presign.upload_url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type || "image/webp",
        },
      })

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file gambar ke cloud storage.")
      }

      setImageUrl(presign.public_url)
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Terjadi kesalahan saat upload gambar."
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenCropper = () => {
    if (rawSelectedFileSrc) {
      setCropImageSrc(rawSelectedFileSrc)
      setIsCropperOpen(true)
    } else if (imageUrl) {
      setCropImageSrc(imageUrl)
      setIsCropperOpen(true)
    } else {
      fileInputRef.current?.click()
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
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Header */}
      <FormDrawerHeader
        title={
          editingCompany
            ? `Edit Mitra: ${editingCompany.name}`
            : "Tambah Mitra Industri Baru"
        }
        description={
          editingCompany
            ? "Perbarui informasi kontak, alamat, kuota, atau jurusan yang diterima."
            : "Daftarkan perusahaan rekanan baru tempat Praktik Kerja Lapangan siswa."
        }
        icon={
          editingCompany ? (
            <Edit3 className="size-5" />
          ) : (
            <Building2 className="size-5" />
          )
        }
        badge={
          editingCompany ? (
            <Badge variant="outline" className="text-[10px] font-semibold">
              Mode Edit
            </Badge>
          ) : (
            <Badge className="bg-blue-600 text-white text-[10px] font-semibold">
              Mitra Baru
            </Badge>
          )
        }
        onClose={onClose}
      />

      {/* Body with Sections */}
      <FormDrawerBody>
        {formError && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="size-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Section 1: Informasi Pokok Mitra */}
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

        {/* Section 2: Banner Thumbnail Kartu Industri (16:9) & Live Preview */}
        <FormDrawerSection
          step={2}
          title="Banner Thumbnail Kartu Industri (16:9)"
          description="Sesuaikan gambar berasio 16:9 dengan alat pemotong (cropper) agar foto mitra tampil rapi dan presisi di katalog publik."
        >
          {uploadError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="size-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="h-8.5 text-xs rounded-xl shadow-xs cursor-pointer"
            >
              <Upload className="size-3.5 mr-1.5" />
              <span>{imageUrl ? "Ganti & Potong Gambar" : "Unggah & Potong Gambar (16:9)"}</span>
            </Button>

            {(rawSelectedFileSrc || imageUrl) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={handleOpenCropper}
                className="h-8.5 text-xs rounded-xl border-slate-200 dark:border-white/10 cursor-pointer"
              >
                <Crop className="size-3.5 mr-1.5 text-blue-500" />
                <span>Sesuaikan Crop (16:9)</span>
              </Button>
            )}

            {imageUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isUploading}
                onClick={() => {
                  setImageUrl("")
                  setRawSelectedFileSrc(null)
                  setCropImageSrc(null)
                }}
                className="h-8.5 text-xs rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
              >
                <X className="size-3.5 mr-1" />
                <span>Hapus Foto</span>
              </Button>
            )}
          </div>

          {/* URL Direct Input Option */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Atau gunakan tautan URL gambar langsung
            </label>
            <Input
              type="url"
              placeholder="https://example.com/images/company-banner.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="h-8.5 text-xs rounded-xl"
            />
          </div>

          {/* Live Thumbnail Card Preview Box */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <Eye className="size-3.5 text-blue-500" />
                <span>Pratinjau Kartu Thumbnail (Live Preview)</span>
              </div>
              <span className="text-[10px] font-normal text-slate-400">
                Rasio 16:9 • Tampilan di Beranda &amp; Direktori
              </span>
            </div>

            <div className="w-full max-w-sm rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#16212D] overflow-hidden shadow-sm transition-all">
              {/* Card Banner 16:9 */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {imageUrl ? (
                  <>
                    <Image
                      src={imageUrl}
                      alt={name.trim() || "Preview"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <Building2 className="size-10 mb-1 opacity-40" />
                    <span className="text-[11px] font-medium">Belum ada foto thumbnail (16:9)</span>
                    <span className="text-[10px] text-slate-400/80">
                      Klik &apos;Unggah &amp; Potong Gambar&apos; untuk menambahkan
                    </span>
                  </div>
                )}

                {/* Uploading Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-white z-20">
                    <Loader2 className="size-6 animate-spin text-blue-400" />
                    <span className="text-xs font-medium">Mengunggah ke Storage...</span>
                  </div>
                )}

                {/* Status Pill on Preview */}
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md">
                  {status === "active" ? (
                    <>
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400">Mitra Aktif</span>
                    </>
                  ) : (
                    <>
                      <span className="size-1.5 rounded-full bg-slate-400" />
                      <span className="text-slate-300">Nonaktif</span>
                    </>
                  )}
                </div>

                {/* Department Count Pill on Preview */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="rounded-md bg-blue-600/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                    {selectedDepts.length > 0
                      ? `${selectedDepts.length} Jurusan`
                      : "Semua Jurusan"}
                  </span>
                </div>
              </div>

              {/* Card Body on Preview */}
              <div className="p-3.5 space-y-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {name.trim() || "Nama Perusahaan / Mitra Industri"}
                  </h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                    {description.trim() ||
                      "Jelaskan profil perusahaan, lingkungan kerja, dan kesempatan belajar bagi siswa PKL..."}
                  </p>
                </div>

                {/* Department Badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedDepts.length > 0 ? (
                    <>
                      {selectedDepts.slice(0, 3).map((dept) => (
                        <span
                          key={dept.id}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        >
                          {dept.code}
                        </span>
                      ))}
                      {selectedDepts.length > 3 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500">
                          +{selectedDepts.length - 3} lainnya
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-400 italic">
                      Belum ada jurusan yang dipilih
                    </span>
                  )}
                </div>

                {/* Card Footer (Strictly Neutral - No Reviews) */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1 truncate max-w-[200px]">
                    <MapPin className="size-3 text-rose-500 shrink-0" />
                    <span className="truncate">
                      {address.trim() || "Malang, Jawa Timur"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Users className="size-3 shrink-0" />
                    <span>Terbuka PKL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FormDrawerSection>

        {/* Section 3: Geolocation & Maps Auto-Resolve */}
        <FormDrawerSection
          step={3}
          title="Koordinat & Peta Lokasi"
          description="Koordinat latitude & longitude untuk plot otomatis di peta interaktif Leaflet sekolah."
        >
          {/* Tautan Google Maps + Auto Resolve Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe className="size-3.5 text-emerald-500" />
                <span>Tautan Google Maps / Shortlink</span>
              </label>
              {gmapsLink.trim() && (
                <a
                  href={gmapsLink.trim()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Buka Peta ↗
                </a>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="url"
                placeholder="Contoh: https://maps.app.goo.gl/... atau https://google.com/maps/..."
                value={gmapsLink}
                onChange={(e) => {
                  setGmapsLink(e.target.value)
                  if (resolveNotice) setResolveNotice(null)
                }}
                className="h-9.5 text-xs rounded-xl flex-1 font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResolveMaps}
                disabled={
                  resolveMapsMutation.isPending ||
                  !gmapsLink.trim() ||
                  Boolean(
                    gmapsLink.trim() &&
                    lastResolvedLink &&
                    gmapsLink.trim() === lastResolvedLink
                  )
                }
                className="h-9.5 px-3.5 rounded-xl border-blue-500/30 bg-blue-50/60 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold text-xs shrink-0 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
                title={
                  gmapsLink.trim() && lastResolvedLink && gmapsLink.trim() === lastResolvedLink
                    ? "Koordinat dari tautan ini sudah terambil"
                    : "Ambil koordinat Latitude & Longitude otomatis dari tautan Google Maps"
                }
              >
                {resolveMapsMutation.isPending ? (
                  <Loader2 className="size-3.5 mr-1.5 animate-spin" />
                ) : gmapsLink.trim() && lastResolvedLink && gmapsLink.trim() === lastResolvedLink ? (
                  <Check className="size-3.5 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Sparkles className="size-3.5 mr-1.5 text-blue-600 dark:text-blue-400" />
                )}
                {resolveMapsMutation.isPending
                  ? "Mendeteksi..."
                  : gmapsLink.trim() && lastResolvedLink && gmapsLink.trim() === lastResolvedLink
                    ? "Terdeteksi"
                    : "Ambil Koordinat"}
              </Button>
            </div>

            {/* Resolve Notice Alert */}
            {resolveNotice && (
              <div
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border ${resolveNotice.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300"
                  }`}
              >
                {resolveNotice.type === "success" ? (
                  <Check className="size-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="size-3.5 text-rose-600 shrink-0" />
                )}
                <span>{resolveNotice.message}</span>
              </div>
            )}
          </div>

          {/* Latitude & Longitude Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="size-3 text-rose-500" />
                  Latitude
                </label>
                {lat && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Koordinat terpasang
                  </span>
                )}
              </div>
              <Input
                type="text"
                placeholder="-7.9825678"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="h-9.5 text-xs rounded-xl font-mono"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="size-3 text-sky-500" />
                  Longitude
                </label>
                {lng && (
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Koordinat terpasang
                  </span>
                )}
              </div>
              <Input
                type="text"
                placeholder="112.6308123"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="h-9.5 text-xs rounded-xl font-mono"
              />
            </div>
          </div>
        </FormDrawerSection>

        {/* Section 4: Jurusan */}
        <FormDrawerSection
          step={4}
          title="Jurusan yang Relevan / Diterima"
          description="Pilih jurusan apa saja yang dapat mendaftar atau magang di mitra ini."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {departments.map((dept) => {
              const checked = selectedDeptIds.includes(dept.id)
              return (
                <label
                  key={dept.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${checked
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
        </FormDrawerSection>
      </FormDrawerBody>

      {/* Sticky Footer */}
      <FormDrawerFooter
        onCancel={onClose}
        isSaving={isSaving}
        disabled={isUploading}
        saveText={editingCompany ? "Simpan Perubahan" : "Tambah Mitra"}
        saveIcon={<Save className="size-3.5 mr-1.5" />}
      />

      {/* 16:9 Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        imageSrc={cropImageSrc}
        aspectRatio={16 / 9}
        cropShape="rect"
        title="Sesuaikan Banner / Thumbnail Industri (16:9)"
        description="Atur bingkai seleksi 16:9 agar gambar tampil proporsional di kartu daftar mitra dan pencarian siswa."
        outputFileName="company_banner.webp"
        isSubmitting={isUploading}
        onCropComplete={handleCropComplete}
      />
    </form>
  )
}

export function CompanyFormDrawer({
  open,
  onOpenChange,
  editingCompany,
  departments,
  isSaving,
  onSave,
}: CompanyFormDrawerProps) {
  return (
    <FormDrawer open={open} onOpenChange={onOpenChange} size="xl">
      {open && (
        <CompanyFormDrawerContent
          key={editingCompany?.id ?? "new-company"}
          editingCompany={editingCompany}
          departments={departments}
          isSaving={isSaving}
          onClose={() => onOpenChange(false)}
          onSave={onSave}
        />
      )}
    </FormDrawer>
  )
}
