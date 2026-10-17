"use client"

import * as React from "react"
import ReactCrop, {
  type Crop,
  type PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

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

export interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  /**
   * Aspect ratio of the crop box (e.g. 1 for 1:1 square). Defaults to 1.
   */
  aspectRatio?: number
  /**
   * Shape of the crop area: 'round' (circle avatar) or 'rect' (standard rectangle). Defaults to 'round'.
   */
  cropShape?: "round" | "rect"
  title?: string
  description?: string
  outputFileName?: string
  onCropComplete: (result: { file: File; url: string }) => Promise<void> | void
  isSubmitting?: boolean
}

function centerAspectCrop(width: number, height: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, width, height),
    width,
    height
  )
}

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
    <DialogContent className="sm:max-w-md max-h-[95vh] flex flex-col p-5 gap-3.5 overflow-hidden shadow-none">
      <DialogHeader className="gap-1 text-left">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CropIcon className="size-4" />
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold">
            {title}
          </DialogTitle>
        </div>
        <DialogDescription className="text-xs text-muted-foreground">
          {description}
        </DialogDescription>
      </DialogHeader>

      {/* Lightweight DOM-based Cropper Container (Zero canvas while dragging) */}
      <div className="flex items-center justify-center bg-muted/40 p-3 sm:p-4 rounded-xl border border-border overflow-hidden max-h-[50vh]">
        {imageSrc && (
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            circularCrop={cropShape === "round"}
            keepSelection
            className="max-h-[46vh] max-w-full rounded-lg"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              alt="Crop target"
              src={imageSrc}
              onLoad={onImageLoad}
              className="max-h-[46vh] max-w-full object-contain block select-none pointer-events-auto"
            />
          </ReactCrop>
        )}
      </div>

      <p className="text-[11px] text-center text-muted-foreground">
        Tarik titik sudut atau geser area bingkai seleksi secara leluasa.
      </p>

      <DialogFooter className="flex-row sm:justify-end gap-2 border-t border-border pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={loading}
          className="flex-1 sm:flex-initial h-9 rounded-xl cursor-pointer text-xs"
        >
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
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <Check className="size-3.5" />
              <span>Terapkan Potongan</span>
            </>
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
      {isOpen && imageSrc ? (
        <ImageCropperModalContent {...props} key={imageSrc} />
      ) : null}
    </Dialog>
  )
})
