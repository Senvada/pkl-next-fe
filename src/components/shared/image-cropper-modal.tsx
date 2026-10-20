"use client"

import * as React from "react"
import { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop"
import { Check, Loader2, Crop as CropIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cropImageToFile } from "@/lib/crop-image"
import { cn } from "@/lib/utils"
import { ImageCropperWorkspace } from "./image-cropper-workspace"

export interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  aspectRatio?: number
  cropShape?: "round" | "rect"
  title?: string
  description?: string
  outputFileName?: string
  onCropComplete: (result: { file: File; url: string }) => Promise<void> | void
  isSubmitting?: boolean
  modalWidth?: string
}

const centerAspectCrop = (width: number, height: number, aspect: number): Crop =>
  centerCrop(makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height), width, height)

function ImageCropperModalContent({
  onClose,
  imageSrc,
  aspectRatio = 1,
  cropShape = "round",
  title = "Sesuaikan & Potong Foto",
  description = "Geser atau ubah ukuran bingkai seleksi untuk memilih area yang diinginkan.",
  outputFileName = "avatar.webp",
  onCropComplete,
  isSubmitting = false,
  modalWidth = "w-[95vw] max-w-[95vw] sm:w-[70vw] sm:max-w-[70vw]",
}: ImageCropperModalProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null)
  const [crop, setCrop] = React.useState<Crop>()
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()
  const [isProcessing, setIsProcessing] = React.useState(false)

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget
    setCrop(centerAspectCrop(width, height, aspectRatio))
  }

  const handleConfirm = async () => {
    if (!imgRef.current || !completedCrop?.width || !completedCrop?.height) return

    try {
      setIsProcessing(true)
      const result = await cropImageToFile(
        imgRef.current,
        completedCrop,
        cropShape === "round" ? "circle" : "square",
        outputFileName,
        "image/webp"
      )
      await onCropComplete(result)
      onClose()
    } catch (err) {
      console.error("Gagal memotong gambar:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const loading = isSubmitting || isProcessing

  return (
    <DialogContent className={cn("max-h-[92vh] flex flex-col p-4 sm:p-6 gap-3.5 overflow-hidden shadow-none", modalWidth)}>
      <DialogHeader className="gap-1 text-left">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CropIcon className="size-4" />
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold">{title}</DialogTitle>
        </div>
        <DialogDescription className="text-xs text-muted-foreground">{description}</DialogDescription>
      </DialogHeader>

      {imageSrc && (
        <ImageCropperWorkspace
          imageSrc={imageSrc}
          crop={crop}
          onCropChange={setCrop}
          onCropComplete={setCompletedCrop}
          aspectRatio={aspectRatio}
          cropShape={cropShape}
          imgRef={imgRef}
          onImageLoad={onImageLoad}
        />
      )}

      <p className="text-[11px] text-center text-muted-foreground">
        Tarik titik sudut atau geser area bingkai seleksi secara leluasa.
      </p>

      <DialogFooter className="flex-row sm:justify-end gap-2 border-t border-border pt-3">
        <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading} className="flex-1 sm:flex-initial h-9 rounded-xl cursor-pointer text-xs">
          Batal
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleConfirm}
          disabled={loading || !completedCrop?.width || !completedCrop?.height}
          className="flex-1 sm:flex-initial h-9 rounded-xl cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-none"
        >
          {loading ? (
            <><Loader2 className="size-3.5 animate-spin" /><span>Memproses...</span></>
          ) : (
            <><Check className="size-3.5" /><span>Terapkan Potongan</span></>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}

export const ImageCropperModal = React.memo(function ImageCropperModal(props: ImageCropperModalProps) {
  const { isOpen, onClose, isSubmitting = false, imageSrc } = props
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      {isOpen && imageSrc ? <ImageCropperModalContent {...props} key={imageSrc} /> : null}
    </Dialog>
  )
})
