"use client"

import * as React from "react"
import Image from "next/image"
import {
  Search,
  UploadCloud,
  Check,
  ImageIcon,
  FolderOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  useAssetsPaginatedQuery,
  useUploadAsset,
} from "@/hooks/modules/asset"
import {
  resolveAssetUrl,
  formatFileSize,
  isImageFile,
} from "@/lib/asset-resolver"
import { ImageCropperModal } from "@/components/shared/image-cropper-modal"
import type { Asset } from "@/types/asset"

export interface ImagePickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (asset: Asset) => void
  selectedUrl?: string | null
  aspectRatio?: number
  cropShape?: "round" | "rect"
  title?: string
  description?: string
  folder?: string
}

function ImagePickerDialogInner({
  open,
  onOpenChange,
  onSelect,
  selectedUrl,
  aspectRatio,
  cropShape = "rect",
  title = "Pilih Media / Gambar",
  description = "Pilih gambar dari galeri aset atau unggah media baru.",
  folder = "gallery",
}: ImagePickerDialogProps) {
  const [activeTab, setActiveTab] = React.useState<"gallery" | "upload">("gallery")
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [manuallySelectedAsset, setManuallySelectedAsset] = React.useState<Asset | null>(null)

  // Cropper states for new upload
  const [cropperOpen, setCropperOpen] = React.useState(false)
  const [cropperImageSrc, setCropperImageSrc] = React.useState<string | null>(null)
  const [pendingFile, setPendingFile] = React.useState<File | null>(null)

  // File input ref
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  // Query assets
  const { data, isLoading } = useAssetsPaginatedQuery({
    page,
    limit: 12,
    filter: {
      search: debouncedSearch,
      mime_type: "image",
    },
    enabled: open,
  })

  const uploadAssetMutation = useUploadAsset()

  const assets = React.useMemo(() => data?.assets || [], [data?.assets])
  const pagination = data?.pagination

  // Determine active selection: manual click takes precedence, fallback to matching selectedUrl
  const selectedAsset = React.useMemo(() => {
    if (manuallySelectedAsset) return manuallySelectedAsset
    if (selectedUrl && assets.length > 0) {
      return assets.find((a) => a.url === selectedUrl || a.path === selectedUrl) || null
    }
    return null
  }, [manuallySelectedAsset, selectedUrl, assets])

  const handleSelectConfirm = () => {
    if (selectedAsset) {
      onSelect(selectedAsset)
      onOpenChange(false)
    }
  }

  // Handle direct file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isImageFile(file.type, file.name)) {
      alert("Hanya berkas gambar (JPEG, PNG, WebP, GIF, SVG) yang diperbolehkan.")
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      alert("Ukuran berkas melebihi batas maksimum 15MB.")
      return
    }

    if (aspectRatio) {
      // Open cropper first
      const reader = new FileReader()
      reader.onload = () => {
        setCropperImageSrc(reader.result as string)
        setPendingFile(file)
        setCropperOpen(true)
      }
      reader.readAsDataURL(file)
    } else {
      // Direct upload
      try {
        const newAsset = await uploadAssetMutation.mutateAsync({ file, folder })
        setManuallySelectedAsset(newAsset)
        setActiveTab("gallery")
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Gagal mengunggah gambar"
        alert(errorMsg)
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ""
      }
    }
  }

  // Handle crop finish
  const handleCropComplete = async ({ file }: { file: File }) => {
    try {
      const newAsset = await uploadAssetMutation.mutateAsync({
        file: new File([file], pendingFile?.name || "cropped_asset.webp", {
          type: file.type || "image/webp",
        }),
        folder,
      })
      setCropperOpen(false)
      setManuallySelectedAsset(newAsset)
      setActiveTab("gallery")
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Gagal mengunggah gambar hasil potong"
      alert(errorMsg)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-full p-0 overflow-hidden flex flex-col max-h-[85vh] sm:rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-border/40">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
              <FolderOpen className="size-5 text-blue-500" />
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {description}
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "gallery" | "upload")}
            className="flex-1 flex flex-col min-h-0"
          >
            <div className="px-6 pt-3">
              <TabsList className="w-full sm:w-auto grid grid-cols-2">
                <TabsTrigger value="gallery" className="text-xs font-medium">
                  Galeri Aset
                </TabsTrigger>
                <TabsTrigger value="upload" className="text-xs font-medium">
                  Unggah Baru
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB 1: GALERI ASET */}
            <TabsContent value="gallery" className="flex-1 flex flex-col p-6 pt-3 min-h-0">
              {/* Search Bar */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari gambar berdasarkan nama berkas..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-9 h-9 text-xs"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Grid Content */}
              <div className="flex-1 overflow-y-auto min-h-[280px] max-h-[340px] pr-1">
                {isLoading ? (
                  <div className="h-full flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Loader2 className="size-8 animate-spin text-blue-500 mb-2" />
                    <p className="text-xs">Memuat daftar aset...</p>
                  </div>
                ) : assets.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed border-border/60 rounded-xl">
                    <ImageIcon className="size-10 stroke-1 text-muted-foreground/60 mb-2" />
                    <p className="text-sm font-medium text-foreground">Belum ada aset ditemukan</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      {debouncedSearch
                        ? `Tidak ada berkas yang cocok dengan pencarian "${debouncedSearch}".`
                        : "Unggah gambar baru untuk mulai menggunakan galeri aset."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 text-xs"
                      onClick={() => setActiveTab("upload")}
                    >
                      <UploadCloud className="size-3.5 mr-1.5" />
                      Unggah Gambar Sekarang
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {assets.map((asset) => {
                      const isSelected = selectedAsset?.id === asset.id
                      const assetUrl = resolveAssetUrl(asset.url || asset.path)

                      return (
                        <div
                          key={asset.id}
                          onClick={() => setManuallySelectedAsset(asset)}
                          className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-[border-color,box-shadow,transform] text-left ${
                            isSelected
                              ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm"
                              : "border-border/60 hover:border-border hover:shadow-xs bg-muted/20"
                          }`}
                        >
                          {/* Image Box */}
                          <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                            <Image
                              src={assetUrl}
                              alt={asset.filename}
                              unoptimized
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                              className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />

                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                                <Check className="size-3 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          {/* Info caption */}
                          <div className="p-2 min-w-0">
                            <p
                              className="text-xs font-medium text-foreground truncate"
                              title={asset.filename}
                            >
                              {asset.filename}
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {formatFileSize(asset.size)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Pagination footer */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/40 text-xs text-muted-foreground">
                  <span>
                    Halaman {pagination.page} dari {pagination.total_pages} ({pagination.total_rows} aset)
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      disabled={!pagination.has_prev}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="size-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 w-7 p-0"
                      disabled={!pagination.has_next}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* TAB 2: UNGGAH BARU */}
            <TabsContent value="upload" className="p-6 pt-3 flex-1 flex flex-col justify-center min-h-[320px]">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => !uploadAssetMutation.isPending && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  uploadAssetMutation.isPending
                    ? "border-muted bg-muted/20 cursor-not-allowed opacity-75"
                    : "border-border/80 hover:border-blue-500 hover:bg-blue-500/5 bg-muted/10"
                }`}
              >
                {uploadAssetMutation.isPending ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="size-12 animate-spin text-blue-500 mb-3" />
                    <p className="text-sm font-semibold text-foreground">Sedang Mengunggah...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mengunggah berkas ke penyimpanan storage...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                      <UploadCloud className="size-7" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      Klik atau seret gambar ke area ini
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                      Mendukung format JPEG, PNG, WEBP, GIF, SVG hingga maksimal 15MB.
                      {aspectRatio ? " Gambar dapat dipotong sesuai rasio yang ditentukan." : ""}
                    </p>
                    <Button variant="outline" size="sm" className="mt-4 text-xs pointer-events-none">
                      Pilih Berkas Komputer
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Modal Footer */}
          <DialogFooter className="px-6 py-3.5 bg-muted/10 border-t border-border/40 flex items-center justify-between sm:justify-between w-full">
            <div className="flex items-center gap-2 min-w-0">
              {selectedAsset && (
                <div className="flex items-center gap-2 min-w-0 text-xs">
                  <div className="relative size-7 rounded-md overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-border">
                    <Image
                      src={resolveAssetUrl(selectedAsset.url || selectedAsset.path)}
                      alt={selectedAsset.filename}
                      unoptimized
                      fill
                      sizes="28px"
                      className="size-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-foreground truncate max-w-[180px] sm:max-w-xs">
                    {selectedAsset.filename}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onOpenChange(false)}
              >
                Batal
              </Button>
              <Button
                variant="default"
                size="sm"
                className="text-xs"
                disabled={!selectedAsset}
                onClick={handleSelectConfirm}
              >
                Pilih Aset
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lightweight Cropper Modal (if aspect ratio provided) */}
      {aspectRatio && (
        <ImageCropperModal
          isOpen={cropperOpen}
          onClose={() => setCropperOpen(false)}
          imageSrc={cropperImageSrc}
          aspectRatio={aspectRatio}
          cropShape={cropShape}
          title="Potong Gambar Aset"
          description="Sesuaikan bingkai sebelum berkas disimpan ke galeri aset."
          onCropComplete={handleCropComplete}
          isSubmitting={uploadAssetMutation.isPending}
        />
      )}
    </>
  )
}

export function ImagePickerDialog(props: ImagePickerDialogProps) {
  if (!props.open) return null
  return <ImagePickerDialogInner {...props} />
}
