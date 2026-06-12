import { v2 as cloudinary } from 'cloudinary'

let configured = false

export function isCloudinaryEnabled(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME?.trim() &&
      process.env.CLOUDINARY_API_KEY?.trim() &&
      process.env.CLOUDINARY_API_SECRET?.trim()
  )
}

export function getCloudinaryFolder(): string {
  return process.env.CLOUDINARY_FOLDER?.trim() || 'miayudatics'
}

export function ensureCloudinaryConfig(): void {
  if (!isCloudinaryEnabled()) return
  if (configured) return

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!.trim(),
    api_key: process.env.CLOUDINARY_API_KEY!.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET!.trim(),
    secure: true,
  })
  configured = true
}

export { cloudinary }
