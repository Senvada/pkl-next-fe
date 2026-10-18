"use client"

import * as React from "react"
import Image from "next/image"
import {
  FolderOpen,
  Search,
  UploadCloud,
  Copy,
  Check,
  Eye,
  Trash2,
  RefreshCw,
  ImageIcon,
  FileText,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
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
import {
  useAssetsPaginatedQuery,
  useUploadAsset,
  useDeleteAsset,
} from "@/hooks/modules/asset"
import {
  resolveAssetUrl,
  formatFileSize,
  getFileExtension,
  isImageFile,
} from "@/lib/asset-resolver"
import type { Asset } from "@/types/asset"

const emptySubscribe = () => () => {}

export default function AssetGalleryPage() {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false)

  // Filters & Pagination
  const [page, setPage] = React.useState(1)
  const limit = 18
  const [search, setSearch] = React.useState("")
  const [debouncedSearch, setDebouncedSearch] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState<"all" | "image">("all")

  // Modals & Active state
  const [previewAsset, setPreviewAsset] = React.useState<Asset | null>(null)
  const [assetToDelete, setAssetToDelete] = React.useState<Asset | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false)
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  // Upload queue states
  const [uploadFiles, setUploadFiles] = React.useState<File[]>([])
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState<string>("")

  // Search debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data, isLoading, refetch } = useAssetsPaginatedQuery({
    page,
    limit,
    filter: {
      search: debouncedSearch,
      mime_type: typeFilter === "image" ? "image" : undefined,
    },
  })

  const uploadMutation = useUploadAsset()
  const deleteMutation = useDeleteAsset()

  const assets = data?.assets || []
  const pagination = data?.pagination

  // Copy URL to clipboard
  const handleCopyUrl = async (asset: Asset) => {
    const fullUrl = resolveAssetUrl(asset.url || asset.path)
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopiedId(asset.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      alert("Gagal menyalin URL ke clipboard")
    }
  }

  // Handle batch file upload
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setUploadFiles(files)
    }
  }

  const handleStartUpload = async () => {
    if (uploadFiles.length === 0) return
    setIsUploading(true)

    for (let i = 0; i < uploadFiles.length; i++) {
      const file = uploadFiles[i]
      setUploadProgress(`Mengunggah (${i + 1}/${uploadFiles.length}): ${file.name}`)
      try {
        await uploadMutation.mutateAsync({ file, folder: "gallery" })
      } catch (err: unknown) {
        console.error("Gagal unggah:", file.name, err)
      }
    }

    setIsUploading(false)
    setUploadProgress("")
    setUploadFiles([])
    setUploadDialogOpen(false)
    refetch()
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!assetToDelete) return
    try {
      await deleteMutation.mutateAsync(assetToDelete.id)
      setAssetToDelete(null)
      if (previewAsset?.id === assetToDelete.id) {
        setPreviewAsset(null)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus aset"
      alert(msg)
    }
  }

  if (!mounted) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
        <div className="h-64 bg-muted/40 rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-1 sm:p-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FolderOpen className="size-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Galeri Aset &amp; Media
            </h1>
            {pagination && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted font-medium text-muted-foreground">
                {pagination.total_rows} berkas
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Kelola berkas media, gambar sampul artikel, dan logo mitra secara terpusat.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="text-xs h-9"
            title="Muat Ulang"
          >
            <RefreshCw className={`size-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
            Segarkan
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
            className="text-xs h-9 gap-1.5 shadow-xs"
          >
            <UploadCloud className="size-4" />
            Unggah Media Baru
          </Button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border/60 rounded-xl p-3 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari berkas berdasarkan nama..."
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

        {/* Filter Type Buttons */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <Button
            variant={typeFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("all")}
            className="h-8 text-xs px-3"
          >
            Semua
          </Button>
          <Button
            variant={typeFilter === "image" ? "default" : "outline"}
            size="sm"
            onClick={() => setTypeFilter("image")}
            className="h-8 text-xs px-3 gap-1.5"
          >
            <ImageIcon className="size-3.5" />
            Gambar Saja
          </Button>
        </div>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-muted-foreground">
          <Loader2 className="size-9 animate-spin text-blue-500 mb-3" />
          <p className="text-xs">Memuat galeri aset...</p>
        </div>
      ) : assets.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-border/70 rounded-2xl bg-card/40 flex flex-col items-center justify-center p-6">
          <div className="size-14 rounded-2xl bg-muted/60 text-muted-foreground flex items-center justify-center mb-3">
            <ImageIcon className="size-7 stroke-1" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Tidak Ada Aset Ditemukan</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {debouncedSearch
              ? `Tidak ada berkas yang sesuai dengan kata kunci "${debouncedSearch}".`
              : "Belum ada berkas media di dalam galeri aset. Unggah media pertama Anda sekarang."}
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => setUploadDialogOpen(true)}
            className="mt-4 text-xs gap-1.5"
          >
            <UploadCloud className="size-4" />
            Unggah Berkas Baru
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {assets.map((asset) => {
            const isImage = isImageFile(asset.mime_type, asset.filename)
            const assetUrl = resolveAssetUrl(asset.url || asset.path)
            const isCopied = copiedId === asset.id
            const ext = getFileExtension(asset.filename).toUpperCase()

            return (
              <div
                key={asset.id}
                className="group relative rounded-xl border border-border/60 bg-card overflow-hidden shadow-xs hover:border-blue-500/50 hover:shadow-md transition-[border-color,box-shadow,transform] duration-200 flex flex-col"
              >
                {/* Media Box */}
                <div
                  onClick={() => setPreviewAsset(asset)}
                  className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 cursor-pointer overflow-hidden flex items-center justify-center"
                >
                  {isImage ? (
                    <Image
                      src={assetUrl}
                      alt={asset.filename}
                      unoptimized
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <FileText className="size-10 stroke-1 mb-1" />
                      <span className="text-[10px] font-semibold">{ext || "FILE"}</span>
                    </div>
                  )}

                  {/* Extension Badge */}
                  {ext && (
                    <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-black/60 text-white backdrop-blur-xs">
                      {ext}
                    </span>
                  )}

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-1.5 p-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewAsset(asset)
                      }}
                      className="size-8 rounded-lg bg-white/90 text-slate-900 hover:bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                      title="Lihat Pratinjau"
                    >
                      <Eye className="size-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCopyUrl(asset)
                      }}
                      className="size-8 rounded-lg bg-white/90 text-slate-900 hover:bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                      title={isCopied ? "URL Disalin!" : "Salin URL"}
                    >
                      {isCopied ? (
                        <Check className="size-4 text-emerald-600" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setAssetToDelete(asset)
                      }}
                      className="size-8 rounded-lg bg-rose-600 text-white hover:bg-rose-700 flex items-center justify-center shadow-xs transition-transform hover:scale-110"
                      title="Hapus Aset"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <p
                    className="text-xs font-semibold text-foreground truncate"
                    title={asset.filename}
                  >
                    {asset.filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-1">
                    <span>{formatFileSize(asset.size)}</span>
                    <button
                      onClick={() => handleCopyUrl(asset)}
                      className="hover:text-blue-500 flex items-center gap-0.5 text-[10px]"
                    >
                      {isCopied ? (
                        <span className="text-emerald-500 font-medium">Disalin!</span>
                      ) : (
                        "Salin"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs text-muted-foreground">
          <span>
            Menampilkan halaman {pagination.page} dari {pagination.total_pages} (Total{" "}
            {pagination.total_rows} berkas)
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1"
              disabled={!pagination.has_prev}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="size-3.5" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1"
              disabled={!pagination.has_next}
              onClick={() => setPage((p) => p + 1)}
            >
              Berikutnya
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      <Dialog open={!!previewAsset} onOpenChange={(open) => !open && setPreviewAsset(null)}>
        <DialogContent className="max-w-2xl w-full p-0 overflow-hidden sm:rounded-2xl">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold text-foreground truncate">
              {previewAsset?.filename}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pratinjau detail media aset
            </DialogDescription>
          </DialogHeader>

          {previewAsset && (
            <div className="p-6 space-y-4">
              {/* Preview image */}
              <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-border/60 min-h-[260px] max-h-[380px] flex items-center justify-center">
                {isImageFile(previewAsset.mime_type, previewAsset.filename) ? (
                  <div className="relative w-full h-[340px]">
                    <Image
                      src={resolveAssetUrl(previewAsset.url || previewAsset.path)}
                      alt={previewAsset.filename}
                      unoptimized
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="py-16 text-center text-muted-foreground">
                    <FileText className="size-16 stroke-1 mb-2 mx-auto" />
                    <p className="text-xs">Berkas bukan merupakan format gambar yang dapat dipratinjau.</p>
                  </div>
                )}
              </div>

              {/* Metadata Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-muted/20 p-3.5 rounded-xl border border-border/40">
                <div className="flex items-center gap-5">
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Ukuran Berkas</span>
                    <span className="font-semibold text-foreground">
                      {formatFileSize(previewAsset.size)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Waktu Unggah</span>
                    <span className="font-semibold text-foreground">
                      {new Date(previewAsset.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs px-2.5 gap-1.5"
                    onClick={() => handleCopyUrl(previewAsset)}
                  >
                    {copiedId === previewAsset.id ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" />
                        <span>Tautan Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Salin Tautan</span>
                      </>
                    )}
                  </Button>
                  <a
                    href={resolveAssetUrl(previewAsset.url || previewAsset.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-8 px-2.5 border rounded-lg flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-background hover:bg-muted/40 transition-colors"
                  >
                    <span>Buka Penuh</span>
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="px-6 py-3 bg-muted/10 border-t border-border/40 flex items-center justify-between sm:justify-between">
            <Button
              variant="destructive"
              size="sm"
              className="text-xs gap-1.5"
              onClick={() => {
                if (previewAsset) {
                  setAssetToDelete(previewAsset)
                  setPreviewAsset(null)
                }
              }}
            >
              <Trash2 className="size-3.5" />
              Hapus Aset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setPreviewAsset(null)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRMATION DIALOG */}
      <Dialog open={!!assetToDelete} onOpenChange={(open) => !open && setAssetToDelete(null)}>
        <DialogContent className="max-w-md w-full sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <Trash2 className="size-4" />
              Hapus Berkas Media
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              Apakah Anda yakin ingin menghapus berkas{" "}
              <strong className="text-foreground">{assetToDelete?.filename}</strong>? Tindakan ini
              akan menghapus berkas dari penyimpanan cloud storage dan tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 flex items-center gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => setAssetToDelete(null)}
              disabled={deleteMutation.isPending}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="text-xs"
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Menghapus...
                </>
              ) : (
                "Hapus Permanen"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UPLOAD MODAL */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md w-full sm:rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <UploadCloud className="size-5 text-blue-500" />
              Unggah Media ke Galeri
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Pilih satu atau beberapa berkas gambar dari komputer Anda.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <input
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleFilesSelected}
              className="hidden"
              id="gallery-file-upload"
              disabled={isUploading}
            />

            <label
              htmlFor="gallery-file-upload"
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                isUploading
                  ? "border-muted bg-muted/20 cursor-not-allowed opacity-75"
                  : "border-border/80 hover:border-blue-500 hover:bg-blue-50/5 bg-muted/10"
              }`}
            >
              <UploadCloud className="size-8 text-blue-500 mb-2" />
              <p className="text-xs font-semibold text-foreground">
                Klik untuk memilih satu atau beberapa berkas
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                PNG, JPEG, WebP, GIF, SVG hingga 15MB
              </p>
            </label>

            {uploadFiles.length > 0 && (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                <p className="text-xs font-semibold text-foreground">
                  Berkas yang dipilih ({uploadFiles.length}):
                </p>
                {uploadFiles.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs p-2 bg-muted/30 rounded-md border border-border/40"
                  >
                    <span className="truncate max-w-[240px]">{f.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatFileSize(f.size)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {isUploading && (
              <div className="flex items-center gap-2 text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-lg">
                <Loader2 className="size-4 animate-spin shrink-0" />
                <span className="truncate">{uploadProgress}</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex items-center gap-2 sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => {
                setUploadFiles([])
                setUploadDialogOpen(false)
              }}
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button
              variant="default"
              size="sm"
              className="text-xs gap-1.5"
              onClick={handleStartUpload}
              disabled={uploadFiles.length === 0 || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                `Unggah ${uploadFiles.length} Berkas`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
