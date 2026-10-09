export interface PixelCrop {
  x: number
  y: number
  width: number
  height: number
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })
}

function getRadianAngle(degreeValue: number) {
  return (degreeValue * Math.PI) / 180
}

function calculateRotatedSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation)
  return {
    width:
      Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height:
      Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  }
}

/**
 * Crops and rotates an image using an HTML5 Canvas and outputs a clean File & Object URL.
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: PixelCrop,
  rotation = 0,
  outputType = "image/webp",
  fileName = "cropped-avatar.webp"
): Promise<{ file: File; url: string }> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Gagal menginisialisasi canvas context")
  }

  const { width: bBoxWidth, height: bBoxHeight } = calculateRotatedSize(
    image.naturalWidth || image.width,
    image.naturalHeight || image.height,
    rotation
  )

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(getRadianAngle(rotation))
  ctx.drawImage(
    image,
    -(image.naturalWidth || image.width) / 2,
    -(image.naturalHeight || image.height) / 2
  )

  const croppedCanvas = document.createElement("canvas")
  const croppedCtx = croppedCanvas.getContext("2d")

  if (!croppedCtx) {
    throw new Error("Gagal menginisialisasi canvas crop context")
  }

  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Kanvas kosong atau gagal memproses gambar"))
          return
        }
        const file = new File([blob], fileName, { type: outputType })
        const url = URL.createObjectURL(blob)
        resolve({ file, url })
      },
      outputType,
      0.92
    )
  })
}
