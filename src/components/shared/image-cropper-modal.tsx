"use client"

import * as React from "react"
import Cropper, { type Area } from "react-easy-crop"
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Check,
  Loader2,
  Crop as CropIcon,
} from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getCroppedImg } from "@/lib/crop-image"

export interface ImageCropperModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string | null
  /**
   * Aspect ratio of the crop box (e.g., 1 for 1:1, 16/9, 4/3). Defaults to 1.
   */
  aspectRatio?: number
  /**
   * Shape of the crop area: 'round' (ideal for avatar) or 'rect' (standard). Defaults to 'round' if aspect is 1, otherwise 'rect'.
   */
  cropShape?: "round" | "rect"
  title?: string
  description?: string
  outputFileName?: string
  onCropComplete: (result: { file: File; url: string }) => Promise<void> | void
  isSubmitting?: boolean
}

export function ImageCropperModal(props: ImageCropperModalProps) {
  const { isOpen, onClose, isSubmitting = false, imageSrc } = props

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      {isOpen && imageSrc ? (
        <ImageCropperModalContent {...props} key={imageSrc} />
      ) : null}
    </Dialog>
  )
}

function ImageCropperModalContent({
  onClose,
  imageSrc,
  aspectRatio = 1,
  cropShape,
  title = "Sesuaikan & Potong Foto",
  description = "Geser, perbesar, atau putar gambar agar pas dengan bingkai yang diinginkan.",
  outputFileName = "avatar.webp",
  onCropComplete,
  isSubmitting = false,
}: ImageCropperModalProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 })
  const [zoom, setZoom] = React.useState(1)
  const [rotation, setRotation] = React.useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop)
  }

  const onCropCompleteInternal = (
    _croppedArea: Area,
    croppedAreaPixels: Area
  ) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleReset = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
  }

  const handleConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return

    try {
      setIsProcessing(true)
      const croppedResult = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        "image/webp",
        outputFileName
      )
      await onCropComplete(croppedResult)
      onClose()
    } catch (err) {
      console.error("Gagal memotong gambar:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const resolvedCropShape = cropShape || (aspectRatio === 1 ? "round" : "rect")
  const loading = isSubmitting || isProcessing

  return (
    <DialogContent className="sm:max-w-xl max-h-[95vh] flex flex-col p-5 gap-4 overflow-hidden">
      <DialogHeader className="gap-1 text-left">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <CropIcon className="size-4" />
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold">
            {title}
          </DialogTitle>
        </div>
        <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
          {description}
        </DialogDescription>
      </DialogHeader>

      {/* Cropper Container */}
      <div className="relative w-full h-72 sm:h-80 bg-neutral-950 rounded-xl overflow-hidden border border-border shadow-inner">
        {imageSrc && (
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            cropShape={resolvedCropShape}
            showGrid={true}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={setZoom}
            classes={{
              containerClassName: "relative w-full h-full",
              mediaClassName: "max-h-full",
            }}
          />
        )}
      </div>

      {/* Controls Section */}
      <div className="flex flex-col gap-3 py-1">
        {/* Zoom Control */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 w-16 shrink-0">
            <ZoomOut className="size-3.5" />
            Skala
          </span>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-blue-600 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg cursor-pointer"
            disabled={loading}
            aria-label="Zoom level"
          />
          <span className="text-xs font-mono text-muted-foreground w-12 text-right">
            {Math.round(zoom * 100)}%
          </span>
          <ZoomIn className="size-3.5 text-muted-foreground" />
        </div>

        {/* Action Tools */}
        <div className="flex items-center justify-between border-t border-border pt-2.5">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRotate}
              disabled={loading}
              className="h-8 gap-1.5 text-xs rounded-lg cursor-pointer"
            >
              <RotateCw className="size-3.5" />
              <span>Putar 90°</span>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={loading}
              className="h-8 gap-1.5 text-xs rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>
          </div>

          <div className="text-[11px] font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
            Rasio: {aspectRatio === 1 ? "1 : 1" : aspectRatio.toFixed(2)}
          </div>
        </div>
      </div>

      <DialogFooter className="flex-row sm:justify-end gap-2 border-t border-border pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          disabled={loading}
          className="flex-1 sm:flex-initial h-9 rounded-lg cursor-pointer text-xs"
        >
          Batal
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleConfirm}
          disabled={loading || !imageSrc}
          className="flex-1 sm:flex-initial h-9 rounded-lg cursor-pointer text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-sm"
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
