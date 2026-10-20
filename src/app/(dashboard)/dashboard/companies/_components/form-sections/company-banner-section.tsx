"use client"

import * as React from "react"
import { AlertCircle, Upload, Crop, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormDrawerSection } from "@/components/shared/form-drawer"
import { ImageCropperModal } from "@/components/shared/image-cropper-modal"
import { CompanyCardLivePreview } from "./company-card-live-preview"
import type { Department } from "@/types/department"
import type { useCompanyImageUpload } from "./use-company-image-upload"

interface CompanyBannerSectionProps {
  imageUrl: string
  name: string
  description: string
  address: string
  status: "active" | "inactive"
  selectedDepts: Department[]
  imageUpload: ReturnType<typeof useCompanyImageUpload>
  onImageUrlChange: (url: string) => void
}

export function CompanyBannerSection({
  imageUrl,
  name,
  description,
  address,
  status,
  selectedDepts,
  imageUpload,
  onImageUrlChange,
}: CompanyBannerSectionProps) {
  const {
    isUploading,
    uploadError,
    rawSelectedFileSrc,
    fileInputRef,
    handleFileSelect,
    handleOpenCropper,
    handleRemoveImage,
  } = imageUpload
  return (
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
            onClick={() => handleOpenCropper(imageUrl)}
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
            onClick={handleRemoveImage}
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
          onChange={(e) => onImageUrlChange(e.target.value)}
          className="h-8.5 text-xs rounded-xl"
        />
      </div>

      {/* Live Thumbnail Card Preview Box */}
      <CompanyCardLivePreview
        name={name}
        description={description}
        address={address}
        status={status}
        imageUrl={imageUrl}
        selectedDepts={selectedDepts}
        isUploading={isUploading}
      />

      <ImageCropperModal
        isOpen={imageUpload.isCropperOpen}
        onClose={() => imageUpload.setIsCropperOpen(false)}
        imageSrc={imageUpload.cropImageSrc}
        aspectRatio={16 / 9}
        cropShape="rect"
        title="Sesuaikan Banner / Thumbnail Industri (16:9)"
        description="Atur bingkai seleksi 16:9 agar gambar tampil proporsional di kartu daftar mitra."
        outputFileName="company_banner.webp"
        isSubmitting={imageUpload.isUploading}
        onCropComplete={imageUpload.handleCropComplete}
      />
    </FormDrawerSection>
  )
}
