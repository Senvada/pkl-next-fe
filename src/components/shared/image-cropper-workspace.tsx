"use client"

import * as React from "react"
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

interface ImageCropperWorkspaceProps {
  imageSrc: string
  crop: Crop | undefined
  onCropChange: (crop: Crop) => void
  onCropComplete: (crop: PixelCrop) => void
  aspectRatio: number
  cropShape: "round" | "rect"
  imgRef: React.RefObject<HTMLInputElement | HTMLImageElement | null>
  onImageLoad: (e: React.SyntheticEvent<HTMLImageElement>) => void
}

export function ImageCropperWorkspace({
  imageSrc,
  crop,
  onCropChange,
  onCropComplete,
  aspectRatio,
  cropShape,
  imgRef,
  onImageLoad,
}: ImageCropperWorkspaceProps) {
  return (
    <div className="flex-1 w-full flex items-center justify-center bg-slate-950/5 dark:bg-black/40 p-3 sm:p-5 rounded-2xl border border-border/80 overflow-hidden min-h-[300px] sm:min-h-[400px] max-h-[64vh]">
      <ReactCrop
        crop={crop}
        onChange={(_, percentCrop) => onCropChange(percentCrop)}
        onComplete={(c) => onCropComplete(c)}
        aspect={aspectRatio}
        circularCrop={cropShape === "round"}
        keepSelection
        className="max-h-[60vh] max-w-full rounded-xl"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef as React.RefObject<HTMLImageElement>}
          alt="Crop target"
          src={imageSrc}
          onLoad={onImageLoad}
          className="max-h-[60vh] max-w-full object-contain block select-none pointer-events-auto"
        />
      </ReactCrop>
    </div>
  )
}
