"use client"

import * as React from "react"
import { usePresignCompanyImage } from "@/hooks/modules/company"

interface UseCompanyImageUploadProps {
  companyId?: string
  setImageUrl: (url: string) => void
}

export function useCompanyImageUpload({ companyId, setImageUrl }: UseCompanyImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadError, setUploadError] = React.useState<string | null>(null)
  const [cropImageSrc, setCropImageSrc] = React.useState<string | null>(null)
  const [isCropperOpen, setIsCropperOpen] = React.useState(false)
  const [rawSelectedFileSrc, setRawSelectedFileSrc] = React.useState<string | null>(null)

  const presignMutation = usePresignCompanyImage()
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

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

  const handleCropComplete = async ({ file, url }: { file: File; url: string }) => {
    setUploadError(null)
    setIsUploading(true)
    setImageUrl(url)

    try {
      const presign = await presignMutation.mutateAsync({
        company_id: companyId,
        content_type: file.type || "image/webp",
        file_size: file.size,
      })

      const uploadRes = await fetch(presign.upload_url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "image/webp" },
      })

      if (!uploadRes.ok) {
        throw new Error("Gagal mengunggah file gambar ke cloud storage.")
      }

      setImageUrl(presign.public_url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Terjadi kesalahan saat upload gambar.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleOpenCropper = (currentImageUrl?: string) => {
    if (rawSelectedFileSrc) {
      setCropImageSrc(rawSelectedFileSrc)
      setIsCropperOpen(true)
    } else if (currentImageUrl) {
      setCropImageSrc(currentImageUrl)
      setIsCropperOpen(true)
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleRemoveImage = () => {
    setImageUrl("")
    setRawSelectedFileSrc(null)
    setCropImageSrc(null)
  }

  return {
    isUploading,
    uploadError,
    cropImageSrc,
    isCropperOpen,
    setIsCropperOpen,
    rawSelectedFileSrc,
    fileInputRef,
    handleFileSelect,
    handleCropComplete,
    handleOpenCropper,
    handleRemoveImage,
  }
}
