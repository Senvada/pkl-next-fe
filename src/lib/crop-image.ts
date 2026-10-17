import type { PixelCrop } from "react-image-crop"

export type { PixelCrop }

const MAX_OUTPUT_DIMENSION = 1024

/**
 * Generates an HTMLCanvasElement from the cropped portion of the image.
 * Uses high-quality 2D context image smoothing and caps max dimension for performance.
 */
export function getCroppedCanvas(
  image: HTMLImageElement,
  crop: PixelCrop,
  shape: "square" | "circle" = "square"
): HTMLCanvasElement | null {
  const canvas = document.createElement("canvas")
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  let outWidth = crop.width * scaleX
  let outHeight = crop.height * scaleY

  if (outWidth > MAX_OUTPUT_DIMENSION || outHeight > MAX_OUTPUT_DIMENSION) {
    const downscale = MAX_OUTPUT_DIMENSION / Math.max(outWidth, outHeight)
    outWidth = Math.round(outWidth * downscale)
    outHeight = Math.round(outHeight * downscale)
  }

  canvas.width = Math.max(1, Math.round(outWidth))
  canvas.height = Math.max(1, Math.round(outHeight))

  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  if (shape === "circle") {
    ctx.beginPath()
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width, canvas.height) / 2,
      0,
      Math.PI * 2
    )
    ctx.clip()
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return canvas
}

/**
 * Converts a cropped canvas into a File and object URL.
 * Only called ONCE upon user submission, avoiding any canvas operations during dragging.
 */
export function cropImageToFile(
  image: HTMLImageElement,
  crop: PixelCrop,
  shape: "square" | "circle" = "square",
  fileName = "avatar.webp",
  mimeType = "image/webp"
): Promise<{ file: File; url: string }> {
  return new Promise((resolve, reject) => {
    const canvas = getCroppedCanvas(image, crop, shape)
    if (!canvas) {
      reject(new Error("Gagal menginisialisasi kanvas crop"))
      return
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Gagal memproses gambar"))
          return
        }
        const file = new File([blob], fileName, { type: mimeType })
        const url = URL.createObjectURL(blob)
        resolve({ file, url })
      },
      mimeType,
      0.9
    )
  })
}
