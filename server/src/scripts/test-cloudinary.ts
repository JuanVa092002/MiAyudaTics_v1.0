/**
 * Smoke test manual de Cloudinary — no se ejecuta en CI por defecto.
 * Uso: pnpm -C server run test:cloudinary
 */
import 'dotenv/config'
import { cloudinary, ensureCloudinaryConfig, isCloudinaryEnabled } from '../shared/config/cloudinary'
import { deleteStoredMedia, saveUploadedFile } from '../shared/services/mediaStorage'

async function main(): Promise<void> {
  console.log('--- Cloudinary smoke test ---')

  if (!isCloudinaryEnabled()) {
    console.error('FAIL: Cloudinary no está habilitado. Revisa CLOUDINARY_* en .env')
    process.exit(1)
  }

  const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
  )

  const file = {
    buffer: pngBuffer,
    mimetype: 'image/png',
    originalname: 'cloudinary-smoke-test.png',
  }

  let uploaded: { filename: string; url: string } | null = null

  try {
    uploaded = await saveUploadedFile(file, 'evidencias')
    console.log('Upload OK')
    console.log('  public_id:', uploaded.filename)
    console.log('  url:', uploaded.url)

    if (!uploaded.url.includes('res.cloudinary.com')) {
      throw new Error('La URL no es de Cloudinary')
    }

    const response = await fetch(uploaded.url, { method: 'HEAD' })
    if (!response.ok) {
      throw new Error(`La URL no responde HTTP ${response.status}`)
    }
    console.log('URL accesible:', response.status)

    await deleteStoredMedia(uploaded)

    ensureCloudinaryConfig()
    try {
      await cloudinary.api.resource(uploaded.filename, { resource_type: 'image' })
      throw new Error('El asset sigue registrado en Cloudinary después de eliminar')
    } catch (error: unknown) {
      const httpCode = (error as { error?: { http_code?: number } })?.error?.http_code
      if (httpCode !== 404) {
        throw error
      }
    }
    console.log('Delete OK (archivo de prueba eliminado en Cloudinary)')

    console.log('--- PASS: Cloudinary funcionando correctamente ---')
    process.exit(0)
  } catch (error) {
    console.error('FAIL:', error)
    if (uploaded) {
      await deleteStoredMedia(uploaded).catch(() => undefined)
    }
    process.exit(1)
  }
}

main()
